import type { MetadataRoute } from "next";
import { teamBios } from "@/lib/team-bios";

const baseUrl = "https://www.wynwoodschoolofmusic.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, priority: 1.0, changeFrequency: "monthly" },
    { url: `${baseUrl}/our-story`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/team`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/programs-and-pricing`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/private-lessons`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/our-bands`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/musicperformancecamp`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/recitals`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
    { url: `${baseUrl}/testimonials`, lastModified: now, priority: 0.6, changeFrequency: "monthly" },
    { url: `${baseUrl}/repair`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/friendsofwsm`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/contact`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
  ];

  const instructorRoutes: MetadataRoute.Sitemap = teamBios.map((bio) => ({
    url: `${baseUrl}/team/${bio.slug}`,
    lastModified: now,
    priority: 0.6,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...instructorRoutes];
}
