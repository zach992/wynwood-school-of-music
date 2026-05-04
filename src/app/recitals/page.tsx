import Image from "next/image";
import Button from "@/components/Button";

export const metadata = {
  title: "Recitals",
  description:
    "Upcoming recitals and showcases at the Wynwood School of Music. Get tickets for our Spring 2026 events.",
  alternates: { canonical: "/recitals" },
};

export default function RecitalsPage() {
  return (
    <>
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
