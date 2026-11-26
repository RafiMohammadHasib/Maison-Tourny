import React from "react";
import { SeoSettings } from "@/lib/settingsStore";
import CustomScriptsExecutor from "./CustomScriptsExecutor";

export function parseGoogleSiteVerificationToken(raw: string | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  // Check if user pasted a <meta ... content="..." ...> tag
  const match = trimmed.match(/content\s*=\s*["']([^"']+)["']/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  // If user pasted something with angle brackets like <meta ...>, strip tags
  const cleaned = trimmed.replace(/<[^>]*>/g, "").trim();
  return cleaned;
}

interface GoogleTagHeadProps {
  seo: SeoSettings;
}

export function GoogleTagHead({ seo }: GoogleTagHeadProps) {
  const {
    googleTagId,
    googleTagEnabled,
    googleAnalyticsId,
    googleSearchConsole,
    customHeadCode
  } = seo;

  const fallbackGsc = "x6PyptfUZpTT1LWFaEJEzgoTPkTt3_4s9j48E-ZJmdI";
  const cleanGscCode =
    parseGoogleSiteVerificationToken(googleSearchConsole) ||
    parseGoogleSiteVerificationToken(customHeadCode) ||
    fallbackGsc;
  const primaryId = (googleTagId || "").trim();
  const secondaryId = (googleAnalyticsId || "").trim();

  const isPrimaryGtm = primaryId.toUpperCase().startsWith("GTM-");
  const isPrimaryGa4 = primaryId.toUpperCase().startsWith("G-");

  return (
    <>
      {/* 1. Google Search Console Verification Meta */}
      <meta name="google-site-verification" content={cleanGscCode} />

      {/* 2. Primary Google Tag (gtm.js for GTM container OR gtag.js for GA4) */}
      {googleTagEnabled && primaryId && (
        <>
          {isPrimaryGtm ? (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(
                  primaryId
                )}`}
                suppressHydrationWarning
              />
              <script
                id="google-tag-manager-init"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                  __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
                  `.trim()
                }}
              />
            </>
          ) : (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
                  primaryId
                )}`}
                suppressHydrationWarning
              />
              <script
                id="google-gtag-init"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                  __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${primaryId}');
                  `.trim()
                }}
              />
            </>
          )}
        </>
      )}

      {/* 3. Secondary Google Analytics 4 (GA4) stream ID if distinct from primary tag */}
      {googleTagEnabled && secondaryId && secondaryId !== primaryId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
              secondaryId
            )}`}
            suppressHydrationWarning
          />
          <script
            id="google-secondary-analytics-init"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${secondaryId}');
              `.trim()
            }}
          />
        </>
      )}
    </>
  );
}

interface GoogleTagBodyProps {
  seo: SeoSettings;
}

export function GoogleTagBody({ seo }: GoogleTagBodyProps) {
  const { googleTagId, googleTagEnabled, customHeadCode, customBodyCode } = seo;

  const isGtm = googleTagId && googleTagId.trim().toUpperCase().startsWith("GTM-");

  return (
    <>
      {/* Google Tag Manager (noscript fallback container for JS-disabled browsers/bots) */}
      {googleTagEnabled && isGtm && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(
              googleTagId.trim()
            )}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}

      {/* Dynamic & Executable Custom Scripts Runner (Head & Body code injection) */}
      <CustomScriptsExecutor
        customHeadCode={customHeadCode}
        customBodyCode={customBodyCode}
      />
    </>
  );
}
