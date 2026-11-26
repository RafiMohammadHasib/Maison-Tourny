import { test, describe } from "node:test";
import assert from "node:assert";
import {
  getLocalSettings,
  persistLocalSettings,
  saveSiteSettingsAsync,
  getSiteSettingsAsync,
  DEFAULT_SEO_SETTINGS
} from "../src/lib/settingsStore";
import { parseGoogleSiteVerificationToken } from "../src/components/seo/GoogleTag";

describe("6. Unit Tests: SEO & Google Analytics Settings & Persistence", () => {
  test("loads default SEO settings containing user GTM container GTM-K7CVNBTS", () => {
    const settings = getLocalSettings();
    assert.ok(settings.settings_seo, "settings_seo should exist");
    assert.strictEqual(settings.settings_seo?.googleTagId, "GTM-K7CVNBTS");
    assert.strictEqual(settings.settings_seo?.googleTagEnabled, true);
    assert.ok(settings.settings_seo?.metaTitle.includes("Maison Tourny"));
  });

  test("persists secondary GA4, Google verification and custom scripts", async () => {
    const testSeo = {
      ...DEFAULT_SEO_SETTINGS,
      googleTagId: "GTM-K7CVNBTS",
      googleTagEnabled: true,
      googleAnalyticsId: "",
      googleSearchConsole: '<meta name="google-site-verification" content="x6PyptfUZpTT1LWFaEJEzgoTPkTt3_4s9j48E-ZJmdI" />',
      customHeadCode: "",
      customBodyCode: ""
    };

    const saved = await saveSiteSettingsAsync({ settings_seo: testSeo });
    assert.strictEqual(saved.settings.settings_seo?.googleTagId, "GTM-K7CVNBTS");
    assert.strictEqual(
      saved.settings.settings_seo?.googleSearchConsole,
      '<meta name="google-site-verification" content="x6PyptfUZpTT1LWFaEJEzgoTPkTt3_4s9j48E-ZJmdI" />'
    );

    const fetched = await getSiteSettingsAsync();
    assert.strictEqual(fetched.settings.settings_seo?.googleTagId, "GTM-K7CVNBTS");
    assert.strictEqual(
      fetched.settings.settings_seo?.googleSearchConsole,
      '<meta name="google-site-verification" content="x6PyptfUZpTT1LWFaEJEzgoTPkTt3_4s9j48E-ZJmdI" />'
    );
  });

  test("extracts Google Search Console verification token from various user input formats", () => {
    const fullTag = parseGoogleSiteVerificationToken('<meta name="google-site-verification" content="GSC_TOKEN_123" />');
    assert.strictEqual(fullTag, "GSC_TOKEN_123");

    const singleQuote = parseGoogleSiteVerificationToken("<meta name='google-site-verification' content='GSC_TOKEN_SINGLE' />");
    assert.strictEqual(singleQuote, "GSC_TOKEN_SINGLE");

    const rawToken = parseGoogleSiteVerificationToken("RAW_TOKEN_ONLY_456");
    assert.strictEqual(rawToken, "RAW_TOKEN_ONLY_456");

    const empty = parseGoogleSiteVerificationToken("");
    assert.strictEqual(empty, "");
  });
});
