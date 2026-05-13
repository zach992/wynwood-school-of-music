import type { NextConfig } from "next";

const instructorSlugs = [
  "leo-cattani",
  "alex-ibanez",
  "vale-penaranda",
  "augusto-di-catarina",
  "renzo-vargas",
  "angel-perez",
  "yamil-granda",
  "patricio-acevedo",
  "sergio-zavala",
  "aj-hill",
  "jake-mongin",
  "nestor-rigaud",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/summercamp",
        destination: "/musicperformancecamp",
        permanent: true,
      },
      // Preserve SEO equity from old Squarespace instructor URLs (root-level)
      // → new Next.js routes under /team/[slug]
      ...instructorSlugs.map((slug) => ({
        source: `/${slug}`,
        destination: `/team/${slug}`,
        permanent: true,
      })),
      // Former instructor — page retired, redirect to /team
      { source: "/thania-sanz", destination: "/team", permanent: true },

      // Squarespace legacy URLs (from old sitemap) → closest topical page
      { source: "/home", destination: "/", permanent: true },
      // Instrument-specific landing pages → private lessons
      { source: "/guitar-lessons", destination: "/private-lessons", permanent: true },
      { source: "/piano-lessons", destination: "/private-lessons", permanent: true },
      { source: "/voice-lessons", destination: "/private-lessons", permanent: true },
      // Camp-related legacy URLs
      { source: "/camp-signup", destination: "/musicperformancecamp", permanent: true },
      { source: "/camp-gallery", destination: "/musicperformancecamp", permanent: true },
      { source: "/summer-camp-photo-gallery", destination: "/musicperformancecamp", permanent: true },
      // Recital / showcase galleries → /recitals
      { source: "/band-showcase-gallery", destination: "/recitals", permanent: true },
      { source: "/private-lesson-recitals-gallery", destination: "/recitals", permanent: true },
      { source: "/spring-band-showcase-gallery-2023", destination: "/recitals", permanent: true },
      { source: "/spring-private-lesson-recitals-gallery-2023", destination: "/recitals", permanent: true },
      { source: "/recitalphotos", destination: "/recitals", permanent: true },
      { source: "/springrecitalphotos2023", destination: "/recitals", permanent: true },
      // Generic galleries — closest match is /recitals (the only photo-heavy page)
      { source: "/gallery", destination: "/recitals", permanent: true },
      { source: "/gallery-2", destination: "/recitals", permanent: true },
      // Former testimonial / student bio pages → /team (similar to /thania-sanz)
      { source: "/ana-liu", destination: "/team", permanent: true },
      { source: "/bella-varela", destination: "/team", permanent: true },
      { source: "/anastasia-chubb", destination: "/team", permanent: true },
      { source: "/vivian-valls", destination: "/team", permanent: true },
      // Squarespace draft / test pages → real equivalents
      { source: "/our-bands-testing", destination: "/our-bands", permanent: true },
      { source: "/testimonials-test-copy", destination: "/testimonials", permanent: true },
      // Blog never carried over — point to homepage
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/makeiteasy", destination: "/", permanent: true },
      // Old teacher bookmark URL → new /teacher-resources page
      { source: "/resources", destination: "/teacher-resources", permanent: true },
    ];
  },
};

export default nextConfig;
