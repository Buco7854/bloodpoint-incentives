package store

import (
	"testing"
	"time"

	"github.com/buco7854/bloodpoint-incentives/internal/domain"
)

func TestActiveEventInSnapshot(t *testing.T) {
	s, _, _ := newTestStore(t)
	now := time.Date(2026, 7, 4, 12, 0, 0, 0, time.UTC)

	s.SetEvents([]domain.BonusEvent{
		{Key: "BPEVENT_Bloodhunt_NAME", Label: "Bloodhunt", Multiplier: 2,
			StartsAt: "2026-07-03T15:00:00.000Z", EndsAt: "2026-07-07T14:59:00.000Z"},
		{Key: "BPEVENT_Old_NAME", Label: "Old", Multiplier: 3,
			StartsAt: "2025-01-01T00:00:00.000Z", EndsAt: "2025-01-02T00:00:00.000Z"},
	})

	got := s.Incentives(domain.PlatformWindows, now)
	if got.ActiveEvent == nil {
		t.Fatal("expected an active event")
	}
	if got.ActiveEvent.Label != "Bloodhunt" || got.ActiveEvent.Multiplier != 2 {
		t.Fatalf("unexpected active event: %+v", got.ActiveEvent)
	}
}

func TestOverlappingEventsPickStrongest(t *testing.T) {
	s, _, _ := newTestStore(t)
	now := time.Date(2026, 7, 4, 12, 0, 0, 0, time.UTC)
	s.SetEvents([]domain.BonusEvent{
		{Label: "Bloodhunt", Multiplier: 2, StartsAt: "2026-07-01T00:00:00Z", EndsAt: "2026-07-10T00:00:00Z"},
		{Label: "Bloodfeast", Multiplier: 3, StartsAt: "2026-07-03T00:00:00Z", EndsAt: "2026-07-06T00:00:00Z"},
	})
	ev := s.Incentives(domain.PlatformWindows, now).ActiveEvent
	if ev == nil || ev.Label != "Bloodfeast" {
		t.Fatalf("expected the stronger overlapping event (Bloodfeast x3), got %+v", ev)
	}
}

func TestNoActiveEventWhenAllPastOrFuture(t *testing.T) {
	s, _, _ := newTestStore(t)
	now := time.Date(2026, 7, 4, 12, 0, 0, 0, time.UTC)
	s.SetEvents([]domain.BonusEvent{
		{Label: "Past", Multiplier: 2, StartsAt: "2020-01-01T00:00:00Z", EndsAt: "2020-01-02T00:00:00Z"},
		{Label: "Future", Multiplier: 2, StartsAt: "2030-01-01T00:00:00Z", EndsAt: "2030-01-02T00:00:00Z"},
	})
	if ev := s.Incentives(domain.PlatformWindows, now).ActiveEvent; ev != nil {
		t.Fatalf("expected no active event, got %+v", ev)
	}
}
