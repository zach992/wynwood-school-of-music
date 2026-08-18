import Image from "next/image";
import Button from "@/components/Button";
import SectionMark from "@/components/SectionMark";
import {
  eventTime,
  upcomingSeasons,
  type RecitalEvent,
  type RecitalVenue,
} from "@/lib/recitals";

export const metadata = {
  title: "Student Recitals & Band Showcases",
  description:
    "Upcoming student recitals and band showcases at the Wynwood School of Music in Miami. Every student performs — see the dates for the current school year.",
  alternates: { canonical: "/recitals" },
};

/**
 * Rebuilt daily so events drop off the page once they've happened, without
 * waiting on a deploy.
 */
export const revalidate = 86400;

const SITE_URL = "https://www.wynwoodschoolofmusic.com";

/** Formatted in UTC to match the noon-UTC parse, so the date can't slip a day. */
function dateParts(event: RecitalEvent) {
  const d = new Date(eventTime(event));
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(d);
  return {
    weekday: part({ weekday: "short" }),
    month: part({ month: "short" }),
    day: part({ day: "numeric" }),
  };
}

function venueLine(venue: RecitalVenue) {
  return `${venue.street}, ${venue.city}, ${venue.state} ${venue.zip}`;
}

export default function RecitalsPage() {
  const seasons = upcomingSeasons();

  // Structured data covers only events that are still ahead of us, and only
  // claims ticket availability once there is somewhere to actually buy one.
  const eventSchemas = seasons.flatMap((season) =>
    season.events.map((event) => ({
      id: event.id,
      schema: {
      "@context": "https://schema.org",
      "@type": "Event",
      name: `Wynwood School of Music — ${event.name} (${season.label})`,
      startDate: event.date,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: season.venue.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: season.venue.street,
          addressLocality: season.venue.city,
          addressRegion: season.venue.state,
          postalCode: season.venue.zip,
          addressCountry: "US",
        },
      },
      description: event.seoDescription,
      organizer: { "@id": `${SITE_URL}#organization` },
      ...(event.flyer ? { image: `${SITE_URL}${event.flyer}` } : {}),
      ...(event.ticketsUrl
        ? {
            offers: {
              "@type": "Offer",
              url: event.ticketsUrl,
              price: event.price.replace(/[^0-9.]/g, ""),
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          }
        : {}),
      },
    }))
  );

  return (
    <>
      {eventSchemas.map(({ id, schema }) => (
        <script
          key={id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Heading */}
      <section className="bg-wsm-dark px-4 pt-12 pb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-black text-white">
            Recitals
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Intro */}
      <section className="bg-wsm-dark px-4 pt-8 pb-4">
        <div className="max-w-5xl mx-auto">
          <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed max-w-2xl">
            Twice a year our students take the stage for a weekend of shows,
            playing what they&apos;ve been working on all semester. Our band
            programs rock the house at the Band Showcase, and our private lesson
            students show their stuff at the Private Lesson Recitals. Join us.
          </p>
        </div>
      </section>

      {/* Dates */}
      {seasons.map((season) => (
        <section key={season.label} className="bg-wsm-dark px-4 py-10 md:py-14">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <SectionMark size={32} />
              <h2 className="font-heading text-3xl md:text-4xl uppercase font-black text-white">
                {season.label}
              </h2>
            </div>
            <p className="font-body text-wsm-gray text-sm md:text-base">
              <span className="text-white font-bold">{season.venue.name}</span>
              {" · "}
              {venueLine(season.venue)}
            </p>
            <p className="font-body text-wsm-gray-dark text-xs uppercase tracking-wider mt-1">
              Set times announced closer to the date
            </p>

            <div className="mt-8 border-t border-white/10">
              {season.events.map((event) => {
                const { weekday, month, day } = dateParts(event);
                return (
                  <div
                    key={event.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 py-7 border-b border-white/10"
                  >
                    {/* Date — the poster, when there is no poster */}
                    <div className="flex items-baseline gap-3 sm:flex-col sm:items-start sm:gap-0 sm:w-20 shrink-0">
                      <span className="font-heading text-xs uppercase tracking-[0.2em] text-wsm-accent">
                        {weekday}
                      </span>
                      <span className="font-heading text-5xl md:text-6xl font-black text-white leading-none">
                        {day}
                      </span>
                      <span className="font-heading text-xs uppercase tracking-[0.2em] text-wsm-accent">
                        {month}
                      </span>
                    </div>

                    {/* Artwork is optional: dates go up as soon as they're
                        confirmed, and the flyer slots in whenever it exists. */}
                    {event.flyer && (
                      <div className="relative w-24 sm:w-28 aspect-[3/4] shrink-0 overflow-hidden rounded">
                        <Image
                          src={event.flyer}
                          alt={`${event.name} flyer`}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-2xl md:text-3xl uppercase font-black text-white leading-tight">
                        {event.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-3 sm:gap-2 shrink-0">
                      <span className="font-heading text-xl font-black text-white">
                        {event.price}
                      </span>
                      {event.ticketsUrl ? (
                        <Button href={event.ticketsUrl}>Tickets</Button>
                      ) : (
                        <span className="font-body text-xs uppercase tracking-wider text-wsm-gray-dark whitespace-nowrap">
                          Tickets on sale soon
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {seasons.length === 0 && (
        <section className="bg-wsm-dark px-4 py-10 md:py-14">
          <div className="max-w-5xl mx-auto">
            <p className="font-body text-wsm-gray text-base">
              Next season&apos;s recital dates are being finalized. Check back
              soon, or{" "}
              <a
                href="/contact"
                className="text-wsm-accent hover:text-wsm-accent-hover"
              >
                get in touch
              </a>{" "}
              and we&apos;ll let you know.
            </p>
          </div>
        </section>
      )}

      {/* Sign-off */}
      <section className="bg-wsm-dark px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-heading text-2xl md:text-3xl uppercase font-black text-white">
            We&apos;ll see you at the shows
          </p>
        </div>
      </section>
    </>
  );
}
