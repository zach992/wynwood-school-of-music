import type { Metadata } from "next";
import CampPageClient from "./CampPageClient";
import "./camp.css";

export const metadata: Metadata = {
  title: "Music Performance Camp",
  description:
    "WSM Summer Music Performance Camp in Wynwood, Miami. Ages 8–14. Live band training, professional instructors, Friday showcases. Early bird pricing until May 15.",
  alternates: { canonical: "/musicperformancecamp" },
};

export default function MusicPerformanceCampPage() {
  return <CampPageClient />;
}
