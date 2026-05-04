import Image from "next/image";
import Button from "@/components/Button";

export const metadata = {
  title: "Student Recitals & Showcases — Spring 2026",
  description:
    "Upcoming student recitals and band showcases at the Wynwood School of Music in Miami. Tickets available for our Spring 2026 events at Inkub8.",
  alternates: { canonical: "/recitals" },
};

const SITE_URL = "https://www.wynwoodschoolofmusic.com";

const inkub8 = {
  "@type": "Place",
  name: "Inkub8",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Miami",
    addressRegion: "FL",
    addressCountry: "US",
  },
};

const events = [
  {
    name: "Wynwood School of Music — Spring Band Showcase 2026",
    startDate: "2026-05-15T19:00:00-04:00",
    image: `${SITE_URL}/images/recitals/spring-2026-band-showcase.webp`,
    url: "https://www.eventbrite.com/e/wynwood-school-of-musics-spring-band-showcase-2026-tickets-1984639810097",
    description:
      "The Wynwood School of Music's Spring 2026 Band Showcase — student bands performing live at Inkub8 in Miami.",
  },
  {
    name: "Wynwood School of Music — Spring Private Lesson Recitals 2026",
    startDate: "2026-05-16T14:00:00-04:00",
    endDate: "2026-05-17T20:00:00-04:00",
    image: `${SITE_URL}/images/recitals/spring-2026-private-lesson-recitals.webp`,
    url: "https://www.eventbrite.com/e/wynwood-school-of-musics-spring-private-lesson-recitals-2026-tickets-1985597339092",
    description:
      "The Wynwood School of Music's Spring 2026 Private Lesson Recitals — students from across the school perform live at Inkub8 in Miami.",
  },
];

export default function RecitalsPage() {
  const eventSchemas = events.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    startDate: e.startDate,
    ...(e.endDate ? { endDate: e.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: inkub8,
    image: e.image,
    description: e.description,
    organizer: { "@id": `${SITE_URL}#organization` },
    offers: {
      "@type": "Offer",
      url: e.url,
      availability: "https://schema.org/InStock",
    },
  }));

  return (
    <>
      {eventSchemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      {/* Event Flyers */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            {/* Band Showcase */}
            <div className="flex flex-col items-center">
              <Image
                src="/images/recitals/spring-2026-band-showcase.webp"
                alt="Spring 2026 Band Showcase — Friday, May 15th at Inkub8"
                width={1500}
                height={1942}
                className="w-full h-auto"
                priority
              />
              <div className="mt-8">
                <Button href="https://www.eventbrite.com/e/wynwood-school-of-musics-spring-band-showcase-2026-tickets-1984639810097?aff=oddtdtcreator">
                  Tickets
                </Button>
              </div>
            </div>

            {/* Private Lesson Recitals */}
            <div className="flex flex-col items-center">
              <Image
                src="/images/recitals/spring-2026-private-lesson-recitals.webp"
                alt="Spring 2026 Private Lesson Recitals — May 16-17 at Inkub8"
                width={1500}
                height={1941}
                className="w-full h-auto"
                priority
              />
              <div className="mt-8">
                <Button href="https://www.eventbrite.com/e/wynwood-school-of-musics-spring-private-lesson-recitals-2026-tickets-1985597339092?aff=oddtdtcreator">
                  Tickets
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heading */}
      <section className="bg-wsm-dark px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase font-black text-white">
            We&apos;ll See You at the Shows!
          </h1>
        </div>
      </section>
    </>
  );
}
