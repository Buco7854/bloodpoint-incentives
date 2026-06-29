package httpapi

import (
	"html"
	"net/http"
	"strings"

	"github.com/buco7854/bloodpoint-incentives/internal/domain"
	"github.com/buco7854/bloodpoint-incentives/internal/registry"
)

const ogOriginPlaceholder = "__OG_ORIGIN__"

const (
	titleTag                 = "<title>Bloodpoint Incentives</title>"
	ogTitleTag               = `<meta property="og:title" content="Bloodpoint Incentives" />`
	twitterTitleTag          = `<meta name="twitter:title" content="Bloodpoint Incentives" />`
	defaultDescription       = "Live Bloodpoint incentives for Dead by Daylight: the current survivor and killer bonus in every matchmaking region, updated in real time."
	defaultSocialDescription = "Track the live Bloodpoint bonus for survivor and killer in every Dead by Daylight matchmaking region."
)

var privatePaths = []string{"/login", "/setup", "/admin", "/account", "/register"}

func (s *Server) seoEnabled() bool {
	return s.deps.Config != nil && s.deps.Config.SEOEnabled
}

func (s *Server) seoOrigin() string {
	if s.deps.Config != nil && s.deps.Config.Auth.Origin != "" {
		return strings.TrimRight(s.deps.Config.Auth.Origin, "/")
	}
	return ""
}

func (s *Server) liveRegistry() *registry.Registry {
	if s.deps.Registry == nil {
		return nil
	}
	return s.deps.Registry.Current()
}

// platformHome parses /platforms/{platform} and reports whether the platform is known.
func platformHome(path string) (domain.Platform, bool) {
	rest, ok := strings.CutPrefix(path, "/platforms/")
	if !ok || rest == "" || strings.Contains(rest, "/") || !domain.IsKnownPlatform(rest) {
		return "", false
	}
	return domain.Platform(rest), true
}

// platformRegion parses /platforms/{platform}/regions/{region}, mirroring the REST shape.
func platformRegion(path string) (domain.Platform, string, bool) {
	rest, ok := strings.CutPrefix(path, "/platforms/")
	if !ok {
		return "", "", false
	}
	p, region, ok := strings.Cut(rest, "/regions/")
	if !ok || p == "" || region == "" || strings.Contains(region, "/") || !domain.IsKnownPlatform(p) {
		return "", "", false
	}
	return domain.Platform(p), region, true
}

// platformCovered reports whether a platform has any agent.
func (s *Server) platformCovered(p domain.Platform) bool {
	reg := s.liveRegistry()
	return reg != nil && len(reg.RegionsFor(p)) > 0
}

// regionCovered reports whether a platform+region has any agent.
func (s *Server) regionCovered(p domain.Platform, region string) bool {
	reg := s.liveRegistry()
	return reg != nil && len(reg.AgentsInGroup(region, p)) > 0
}

// indexablePath is true only for real public content: a platform home or a
// platform+region page backed by an agent. Private/unknown/empty paths are excluded.
func (s *Server) indexablePath(path string) bool {
	if p, ok := platformHome(path); ok {
		return s.platformCovered(p)
	}
	if p, region, ok := platformRegion(path); ok {
		return s.regionCovered(p, region)
	}
	return false
}

func canonicalPath(path string) string {
	return "/" + strings.Trim(path, "/")
}

// noindexMiddleware tags every response noindex; installed only when SEO is off.
func noindexMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Robots-Tag", "noindex, nofollow")
		next.ServeHTTP(w, r)
	})
}

// pageMeta returns the title/description to substitute for a path, or ok=false to
// keep the baked-in defaults (the default platform's home stays clean). The
// platform label distinguishes the same region/home across platforms.
func pageMeta(path string) (title, desc string, ok bool) {
	if p, region, found := platformRegion(path); found {
		m, mok := domain.RegionMetaFor(region)
		if !mok {
			return "", "", false
		}
		title = m.DisplayName + " Bloodpoint Incentives" + platformParen(p) + " | Live Bonus Tracker"
		desc = "Live Bloodpoint incentives for " + m.DisplayName + platformOn(p) +
			": the current survivor and killer bonus, updated in real time for Dead by Daylight."
		return title, desc, true
	}
	if p, found := platformHome(path); found && p != domain.DefaultPlatform {
		label := domain.PlatformLabel(p)
		title = "Bloodpoint Incentives - " + label
		desc = "Live Bloodpoint incentives for Dead by Daylight on " + label +
			": the current survivor and killer bonus in every matchmaking region, updated in real time."
		return title, desc, true
	}
	return "", "", false
}

// platformParen / platformOn render the platform label for non-default platforms only.
func platformParen(p domain.Platform) string {
	if p == domain.DefaultPlatform {
		return ""
	}
	return " (" + domain.PlatformLabel(p) + ")"
}

func platformOn(p domain.Platform) string {
	if p == domain.DefaultPlatform {
		return ""
	}
	return " on " + domain.PlatformLabel(p)
}

func (s *Server) renderShell(shell, path string, index bool) string {
	origin := s.seoOrigin()

	if title, desc, ok := pageMeta(path); ok {
		shell = strings.Replace(shell, titleTag, "<title>"+title+"</title>", 1)
		shell = strings.Replace(shell, ogTitleTag, `<meta property="og:title" content="`+title+`" />`, 1)
		shell = strings.Replace(shell, twitterTitleTag, `<meta name="twitter:title" content="`+title+`" />`, 1)
		shell = strings.ReplaceAll(shell, defaultSocialDescription, desc)
		shell = strings.Replace(shell, defaultDescription, desc, 1)
	}

	if index && origin != "" {
		canonical := html.EscapeString(origin + canonicalPath(path))
		shell = strings.Replace(shell,
			`<meta property="og:url" content="`+ogOriginPlaceholder+`/" />`,
			`<meta property="og:url" content="`+canonical+`" />`, 1)
	}
	shell = strings.ReplaceAll(shell, ogOriginPlaceholder, origin)

	robots := "noindex, nofollow"
	if index {
		robots = "index, follow, max-image-preview:large"
	}
	var head strings.Builder
	head.WriteString(`<meta name="robots" content="` + robots + `" />`)
	if index && origin != "" {
		canonical := html.EscapeString(origin + canonicalPath(path))
		head.WriteString("\n    " + `<link rel="canonical" href="` + canonical + `" />`)
		if _, ok := platformHome(path); ok {
			head.WriteString("\n    " + websiteJSONLD(origin))
		}
	}
	return strings.Replace(shell, "</head>", "    "+head.String()+"\n  </head>", 1)
}

func websiteJSONLD(origin string) string {
	o := html.EscapeString(origin)
	return `<script type="application/ld+json">` +
		`{"@context":"https://schema.org","@type":"WebSite",` +
		`"name":"Bloodpoint Incentives",` +
		`"alternateName":["Bloodpoint Bonus","DBD Bloodpoint Multiplier","BP Bonus Tracker"],` +
		`"url":"` + o + `/",` +
		`"description":"Live Bloodpoint incentives for Dead by Daylight: survivor and killer bonus per region."}` +
		`</script>`
}

func (s *Server) registerSEORoutes() {
	s.Router.Get("/robots.txt", s.handleRobots)
	s.Router.Get("/sitemap.xml", s.handleSitemap)
}

func (s *Server) handleRobots(w http.ResponseWriter, _ *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=3600")
	var b strings.Builder
	if !s.seoEnabled() {
		b.WriteString("User-agent: *\nDisallow: /\n")
	} else {
		b.WriteString("User-agent: *\nAllow: /\n")
		for _, p := range privatePaths {
			b.WriteString("Disallow: " + p + "\n")
		}
		if origin := s.seoOrigin(); origin != "" {
			b.WriteString("Sitemap: " + origin + "/sitemap.xml\n")
		}
	}
	_, _ = w.Write([]byte(b.String()))
}

func (s *Server) handleSitemap(w http.ResponseWriter, r *http.Request) {
	origin := s.seoOrigin()
	reg := s.liveRegistry()
	if !s.seoEnabled() || origin == "" || reg == nil {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Content-Type", "application/xml; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=3600")
	var b strings.Builder
	b.WriteString(`<?xml version="1.0" encoding="UTF-8"?>` + "\n")
	b.WriteString(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + "\n")
	writeURL := func(loc string) {
		b.WriteString("  <url><loc>" + html.EscapeString(loc) + "</loc></url>\n")
	}
	for _, p := range reg.Platforms() {
		base := origin + "/platforms/" + string(p)
		writeURL(base)
		for _, region := range reg.RegionsFor(p) {
			writeURL(base + "/regions/" + region)
		}
	}
	b.WriteString("</urlset>\n")
	_, _ = w.Write([]byte(b.String()))
}
