"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useLanguage } from "@/lib/languageContext";
import {
  Globe,
  BarChart3,
  Search,
  ShieldCheck,
  Share2,
  Code,
  Save,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  Smartphone,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Eye
} from "lucide-react";

export default function SeoPage() {
  const { language, t, isEnglish } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [syncedWithOvh, setSyncedWithOvh] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [searchPreviewDevice, setSearchPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // SEO & Google Analytics State
  const [googleTagId, setGoogleTagId] = useState("GTM-K7CVNBTS");
  const [googleTagEnabled, setGoogleTagEnabled] = useState(true);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [googleSearchConsole, setGoogleSearchConsole] = useState(
    '<meta name="google-site-verification" content="x6PyptfUZpTT1LWFaEJEzgoTPkTt3_4s9j48E-ZJmdI" />'
  );
  const [metaTitle, setMetaTitle] = useState("Maison Calvé — Coworking Bordeaux Fondaudège avec Parking");
  const [metaDescription, setMetaDescription] = useState(
    "Maison Calvé : espace de coworking haut de gamme à Bordeaux Fondaudège (48 rue Calvé). 5 bureaux privatifs, open space feutré, salle de réunion 30m² et 9 places de parking privatives sécurisées."
  );
  const [metaKeywords, setMetaKeywords] = useState(
    "coworking bordeaux, coworking bordeaux parking, espace de coworking bordeaux, bureaux privatifs bordeaux, open space bordeaux, salle de reunion bordeaux, meeting room bordeaux, coworking with parking bordeaux, coworking fondaudege, location bureau bordeaux"
  );
  const [canonicalUrl, setCanonicalUrl] = useState("https://maisoncalve.fr");
  const [allowIndexing, setAllowIndexing] = useState(true);
  const [ogTitle, setOgTitle] = useState("Maison Calvé — Coworking Bordeaux Fondaudège");
  const [ogDescription, setOgDescription] = useState(
    "Bureaux privatifs, open space feutré et salle de réunion au 48 rue Calvé avec 9 places de parking privatives."
  );
  const [ogImage, setOgImage] = useState("/images/spaces/real-open-space-fixe-4k.jpg");
  const [customHeadCode, setCustomHeadCode] = useState("");
  const [customBodyCode, setCustomBodyCode] = useState("");

  // Load SEO settings from API / local storage
  const fetchSeoSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings?key=settings_seo");
      const data = await res.json();

      let seo = data.value;
      if (typeof seo === "string") {
        try {
          seo = JSON.parse(seo);
        } catch {}
      }

      if (seo && typeof seo === "object") {
        if (seo.googleTagId !== undefined) setGoogleTagId(seo.googleTagId);
        if (seo.googleTagEnabled !== undefined) setGoogleTagEnabled(Boolean(seo.googleTagEnabled));
        if (seo.googleAnalyticsId !== undefined) setGoogleAnalyticsId(seo.googleAnalyticsId || "");
        if (seo.googleSearchConsole !== undefined) setGoogleSearchConsole(seo.googleSearchConsole || "");
        if (seo.metaTitle) setMetaTitle(seo.metaTitle);
        if (seo.metaDescription) setMetaDescription(seo.metaDescription);
        if (seo.metaKeywords) setMetaKeywords(seo.metaKeywords);
        if (seo.canonicalUrl) setCanonicalUrl(seo.canonicalUrl);
        if (seo.allowIndexing !== undefined) setAllowIndexing(Boolean(seo.allowIndexing));
        if (seo.ogTitle) setOgTitle(seo.ogTitle);
        if (seo.ogDescription) setOgDescription(seo.ogDescription);
        if (seo.ogImage) setOgImage(seo.ogImage);
        if (seo.customHeadCode !== undefined) setCustomHeadCode(seo.customHeadCode || "");
        if (seo.customBodyCode !== undefined) setCustomBodyCode(seo.customBodyCode || "");
      } else if (typeof window !== "undefined") {
        try {
          const backupStr = localStorage.getItem("mc_settings_seo_backup");
          if (backupStr) {
            const b = JSON.parse(backupStr);
            if (b.googleTagId) setGoogleTagId(b.googleTagId);
            if (b.googleAnalyticsId) setGoogleAnalyticsId(b.googleAnalyticsId);
            if (b.googleSearchConsole) setGoogleSearchConsole(b.googleSearchConsole);
            if (b.customHeadCode) setCustomHeadCode(b.customHeadCode);
            if (b.customBodyCode) setCustomBodyCode(b.customBodyCode);
          }
        } catch {}
      }

      if (data.source === "ovh_mysql") {
        setSyncedWithOvh(true);
      }
      setLastSyncTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      console.error("Error loading SEO settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  // Save SEO Configuration
  const handleSaveSeo = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setSaving(true);
      const seoPayload = {
        googleTagId: googleTagId.trim(),
        googleTagEnabled,
        googleAnalyticsId: googleAnalyticsId.trim(),
        googleSearchConsole: googleSearchConsole.trim(),
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        metaKeywords: metaKeywords.trim(),
        canonicalUrl: canonicalUrl.trim(),
        allowIndexing,
        ogTitle: ogTitle.trim(),
        ogDescription: ogDescription.trim(),
        ogImage: ogImage.trim(),
        customHeadCode: customHeadCode.trim(),
        customBodyCode: customBodyCode.trim()
      };

      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("mc_settings_seo_backup", JSON.stringify(seoPayload));
        }
      } catch {}

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "settings_seo",
          value: seoPayload
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setSyncedWithOvh(Boolean(data.syncedWithOvh));
        const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        setLastSyncTime(now);
        setTimeout(() => setSaved(false), 4000);
      }
    } catch (err) {
      console.error("Error saving SEO settings:", err);
    } finally {
      setSaving(false);
    }
  };

  // Copy code snippet helper
  const copyGoogleTagSnippet = () => {
    const primaryId = (googleTagId || "").trim() || "GTM-K7CVNBTS";
    const isGtm = primaryId.toUpperCase().startsWith("GTM-");
    const code = isGtm
      ? `<script async src="https://www.googletagmanager.com/gtm.js?id=${primaryId}"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n</script>`
      : `<script async src="https://www.googletagmanager.com/gtag/js?id=${primaryId}"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', '${primaryId}');\n</script>`;

    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl">
        {/* ========================================================== */}
        {/* 1. TOP HEADER & TELEMETRY BAR                              */}
        {/* ========================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-calve-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-calve-muted">
                {isEnglish ? "SEARCH ENGINE OPTIMIZATION & TRACKING" : "RÉFÉRENCEMENT NATUREL & AUDIENCE"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                Module SEO
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-calve-charcoal tracking-tight flex items-center gap-2.5">
              <Globe className="w-7 h-7 text-emerald-600 shrink-0" />
              <span>SEO & Analytics</span>
            </h1>
            <p className="text-xs text-calve-muted mt-1 max-w-2xl">
              {isEnglish
                ? "Manage Google Tag Manager (GTM), GA4, search verification, meta tags, and live Google Search preview."
                : "Configurez Google Tag Manager (GTM), Google Analytics 4, les balises méta, la console Google et l'aperçu de recherche en temps réel."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastSyncTime && (
              <span className="text-[11px] font-semibold text-calve-muted hidden md:inline">
                {isEnglish ? `Last sync: ${lastSyncTime}` : `Dernière sync : ${lastSyncTime}`}
              </span>
            )}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-calve-border bg-white hover:bg-calve-stone text-xs font-semibold text-calve-charcoal transition-all shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-calve-slate" />
              <span className="hidden sm:inline">{isEnglish ? "View Site" : "Voir le Site"}</span>
            </a>

            <button
              type="button"
              onClick={handleSaveSeo}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{saving ? (isEnglish ? "Saving..." : "Enregistrement...") : (isEnglish ? "Save SEO Settings" : "Enregistrer SEO")}</span>
            </button>
          </div>
        </div>

        {/* Saved Banner */}
        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isEnglish
                ? "SEO parameters, Google Tag and analytics scripts successfully saved and applied live to the site!"
                : "Configuration SEO, Google Tag et scripts de tracking enregistrés et appliqués en direct sur le site !"}
            </span>
          </div>
        )}

        {/* ========================================================== */}
        {/* CARD 1: GOOGLE TAG & GOOGLE ANALYTICS (GA4 / GTM)          */}
        {/* ========================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-calve-border/60 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-calve-charcoal">
                    {isEnglish ? "1. Google Tag & Google Analytics (GA4 / GTM)" : "1. Google Tag & Google Analytics (GA4 / GTM)"}
                  </h3>
                  {googleTagEnabled && googleTagId ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      {isEnglish ? "Live & Tagging" : "Actif & Connecté"}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {isEnglish ? "Inactive / Paused" : "Inactif / En Pause"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-calve-muted mt-0.5">
                  {isEnglish
                    ? "Configure Google Tag Manager container or Google Analytics 4 Measurement ID shown on your setup screen."
                    : "Configurez l'identifiant de tag Google Analytics ou le conteneur Google Tag Manager (GTM) requis pour mesurer l'audience."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={googleTagEnabled}
                  onChange={(e) => setGoogleTagEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-2.5 text-xs font-bold text-calve-charcoal select-none">
                  {googleTagEnabled ? (isEnglish ? "Google Tag Enabled" : "Google Tag Activé") : (isEnglish ? "Google Tag Paused" : "Google Tag Désactivé")}
                </span>
              </label>
            </div>
          </div>

          {/* Tag ID input and GA4 input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-calve-muted">
                  {isEnglish ? "PRIMARY GOOGLE TAG ID / GTM CONTAINER ID *" : "IDENTIFIANT GOOGLE TAG / GTM PRINCIPAL *"}
                </label>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                  {googleTagId.startsWith("GTM-") ? "GTM Container" : googleTagId.startsWith("G-") ? "GA4 Stream" : "Google Tag"}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={googleTagId}
                  onChange={(e) => setGoogleTagId(e.target.value.trim())}
                  placeholder="GTM-K7CVNBTS ou G-XXXXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono font-bold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                />
              </div>
              <p className="text-[11px] text-calve-muted mt-1.5">
                {isEnglish
                  ? "Directly matches the container ID from your setup: GTM-K7CVNBTS"
                  : "Correspond directement à l'ID affiché sur votre écran Google Tag : GTM-K7CVNBTS"}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-calve-muted">
                  {isEnglish ? "SECONDARY GA4 MEASUREMENT ID (OPTIONAL)" : "ID DE MESURE GOOGLE ANALYTICS 4 DIRECT (OPTIONNEL)"}
                </label>
                <span className="text-[10px] text-calve-muted font-mono">G-XXXXXXXXXX</span>
              </div>
              <input
                type="text"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value.trim())}
                placeholder="ex: G-E7W8S9KL10"
                className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
              />
              <p className="text-[11px] text-calve-muted mt-1.5">
                {isEnglish
                  ? "Optional: Only needed if you run a direct GA4 measurement stream separate from Tag Manager."
                  : "Facultatif : Nécessaire uniquement si vous suivez un flux GA4 direct en dehors de GTM."}
              </p>
            </div>
          </div>

          {/* Exact Code Preview */}
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono text-slate-200">
                  {isEnglish ? "Auto-Injected Tag Snippet (Next.js <head>)" : "Extrait de Tag Injecté Automatiquement (Next.js <head>)"}
                </span>
              </div>
              <button
                type="button"
                onClick={copyGoogleTagSnippet}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-slate-700"
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isEnglish ? "Copied!" : "Copié !"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isEnglish ? "Copy Code" : "Copier"}</span>
                  </>
                )}
              </button>
            </div>

            <pre className="text-[11px] font-mono leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 overflow-x-auto text-emerald-300/90 selection:bg-emerald-900 selection:text-white">
{`<script async src="https://www.googletagmanager.com/gtm.js?id=${googleTagId || "GTM-K7CVNBTS"}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
</script>`}
            </pre>

            <div className="flex items-start gap-2 text-[11px] text-slate-400 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {isEnglish
                  ? "Automatic Setup: When you click 'Save SEO Settings', this script and the GTM container noscript fallback are automatically embedded in every page. Google Analytics can immediately verify your site!"
                  : "Installation Automatique : Dès que vous enregistrez cette page, ce script ainsi que la balise noscript de secours sont automatiquement intégrés dans chaque page. Google Analytics valide le tag immédiatement !"}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* CARD 2: SEARCH ENGINE OPTIMIZATION & CORE META TAGS        */}
        {/* ========================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
          <div className="border-b border-calve-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-calve-slate" />
              <h3 className="text-base font-extrabold text-calve-charcoal">
                {isEnglish ? "2. Search Engine Optimization (SEO) & Core Meta Tags" : "2. Référencement Naturel (SEO) & Balises Méta Principales"}
              </h3>
            </div>
            <p className="text-xs text-calve-muted mt-0.5">
              {isEnglish
                ? "Control how Maison Calvé appears on Google Search results, Bing, and web crawlers."
                : "Contrôlez les titres, résumés et mots-clés affichés dans les résultats Google et Bing."}
            </p>
          </div>

          <div className="space-y-4">
            {/* Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-calve-muted">
                  {isEnglish ? "PRIMARY WEBSITE META TITLE *" : "TITRE MÉTA PRINCIPAL DU SITE (PAGE D'ACCUEIL) *"}
                </label>
                <span className={`text-[10px] font-mono ${metaTitle.length > 65 ? "text-amber-600 font-bold" : "text-calve-muted"}`}>
                  {metaTitle.length} / 60 {isEnglish ? "characters (ideal: 50-60)" : "caractères (idéal: 50-60)"}
                </span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-semibold text-calve-charcoal focus:border-calve-slate shadow-2xs"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-calve-muted">
                  {isEnglish ? "PRIMARY META DESCRIPTION *" : "DESCRIPTION MÉTA DU SITE (RÉSUMÉ GOOGLE) *"}
                </label>
                <span className={`text-[10px] font-mono ${metaDescription.length > 165 ? "text-amber-600 font-bold" : "text-calve-muted"}`}>
                  {metaDescription.length} / 160 {isEnglish ? "characters (ideal: 150-160)" : "caractères (idéal: 150-160)"}
                </span>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs leading-relaxed"
              />
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                {isEnglish ? "META KEYWORDS (COMMA SEPARATED)" : "MOTS-CLÉS SEO (SÉPARÉS PAR DES VIRGULES)"}
              </label>
              <input
                type="text"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs font-mono"
              />
            </div>

            {/* Canonical URL and Allow Indexing toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                  {isEnglish ? "CANONICAL BASE URL" : "URL CANONIQUE OFFICIELLE"}
                </label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://maisoncalve.fr"
                  className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                  {isEnglish ? "SEARCH ENGINE CRAWLING (ROBOTS.TXT)" : "INDEXATION MOTEURS DE RECHERCHE (ROBOTS)"}
                </label>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-calve-border bg-slate-50">
                  <span className="text-xs font-bold text-calve-charcoal">
                    {allowIndexing
                      ? isEnglish ? "Index & Follow (Active)" : "Index & Follow (Autorisé)"
                      : isEnglish ? "No-Index (Paused)" : "No-Index (Bloqué)"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowIndexing}
                      onChange={(e) => setAllowIndexing(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* CARD 3: REAL-TIME GOOGLE SEARCH PREVIEW (SERP)             */}
        {/* ========================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-calve-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-extrabold text-calve-charcoal">
                {isEnglish ? "3. Google Search Result Real-Time Preview (SERP)" : "3. Aperçu en Temps Réel dans les Résultats Google"}
              </h3>
            </div>

            {/* Desktop vs Mobile Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSearchPreviewDevice("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                  searchPreviewDevice === "desktop"
                    ? "bg-white text-calve-charcoal shadow-2xs font-bold"
                    : "text-calve-muted hover:text-calve-charcoal"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchPreviewDevice("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                  searchPreviewDevice === "mobile"
                    ? "bg-white text-calve-charcoal shadow-2xs font-bold"
                    : "text-calve-muted hover:text-calve-charcoal"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
          </div>

          <div className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm ${searchPreviewDevice === "mobile" ? "max-w-md mx-auto" : "w-full"}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                MC
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-none">Maison Calvé</span>
                <span className="text-[11px] text-slate-500 font-mono leading-tight">{canonicalUrl || "https://maisoncalve.fr"}</span>
              </div>
            </div>
            <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
              {metaTitle || "Maison Calvé — Coworking Bordeaux Fondaudège avec Parking"}
            </h4>
            <p className="text-xs sm:text-sm text-[#4d5156] mt-1 leading-relaxed line-clamp-3">
              {metaDescription || "Maison Calvé : espace de coworking haut de gamme à Bordeaux Fondaudège avec bureaux privatifs, open space feutré et parking."}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-[#1a0dab]">
              <span className="hover:underline cursor-pointer">Bureaux Privatifs</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">Open Space Feutré</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">Salle de Réunion</span>
              <span>·</span>
              <span className="hover:underline cursor-pointer">Parking Cour Privée</span>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* CARD 4: GOOGLE SEARCH CONSOLE & DOMAIN VERIFICATION        */}
        {/* ========================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
          <div className="border-b border-calve-border/60 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-calve-slate" />
              <h3 className="text-base font-extrabold text-calve-charcoal">
                {isEnglish ? "4. Google Search Console & Domain Verification" : "4. Validation Google Search Console & Outils Webmasters"}
              </h3>
            </div>
            <p className="text-xs text-calve-muted mt-0.5">
              {isEnglish
                ? "Validate domain property in Google Search Console using HTML tag verification."
                : "Validez la propriété de votre site dans Google Search Console grâce à la balise de vérification."}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                {isEnglish ? "GOOGLE SITE VERIFICATION TOKEN OR TAG" : "CODE OU BALISE GOOGLE-SITE-VERIFICATION"}
              </label>
              <input
                type="text"
                value={googleSearchConsole}
                onChange={(e) => setGoogleSearchConsole(e.target.value)}
                placeholder='ex: <meta name="google-site-verification" content="abcdef123..." /> ou juste le code abcdef123...'
                className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
              />
              <p className="text-[11px] text-calve-muted mt-1.5">
                {isEnglish
                  ? "In Google Search Console, choose 'HTML Tag' verification method and paste the string here."
                  : "Dans Google Search Console, choisissez la méthode 'Balise HTML' et collez la balise ou le code ici."}
              </p>
            </div>

            {/* Direct quick action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-calve-slate flex items-center justify-between text-xs font-bold text-calve-charcoal transition-all group"
              >
                <span>Search Console</span>
                <ExternalLink className="w-3.5 h-3.5 text-calve-muted group-hover:text-calve-slate" />
              </a>

              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-calve-slate flex items-center justify-between text-xs font-bold text-calve-charcoal transition-all group"
              >
                <span>Google Analytics</span>
                <ExternalLink className="w-3.5 h-3.5 text-calve-muted group-hover:text-calve-slate" />
              </a>

              <a
                href="/sitemap.xml"
                target="_blank"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-calve-slate flex items-center justify-between text-xs font-bold text-calve-charcoal transition-all group"
              >
                <span>Sitemap XML</span>
                <ExternalLink className="w-3.5 h-3.5 text-calve-muted group-hover:text-calve-slate" />
              </a>

              <a
                href="/robots.txt"
                target="_blank"
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-calve-slate flex items-center justify-between text-xs font-bold text-calve-charcoal transition-all group"
              >
                <span>Robots.txt</span>
                <ExternalLink className="w-3.5 h-3.5 text-calve-muted group-hover:text-calve-slate" />
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* CARD 5: SOCIAL SHARE & OPEN GRAPH (OG) PREVIEW             */}
        {/* ========================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
          <div className="border-b border-calve-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-calve-slate" />
              <h3 className="text-base font-extrabold text-calve-charcoal">
                {isEnglish
                  ? "5. Social Share & Open Graph (LinkedIn, WhatsApp, Facebook, X)"
                  : "5. Partage Réseaux Sociaux & Open Graph (LinkedIn, WhatsApp, Facebook, X)"}
              </h3>
            </div>
            <p className="text-xs text-calve-muted mt-0.5">
              {isEnglish
                ? "Customize the preview card generated when your link is shared on messaging apps and social platforms."
                : "Personnalisez l'aperçu du lien lorsqu'il est partagé sur WhatsApp, LinkedIn, X ou Facebook."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                  {isEnglish ? "SOCIAL SHARE TITLE (OG:TITLE)" : "TITRE DU PARTAGE SOCIAL (OG:TITLE)"}
                </label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-semibold text-calve-charcoal focus:border-calve-slate shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                  {isEnglish ? "SOCIAL SHARE DESCRIPTION (OG:DESCRIPTION)" : "DESCRIPTION DU PARTAGE SOCIAL (OG:DESCRIPTION)"}
                </label>
                <textarea
                  rows={2}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs text-calve-charcoal focus:border-calve-slate shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                  {isEnglish ? "SOCIAL SHARE IMAGE URL (1200X630PX)" : "URL IMAGE DE PARTAGE SOCIAL (1200X630PX)"}
                </label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-white text-xs font-mono text-calve-charcoal focus:border-calve-slate shadow-2xs"
                />
              </div>
            </div>

            {/* Social Card Live Preview */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-calve-muted">
                {isEnglish ? "LIVE SOCIAL PREVIEW CARD" : "APERÇU DE LA CARTE DE PARTAGE"}
              </span>
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-slate-50">
                <div className="aspect-[1.91/1] w-full bg-slate-200 relative overflow-hidden flex items-center justify-center">
                  {ogImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ogImage}
                      alt="Open Graph preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = "/images/spaces/real-open-space-fixe-4k.jpg";
                      }}
                    />
                  ) : (
                    <span className="text-xs text-slate-400">1200 x 630</span>
                  )}
                </div>
                <div className="p-3.5 bg-white border-t border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-calve-muted font-mono tracking-wider">
                    maisoncalve.fr
                  </span>
                  <h4 className="text-xs font-extrabold text-calve-charcoal line-clamp-1">
                    {ogTitle || metaTitle}
                  </h4>
                  <p className="text-[11px] text-calve-muted line-clamp-2 leading-relaxed">
                    {ogDescription || metaDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* CARD 6: ADVANCED CUSTOM SCRIPT INJECTION (<head> & <body>) */}
        {/* ========================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-calve-border/80 shadow-2xs space-y-5">
          <div className="border-b border-calve-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-calve-slate" />
              <h3 className="text-base font-extrabold text-calve-charcoal">
                {isEnglish
                  ? "6. Advanced Custom Script Injection (<head> & <body>)"
                  : "6. Injection de Scripts & Pixels Avancés (<head> & <body>)"}
              </h3>
            </div>
            <p className="text-xs text-calve-muted mt-0.5">
              {isEnglish
                ? "Add custom marketing pixels (Meta Pixel, LinkedIn Insight, Hotjar, TikTok) without touching source code."
                : "Intégrez d'autres pixels marketing (Pixel Facebook, LinkedIn Insight, Hotjar) en toute sécurité."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                {isEnglish ? "CUSTOM CODE IN <HEAD>" : "CODE PERSONNALISÉ DANS <HEAD>"}
              </label>
              <textarea
                rows={4}
                value={customHeadCode}
                onChange={(e) => setCustomHeadCode(e.target.value)}
                placeholder="<!-- Ex: <script ...></script> ou <meta ...> -->"
                className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-slate-900 text-emerald-300 font-mono text-[11px] focus:border-calve-slate shadow-2xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-calve-muted mb-1.5">
                {isEnglish ? "CUSTOM CODE IN <BODY> (FOOTER)" : "CODE PERSONNALISÉ DANS <BODY> (BAS DE PAGE)"}
              </label>
              <textarea
                rows={4}
                value={customBodyCode}
                onChange={(e) => setCustomBodyCode(e.target.value)}
                placeholder="<!-- Ex: widget de chat, noscript, etc. -->"
                className="w-full px-4 py-2.5 rounded-xl border border-calve-border bg-slate-900 text-emerald-300 font-mono text-[11px] focus:border-calve-slate shadow-2xs leading-relaxed"
              />
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-calve-border/60">
            <div className="flex items-center gap-2">
              <span className="text-xs text-calve-muted">
                {syncedWithOvh ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {isEnglish ? "OVH MySQL & Local Storage Synchronized" : "Synchronisé avec OVH MySQL & Cache Local"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    {isEnglish ? "Local Persistence Active" : "Stockage Local Actif"}
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveSeo}
                disabled={saving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>
                  {saving
                    ? isEnglish ? "Saving SEO Configuration..." : "Enregistrement SEO..."
                    : isEnglish ? "Save SEO & Analytics Settings" : "Enregistrer la Configuration SEO & Tracking"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
