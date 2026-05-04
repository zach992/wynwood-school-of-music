import type { Metadata } from "next";
import CampPageClient from "./CampPageClient";
import { campFaqs } from "./faqs";
import "./camp.css";

export const metadata: Metadata = {
  title: "Summer Music Camp in Miami (Ages 8–14)",
  description:
    "Summer Music Performance Camp in Wynwood, Miami. Ages 8–14. Live band training, professional instructors, Friday showcases. Early bird pricing until May 15.",
  alternates: { canonical: "/musicperformancecamp" },
};

export default function MusicPerformanceCampPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: campFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <CampPageClient />
    </>
  );
}
