package report

import "testing"

func TestValidateEventsNormalizesAndFilters(t *testing.T) {
	in := []EventInput{
		{Key: "BPEVENT_Bloodhunt_NAME", Label: "Bloodhunt", Multiplier: 2, StartsAt: "2026-07-03T15:00:00Z", EndsAt: "2026-07-07T14:59:00Z"},
		{Key: "bad-multiplier", Label: "x", Multiplier: 0.5, StartsAt: "2026-07-03T15:00:00Z", EndsAt: "2026-07-07T14:59:00Z"}, // < 1, dropped
		{Key: "bad-times", Label: "x", Multiplier: 2, StartsAt: "nope", EndsAt: "nope"},                                        // unparseable, dropped
		{Key: "end-before-start", Label: "x", Multiplier: 2, StartsAt: "2026-07-07T00:00:00Z", EndsAt: "2026-07-03T00:00:00Z"}, // dropped
		{Key: "BPEVENT_NoLabel_NAME", Label: "", Multiplier: 1.5, StartsAt: "2026-01-01T00:00:00Z", EndsAt: "2026-01-02T00:00:00Z"},
	}
	out := ValidateEvents(in)
	if len(out) != 2 {
		t.Fatalf("expected 2 valid events, got %d: %+v", len(out), out)
	}
	if out[0].Label != "Bloodhunt" {
		t.Errorf("unexpected first event: %+v", out[0])
	}
	// Empty label falls back to the key.
	if out[1].Label != "BPEVENT_NoLabel_NAME" {
		t.Errorf("expected label to fall back to key, got %q", out[1].Label)
	}
}

func TestValidateEventsCapsCount(t *testing.T) {
	in := make([]EventInput, maxEvents+50)
	for i := range in {
		in[i] = EventInput{Key: "k", Label: "l", Multiplier: 2, StartsAt: "2026-01-01T00:00:00Z", EndsAt: "2026-01-02T00:00:00Z"}
	}
	if out := ValidateEvents(in); len(out) != maxEvents {
		t.Fatalf("expected cap at %d, got %d", maxEvents, len(out))
	}
}
