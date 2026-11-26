import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { LanguageProvider } from "@/lib/languageContext";
import {
  getLocalSettings,
  DEFAULT_SEO_SETTINGS
} from "@/lib/settingsStore";
import { GoogleTagHead, GoogleTagBody, parseGoogleSiteVerificationToken } from "@/components/seo/GoogleTag";
import JsonLd from "@/components/seo/JsonLd";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap"
});

export const viewport: Viewport = {
  themeColor: "#a5aed7",
  width: "device-width",
  initialScale: 1
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = getLocalSettings();
  const seo = settings.settings_seo || DEFAULT_SEO_SETTINGS;

  const canonicalUrl = seo.canonicalUrl || "https://maisoncalve.fr";
  const title = seo.metaTitle || "Maison Tourny — Coworking Bordeaux Fondaudège avec Parking";
  const description =
    seo.metaDescription ||
    "Maison Tourny : espace de coworking haut de gamme à Bordeaux Fondaudège (48 rue Calvé). 5 bureaux privatifs, open space feutré, salle de réunion 30m² et 9 places de parking privatives sécurisées.";

  const rawKeywords =
    seo.metaKeywords ||
    "coworking bordeaux, coworking bordeaux parking, espace de coworking bordeaux, bureaux privatifs bordeaux, open space bordeaux, salle de reunion bordeaux, meeting room bordeaux, coworking with parking bordeaux, coworking fondaudege, location bureau bordeaux";
  const keywords = rawKeywords.split(",").map((k) => k.trim()).filter(Boolean);

  const ogTitle = seo.ogTitle || title;
  const ogDescription = seo.ogDescription || description;
  const ogImage = seo.ogImage || "/images/spaces/real-open-space-fixe-4k.jpg";
  const fallbackGsc = "x6PyptfUZpTT1LWFaEJEzgoTPkTt3_4s9j48E-ZJmdI";
  const cleanGscCode =
    parseGoogleSiteVerificationToken(seo.googleSearchConsole) ||
    parseGoogleSiteVerificationToken(seo.customHeadCode) ||
    fallbackGsc;

  return {
    metadataBase: new URL(canonicalUrl),
    title,
    description,
    keywords,
    verification: { google: cleanGscCode },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "64x64" },
        { url: "/images/brand/maison-tourny-logo.png", type: "image/png", sizes: "1024x1024" },
        { url: "/icon.svg", type: "image/svg+xml" }
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }]
    },
    manifest: "/site.webmanifest",
    authors: [{ name: "Maison Tourny" }],
    creator: "Maison Tourny",
    publisher: "Maison Tourny",
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "fr-FR": canonicalUrl,
        "en-US": `${canonicalUrl}/?lang=en`,
        "es-ES": `${canonicalUrl}/?lang=es`
      }
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: "Maison Tourny",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 800,
          alt: "Maison Tourny - Coworking Hôtel Particulier Bordeaux Fondaudège"
        }
      ],
      locale: "fr_FR",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage]
    },
    robots: seo.allowIndexing
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
          }
        }
      : {
          index: false,
          follow: false
        }
  };
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const settings = getLocalSettings();
  const seo = settings.settings_seo || DEFAULT_SEO_SETTINGS;
  const fallbackGsc = "x6PyptfUZpTT1LWFaEJEzgoTPkTt3_4s9j48E-ZJmdI";
  const cleanGscCode =
    parseGoogleSiteVerificationToken(seo.googleSearchConsole) ||
    parseGoogleSiteVerificationToken(seo.customHeadCode) ||
    fallbackGsc;

  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${jakartaSans.variable} font-sans h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head suppressHydrationWarning>
        <script
          id="anti-extension-shield"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof window==="undefined")return;try{var oE=console.error;console.error=function(){for(var i=0;i<arguments.length;i++){var a=arguments[i];if(typeof a==="string"&&(a.indexOf("chrome-extension://")!==-1||a.indexOf("moz-extension://")!==-1||a.indexOf("eppiocemhmnlbhjplcgkofciiegomcon")!==-1||a.indexOf("bis_skin_checked")!==-1||(a.indexOf("hydration-mismatch")!==-1&&(a.indexOf("google-tag-manager-init")!==-1||a.indexOf("application/ld+json")!==-1||a.indexOf("extension")!==-1))))return;}return oE.apply(console,arguments);};}catch(e){}})();`
          }}
        />
        <script src="/anti-extension.js" suppressHydrationWarning />
        <meta name="google-site-verification" content={cleanGscCode} />
        <GoogleTagHead seo={seo} />
        <JsonLd />
      </head>
      <body
        className="min-h-full flex flex-col font-sans bg-calve-cream text-calve-charcoal"
        suppressHydrationWarning
      >
        <GoogleTagBody seo={seo} />
        <LanguageProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
