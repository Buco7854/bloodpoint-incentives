package auth

import (
	"encoding/json"
	"testing"

	"github.com/go-webauthn/webauthn/protocol"
)

func newTestWA(t *testing.T) *WebAuthn {
	t.Helper()
	w, err := NewWebAuthn("example.com", "Example", "https://example.com")
	if err != nil {
		t.Fatalf("NewWebAuthn: %v", err)
	}
	return w
}

func testUser() WAUser {
	return WAUser{
		ID:          42,
		Username:    "alice",
		DisplayName: "Alice",
	}
}

func TestBeginRegistration(t *testing.T) {
	w := newTestWA(t)
	opts, session, err := w.BeginRegistration(testUser())
	if err != nil {
		t.Fatalf("BeginRegistration: %v", err)
	}
	if opts == nil {
		t.Fatal("expected non-nil options")
	}
	if session == "" {
		t.Fatal("expected non-empty session blob")
	}

	// options must be JSON-serializable and contain a publicKey challenge.
	b, err := json.Marshal(opts)
	if err != nil {
		t.Fatalf("marshal options: %v", err)
	}
	var m map[string]any
	if err := json.Unmarshal(b, &m); err != nil {
		t.Fatalf("unmarshal options: %v", err)
	}
	pk, ok := m["publicKey"].(map[string]any)
	if !ok {
		t.Fatalf("expected publicKey object in options, got %v", m)
	}
	if pk["challenge"] == nil {
		t.Fatal("expected challenge in publicKey options")
	}

	// session blob must round-trip as JSON.
	var sess map[string]any
	if err := json.Unmarshal([]byte(session), &sess); err != nil {
		t.Fatalf("session blob is not valid JSON: %v", err)
	}
}

func TestBeginLogin(t *testing.T) {
	w := newTestWA(t)
	u := testUser()
	u.Creds = []StoredCred{{
		// 16 random-ish bytes base64url (no padding).
		CredentialID: "AQIDBAUGBwgJCgsMDQ4PEA",
		PublicKey:    "AQIDBAUGBwgJCgsMDQ4PEA",
		Counter:      0,
		Transports:   []string{"internal"},
	}}
	opts, session, err := w.BeginLogin(u)
	if err != nil {
		t.Fatalf("BeginLogin: %v", err)
	}
	if opts == nil {
		t.Fatal("expected non-nil options")
	}
	if session == "" {
		t.Fatal("expected non-empty session blob")
	}
}

func TestCredentialRoundTrip(t *testing.T) {
	in := StoredCred{
		CredentialID: "AQIDBAUGBwgJCgsMDQ4PEA",
		PublicKey:    "AQIDBAUGBwgJCgsMDQ4PEA",
		Counter:      7,
		Transports:   []string{"usb", "nfc"},
	}
	wc, err := toCredential(in)
	if err != nil {
		t.Fatalf("toCredential: %v", err)
	}
	out := fromCredential(&wc)
	if out.CredentialID != in.CredentialID {
		t.Errorf("CredentialID = %q, want %q", out.CredentialID, in.CredentialID)
	}
	if out.PublicKey != in.PublicKey {
		t.Errorf("PublicKey = %q, want %q", out.PublicKey, in.PublicKey)
	}
	if out.Counter != in.Counter {
		t.Errorf("Counter = %d, want %d", out.Counter, in.Counter)
	}
	if len(out.Transports) != len(in.Transports) {
		t.Errorf("Transports = %v, want %v", out.Transports, in.Transports)
	}
}

// A credential's flags byte (which carries the immutable backup-eligible flag)
// must survive the store/reconstruct round-trip; otherwise go-webauthn's login
// validation reports a "Backup Eligible flag inconsistency" for synced passkeys.
func TestCredentialFlagsRoundTrip(t *testing.T) {
	// BE (backup-eligible) + BS (backup-state) set, as a synced platform passkey reports.
	flags := uint8(protocol.FlagBackupEligible | protocol.FlagBackupState)
	in := StoredCred{
		CredentialID: "AQIDBAUGBwgJCgsMDQ4PEA",
		PublicKey:    "AQIDBAUGBwgJCgsMDQ4PEA",
		Counter:      1,
		Flags:        &flags,
	}
	wc, err := toCredential(in)
	if err != nil {
		t.Fatalf("toCredential: %v", err)
	}
	if !wc.Flags.BackupEligible || !wc.Flags.BackupState {
		t.Fatalf("reconstructed flags = %+v, want BE and BS set", wc.Flags)
	}
	out := fromCredential(&wc)
	if out.Flags == nil || *out.Flags != flags {
		t.Fatalf("round-tripped flags = %v, want %d", out.Flags, flags)
	}
}

// A credential stored before flags were persisted (nil flags) must reconstruct
// without any flags set so login can adopt whatever the assertion presents.
func TestCredentialNilFlags(t *testing.T) {
	wc, err := toCredential(StoredCred{
		CredentialID: "AQIDBAUGBwgJCgsMDQ4PEA",
		PublicKey:    "AQIDBAUGBwgJCgsMDQ4PEA",
	})
	if err != nil {
		t.Fatalf("toCredential: %v", err)
	}
	if wc.Flags.BackupEligible {
		t.Fatalf("expected no backup-eligible flag for an unrecorded credential")
	}
}
