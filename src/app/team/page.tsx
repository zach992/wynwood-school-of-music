import Image from "next/image";
import Button from "@/components/Button";
import TeamMemberCard from "@/components/TeamMemberCard";
import { teamBios } from "@/lib/team-bios";

export const metadata = {
  title: "Team",
  description:
    "Meet the team behind Wynwood School of Music — founders Zach Larmer and Sammy Gonzalez Zeira, plus our world-class instructors.",
};

const instructors = [
  { name: "Leo Cattani", role: "Keyboard, Trumpet, Music Theory", imageSrc: "/images/team/leo-cattani.png", slug: "leo-cattani" },
  { name: "Alex Ibanez", role: "Drums, Percussion", imageSrc: "/images/team/alex-ibanez.png", slug: "alex-ibanez" },
  { name: "Vale Pe\u00f1aranda", role: "Voice, Keyboard, Music Production, Songwriting", imageSrc: "/images/team/vale-penaranda.jpg", slug: "vale-penaranda" },
  { name: "Augusto Di Catarina", role: "Voice, Guitar, Bass, Keyboard, Ukulele", imageSrc: "/images/team/augusto-di-catarina.png", slug: "augusto-di-catarina" },
  { name: "Renzo Vargas", role: "Drums, Percussion", imageSrc: "/images/team/renzo-vargas.png", slug: "renzo-vargas" },
  { name: "Angel Perez", role: "Keyboard, Music Theory", imageSrc: "/images/team/angel-perez.jpg", slug: "angel-perez" },
  { name: "Yamil Granda", role: "Bass, Guitar", imageSrc: "/images/team/yamil-granda.jpg", slug: "yamil-granda" },
  { name: "Patricio Acevedo", role: "Strings (Violin, Viola, Cello)", imageSrc: "/images/team/patricio-acevedo.png", slug: "patricio-acevedo" },
  { name: "Sergio Zavala", role: "Guitar", imageSrc: "/images/team/sergio-zavala.png", slug: "sergio-zavala" },
  { name: "AJ Hill", role: "Saxophone, Voice, Drums", imageSrc: "/images/team/aj-hill.png", slug: "aj-hill" },
  { name: "Jake Mongin", role: "Guitar, Music Theory", imageSrc: "/images/team/jake-mongin.png", slug: "jake-mongin" },
  { name: "Nestor Rigaud", role: "Guitar, Bass, Music Production", imageSrc: "/images/team/nestor-rigaud.png", slug: "nestor-rigaud" },
];

const bioSlugs = new Set(
  teamBios.filter((b) => b.bioParagraphs.length > 0).map((b) => b.slug)
);

export default function TeamPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-12 pb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-bold text-white">
            Team
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Subheading */}
      <section className="bg-wsm-dark px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-xl md:text-2xl uppercase font-bold text-white leading-snug">
            With a Combined 30+ Years of Educational Experience, Zach and Sammy
            Have Dedicated Their Lives to Building Miami&apos;s Music Community
          </h2>
        </div>
      </section>

      {/* Founders Section */}
      <section className="bg-wsm-dark px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Founder Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="relative w-full aspect-[4/5] bg-wsm-darker overflow-hidden">
              <Image
                src="/images/team/zach-larmer.png"
                alt="Zach Larmer, Founder"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative w-full aspect-[4/5] bg-wsm-darker overflow-hidden">
              <Image
                src="/images/team/sammy-gonzalez.jpg"
                alt="Sammy Gonzalez Zeira, Founder"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Founder Bios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Zach */}
            <div>
              <h3 className="font-heading text-xl md:text-2xl uppercase font-bold text-white mb-6">
                Zach Larmer, Founder
              </h3>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-4">
                Zach is an internationally acclaimed jazz musician and educator.
                As a performer and composer, Zach has received three GRAMMY
                awards and embarked on numerous world tours. He has had the
                chance to work alongside artists such as Pat Metheny, John
                Scofield, and The Steve Miller Band. Zach is also the guitarist
                on American Dreamers: Voices of Hope and Freedom, an album that
                gained bi-partisan support in the United States House and Senate
                for its advocacy of citizenship for DACA recipients.
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed">
                As a music educator over the last 13 years, Zach has focused on
                creating an infrastructure for musicians to support their growth
                as they transform into phenomenal artists.
              </p>
            </div>

            {/* Sammy */}
            <div>
              <h3 className="font-heading text-xl md:text-2xl uppercase font-bold text-white mb-6">
                Sammy Gonzalez Zeira, Founder
              </h3>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-4">
                Sammy Gonzalez Zeira is the CEO and Founder of the non-profit
                Young Musicians Unite, where he has personally raised over $30
                million to expand access to music education. Under his
                leadership, YMU ensures that every student in Miami-Dade has the
                opportunity to learn music, regardless of socioeconomic
                background. Today, the organization serves more than 12,000
                students across 75 schools and has reached over 36,000 students
                since its founding in 2013.
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-4">
                In addition to leading YMU, Sammy serves as Director of the
                Miami Beach Senior High School Rock Ensemble. Founded in 1972 by
                the late Doug Burris, the Rock Ensemble was the first
                school-based group of its kind in the US.
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed">
                An educator since 2004, Sammy has guided countless students to
                success, with alumni earning acceptance to prestigious
                institutions such as the New World School of the Arts,
                Juilliard, Harvard, NYU, Georgetown, Cornell, Vanderbilt, and
                Penn State.
              </p>
            </div>
          </div>

          {/* Centered View Programs button */}
          <div className="flex justify-center mt-12">
            <Button href="/programs-and-pricing">View Programs</Button>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl uppercase font-bold text-white mb-12">
            Instructors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
            {instructors.map((instructor) => {
              const hasBio = bioSlugs.has(instructor.slug);
              return (
                <TeamMemberCard
                  key={instructor.slug}
                  name={instructor.name}
                  role={instructor.role}
                  imageSrc={instructor.imageSrc}
                  buttonLabel={hasBio ? `About ${instructor.name.split(" ")[0]}` : undefined}
                  buttonHref={hasBio ? `/team/${instructor.slug}` : undefined}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="bg-wsm-dark py-8" />
    </>
  );
}
