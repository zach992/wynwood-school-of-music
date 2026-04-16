import Button from "@/components/Button";

export const metadata = {
  title: "Private Lessons | Wynwood School of Music",
  description:
    "Private music lessons for all ages at the Wynwood School of Music. One-on-one instruction with professional musicians in Miami's Wynwood Art District.",
};

export default function PrivateLessonsPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-12 pb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-bold text-white">
            Private Lessons
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold text-white mb-6">
            Learn. Grow. Perform.
          </h2>
          <p className="font-body text-wsm-gray text-base leading-relaxed">
            Students of all ages work one on one with professional musicians to
            build skills and confidence that lead to real performances and
            playing with others. As students grow, lessons naturally open the
            door to bands, recitals, and live shows. Each lesson helps turn
            practice into real musical experiences on stage and beyond.
          </p>
        </div>
      </section>

      {/* Testimonial Quote Block */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-end">
            <div className="w-full md:w-3/5 bg-wsm-accent/85 p-8 md:p-12">
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
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold text-white mb-8">
            Private Lesson Pillars
          </h2>

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
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Measured Achievement */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold text-white mb-6">
            Measured Achievement in Private Lessons
          </h2>
          <p className="font-body text-wsm-gray text-base leading-relaxed mb-8">
            At Wynwood School of Music, private lessons aren&apos;t just about
            learning songs&mdash;they&apos;re about real, measurable growth.
            Every lesson follows a clear structure designed to help each student
            progress at their own pace while building a strong musical
            foundation.
          </p>

          <div className="space-y-6">
            <div>
              <p className="font-body text-white text-base mb-1">
                <span className="italic font-bold">1. Technique:</span>
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed">
                Think of this as training for your fingers, hands, and ears. We
                focus on warm-ups, scales, arpeggios, and speed drills to build
                coordination, control, and confidence.
              </p>
            </div>

            <div>
              <p className="font-body text-white text-base mb-1">
                <span className="italic font-bold">2. Music Literacy:</span>
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed">
                Music is a language, and fluency matters. We blend reading,
                theory, and ear training based on your goals&mdash;whether
                you&apos;re preparing for auditions or just want to better
                understand what you&apos;re playing.
              </p>
            </div>

            <div>
              <p className="font-body text-white text-base mb-1">
                <span className="italic font-bold">3. Repertoire:</span>
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed">
                Together, we build a set of songs that inspire and challenge you.
                From classic rock to jazz, pop, or originals, we focus on music
                that brings your skills to life.
              </p>
            </div>

            <div>
              <p className="font-body text-white text-base mb-1">
                <span className="font-bold">Recitals & Performances:</span>
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed">
                Each semester includes check-ins, personalized feedback, and an
                optional recital to showcase your growth. Whether it&apos;s your
                first performance or a polished piece, these moments mark how far
                you&apos;ve come&mdash;and where you&apos;re going next.
              </p>
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
