import Image from "next/image";
import Button from "@/components/Button";

export const metadata = {
  title: "Private Music Lessons in Miami — Guitar, Piano, Drums, Voice & More",
  description:
    "Private music lessons for all ages in Miami — guitar, piano, drums, voice, bass, saxophone, violin and more. One-on-one instruction with professional musicians in Wynwood.",
  alternates: { canonical: "/private-lessons" },
};

export default function PrivateLessonsPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-12 pb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-black text-white">
            Private Lessons
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-black text-white mb-6">
            Learn. Grow. Perform.
          </h2>
          <p className="font-body text-wsm-gray text-base leading-relaxed">
            Students of all ages take private music lessons one on one with
            professional musicians in Miami&rsquo;s Wynwood Art District. We
            teach guitar, piano, drums, voice, bass, saxophone, violin, and
            more &mdash; building the skills and confidence that lead to real
            performances and playing with others. As students grow, lessons
            naturally open the door to bands, recitals, and live shows. Each
            lesson helps turn practice into real musical experiences on stage
            and beyond.
          </p>
        </div>
      </section>

      {/* Instruments We Teach */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-black text-white mb-8">
            Instruments We Teach
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Guitar Lessons", desc: "Acoustic, electric, classical." },
              { name: "Piano & Keyboard", desc: "Classical, pop, jazz, theory." },
              { name: "Drum Lessons", desc: "Rock, jazz, Latin, fundamentals." },
              { name: "Voice Lessons", desc: "Pop, musical theater, classical." },
              { name: "Bass Lessons", desc: "Electric & upright, all genres." },
              { name: "Saxophone", desc: "Jazz, classical, contemporary." },
              { name: "Strings", desc: "Violin, viola, and cello." },
              { name: "Music Production", desc: "Songwriting & recording." },
            ].map((i) => (
              <div
                key={i.name}
                className="border border-wsm-gray-dark rounded p-4 md:p-5"
              >
                <h3 className="font-heading text-sm md:text-base uppercase font-black text-white mb-1 tracking-wide">
                  {i.name}
                </h3>
                <p className="font-body text-wsm-gray text-xs md:text-sm leading-snug">
                  {i.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="font-body text-wsm-gray text-sm leading-relaxed mt-6 italic">
            Don&rsquo;t see your instrument? Reach out &mdash; our team of
            instructors covers a wide range of styles and instruments.
          </p>
        </div>
      </section>

      {/* Testimonial Quote Block */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 items-stretch">
            <div className="md:col-span-5 relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
              <Image
                src="/images/private-lessons/sax.webp"
                alt="Saxophonist performing at the Wynwood School of Music"
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="md:col-span-7 bg-wsm-accent/85 p-8 md:p-12 flex items-center">
              <p className="font-body text-white text-lg md:text-xl italic font-bold leading-relaxed">
                &ldquo;Private lessons helped me reconnect with music in a way I
                never had time for before. The progress has been real and
                surprisingly fast.&rdquo;
              </p>
            </div>
          </div>

          {/* Sign Up Button */}
          <div className="flex justify-center mt-10">
            <Button href="/contact">Sign Up</Button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Private Lesson Pillars */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-black text-white mb-8">
            Private Lesson Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text */}
            <div className="space-y-8">
              <div>
                <h3 className="font-body text-xl font-semibold text-white mb-4">
                  1. Youth Private Lessons
                </h3>
                <p className="font-body text-wsm-gray text-base leading-relaxed">
                  Personal one on one instruction designed for young musicians at
                  every stage. Lessons focus on building strong fundamentals,
                  confidence, and creativity while supporting each student&apos;s
                  individual interests and pace of growth.
                </p>
              </div>

              <div>
                <h3 className="font-body text-xl font-semibold text-white mb-4">
                  2. Adult Private Lessons
                </h3>
                <p className="font-body text-wsm-gray text-base leading-relaxed">
                  Private lessons built around your goals, schedule, and musical
                  interests. Whether you are returning to music or starting for
                  the first time, our instructors help adults build skills, deepen
                  understanding, and enjoy the process of making music.
                </p>
              </div>
            </div>

            {/* Image — landscape keyboard student */}
            <div className="relative w-full aspect-[3/2]">
              <Image
                src="/images/private-lessons/pillars-keyboard.webp"
                alt="Young pianist focused at the keyboard during a private lesson"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Measured Achievement */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Heading + intro + pillar list, all wrapped inside the left column */}
            <div className="space-y-5">
              <h2 className="font-heading text-2xl md:text-3xl uppercase font-black text-white mb-2">
                Measured Achievement in Private Lessons
              </h2>
              <p className="font-body text-wsm-gray text-base leading-relaxed">
                At Wynwood School of Music, private lessons aren&apos;t just
                about learning songs&mdash;they&apos;re about real, measurable
                growth. Every lesson follows a clear structure designed to help
                each student progress at their own pace while building a strong
                musical foundation.
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed">
                <span className="italic font-bold text-white">1. Technique:</span>{" "}
                Think of this as training for your fingers, hands, and ears. We
                focus on warm-ups, scales, arpeggios, and speed drills to build
                coordination, control, and confidence.
              </p>

              <p className="font-body text-wsm-gray text-base leading-relaxed">
                <span className="italic font-bold text-white">
                  2. Music Literacy:
                </span>{" "}
                Music is a language, and fluency matters. We blend reading,
                theory, and ear training based on your goals&mdash;whether
                you&apos;re preparing for auditions or just want to better
                understand what you&apos;re playing.
              </p>

              <p className="font-body text-wsm-gray text-base leading-relaxed">
                <span className="italic font-bold text-white">3. Repertoire:</span>{" "}
                Together, we build a set of songs that inspire and challenge you.
                From classic rock to jazz, pop, or originals, we focus on music
                that brings your skills to life.
              </p>

              <p className="font-body text-wsm-gray text-base leading-relaxed">
                <span className="font-bold text-white">
                  Recitals &amp; Performances:
                </span>{" "}
                Each semester includes check-ins, personalized feedback, and an
                optional recital to showcase your growth. Whether it&apos;s your
                first performance or a polished piece, these moments mark how far
                you&apos;ve come&mdash;and where you&apos;re going next.
              </p>
            </div>

            {/* Image — portrait performer */}
            <div className="relative w-full aspect-[4/5]">
              <Image
                src="/images/private-lessons/achievement-singing.webp"
                alt="Young performer singing on stage at a Wynwood School of Music recital"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sign Up CTA */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto flex justify-center">
          <Button href="/contact">Sign Up</Button>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="bg-wsm-dark py-8" />
    </>
  );
}
