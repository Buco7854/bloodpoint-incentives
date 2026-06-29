package httpapi

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/buco7854/bloodpoint-incentives/internal/config"
	"github.com/buco7854/bloodpoint-incentives/internal/db"
	"github.com/buco7854/bloodpoint-incentives/internal/domain"
	"github.com/buco7854/bloodpoint-incentives/internal/registry"
)

const testShell = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="Live Bloodpoint incentives for Dead by Daylight: the current survivor and killer bonus in every matchmaking region, updated in real time." />
    <meta property="og:url" content="__OG_ORIGIN__/" />
    <meta property="og:title" content="Bloodpoint Incentives" />
    <meta property="og:description" content="Track the live Bloodpoint bonus for survivor and killer in every Dead by Daylight matchmaking region." />
    <meta property="og:image" content="__OG_ORIGIN__/og.png" />
    <meta property="og:image:alt" content="Bloodpoint Incentives" />
    <meta name="twitter:title" content="Bloodpoint Incentives" />
    <title>Bloodpoint Incentives</title>
  </head>
  <body><div id="root"></div></body>
</html>`

func seoServer(t *testing.T, seo bool, origin string) *Server {
	t.Helper()
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "index.html"), []byte(testShell), 0o644); err != nil {
		t.Fatal(err)
	}
	cfg := &config.Config{SEOEnabled: seo}
	cfg.Auth.Origin = origin
	// One agent on eu-central-1; us-west-2 has none, so it stays uncovered.
	prov, err := registry.NewProvider(func() ([]db.AgentRow, error) {
		return []db.AgentRow{{ID: 1, Region: "eu-central-1", Platform: domain.PlatformWindows, Enabled: true}}, nil
	})
	if err != nil {
		t.Fatal(err)
	}
	return New(Deps{Config: cfg, PublicDir: dir, Registry: prov})
}

func get(t *testing.T, srv *Server, path string) *httptest.ResponseRecorder {
	t.Helper()
	rec := httptest.NewRecorder()
	srv.Router.ServeHTTP(rec, httptest.NewRequest("GET", path, nil))
	return rec
}

func TestRobotsDisabledDisallowsAll(t *testing.T) {
	rec := get(t, seoServer(t, false, "https://x.test"), "/robots.txt")
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
	if !strings.Contains(rec.Body.String(), "Disallow: /") || strings.Contains(rec.Body.String(), "Sitemap:") {
		t.Fatalf("unexpected robots body: %q", rec.Body.String())
	}
}

func TestRobotsEnabledAllowsAndLinksSitemap(t *testing.T) {
	rec := get(t, seoServer(t, true, "https://x.test"), "/robots.txt")
	body := rec.Body.String()
	if !strings.Contains(body, "Allow: /") || !strings.Contains(body, "Sitemap: https://x.test/sitemap.xml") {
		t.Fatalf("unexpected robots body: %q", body)
	}
	if !strings.Contains(body, "Disallow: /admin") {
		t.Fatalf("private routes not disallowed: %q", body)
	}
}

func TestSitemap(t *testing.T) {
	if rec := get(t, seoServer(t, false, "https://x.test"), "/sitemap.xml"); rec.Code != http.StatusNotFound {
		t.Fatalf("disabled sitemap status = %d", rec.Code)
	}
	rec := get(t, seoServer(t, true, "https://x.test"), "/sitemap.xml")
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
	body := rec.Body.String()
	if !strings.Contains(body, "<loc>https://x.test/platforms/Windows</loc>") ||
		!strings.Contains(body, "<loc>https://x.test/platforms/Windows/regions/eu-central-1</loc>") {
		t.Fatalf("unexpected sitemap: %q", body)
	}
	if strings.Contains(body, "us-west-2") || strings.Contains(body, "/platforms/EGS") {
		t.Fatalf("uncovered platform/region listed in sitemap: %q", body)
	}
}

func TestUncoveredRegionNoindex(t *testing.T) {
	rec := get(t, seoServer(t, true, "https://x.test"), "/platforms/Windows/regions/us-west-2")
	if h := rec.Header().Get("X-Robots-Tag"); !strings.Contains(h, "noindex") {
		t.Fatalf("X-Robots-Tag = %q", h)
	}
	if !strings.Contains(rec.Body.String(), `content="noindex, nofollow"`) {
		t.Fatalf("uncovered region should be noindex")
	}
}

func TestRootRedirectsToDefaultPlatform(t *testing.T) {
	rec := get(t, seoServer(t, true, "https://x.test"), "/")
	if rec.Code != http.StatusFound {
		t.Fatalf("status = %d", rec.Code)
	}
	if loc := rec.Header().Get("Location"); loc != "/platforms/Windows" {
		t.Fatalf("Location = %q", loc)
	}
}

func TestShellNoindexWhenDisabled(t *testing.T) {
	rec := get(t, seoServer(t, false, "https://x.test"), "/platforms/Windows")
	if h := rec.Header().Get("X-Robots-Tag"); !strings.Contains(h, "noindex") {
		t.Fatalf("X-Robots-Tag = %q", h)
	}
	body := rec.Body.String()
	if !strings.Contains(body, `name="robots" content="noindex, nofollow"`) {
		t.Fatalf("expected noindex meta: %q", body)
	}
	if strings.Contains(body, "__OG_ORIGIN__") {
		t.Fatalf("og placeholder not resolved: %q", body)
	}
}

func TestShellIndexesHomeAndRegions(t *testing.T) {
	srv := seoServer(t, true, "https://x.test")
	cases := map[string]string{
		"/platforms/Windows":                      "https://x.test/platforms/Windows",
		"/platforms/Windows/regions/eu-central-1": "https://x.test/platforms/Windows/regions/eu-central-1",
	}
	for path, want := range cases {
		body := get(t, srv, path).Body.String()
		if !strings.Contains(body, `name="robots" content="index, follow`) {
			t.Fatalf("%s not indexable: %q", path, body)
		}
		if !strings.Contains(body, `rel="canonical" href="`+want+`"`) {
			t.Fatalf("%s missing canonical %q: %q", path, want, body)
		}
	}
}

func TestShellRegionMetadata(t *testing.T) {
	body := get(t, seoServer(t, true, "https://x.test"), "/platforms/Windows/regions/eu-central-1").Body.String()
	m, _ := domain.RegionMetaFor("eu-central-1")
	if !strings.Contains(body, "<title>"+m.DisplayName+" Bloodpoint Incentives | Live Bonus Tracker</title>") {
		t.Fatalf("region title not applied: %q", body)
	}
	if !strings.Contains(body, `<meta property="og:title" content="`+m.DisplayName+` Bloodpoint Incentives | Live Bonus Tracker" />`) {
		t.Fatalf("region og:title not applied: %q", body)
	}
	if !strings.Contains(body, "Live Bloodpoint incentives for "+m.DisplayName+": the current survivor and killer bonus") {
		t.Fatalf("region description not applied: %q", body)
	}
	if strings.Contains(body, titleTag) {
		t.Fatalf("default title leaked on region page: %q", body)
	}
	if !strings.Contains(body, `<meta property="og:image:alt" content="Bloodpoint Incentives" />`) {
		t.Fatalf("brand string clobbered: %q", body)
	}
}

func TestShellPlatformLabelInTitle(t *testing.T) {
	srv := seoServer(t, true, "https://x.test")
	m, _ := domain.RegionMetaFor("eu-central-1")
	// Non-default platform carries its label so titles stay distinct per platform.
	region := get(t, srv, "/platforms/EGS/regions/eu-central-1").Body.String()
	if !strings.Contains(region, "<title>"+m.DisplayName+" Bloodpoint Incentives (Epic) | Live Bonus Tracker</title>") {
		t.Fatalf("EGS region title: %q", region)
	}
	if !strings.Contains(region, "on Epic") {
		t.Fatalf("EGS region description missing platform: %q", region)
	}
	home := get(t, srv, "/platforms/EGS").Body.String()
	if !strings.Contains(home, "<title>Bloodpoint Incentives - Epic</title>") {
		t.Fatalf("EGS home title: %q", home)
	}
	// The default platform keeps the clean baked-in title.
	def := get(t, srv, "/platforms/Windows").Body.String()
	if !strings.Contains(def, titleTag) {
		t.Fatalf("default home title should be unchanged: %q", def)
	}
}

func TestShellNoindexPrivateAndUnknownEvenWhenEnabled(t *testing.T) {
	srv := seoServer(t, true, "https://x.test")
	for _, path := range []string{"/login", "/admin", "/platforms/EGS", "/platforms/Windows/regions/nope", "/whatever"} {
		rec := get(t, srv, path)
		if h := rec.Header().Get("X-Robots-Tag"); !strings.Contains(h, "noindex") {
			t.Fatalf("%s X-Robots-Tag = %q", path, h)
		}
		if !strings.Contains(rec.Body.String(), `content="noindex, nofollow"`) {
			t.Fatalf("%s should be noindex", path)
		}
	}
}
