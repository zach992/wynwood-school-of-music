import Image from "next/image";
import Button from "@/components/Button";

export const metadata = {
  title: "Programs & Pricing | Wynwood School of Music",
  description:
    "Explore private lessons and band programs at the Wynwood School of Music. Led by professional musicians in Miami's Wynwood Art District.",
};

export default function ProgramsAndPricingPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-12 pb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-bold text-white">
            Programs & Pricing
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold text-white mb-6">
            Learn From Professional Musicians
          </h2>
          <p className="font-body text-wsm-gray text-base leading-relaxed mb-6">
            At the Wynwood School of Music, we focus on two core experiences:
            Private Lessons and Band Programs.
          </p>
          <p className="font-body text-wsm-gray text-base leading-relaxed">
            Led by nationally recognized performers, our programs help students
            grow as musicians, collaborators, and confident performers. Whether
            you&apos;re taking your first lesson or preparing to take the stage,
            we meet you where you are&mdash;and help you grow every step of the
            way.
          </p>
        </div>
      </section>

      {/* Testimonial Quote Block */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full overflow-hidden rounded">
            {/* Background image */}
            <div className="relative w-full aspect-[16/9]">
              <Image
                src="/images/programs/testimonial-bg.png"
                alt="Musician performing on stage"
                fill
                className="object-cover"
              />
              {/* Overlay with quote - positioned on right half */}
              <div className="absolute inset-0 flex items-center justify-end">
                <div className="w-full md:w-1/2 bg-wsm-accent/85 p-8 md:p-12 h-full flex flex-col justify-center">
                  <p className="font-body text-white text-lg md:text-xl italic font-bold leading-relaxed mb-4">
                    &ldquo;Every lesson feels like unlocking a new chapter of
                    skills, taking lessons has helped me improve so much as a
                    musician in such a short amount of time.&rdquo;
                  </p>
                  <p className="font-body text-white/80 text-sm">
                    Micaela Godoy, Bass
                  </p>
                </div>
              </div>
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

      {/* Program Pillars */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold text-white mb-8">
            Program Pillars
          </h2>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Text content */}
            <div className="w-full md:w-1/2">
              <h3 className="font-body text-xl font-semibold text-white mb-4">
                1. Private Lessons
              </h3>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-8">
                One-on-one instruction tailored to your goals, experience level,
                and musical style. Our professional musicians work closely with
                students to build a strong foundation, explore personal
                interests, and unlock their full potential.
              </p>

              <h3 className="font-body text-xl font-semibold text-white mb-4">
                2. Band Programs
              </h3>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-4">
                We believe music is meant to be shared. Our 90-minute weekly
                Band Programs pair students with peers of similar age and skill
                level to form real bands that rehearse, write, and perform
                together.
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-4">
                Whether you&apos;re just starting out or ready to take the
                stage, there&apos;s a band for you.
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed">
                Note: Band students must also be enrolled in private lessons to
                support their individual growth.
              </p>
            </div>

            {/* Image */}
            <div className="w-full md:w-1/2">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src="/images/programs/drum-lessons.jpg"
                  alt="Child playing drums at Wynwood School of Music"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Pricing Section */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
            {/* Private Lessons Column */}
            <div className="text-center">
              <h3 className="font-heading text-2xl md:text-3xl uppercase font-bold text-white mb-8">
                Private Lessons
              </h3>

              <p className="font-body text-white font-bold text-lg mb-1">
                Ages 6+*
              </p>
              <p className="font-body text-wsm-gray italic text-sm mb-6">
                *&lt;6 years old at teacher&apos;s discretion
              </p>

              <div className="font-body text-wsm-gray text-base space-y-1 mb-6">
                <p>90 Minutes, 1x/Week | $410 Per Month</p>
                <p>60 Minutes, 1x/Week | $290 Per Month</p>
                <p>45 Minutes, 1x/Week | $250 Per Month</p>
                <p>30 Minutes, 1x/Week | $210 Per Month</p>
              </div>

              <p className="font-body text-white font-bold text-base mb-2">
                Instruments:
              </p>
              <div className="font-body text-wsm-gray text-base space-y-1">
                <p>Bass, Cello, Drums, Guitar</p>
                <p>Keyboard, Music Production</p>
                <p>Music Theory, Saxophone</p>
                <p>Songwriting, Trumpet, Ukulele</p>
                <p>Viola, Violin, Voice</p>
              </div>
            </div>

            {/* Band Programs Column */}
            <div className="text-center">
              <h3 className="font-heading text-2xl md:text-3xl uppercase font-bold text-white mb-8">
                Band Programs
              </h3>

              <p className="font-body text-white font-bold text-lg mb-1">
                Ages 7+*
              </p>
              <p className="font-body text-wsm-gray italic text-sm mb-6">
                *Placement based on age + skill level
              </p>

              <div className="font-body text-wsm-gray text-base space-y-1 mb-6">
                <p>90 Minutes, 1x/Week | $195 Per Month</p>
                <p>*Private Lessons Required</p>
              </div>

              <p className="font-body text-white font-bold text-base mb-2">
                Genres:
              </p>
              <div className="font-body text-wsm-gray text-base mb-6">
                <p>Rock, Pop, Jazz, Funk, Soul</p>
              </div>

              <p className="font-body text-white font-bold text-base mb-2">
                Levels:
              </p>
              <div className="font-body text-wsm-gray text-base space-y-1">
                <p>Rock Ambassadors (Advanced)</p>
                <p>Rock Legends (Intermediate)</p>
                <p>Rising Stars (Beginner)</p>
                <p>Rock Juniors (Intro)</p>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row justify-around items-center gap-6 mt-12">
            <Button href="#">Calendar + Pricing</Button>
            <Button href="#">Payment + Cancellation Policies</Button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Final Sign Up */}
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
