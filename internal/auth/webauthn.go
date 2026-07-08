package auth

import (
	"bytes"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"fmt"

	"github.com/go-webauthn/webauthn/protocol"
	"github.com/go-webauthn/webauthn/webauthn"
)

// StoredCred is one passkey as persisted (base64url strings, like @simplewebauthn stored).
type StoredCred struct {
	CredentialID string // base64url (raw, no padding)
	PublicKey    string // base64url of COSE public key
	Counter      uint32
	Transports   []string
	// Flags is the raw WebAuthn credential-flags byte (UP/UV/backup-eligible/
	// backup-state) recorded for this credential, or nil if it was stored before
	// flags were persisted. The backup-eligible (BE) flag is immutable per spec and
	// is enforced against every assertion, so it must survive a round-trip.
	Flags *uint8
}

// WAUser is the minimal user view the wrapper needs.
type WAUser struct {
	ID          int64
	Username    string
	DisplayName string
	Creds       []StoredCred
}

// WebAuthn wraps the relying party.
type WebAuthn struct {
	wa *webauthn.WebAuthn
}

// NewWebAuthn builds the relying party. origin is the full origin (e.g. https://x.com).
func NewWebAuthn(rpID, rpName, origin string) (*WebAuthn, error) {
	wa, err := webauthn.New(&webauthn.Config{
		RPID:          rpID,
		RPDisplayName: rpName,
		RPOrigins:     []string{origin},
	})
	if err != nil {
		return nil, err
	}
	return &WebAuthn{wa: wa}, nil
}

// waUser adapts WAUser to the webauthn.User interface.
type waUser struct {
	u WAUser
}

func (a *waUser) WebAuthnID() []byte {
	b := make([]byte, 8)
	binary.BigEndian.PutUint64(b, uint64(a.u.ID))
	return b
}

func (a *waUser) WebAuthnName() string        { return a.u.Username }
func (a *waUser) WebAuthnDisplayName() string { return a.u.DisplayName }
func (a *waUser) WebAuthnIcon() string        { return "" }

func (a *waUser) WebAuthnCredentials() []webauthn.Credential {
	creds := make([]webauthn.Credential, 0, len(a.u.Creds))
	for _, c := range a.u.Creds {
		wc, err := toCredential(c)
		if err != nil {
			continue
		}
		creds = append(creds, wc)
	}
	return creds
}

func toCredential(c StoredCred) (webauthn.Credential, error) {
	id, err := base64.RawURLEncoding.DecodeString(c.CredentialID)
	if err != nil {
		return webauthn.Credential{}, fmt.Errorf("decode credential id: %w", err)
	}
	pk, err := base64.RawURLEncoding.DecodeString(c.PublicKey)
	if err != nil {
		return webauthn.Credential{}, fmt.Errorf("decode public key: %w", err)
	}
	transports := make([]protocol.AuthenticatorTransport, 0, len(c.Transports))
	for _, t := range c.Transports {
		transports = append(transports, protocol.AuthenticatorTransport(t))
	}
	cred := webauthn.Credential{
		ID:        id,
		PublicKey: pk,
		Transport: transports,
		Authenticator: webauthn.Authenticator{
			SignCount: c.Counter,
		},
	}
	if c.Flags != nil {
		cred.Flags = webauthn.CredentialFlagsFromMsgpByte(*c.Flags)
	}
	return cred, nil
}

func fromCredential(c *webauthn.Credential) StoredCred {
	transports := make([]string, 0, len(c.Transport))
	for _, t := range c.Transport {
		transports = append(transports, string(t))
	}
	flags := c.Flags.MsgpByte()
	return StoredCred{
		CredentialID: base64.RawURLEncoding.EncodeToString(c.ID),
		PublicKey:    base64.RawURLEncoding.EncodeToString(c.PublicKey),
		Counter:      c.Authenticator.SignCount,
		Transports:   transports,
		Flags:        &flags,
	}
}

func excludeDescriptors(u WAUser) []protocol.CredentialDescriptor {
	ds := make([]protocol.CredentialDescriptor, 0, len(u.Creds))
	for _, c := range u.Creds {
		wc, err := toCredential(c)
		if err != nil {
			continue
		}
		ds = append(ds, wc.Descriptor())
	}
	return ds
}

// BeginRegistration returns the options object to send to the browser and an opaque
// session blob to stash server-side until FinishRegistration.
func (w *WebAuthn) BeginRegistration(u WAUser) (options any, session string, err error) {
	opts, sess, err := w.wa.BeginRegistration(
		&waUser{u: u},
		webauthn.WithConveyancePreference(protocol.PreferNoAttestation),
		webauthn.WithAuthenticatorSelection(protocol.AuthenticatorSelection{
			ResidentKey:      protocol.ResidentKeyRequirementPreferred,
			UserVerification: protocol.VerificationPreferred,
		}),
		webauthn.WithExclusions(excludeDescriptors(u)),
	)
	if err != nil {
		return nil, "", err
	}
	blob, err := json.Marshal(sess)
	if err != nil {
		return nil, "", err
	}
	return opts, string(blob), nil
}

// FinishRegistration verifies the browser's registration response JSON against the
// stashed session blob and returns the new credential to persist.
func (w *WebAuthn) FinishRegistration(u WAUser, session string, body []byte) (StoredCred, error) {
	var sess webauthn.SessionData
	if err := json.Unmarshal([]byte(session), &sess); err != nil {
		return StoredCred{}, fmt.Errorf("unmarshal session: %w", err)
	}
	parsed, err := protocol.ParseCredentialCreationResponseBody(bytes.NewReader(body))
	if err != nil {
		return StoredCred{}, fmt.Errorf("parse registration response: %w", err)
	}
	cred, err := w.wa.CreateCredential(&waUser{u: u}, sess, parsed)
	if err != nil {
		return StoredCred{}, err
	}
	return fromCredential(cred), nil
}

// BeginLogin returns assertion options + an opaque session blob, restricted to the user's creds.
func (w *WebAuthn) BeginLogin(u WAUser) (options any, session string, err error) {
	opts, sess, err := w.wa.BeginLogin(
		&waUser{u: u},
		webauthn.WithUserVerification(protocol.VerificationPreferred),
	)
	if err != nil {
		return nil, "", err
	}
	blob, err := json.Marshal(sess)
	if err != nil {
		return nil, "", err
	}
	return opts, string(blob), nil
}

// FinishLogin verifies the assertion response JSON and returns the credential id
// (base64url) that was used, its new signature counter, and its refreshed flags
// byte (the backup-state flag can legitimately change and should be written back).
func (w *WebAuthn) FinishLogin(u WAUser, session string, body []byte) (credentialID string, newCounter uint32, newFlags uint8, err error) {
	var sess webauthn.SessionData
	if err := json.Unmarshal([]byte(session), &sess); err != nil {
		return "", 0, 0, fmt.Errorf("unmarshal session: %w", err)
	}
	parsed, err := protocol.ParseCredentialRequestResponseBody(bytes.NewReader(body))
	if err != nil {
		return "", 0, 0, fmt.Errorf("parse assertion response: %w", err)
	}
	// A credential registered before flags were persisted has no recorded BE/BS
	// flags. The spec's flag-consistency check would then reject any backup-eligible
	// (synced) passkey, since the stored flag reads false while the assertion says
	// true. With nothing recorded to enforce against, adopt the flags this assertion
	// presents for the matching credential before validating; the value is then
	// written back so subsequent logins are enforced normally.
	assertedID := base64.RawURLEncoding.EncodeToString(parsed.RawID)
	assertedFlags := uint8(parsed.Response.AuthenticatorData.Flags)
	for i := range u.Creds {
		if u.Creds[i].CredentialID == assertedID && u.Creds[i].Flags == nil {
			f := assertedFlags
			u.Creds[i].Flags = &f
		}
	}
	cred, err := w.wa.ValidateLogin(&waUser{u: u}, sess, parsed)
	if err != nil {
		return "", 0, 0, err
	}
	return base64.RawURLEncoding.EncodeToString(cred.ID), cred.Authenticator.SignCount, cred.Flags.MsgpByte(), nil
}
