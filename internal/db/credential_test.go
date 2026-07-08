package db

import "testing"

// Credential flags must persist through insert/read and be updatable on login, so
// the WebAuthn backup-eligible flag stays consistent across assertions. A nil flags
// value (legacy passkey) must read back as nil rather than zero.
func TestCredentialFlagsPersist(t *testing.T) {
	conn, err := Open(":memory:")
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close()
	repo, err := NewAuthRepo(conn)
	if err != nil {
		t.Fatal(err)
	}

	u, err := repo.CreateUser(NewUser{Username: "alice", Role: RoleUser})
	if err != nil {
		t.Fatal(err)
	}

	flags := int64(29) // UP|UV|BE|BS
	if err := repo.AddCredential(CredentialRow{UserID: u.ID, CredentialID: "cred-with-flags", PublicKey: "pk", Counter: 0, Flags: &flags}); err != nil {
		t.Fatal(err)
	}
	if err := repo.AddCredential(CredentialRow{UserID: u.ID, CredentialID: "cred-legacy", PublicKey: "pk", Counter: 0, Flags: nil}); err != nil {
		t.Fatal(err)
	}

	creds, err := repo.CredentialsForUser(u.ID)
	if err != nil {
		t.Fatal(err)
	}
	byID := map[string]CredentialRow{}
	for _, c := range creds {
		byID[c.CredentialID] = c
	}
	if got := byID["cred-with-flags"].Flags; got == nil || *got != 29 {
		t.Fatalf("flags = %v, want 29", got)
	}
	if got := byID["cred-legacy"].Flags; got != nil {
		t.Fatalf("legacy flags = %v, want nil", got)
	}

	// A successful assertion updates the counter and refreshes the flags.
	newFlags := int64(21) // BS cleared
	if err := repo.UpdateCredentialCounter("cred-with-flags", 5, &newFlags); err != nil {
		t.Fatal(err)
	}
	c, ok, err := repo.GetCredential("cred-with-flags")
	if err != nil || !ok {
		t.Fatalf("GetCredential: ok=%v err=%v", ok, err)
	}
	if c.Counter != 5 {
		t.Fatalf("counter = %d, want 5", c.Counter)
	}
	if c.Flags == nil || *c.Flags != 21 {
		t.Fatalf("updated flags = %v, want 21", c.Flags)
	}
}
