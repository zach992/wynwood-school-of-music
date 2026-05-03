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
    ];
  },
};

export default nextConfig;
