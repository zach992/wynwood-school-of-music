import Image from "next/image";
import Button from "@/components/Button";
import SectionMark from "@/components/SectionMark";

export const metadata = {
  title: "Our Bands",
  description:
    "Explore our band programs at Wynwood School of Music. Four levels from intro to advanced, designed so musicians at any stage can be part of a real band.",
};

const bands = [
  {
    name: "Rock Ambassadors",
    level: "Advanced — Audition Only",
    description:
      "This audition-based ensemble, led by WSM co-founder Sammy Gonzalez Zeira, offers advanced music training, major performance opportunities, and leadership development through the YMU Student Ambassadors program.",
    image: "/images/bands/rock-ambassadors.jpg",
    alt: "Rock Ambassadors performing live on stage",
  },
  {
    name: "Rock Legends",
    level: "Intermediate",
    description:
      "Rock Legends is for students with a strong foundation who are ready for advanced techniques, tighter ensembles, and deeper collaboration as performing artists.",
    image: "/images/bands/rock-legends.jpg",
    alt: "Rock Legends band performing together",
  },
  {
    name: "Rising Stars",
    level: "Beginner",
    description:
      "Rising Stars connects private lessons to band rehearsals, helping students build confidence, rhythm, and teamwork as they step into live performance.",
    image: "/images/bands/rising-stars.jpg",
    alt: "Rising Stars guitarist performing on stage",
  },
  {
    name: "Rock Juniors",
    level: "Intro",
    description:
      "Rock Juniors introduces young musicians to playing together while building rhythm, listening skills, and confidence in a fun, age-appropriate setting.",
    image: "/images/bands/rock-juniors.jpg",
    alt: "Young Rock Juniors musician playing drums",
  },
];

export default function OurBandsPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-12 pb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-black text-white">
            Band Programs
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl uppercase font-black text-white mb-6 leading-snug">
                Play Together. Grow Together. Perform Together.
              </h2>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-8">
                Our 90-minute weekly band programs are designed so musicians at
                any stage can be part of a real band. With four clearly defined
                levels, from first-time players to advanced performers, students
                are placed in bands that match their age and skill level while
                giving them a clear path for growth. Bands collaborate, rehearse,
                and perform live across Miami, helping musicians build
                confidence, musicianship, and stage presence through real
                performance experiences.
              </p>
              <Button href="/contact">Sign Up Today</Button>
            </div>
            <div className="relative w-full aspect-[4/3]">
              <Image
                src="/images/bands/intro-v2.jpg"
                alt="Students performing live at Wynwood School of Music"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Band Pathways Heading */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <p className="font-body text-wsm-accent text-sm font-semibold uppercase tracking-[0.25em] mb-4">
            Four Levels
          </p>
          <div className="flex items-center gap-5">
            <SectionMark />
            <h2 className="font-heading text-4xl md:text-5xl uppercase font-black text-white tracking-tight">
              Band Pathways
            </h2>
          </div>
          <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed mt-6 max-w-2xl">
            Designed so musicians at any stage can be part of a real band — with
            a clear path from first rehearsal to the live stage.
          </p>
        </div>
      </section>

      {/* Band Levels */}
      {bands.map((band, index) => {
        const isReversed = index % 2 === 1;
        const numeral = String(index + 1).padStart(2, "0");
        return (
          <section key={band.name} className="bg-wsm-dark px-4 py-10 md:py-14">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Image */}
                <div className={isReversed ? "md:order-2" : ""}>
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={band.image}
                      alt={band.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className={`relative ${isReversed ? "md:order-1" : ""}`}>
                  <span
                    aria-hidden
                    className="font-heading font-bold leading-none select-none block mb-4 text-[110px] md:text-[160px]"
                    style={{
                      color: "transparent",
                      WebkitTextStroke: "1.5px rgba(255,255,255,0.22)",
                      transform: "skewX(-19deg)",
                      transformOrigin: "left bottom",
                      display: "inline-block",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {numeral}
                  </span>
                  <p className="font-body text-wsm-accent text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-3">
                    {band.level}
                  </p>
                  <h3 className="font-heading text-3xl md:text-4xl uppercase font-black text-white mb-5 leading-tight">
                    {band.name}
                  </h3>
                  <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed">
                    {band.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="bg-wsm-dark px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <SectionMark size={48} />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl uppercase font-black text-white mb-4 tracking-tight">
            Ready to Join a Band?
          </h2>
          <p className="font-body text-wsm-gray text-base md:text-lg uppercase tracking-wider mb-10">
            Meet your future bandmates &mdash; and start something awesome.
          </p>
          <div className="flex justify-center">
            <Button href="/contact">Sign Up Today</Button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Testimonial */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
            <div className="md:col-span-5 relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
              <Image
                src="/images/bands/testimonial.jpg"
                alt="Students performing at Wynwood School of Music"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 42vw, 100vw"
              />
            </div>
            <div className="md:col-span-7 bg-wsm-accent/85 p-8 md:p-12 flex flex-col justify-center">
              <blockquote className="font-body text-white text-lg md:text-xl italic font-bold leading-relaxed">
                &ldquo;The incredible opportunities to be part of a band and
                also give back in the music arena has been wonderful. We are
                grateful to be a part of such a great school and
                organization.&rdquo;
              </blockquote>
              <p className="font-body text-white/80 text-sm mt-5">
                &mdash; Lisa, Parent
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="bg-wsm-dark py-8" />
    </>
  );
}
