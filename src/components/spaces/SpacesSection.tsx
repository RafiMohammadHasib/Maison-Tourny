"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Columns2,
  ShieldCheck,
  Maximize2,
  X,
  Users,
  Car,
  Clock
} from "lucide-react";
import { SPACES, SpaceItem } from "@/data/spaces";
import { Language, CONTENT } from "@/data/content";

interface SpacesSectionProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string, source?: string) => void;
}

export default function SpacesSection({ language, onOpenEnquiry }: SpacesSectionProps) {
  const [filter, setFilter] = useState<"all" | "private-office" | "open-space" | "meeting-room" | "common-areas">("all");
  const [viewMode, setViewMode] = useState<"grid" | "focus">("grid");
  const [focusIndex, setFocusIndex] = useState(0);
  const [selectedLightboxIndex, setSelectedLightboxIndex] = useState<number | null>(null);

  const t = CONTENT[language].spacesSection;

  // Filter out standalone parking spots as parking is an included amenity/option
  const filteredSpaces = SPACES.filter((space) => {
    if (filter === "all") return space.category !== "parking";
    return space.category === filter;
  });

  // Reset focus index when filter changes
  useEffect(() => {
    setFocusIndex(0);
  }, [filter]);

  // Keyboard navigation for 4K Lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedLightboxIndex === null) return;
      if (e.key === "Escape") setSelectedLightboxIndex(null);
      if (e.key === "ArrowLeft") {
        setSelectedLightboxIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : filteredSpaces.length - 1
        );
      }
      if (e.key === "ArrowRight") {
        setSelectedLightboxIndex((prev) =>
          prev !== null && prev < filteredSpaces.length - 1 ? prev + 1 : 0
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLightboxIndex, filteredSpaces.length]);

  const activeSpace = filteredSpaces[focusIndex] || filteredSpaces[0];
  const lightboxSpace = selectedLightboxIndex !== null ? filteredSpaces[selectedLightboxIndex] : null;

  // Localized Category Names for Eyebrow
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "private-office":
        return language === "fr" ? "Bureau Privatif" : language === "es" ? "Oficina Privada" : "Private Suite";
      case "open-space":
        return language === "fr" ? "Poste Résident & Nomade" : language === "es" ? "Puesto de Trabajo" : "Resident & Nomad Desk";
      case "meeting-room":
        return language === "fr" ? "Salle de Réunion" : language === "es" ? "Sala de Reuniones" : "Executive Boardroom";
      case "common-areas":
        return language === "fr" ? "Espaces Partagés" : language === "es" ? "Zonas Comunes" : "Shared Amenities";
      default:
        return language === "fr" ? "Espace de Travail" : language === "es" ? "Espacio de Trabajo" : "Workspace";
    }
  };

  const filterTabs = [
    { id: "all", label: t.filterAll, count: 6 },
    { id: "private-office", label: t.filterOffices, count: 2 },
    { id: "open-space", label: t.filterOpenSpace, count: 2 },
    { id: "meeting-room", label: t.filterMeeting, count: 1 },
    { id: "common-areas", label: t.filterCommon, count: 1 },
  ];

  return (
    <section id="espaces" className="py-12 sm:py-16 lg:py-20 bg-calve-stone/30 border-t border-b border-calve-border/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* SECTION HEADER: Architectural Editorial Typography       */}
        {/* ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4" data-reveal="fade-up">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-calve-slate mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-calve-slate/60" />
              <span>{t.tag}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-calve-charcoal leading-tight tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs sm:text-sm text-calve-muted mt-2 leading-relaxed max-w-xl">
              {t.subtitle}
            </p>
          </div>

          {/* View Mode Toggle (Grid vs Focus) */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="text-[11px] font-mono text-calve-muted hidden sm:inline-block mr-1">
              {language === "en" ? "View:" : language === "es" ? "Vista:" : "Affichage :"}
            </span>
            <div className="p-1 rounded-xl bg-white border border-calve-border/90 flex items-center gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label={language === "en" ? "Grid View" : "Vue Grille"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-calve-charcoal text-white shadow-xs"
                    : "text-calve-muted hover:text-calve-charcoal"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{language === "en" ? "Grid" : language === "es" ? "Cuadrícula" : "Grille"}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("focus")}
                aria-label={language === "en" ? "Focus View" : "Vue Focus"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  viewMode === "focus"
                    ? "bg-calve-charcoal text-white shadow-xs"
                    : "text-calve-muted hover:text-calve-charcoal"
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>{language === "en" ? "Focus" : language === "es" ? "Detalle" : "Focus"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FILTER CAPSULES: Understated, Responsive Navigation     */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none" data-reveal="fade-up">
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-calve-charcoal text-white shadow-xs"
                    : "bg-white hover:bg-calve-stone/60 text-calve-charcoal/80 hover:text-calve-charcoal border border-calve-border/80"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-calve-stone text-calve-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* PRIMARY VIEW: EQUAL-WEIGHT ARCHITECTURAL CARD GRID      */}
        {/* Fixed slot model: equal height, aligned prices & CTAs    */}
        {/* ======================================================== */}
        {viewMode === "grid" && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
            data-reveal="stagger"
          >
            {filteredSpaces.map((space, idx) => (
              <article
                key={space.id}
                className="group bg-white rounded-2xl sm:rounded-3xl border border-calve-border/80 hover:border-calve-slate/40 shadow-[0_4px_20px_-4px_rgba(23,33,35,0.06)] hover:shadow-[0_16px_36px_-8px_rgba(23,33,35,0.12)] transition-[box-shadow,border-color,transform] duration-300 overflow-hidden flex flex-col h-full ring-1 ring-black/5"
              >
                {/* 1. Uniform Architectural Media Frame */}
                <div
                  className="relative aspect-[16/10] overflow-hidden bg-stone-100 cursor-pointer"
                  onClick={() => setSelectedLightboxIndex(idx)}
                >
                  <img
                    src={space.image}
                    alt={space.name[language]}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 pointer-events-none" />

                  {/* Top Floating Spec Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-calve-charcoal shadow-2xs border border-white/60">
                      {space.area || getCategoryLabel(space.category)}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] sm:text-[11px] font-semibold text-calve-charcoal shadow-2xs border border-white/60 flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          space.availability.available > 0 ? "bg-emerald-600" : "bg-amber-600"
                        }`}
                      />
                      <span>{space.availability.status[language]}</span>
                    </span>
                  </div>

                  {/* Hover 4K Zoom Hint */}
                  <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1 shadow-sm">
                      <Maximize2 className="w-3 h-3" />
                      <span>{language === "en" ? "View 4K" : language === "es" ? "Ver 4K" : "Agrandir 4K"}</span>
                    </span>
                  </div>
                </div>

                {/* 2. Structured Card Content (Slot Model) */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-4 bg-white">
                  <div className="space-y-3">
                    {/* Eyebrow & Capacity */}
                    <div className="flex items-center justify-between gap-2 border-b border-calve-border/60 pb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-calve-slate">
                        {getCategoryLabel(space.category)}
                      </span>
                      <span className="text-[11px] font-medium text-calve-muted">
                        {space.capacity[language]}
                      </span>
                    </div>

                    {/* Room Title */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-calve-charcoal tracking-tight group-hover:text-calve-slate transition-colors leading-snug">
                        {space.name[language]}
                      </h3>
                      <p className="text-xs text-calve-muted mt-1 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                        {space.description[language]}
                      </p>
                    </div>

                    {/* Architectural Specifications Grid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-calve-cream/40 border border-calve-border/70 text-[11px]">
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-calve-slate mb-0.5">
                          {t.specsLabels?.surface || "Superficie"}
                        </span>
                        <span className="font-bold text-calve-charcoal">
                          {space.area || "Sur mesure"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-calve-slate mb-0.5">
                          {t.specsLabels?.capacity || "Capacité"}
                        </span>
                        <span className="font-bold text-calve-charcoal truncate block">
                          {space.capacity[language]}
                        </span>
                      </div>
                    </div>

                    {/* Curated Inclusions (Top 3 items) */}
                    <div className="space-y-1.5 pt-0.5">
                      {space.features[language].slice(0, 3).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-[11px] text-calve-charcoal/85">
                          <span className="w-1.5 h-1.5 rounded-full bg-calve-slate/60 shrink-0 mt-1.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Pinned Bottom Anchor: Pricing & Direct Action */}
                  <div className="mt-auto pt-4 border-t border-calve-border/70 space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-calve-charcoal tracking-tight tabular-nums">
                          {space.pricing.amount}
                        </span>
                        <span className="text-[11px] font-bold text-calve-slate uppercase">
                          {space.pricing.tax}
                        </span>
                        <span className="text-xs text-calve-muted font-medium">
                          / {space.pricing.period[language].split(" ")[0]}
                        </span>
                      </div>
                      <span className="text-[10px] text-calve-muted font-medium text-right truncate">
                        {language === "en" ? "Fiber & fees incl." : language === "es" ? "Gastos incluidos" : "Charges & fibre incluses"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenEnquiry(space.id, `Spaces: ${space.name[language]}`)}
                      className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-calve-charcoal hover:bg-calve-slate text-white text-xs font-bold tracking-[0.14em] uppercase transition-[background-color,transform] duration-150 shadow-xs hover:shadow-md flex items-center justify-center gap-2 group/btn cursor-pointer active:scale-[0.98]"
                    >
                      <span>
                        {space.category === "common-areas"
                          ? language === "en" ? "Schedule a tour" : language === "es" ? "Visitar espacio" : "Planifier une visite"
                          : t.ctaEnquire}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* SECONDARY VIEW: BALANCED 50/50 FOCUS SHOWCASE           */}
        {/* Elegant wide presentation without tiny thumbnail strips  */}
        {/* ======================================================== */}
        {viewMode === "focus" && activeSpace && (
          <article className="bg-white rounded-2xl lg:rounded-3xl overflow-hidden border border-calve-border/90 shadow-[0_12px_32px_rgba(23,33,35,0.06)] transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[480px]">
              
              {/* Left Column: Balanced 50% Panoramic Photo */}
              <div className="lg:col-span-6 relative overflow-hidden bg-stone-900 min-h-[300px] sm:min-h-[380px] lg:min-h-full group">
                <img
                  src={activeSpace.image}
                  alt={activeSpace.name[language]}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
                  <span className="px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-calve-charcoal shadow-xs">
                    {activeSpace.area || getCategoryLabel(activeSpace.category)}
                  </span>
                  
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-semibold text-calve-charcoal shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>{activeSpace.availability.status[language]}</span>
                  </span>
                </div>

                {/* Bottom Architectural Caption */}
                <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                  <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed drop-shadow-md max-w-lg">
                    {activeSpace.highlight[language]}
                  </p>
                </div>

                {/* Slide Controls overlay */}
                <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    onClick={() => setFocusIndex((prev) => (prev > 0 ? prev - 1 : filteredSpaces.length - 1))}
                    aria-label="Previous"
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-calve-charcoal flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-95 pointer-events-auto cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFocusIndex((prev) => (prev < filteredSpaces.length - 1 ? prev + 1 : 0))}
                    aria-label="Next"
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-calve-charcoal flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-95 pointer-events-auto cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Balanced 50% Architectural Specs Panel */}
              <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-white">
                <div className="space-y-4">
                  {/* Eyebrow & Slide Counter */}
                  <div className="flex items-center justify-between gap-2 border-b border-calve-border/70 pb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-calve-slate">
                      {getCategoryLabel(activeSpace.category)}
                    </span>
                    <span className="text-xs font-mono font-semibold text-calve-muted">
                      0{focusIndex + 1} / 0{filteredSpaces.length}
                    </span>
                  </div>

                  {/* Room Title & Story */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-calve-charcoal tracking-tight leading-snug">
                      {activeSpace.name[language]}
                    </h3>
                    <p className="text-xs sm:text-sm text-calve-muted mt-2 leading-relaxed">
                      {activeSpace.description[language]}
                    </p>
                  </div>

                  {/* Architectural Specifications Grid */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 sm:p-4 rounded-xl bg-calve-cream/40 border border-calve-border/80">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                        {t.specsLabels?.surface || "Superficie"}
                      </span>
                      <span className="font-bold text-calve-charcoal text-sm sm:text-base">
                        {activeSpace.area || "Sur mesure"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                        {t.specsLabels?.capacity || "Capacité"}
                      </span>
                      <span className="font-bold text-calve-charcoal text-sm sm:text-base">
                        {activeSpace.capacity[language]}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                        {t.specsLabels?.parking || "Stationnement"}
                      </span>
                      <span className="font-bold text-calve-charcoal text-xs sm:text-sm">
                        {language === "en" ? "Courtyard Parking" : language === "es" ? "Parking en patio" : "Parking en cour"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-calve-slate mb-1">
                        {t.specsLabels?.access || "Accès"}
                      </span>
                      <span className="font-bold text-calve-charcoal text-xs sm:text-sm">
                        {language === "en" ? "24/7 Keycard" : language === "es" ? "24/7 con tarjeta" : "Badge sécurisé 24/7"}
                      </span>
                    </div>
                  </div>

                  {/* Transparent Pricing Display */}
                  <div className="border-t border-b border-calve-border/70 py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-calve-charcoal tracking-tight">
                          {activeSpace.pricing.amount}
                        </span>
                        <span className="text-xs font-bold text-calve-slate uppercase">
                          {activeSpace.pricing.tax}
                        </span>
                        <span className="text-xs text-calve-muted font-medium">
                          / {activeSpace.pricing.period[language]}
                        </span>
                      </div>
                      {activeSpace.pricing.note && (
                        <div className="text-[11px] text-calve-muted mt-0.5 font-medium">
                          {activeSpace.pricing.note[language]}
                        </div>
                      )}
                    </div>
                    <div className="text-left sm:text-right text-xs text-calve-muted font-medium">
                      <span>{language === "en" ? "Charges & Fiber included" : language === "es" ? "Gastos y fibra incluidos" : "Charges & fibre incluses"}</span>
                    </div>
                  </div>

                  {/* Included Amenities List */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-calve-slate block">
                      {t.featuresIncluded}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                      {activeSpace.features[language].slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-calve-charcoal/90">
                          <span className="w-1.5 h-1.5 rounded-full bg-calve-slate shrink-0" />
                          <span className="font-medium truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Luxury CTA */}
                <div className="space-y-3 pt-3 border-t border-calve-border/70">
                  <button
                    type="button"
                    onClick={() => onOpenEnquiry(activeSpace.id, `Spaces: ${activeSpace.name[language]}`)}
                    className="w-full py-3.5 px-6 rounded-xl bg-calve-charcoal hover:bg-calve-slate text-white text-xs font-bold tracking-[0.14em] uppercase transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>
                      {activeSpace.category === "common-areas"
                        ? language === "en" ? "Schedule a discovery tour" : language === "es" ? "Planificar una visita guiada" : "Planifier une visite découverte"
                        : t.ctaEnquire}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-calve-muted font-medium text-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {language === "en"
                        ? "Private viewing on appointment · No broker fees"
                        : language === "es"
                        ? "Visita privada con cita previa · Sin comisiones"
                        : "Visite privée sur rendez-vous · Sans frais d'agence"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Minimalist Trust Indicator Bar */}
        <div className="mt-10 pt-6 border-t border-calve-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-calve-muted" data-reveal="fade-up">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>
              {language === "en"
                ? "Boutique heritage residence: maximum 5 quiet private offices and 10 resident desks"
                : language === "es"
                ? "Residencia histórica boutique: máximo 5 despachos privados y 10 puestos residentes"
                : "Hôtel particulier à taille humaine : 5 bureaux privatifs calmes et 10 postes résidents au maximum"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenEnquiry("office", "Schedule a private tour")}
            className="text-calve-charcoal hover:text-calve-slate font-semibold underline underline-offset-4 cursor-pointer"
          >
            {language === "en" ? "Book an on-site visit →" : language === "es" ? "Reservar visita presencial →" : "Organiser une visite sur place →"}
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4K FULLSCREEN ARCHITECTURAL LIGHTBOX MODAL               */}
      {/* ======================================================== */}
      {lightboxSpace && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxSpace.name[language]}
        >
          <div
            className="relative bg-black rounded-3xl overflow-hidden max-w-5xl w-full max-h-[92vh] shadow-2xl border border-white/20 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedLightboxIndex(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Navigation Controls */}
            <button
              type="button"
              onClick={() =>
                setSelectedLightboxIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : filteredSpaces.length - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedLightboxIndex((prev) =>
                  prev !== null && prev < filteredSpaces.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              aria-label="Suivant"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </button>

            {/* Uncropped 4K Photo */}
            <div className="relative w-full h-full max-h-[82vh] flex items-center justify-center p-2 sm:p-4">
              <img
                src={lightboxSpace.image}
                alt={lightboxSpace.name[language]}
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl"
              />
            </div>

            {/* Clean Bottom Label */}
            <div className="w-full bg-black/80 backdrop-blur-md px-6 py-3 border-t border-white/10 flex items-center justify-between text-white text-xs">
              <div>
                <span className="font-bold">{lightboxSpace.name[language]}</span>
                <span className="text-white/60 ml-2">({lightboxSpace.area || getCategoryLabel(lightboxSpace.category)})</span>
              </div>
              <div className="font-mono text-white/60">
                0{(selectedLightboxIndex ?? 0) + 1} / 0{filteredSpaces.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}