import Image from "next/image";
import Button from "@/components/Button";

export const metadata = {
  title: "Recitals | Wynwood School of Music",
  description:
    "Upcoming recitals and showcases at the Wynwood School of Music. Get tickets for our Spring 2026 events.",
};

export default function RecitalsPage() {
  return (
    <>
      {/* Event Cards */}
      <section className="bg-wsm-dark">
        <div className="grid md:grid-cols-2">
          {/* Band Showcase Card */}
          <div className="relative flex flex-col items-center justify-center min-h-[60vh]">
            <Image
              src="/images/recitals/band-showcase.png"
              alt="Spring 2026 Band Showcase — Friday, May 15th at Inkub8"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 mt-auto pb-12">
              <Button href="#">Tickets</Button>
            </div>
          </div>

          {/* Private Lesson Recitals Card */}
          <div className="relative flex flex-col items-center justify-center min-h-[60vh]">
            <Image
              src="/images/recitals/private-lesson-recitals.png"
              alt="Spring 2026 Private Lesson Recitals — May 16-17 at Inkub8"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 mt-auto pb-12">
              <Button href="#">Tickets</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Heading */}
      <section className="bg-wsm-dark px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase font-bold text-white">
            We&apos;ll See You at the Shows!
          </h1>
        </div>
      </section>
    </>
  );
}
