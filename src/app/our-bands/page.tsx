import Image from "next/image";
import Button from "@/components/Button";

export const metadata = {
  title: "Our Bands | Wynwood School of Music",
  description:
    "Explore our band programs at Wynwood School of Music. Four levels from intro to advanced, designed so musicians at any stage can be part of a real band.",
};

const bands = [
  {
    name: "Rock Ambassadors",
    level: "ADVANCED LEVEL \u2013 AUDITION ONLY",
    description:
      "This audition-based ensemble, led by WSM co-founder Sammy Gonzalez Zeira, offers advanced music training, major performance opportunities, and leadership development through the YMU Student Ambassadors program.",
    image: "/images/bands/rock-ambassadors.jpg",
    alt: "Rock Ambassadors performing live on stage",
  },
  {
    name: "Rock Legends",
    level: "INTERMEDIATE LEVEL",
    description:
      "Rock Legends is for students with a strong foundation who are ready for advanced techniques, tighter ensembles, and deeper collaboration as performing artists.",
    image: "/images/bands/rock-legends.jpg",
    alt: "Rock Legends band performing together",
  },
  {
    name: "Rising Stars",
    level: "BEGINNER LEVEL",
    description:
      "Rising Stars connects private lessons to band rehearsals, helping students build confidence, rhythm, and teamwork as they step into live performance.",
    image: "/images/bands/rising-stars.jpg",
    alt: "Rising Stars guitarist performing on stage",
  },
  {
    name: "Rock Juniors",
    level: "INTRO LEVEL",
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
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-bold text-white">
            Band Programs
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="w-full md:w-[50%]">
              <h2 className="font-heading text-xl md:text-2xl uppercase font-bold text-white mb-6 leading-snug">
                Play Together. Grow Together. Perform Together.
              </h2>
              <p className="font-body text-wsm-gray text-base leading-relaxed">
                Our 90-minute weekly band programs are designed so musicians at
                any stage can be part of a real band. With four clearly defined
                levels, from first-time players to advanced performers, students
                are placed in bands that match their age and skill level while
                giving them a clear path for growth. Bands collaborate, rehearse,
                and perform live across Miami, helping musicians build
                confidence, musicianship, and stage presence through real
                performance experiences.
              </p>
            </div>
            <div className="w-full md:w-[50%]">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src="/images/bands/intro.jpg"
                  alt="Students performing live at Wynwood School of Music"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <Button href="/contact">Sign Up Today!</Button>
          </div>
        </div>
      </section>

      {/* Band Pathways Heading */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl uppercase font-bold text-white mb-6">
            Band Pathways
          </h2>
          <p className="font-body text-white text-lg md:text-xl">
            4 levels designed so musicians at any stage can be part of a real
            band
          </p>
          <hr className="border-wsm-gray-dark mt-10" />
        </div>
      </section>

      {/* Band Levels */}
      {bands.map((band, index) => (
        <section key={band.name} className="bg-wsm-dark px-4 py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              {/* Image */}
              <div className="w-full md:w-[45%] shrink-0">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={band.image}
                    alt={band.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="w-full md:w-[55%]">
                <h3 className="font-heading text-3xl md:text-5xl uppercase font-bold text-white mb-4">
                  {band.name}
                </h3>
                <p className="font-heading text-base md:text-lg uppercase font-bold text-white mb-4 underline">
                  {band.level}
                </p>
                <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed">
                  {band.description}
                </p>
              </div>
            </div>
            <hr className="border-wsm-gray-dark mt-10" />
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl uppercase font-bold text-white mb-4">
            Ready to Join a Band?
          </h2>
          <p className="font-heading text-base md:text-lg uppercase font-bold text-white mb-8">
            Meet Your Future Bandmates — and Start Something Awesome.
          </p>
          <div className="flex justify-center">
            <Button href="/contact">Sign Up Today!</Button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Quote overlay */}
              <div className="relative z-10 bg-wsm-darker/90 p-8 md:p-12 md:w-[50%]">
                <blockquote className="font-heading text-xl md:text-2xl text-white leading-snug">
                  &ldquo;The incredible opportunities to be part of a band and
                  also give back in the music arena has been wonderful. We are
                  grateful to be a part of such a great school and
                  organization.&rdquo;
                </blockquote>
                <p className="font-body text-wsm-gray text-sm mt-6 italic">
                  - Lisa, Parent
                </p>
              </div>

              {/* Background image */}
              <div className="relative md:w-[50%] aspect-[4/3] md:aspect-auto">
                <Image
                  src="/images/bands/testimonial.jpg"
                  alt="Students performing at Wynwood School of Music"
                  fill
                  className="object-cover grayscale"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="bg-wsm-dark py-8" />
    </>
  );
}
