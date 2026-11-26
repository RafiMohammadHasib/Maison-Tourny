"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowDown,
  Calendar,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Language, CONTENT } from "@/data/content";
import { BUILDING_STATS } from "@/data/spaces";

interface HeroProps {
  language: Language;
  onOpenEnquiry: (spaceId?: string, source?: string) => void;
}

interface HeroImage {
  id: string;
  image: string;
  alt: { fr: string; en: string; es: string };
}

export default function Hero({ language, onOpenEnquiry }: HeroProps) {
  const t = CONTENT[language].hero;
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const scrollToSpaces = () => {
    const el = document.getElementById("espaces");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const heroImages: HeroImage[] = [
    {
      id: "open-space",
      image: "/images/hero/hero-open-space.jpg",
      alt: {
        fr: "Maison Calvé - Open Space Pierre Blonde",
        en: "Maison Calvé - Exposed Stone Open Space",
        es: "Maison Calvé - Open Space Piedra Vista"
      }
    },
    {
      id: "kitchen",
      image: "/images/hero/hero-kitchen.jpg",
      alt: {
        fr: "Maison Calvé - Cuisine Équipée & Barista",
        en: "Maison Calvé - Resident Kitchen & Café",
        es: "Maison Calvé - Cocina de Residentes"
      }
    },
    {
      id: "boardroom",
      image: "/images/hero/hero-meeting.jpg",
      alt: {
        fr: "Maison Calvé - Salle de Réunion 30 m²",
        en: "Maison Calvé - Executive Boardroom",
        es: "Maison Calvé - Sala de Juntas"
      }
    }
  ];

  // Close modal on Escape key & Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === "Escape") setSelectedPhotoIndex(null);
      if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : heroImages.length - 1));
      }
      if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev) => (prev !== null && prev < heroImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, heroImages.length]);

  const selectedImage = selectedPhotoIndex !== null ? heroImages[selectedPhotoIndex] : null;

  return (
    <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-20 overflow-hidden bg-gradient-to-b from-calve-stone/30 via-calve-cream to-white">
      {/* Background Subtle Architectural Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#172123_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Heritage Overline: Quiet Editorial Typography */}
        <div className="flex justify-center mb-6" data-reveal="fade-up">
          <span className="text-xs font-medium tracking-wide text-calve-slate/80 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-calve-slate/40" />
            <span>{t.badge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-calve-slate/40" />
          </span>
        </div>

        {/* Authentic Brand Wordmark in Center */}
        <div className="text-center space-y-3 mb-8" data-reveal="fade-up">
          <div className="flex flex-col items-center justify-center font-extrabold tracking-tighter lowercase leading-[0.82] text-5xl sm:text-7xl md:text-8xl lg:text-9xl selection:bg-calve-slate selection:text-white">
            <span className="text-calve-slate">maison</span>
            <span className="text-calve-slate">calvé</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-calve-muted font-medium pt-2">
            <MapPin className="w-3.5 h-3.5 text-calve-slate/80 shrink-0" strokeWidth={1.5} />
            <span className="[text-wrap:balance]">
              {language === "en"
                ? "48 rue Calvé, 33000 Bordeaux (Fondaudège District)"
                : language === "es"
                ? "48 rue Calvé, 33000 Burdeos (Barrio Fondaudège)"
                : "48 rue Calvé, 33000 Bordeaux (Quartier Fondaudège)"}
            </span>
          </div>
        </div>

        {/* Narrative Description with Balanced Typography */}
        <p className="max-w-2xl mx-auto text-center text-sm sm:text-base text-calve-charcoal/80 font-normal leading-relaxed [text-wrap:pretty] mb-10" data-reveal="fade-up">
          {t.description}
        </p>

        {/* Action Buttons with Concentric Radii and Tactile Feedback */}
        <div className="flex flex-col items-center mb-12 sm:mb-16" data-reveal="fade-up">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4">
            <button
              type="button"
              onClick={() => onOpenEnquiry("office", "Book a Private Tour (Hero)")}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-calve-charcoal hover:bg-calve-slate text-white font-medium text-xs tracking-wider uppercase transition-[background-color,box-shadow,transform] duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{t.ctaVisit}</span>
            </button>

            <button
              type="button"
              onClick={scrollToSpaces}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-calve-stone text-calve-charcoal border border-calve-border hover:border-calve-slate/40 font-medium text-xs tracking-wider uppercase transition-[background-color,border-color,box-shadow,transform] duration-200 shadow-2xs active:scale-[0.98] cursor-pointer"
            >
              <span>{t.ctaExplore}</span>
              <ArrowDown className="w-3.5 h-3.5 text-calve-slate/80" strokeWidth={1.5} />
            </button>
          </div>

          {/* Understated Contact Line */}
          <div className="flex items-center gap-2 text-xs text-calve-muted font-normal">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block shrink-0" />
            <span>
              {language === "en"
                ? "Direct contact with resident team: +33 6 95 57 70 33 · Tours on appointment"
                : language === "es"
                ? "Atención directa con el equipo: +33 6 95 57 70 33 · Visitas con cita previa"
                : "Échange direct avec l'équipe résidente : 06 95 57 70 33 · Visites sur rendez-vous"}
            </span>
          </div>
        </div>

        {/* ========================================================== */}
        {/* THE 3 HERO IMAGES: PURE ARCHITECTURAL PHOTOGRAPHY           */}
        {/* NO TEXT · NO DETAILS · JUST THE 3 IMAGES                   */}
        {/* ========================================================== */}
        <div data-reveal="stagger" className="relative mb-14">
          <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
            {heroImages.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhotoIndex(idx)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-calve-border/80 bg-stone-900 shadow-[0_12px_40px_-15px_rgba(23,33,35,0.08)] hover:shadow-[0_20px_50px_-12px_rgba(23,33,35,0.18)] transition-[box-shadow,transform] duration-300 ring-1 ring-black/5 cursor-pointer flex-shrink-0 w-[84vw] max-w-[340px] md:w-auto md:max-w-none snap-center aspect-[4/5]"
              >
                <img
                  src={item.image}
                  alt={item.alt[language]}
                  fetchPriority={idx < 2 ? "high" : undefined}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Clean Key Stats Grid with Concentric Corners and Tabular Numerals */}
        <div data-reveal="stagger" className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {BUILDING_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-calve-border/80 shadow-2xs text-center space-y-1 hover:border-calve-slate/40 transition-[border-color,box-shadow] duration-200 ring-1 ring-black/5"
            >
              <div className="text-3xl font-bold tracking-tight text-calve-charcoal tabular-nums">
                {stat.number}
                {stat.unit && <span className="text-lg font-medium ml-0.5 text-calve-slate">{stat.unit}</span>}
              </div>
              <div className="text-xs font-semibold text-calve-slate">
                {stat.label[language]}
              </div>
              <div className="text-[11px] text-calve-muted font-normal">
                {stat.detail[language]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================== */}
      {/* FULLSCREEN IMAGE LIGHTBOX MODAL                           */}
      {/* ========================================================== */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedPhotoIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt[language]}
        >
          <div
            className="relative bg-black rounded-3xl overflow-hidden max-w-5xl w-full max-h-[92vh] shadow-2xl border border-white/20 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-[background-color,transform] duration-150 cursor-pointer shadow-md active:scale-[0.96]"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Left/Next Arrow Controls */}
            <button
              type="button"
              onClick={() =>
                setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : heroImages.length - 1))
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-[background-color,transform] duration-150 cursor-pointer shadow-md active:scale-[0.96]"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedPhotoIndex((prev) => (prev !== null && prev < heroImages.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-[background-color,transform] duration-150 cursor-pointer shadow-md active:scale-[0.96]"
              aria-label="Suivant"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </button>

            {/* Full Uncropped Photo */}
            <div className="relative w-full h-full max-h-[88vh] flex items-center justify-center p-2 sm:p-4">
              <img
                src={selectedImage.image}
                alt={selectedImage.alt[language]}
                className="max-h-[85vh] w-auto max-w-full object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
