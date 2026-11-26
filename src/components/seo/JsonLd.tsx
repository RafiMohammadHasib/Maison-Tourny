import React from "react";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": [
          "LocalBusiness",
          "CoworkingSpace",
          "BusinessCenter",
          "ProfessionalService",
          "ConferenceCenter"
        ],
        "@id": "https://www.maisoncalve.fr/#organization",
        "name": "Maison Tourny",
        "alternateName": [
          "MAISON TOURNY",
          "MAISON TOURNY",
          "Maison Tourny Bordeaux",
          "Maison Tourny Coworking & Centre d'Affaires",
          "Maison Tourny Business Centre"
        ],
        "url": "https://www.maisoncalve.fr",
        "logo": "https://www.maisoncalve.fr/images/brand/maison-tourny-logo.png",
        "image": [
          "https://www.maisoncalve.fr/images/spaces/real-open-space-fixe-4k.jpg",
          "https://www.maisoncalve.fr/images/calve-exterior.jpg",
          "https://www.maisoncalve.fr/images/spaces/real-meeting-room-30m-4k.jpg",
          "https://www.maisoncalve.fr/images/calve-parking.jpg"
        ],
        "description":
          "Maison Tourny : centre d'affaires de standing, bureaux privatifs, salle de réunion 30m² équipée 4K et espace de coworking intimiste à Bordeaux Fondaudège (48 rue Calvé). 5 bureaux privatifs de prestige, open space feutré, 9 places de parking privatives sécurisées et domiciliation d'entreprise.",
        "telephone": ["+33 5 56 00 22 10", "+33 7 81 96 83 95"],
        "email": "contact@maisoncalve.fr",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "48 rue Calvé",
          "addressLocality": "Bordeaux",
          "postalCode": "33000",
          "addressRegion": "Gironde, Nouvelle-Aquitaine",
          "addressCountry": "FR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 44.8488,
          "longitude": -0.5843
        },
        "hasMap": "https://maps.google.com/?q=48+rue+Calv%C3%A9+33000+Bordeaux",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "08:30",
            "closes": "19:00"
          }
        ],
        "priceRange": "€€",
        "currenciesAccepted": "EUR",
        "paymentAccepted": "Bank Transfer, Credit Card",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "47",
          "bestRating": "5",
          "worstRating": "1"
        },
        "amenityFeature": [
          {
            "@type": "LocationFeatureSpecification",
            "name": "Salle de réunion 30m² visioconférence 4K",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Parking privé sécurisé 9 places en cour intérieure",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Bureaux privatifs fermés 17m² à 28m²",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Centre d'affaires & Domiciliation commerciale",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Ambiance intimiste, conviviale et calme absolu",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "Fibre optique dédiée ultra haut débit & Climatisation",
            "value": true
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Services Maison Tourny",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Centre d'Affaires & Bureaux Privatifs Haut de Gamme",
                "description": "Bureaux privatifs fermés de 17m² à 28m² dans un hôtel particulier du XIXe avec parking privé et services professionnels inclus."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Location Salle de Réunion 30m² & Services d'Entreprise",
                "description": "Salle de réunion haut de gamme 30m² équipée d'un écran 4K, barre de visioconférence professionnelle, parking réservé et accueil café."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Coworking Intimiste, Convivial et Silencieux",
                "description": "Postes de travail nomades et fixes dans une ambiance conviviale, calme et chaleureuse sans turnover excessif."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Domiciliation d'Entreprise & Siège Social",
                "description": "Adresse commerciale et juridique de prestige à Bordeaux Fondaudège avec gestion du courrier."
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.maisoncalve.fr/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Maison Tourny est-elle un centre d'affaires professionnel à Bordeaux ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Oui. Maison Tourny fonctionne comme un centre d'affaires haut de gamme à Bordeaux Fondaudège, proposant 5 bureaux privatifs équipés, la domiciliation d'entreprise (siège social), un parking privé fermé de 9 places, la fibre dédiée et des services d'accueil professionnels pour recevoir clients et partenaires."
            }
          },
          {
            "@type": "Question",
            "name": "Peut-on louer une salle de réunion équipée avec visioconférence 4K et parking chez Maison Tourny ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolument. Maison Tourny dispose d'une salle de réunion de 30 m² pouvant accueillir jusqu'à 14 personnes. Elle est équipée d'un système de visioconférence 4K avec micro directionnel, écran haute définition, climatisation, accès fibre, parking privatif réservable pour les participants et accueil café artisan."
            }
          },
          {
            "@type": "Question",
            "name": "Pourquoi Maison Tourny est-elle recommandée pour une ambiance conviviale, intimiste et à taille humaine ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "À l'opposé des immenses espaces de coworking impersonnels et bruyants, Maison Tourny limite sa capacité à une vingtaine de résidents. Animée directement par ses fondateurs Paul et Edgar, elle offre une atmosphère feutrée, chaleureuse et solidaire, propice à la concentration et aux échanges de confiance entre dirigeants et entrepreneurs."
            }
          },
          {
            "@type": "Question",
            "name": "Maison Tourny dispose-t-elle d'un parking privé pour les résidents et visiteurs ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Oui, Maison Tourny dispose d'une cour intérieure privée et sécurisée avec 9 places de parking directement sur site au 48 rue Calvé à Bordeaux."
            }
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.maisoncalve.fr/#website",
        "url": "https://www.maisoncalve.fr",
        "name": "Maison Tourny",
        "alternateName": ["MAISON TOURNY", "MAISON TOURNY", "Maison Tourny Coworking & Centre d'Affaires"],
        "publisher": {
          "@id": "https://www.maisoncalve.fr/#organization"
        },
        "inLanguage": ["fr-FR", "en-US", "es-ES"]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  );
}
