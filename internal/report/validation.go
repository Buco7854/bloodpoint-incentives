// Package report validates incoming agent readings against the agent's assignment
// and a set of generous plausibility bounds.
package report

import (
	"errors"
	"math"

	"github.com/buco7854/bloodpoint-incentives/internal/domain"
	"github.com/buco7854/bloodpoint-incentives/internal/registry"
)

const (
	maxPercent        = 1000
	maxRatio          = 100000
	clockSkewMs       = 60_000
	maxAgeMs          = 10 * 60_000
	maxStringLength   = 64
	maxRefreshSeconds = 6 * 3600
	maxEvents         = 200
	maxMultiplier     = 100
)

// Input is a reading as received from an agent (already JSON-decoded).
type Input struct {
	Region             string          `json:"region"`
	Platform           domain.Platform `json:"platform"`
	Survivor           float64         `json:"survivor"`
	Killer             float64         `json:"killer"`
	Ratio              float64         `json:"ratio"`
	IsReal             bool            `json:"isReal"`
	Version            *string         `json:"version,omitempty"`
	Category           *string         `json:"category,omitempty"`
	RefreshTimeSeconds *float64        `json:"refreshTimeSeconds,omitempty"`
	MeasuredAt         string          `json:"measuredAt"`
}

func finite(v float64) bool { return !math.IsNaN(v) && !math.IsInf(v, 0) }

func clip(s *string) *string {
	if s == nil {
		return nil
	}
	v := *s
	if len(v) > maxStringLength {
		v = v[:maxStringLength]
	}
	return &v
}

// Validate checks an input against the agent's slot and the plausibility bounds,
// returning the normalized report or a reason to reject.
func Validate(in Input, slot registry.Slot, nowMs int64) (domain.AgentReport, error) {
	if in.Region != slot.Region || in.Platform != slot.Platform {
		return domain.AgentReport{}, errors.New("report does not match the agent assignment")
	}
	if !in.IsReal {
		return domain.AgentReport{}, errors.New("report must be a real reading (isReal=true)")
	}
	ts, ok := domain.ParseISOMs(in.MeasuredAt)
	if in.MeasuredAt == "" || !ok {
		return domain.AgentReport{}, errors.New("measuredAt is not a valid timestamp")
	}
	if ts > nowMs+clockSkewMs {
		return domain.AgentReport{}, errors.New("measuredAt is in the future")
	}
	if ts < nowMs-maxAgeMs {
		return domain.AgentReport{}, errors.New("measuredAt is too old")
	}
	if !finite(in.Survivor) || !finite(in.Killer) || !finite(in.Ratio) {
		return domain.AgentReport{}, errors.New("survivor, killer and ratio must be finite numbers")
	}
	if in.Survivor < 0 || in.Survivor > maxPercent || in.Killer < 0 || in.Killer > maxPercent {
		return domain.AgentReport{}, errors.New("survivor/killer percentages are out of range")
	}
	if in.Ratio <= 0 || in.Ratio > maxRatio {
		return domain.AgentReport{}, errors.New("ratio is out of range")
	}

	var refresh *int
	if in.RefreshTimeSeconds != nil {
		v := *in.RefreshTimeSeconds
		if v > 0 && v <= maxRefreshSeconds {
			r := int(v)
			refresh = &r
		}
	}
	return domain.AgentReport{
		Region:             slot.Region,
		Platform:           slot.Platform,
		Survivor:           int(in.Survivor),
		Killer:             int(in.Killer),
		Ratio:              in.Ratio,
		IsReal:             true,
		Version:            clip(in.Version),
		Category:           clip(in.Category),
		RefreshTimeSeconds: refresh,
		MeasuredAt:         in.MeasuredAt,
	}, nil
}

// EventInput is one Bloodpoint event as received from an agent.
type EventInput struct {
	Key        string  `json:"key"`
	Label      string  `json:"label"`
	Multiplier float64 `json:"multiplier"`
	StartsAt   string  `json:"startsAt"`
	EndsAt     string  `json:"endsAt"`
}

// clipStr trims a plain string to the max length (events carry non-pointer strings).
func clipStr(s string) string {
	if len(s) > maxStringLength {
		return s[:maxStringLength]
	}
	return s
}

// ValidateEvents normalizes an agent's Bloodpoint-event schedule, dropping any
// malformed entry rather than rejecting the whole batch (a bad row shouldn't hide
// a live event), and capping the count so a rogue agent can't flood the store.
func ValidateEvents(in []EventInput) []domain.BonusEvent {
	if len(in) > maxEvents {
		in = in[:maxEvents]
	}
	out := make([]domain.BonusEvent, 0, len(in))
	for _, e := range in {
		if !finite(e.Multiplier) || e.Multiplier < 1 || e.Multiplier > maxMultiplier {
			continue
		}
		start, ok := domain.ParseISOMs(e.StartsAt)
		if !ok {
			continue
		}
		end, ok := domain.ParseISOMs(e.EndsAt)
		if !ok || end <= start {
			continue
		}
		label := clipStr(e.Label)
		if label == "" {
			label = clipStr(e.Key)
		}
		out = append(out, domain.BonusEvent{
			Key:        clipStr(e.Key),
			Label:      label,
			Multiplier: e.Multiplier,
			StartsAt:   e.StartsAt,
			EndsAt:     e.EndsAt,
		})
	}
	return out
}
