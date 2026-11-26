"use client";

import React from "react";
import { Star, ExternalLink, ArrowRight, ShieldCheck } from "lucide-react";
import { Language } from "@/data/content";

interface SocialProof14Props {
  language: Language;
  onOpenEnquiry?: (spaceId?: string) => void;
}

export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=maison+calve#lrd=0xd55290c0361c9e7:0x4f8484e78cd41449,1,,,,";

interface Review {
  name: string;
  avatar?: string;
  role: { fr: string; en: string; es: string };
  initials: string;
  avatarBg: string;
  date: { fr: string; en: string; es: string };
  text: { fr: string; en: string; es: string };
}

const REVIEWS: Review[] = [
  {
    name: "Lucas Vachette",
    avatar: "/images/avatars/google/lucas-vachette.png",
    role: {
      fr: "Avis vérifié Google • 2 avis",
      en: "Verified Google Review • 2 reviews",
      es: "Opinión verificada en Google • 2 opiniones",
    },
    initials: "LV",
    avatarBg: "bg-calve-slate text-white",
    date: { fr: "Il y a 2 semaines", en: "2 weeks ago", es: "Hace 2 semanas" },
    text: {
      fr: "Une excellente expérience dans cette salle de coworking ! L’espace est agréable, propre, bien aménagé et parfaitement adapté pour travailler dans de bonnes conditions. L’ambiance est professionnelle et conviviale, ce qui rend l’expérience encore plus appréciable.\n\nUn grand point positif pour les responsables, qui sont vraiment très gentils, accueillants, disponibles et surtout à l’écoute des suggestions d’amélioration. On sent une réelle volonté de satisfaire les clients et de faire évoluer l’espace dans le bon sens.\n\nJe recommande vivement cet endroit à toute personne recherchant un cadre de travail agréable et de qualité. Une très belle expérience, je reviendrai avec plaisir !",
      en: "An excellent experience at this coworking space! The space is pleasant, clean, well-designed, and perfectly suited for working in optimal conditions. The atmosphere is both professional and friendly, making the experience even more enjoyable.\n\nA huge plus for the managers, who are truly very kind, welcoming, available, and above all attentive to feedback. You feel a genuine commitment to client satisfaction and moving the space in the right direction.\n\nI highly recommend this place to anyone looking for an enjoyable, high-quality work environment. A fantastic experience, I will gladly return!",
      es: "¡Una excelente experiencia en este espacio de coworking! El espacio es agradable, limpio, bien diseñado y perfectamente adaptado para trabajar en condiciones óptimas. El ambiente es profesional y acogedor, lo que hace que la experiencia sea aún más agradable.\n\nUn gran punto positivo para los responsables, que son muy amables, acogedores, disponibles y atentos a las sugerencias de mejora. Se nota un verdadero compromiso con la satisfacción de los clientes.\n\nRecomiendo totalmente este lugar a cualquiera que busque un entorno de trabajo agradable y de calidad. ¡Una magnífica experiencia, volveré con mucho gusto!",
    },
  },
  {
    name: "Sandra Pacheco Messibah",
    avatar: "/images/avatars/google/sandra-pacheco.png",
    role: {
      fr: "Local Guide Google • 38 avis",
      en: "Google Local Guide • 38 reviews",
      es: "Google Local Guide • 38 opiniones",
    },
    initials: "SP",
    avatarBg: "bg-emerald-800 text-emerald-100",
    date: { fr: "Il y a 2 semaines", en: "2 weeks ago", es: "Hace 2 semanas" },
    text: {
      fr: "Nous avons passé une journée en équipe à la Maison Calvé et je recommande ! Accueil très sympathique, ambiance conviviale mais propice au travail (hyper calme), sans oublier le café et les gourmandises à disposition dans la cuisine, ce qui n’est pas négligeable pour une équipe aussi gourmande que nous ! Et pour ceux qui se déplacent en voiture il y a même un parking.",
      en: "We spent a team day at Maison Calvé and I highly recommend it! A very warm welcome, a friendly yet productive atmosphere (hyper quiet), not to mention the coffee and treats available in the kitchen, which is a real bonus for a team with such a sweet tooth as us! And for those arriving by car, there's even private parking.",
      es: "¡Pasamos un día en equipo en Maison Calvé y lo recomiendo totalmente! Muy buena acogida, ambiente agradable y productivo (súper tranquilo), además del café y los aperitivos disponibles en la cocina, lo cual es genial para un equipo como el nuestro. Y para quienes van en coche, ¡incluso hay aparcamiento privado!",
    },
  },
  {
    name: "Jules Cadusseau",
    avatar: "/images/avatars/google/jules-cadusseau.png",
    role: {
      fr: "Avis vérifié Google • Résident",
      en: "Verified Google Review • Resident",
      es: "Opinión verificada en Google • Residente",
    },
    initials: "JC",
    avatarBg: "bg-stone-700 text-stone-100",
    date: { fr: "Il y a 1 mois", en: "1 month ago", es: "Hace 1 mes" },
    text: {
      fr: "Un lieu de travail exceptionnel ! L'ambiance y est à la fois studieuse et très conviviale. Les espaces sont lumineux, bien agencés et le réseau Wi-Fi est irréprochable. On s'y sent tout de suite bien. Paul et Edgar sont toujours aux petits soins. Je recommande les yeux fermés !",
      en: "An exceptional workspace! The atmosphere is both studious and very friendly. The spaces are bright, well laid out, and the Wi-Fi is flawless. You immediately feel at home. Paul and Edgar are always wonderfully attentive. I recommend with my eyes closed!",
      es: "¡Un lugar de trabajo excepcional! El ambiente es a la vez estudioso y muy agradable. Los espacios son luminosos, bien distribuidos y el Wi-Fi es impecable. Se está a gusto enseguida. Paul y Edgar siempre están atentos a todo. ¡Lo recomiendo con los ojos cerrados!",
    },
  },
  {
    name: "Charles Teil",
    avatar: "/images/avatars/google/charles-teil.png",
    role: {
      fr: "Avis vérifié Google • 15 avis",
      en: "Verified Google Review • 15 reviews",
      es: "Opinión verificada en Google • 15 opiniones",
    },
    initials: "CT",
    avatarBg: "bg-slate-800 text-amber-200",
    date: { fr: "Il y a 3 semaines", en: "3 weeks ago", es: "Hace 3 semaines" },
    text: {
      fr: "Super espace de coworking ! Un lieu agréable, bien aménagé et idéal pour travailler dans de bonnes conditions. L’ambiance est conviviale, les espaces sont propres et tout est pensé pour être à l’aise et productif. Je recommande sans hésiter ! :)",
      en: "Fantastic coworking space! A pleasant, well-designed place, ideal for working in optimal conditions. The atmosphere is friendly, the spaces are spotless, and everything is thoughtfully designed for comfort and productivity. I recommend without hesitation! :)",
      es: "¡Fantástico espacio de coworking! Un lugar agradable, bien acondicionado e ideal para trabajar en buenas condiciones. El ambiente es acogedor, los espacios están impecables y todo está pensado para estar a gusto y ser productivo. ¡Recomiendo sin dudarlo! :)"
    },
  },
  {
    name: "Diatta Pierre",
    avatar: "/images/avatars/google/diatta-pierre.png",
    role: {
      fr: "Avis vérifié Google • Membre",
      en: "Verified Google Review • Member",
      es: "Opinión verificada en Google • Miembro",
    },
    initials: "DP",
    avatarBg: "bg-rose-900/80 text-rose-100",
    date: { fr: "Il y a 3 semaines", en: "3 weeks ago", es: "Hace 3 semaines" },
    text: {
      fr: "Super espace de coworking en plein Bordeaux ! Les locaux sont modernes, agréables et parfaitement adaptés pour travailler dans de bonnes conditions. L’ambiance est à la fois professionnelle et conviviale, avec des espaces bien aménagés et une équipe accueillante et disponible.\n\nUn endroit que je recommande sans hésiter, que ce soit pour travailler ponctuellement ou s’installer sur le long terme !",
      en: "Super coworking space right in the heart of Bordeaux! The premises are modern, pleasant, and perfectly suited for working in optimal conditions. The atmosphere is both professional and friendly, with well-designed spaces and a welcoming, available team.\n\nA place I recommend without hesitation, whether for occasional work or settling in long term!",
      es: "¡Excelente espacio de coworking en el centro de Burdeos! Instalaciones modernas, agradables y perfectamente adaptadas para trabajar en las mejores condiciones. El ambiente es profesional y acogedor, con una atención impecable.\n\n¡Un lugar que recomiendo sin vacilar, ya sea para trabajar puntualmente o establecerse a largo plazo!",
    },
  },
];

export default function SocialProof14({
  language,
  onOpenEnquiry,
}: SocialProof14Props) {
  const content = {
    fr: {
      badge: "Avis Google Vérifiés",
      title: "Ce que nos résidents disent de la Maison",
      subtitle:
        "Une note parfaite de 5.0 / 5 basée sur 47 avis Google. Retours d'expérience authentiques des professionnels et résidents qui ont choisi le 48 rue Calvé pour développer leur activité.",
      ratingScore: "5.0",
      ratingMax: "/ 5",
      ratingCount: "47 avis Google certifiés",
      ratingNote: "100% d'avis 5 étoiles • Zéro concession sur la sérénité",
      viewOnGoogle: "Voir les 47 avis sur Google",
      bookTour: "Planifier une visite privée",
      verifiedBadge: "Avis vérifié",
      residentBadge: "Résident",
    },
    en: {
      badge: "Verified Google Reviews",
      title: "What our resident partners say about the Maison",
      subtitle:
        "A flawless 5.0 / 5 score based on 47 Google reviews. Authentic feedback from executives, attorneys, and founders who chose 48 rue Calvé to foster their business and focus.",
      ratingScore: "5.0",
      ratingMax: "/ 5",
      ratingCount: "47 certified Google reviews",
      ratingNote: "100% 5-star ratings • Uncompromised deep-work calm",
      viewOnGoogle: "Read all 47 reviews on Google",
      bookTour: "Schedule a private tour",
      verifiedBadge: "Verified Review",
      residentBadge: "Resident",
    },
    es: {
      badge: "Reseñas de Google Verificadas",
      title: "Lo que opinan nuestros residentes de la Maison",
      subtitle:
        "Puntuación perfecta de 5.0 / 5 basada en 47 opiniones de Google. Opiniones reales de directivos, profesionales y residentes que trabajan en el 48 rue Calvé.",
      ratingScore: "5.0",
      ratingMax: "/ 5",
      ratingCount: "47 opiniones certificadas en Google",
      ratingNote: "100% valoraciones de 5 estrellas • Máxima serenidad",
      viewOnGoogle: "Ver las 47 opiniones en Google",
      bookTour: "Solicitar visita privada",
      verifiedBadge: "Opinión verificada",
      residentBadge: "Residente",
    },
  }[language];

  return (
    <section
      id="reviews"
      aria-label="Google Reviews & Social Proof"
      className="py-16 sm:py-24 bg-white border-b border-calve-border relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Grid: Left Column stretches full height of masonry column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 relative items-stretch">
          {/* ============================================================ */}
          {/* STICKY INTRO (Left Column)                                   */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-28 space-y-6 sm:space-y-8 pb-4">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-calve-stone/90 border border-calve-border text-calve-slate text-[11px] font-bold tracking-wider uppercase">
              {/* Google multicolor G icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{content.badge}</span>
            </div>

            {/* Headline & Description */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-calve-charcoal tracking-tight leading-[1.12]">
                {content.title}
              </h2>
              <p className="text-sm sm:text-base text-calve-muted leading-relaxed">
                {content.subtitle}
              </p>
            </div>

            {/* Real Reviewers Avatar Stack */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2.5 overflow-hidden py-0.5">
                {REVIEWS.map((r, i) => (
                  <img
                    key={i}
                    src={r.avatar}
                    alt={r.name}
                    title={r.name}
                    className="inline-block w-9 h-9 rounded-full ring-2 ring-white object-cover shadow-2xs"
                  />
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-bold text-calve-charcoal leading-tight">
                  {language === "fr"
                    ? "Recommandé par nos résidents"
                    : language === "es"
                    ? "Recomendado por nuestros residentes"
                    : "Endorsed by our resident partners"}
                </span>
                <span className="text-[11px] text-calve-muted font-medium">
                  {language === "fr"
                    ? "Photos & avis réels Google Maps"
                    : language === "es"
                    ? "Fotos y reseñas reales de Google Maps"
                    : "Real Google Maps photos & reviews"}
                </span>
              </div>
            </div>

            {/* Google Scorecard Box */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-calve-stone/60 border border-calve-border space-y-4 shadow-2xs">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-extrabold text-calve-charcoal tracking-tight font-sans">
                    {content.ratingScore}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-calve-muted font-sans">
                    {content.ratingMax}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 stroke-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-calve-charcoal">
                    {content.ratingCount}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-calve-border/70 flex items-center gap-2 text-xs text-calve-muted">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{content.ratingNote}</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 pt-2">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-calve-slate hover:bg-calve-slate-dark text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs hover:shadow-sm active:scale-98 cursor-pointer"
              >
                <span>{content.viewOnGoogle}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {onOpenEnquiry && (
                <button
                  type="button"
                  onClick={() => onOpenEnquiry("visit")}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-calve-stone/70 border border-calve-border text-calve-charcoal text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                >
                  <span>{content.bookTour}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

          {/* ============================================================ */}
          {/* MASONRY WALL OF LOVE (Right Column)                          */}
          {/* ============================================================ */}
          <div className="lg:col-span-7">
            <div className="columns-1 sm:columns-2 gap-4 lg:gap-5 space-y-4 lg:space-y-5">
              {REVIEWS.map((review, idx) => (
                <article
                  key={idx}
                  className="break-inside-avoid bg-white rounded-2xl border border-calve-border/90 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-300 space-y-4 group"
                >
                  {/* Card Header: Stars, Google G and Date */}
                  <div className="flex items-center justify-between gap-2 pb-1 border-b border-calve-border/40">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-amber-500" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-calve-muted font-medium">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>{review.date[language]}</span>
                    </div>
                  </div>

                  {/* Review Text Body */}
                  <blockquote className="text-xs sm:text-sm text-calve-charcoal leading-relaxed font-normal italic whitespace-pre-line">
                    &ldquo;{review.text[language]}&rdquo;
                  </blockquote>

                  {/* Author Meta Footer */}
                  <div className="flex items-center gap-3 pt-3 border-t border-calve-border/60">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-2xs border border-calve-border/60 bg-calve-stone">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={`w-full h-full ${review.avatarBg} flex items-center justify-center font-bold text-xs tracking-wider`}
                        >
                          {review.initials}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-calve-charcoal truncate">
                          {review.name}
                        </span>
                        <span
                          title={content.verifiedBadge}
                          className="inline-flex items-center text-emerald-600 shrink-0"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </div>
                      <p className="text-[11px] text-calve-muted truncate">
                        {review.role[language]}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
