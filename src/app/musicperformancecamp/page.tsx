import Image from "next/image";
import Button from "@/components/Button";

export const metadata = {
  title: "Music Performance Camp",
  description:
    "Join our annual Music Performance Camp for ages 8-14. A fully immersive experience where students step into the life of a performing musician.",
};

const scheduleItems = [
  { time: "9:00", activity: "Drop Off + Warm Up + Bonding" },
  { time: "10:00", activity: "Music Education Workshops" },
  { time: "11:00", activity: "Band Rehearsal" },
  { time: "12:15", activity: "Lunch + Recess" },
  { time: "1:15", activity: "Instrument Sectionals" },
  { time: "2:30", activity: "Band Rehearsal" },
  { time: "3:30", activity: "Dismissal + Pickup" },
];

const sessionDates = [
  { label: "Session A", dates: "June 15th - June 19th" },
  { label: "Session B", dates: "June 22nd - June 26th" },
  { label: "Session C", dates: "July 6th - July 10th" },
  { label: "Session D", dates: "July 13th - July 17th" },
  { label: "Session E", dates: "July 20th - July 24th" },
  { label: "Session F", dates: "July 27th - July 31st" },
  { label: "Session G", dates: "August 3rd - August 7th" },
];

const faqItems = [
  {
    question: "Does my child need to have prior experience playing an instrument?",
    answer:
      "Absolutely not! The camp is for everyone regardless of skill level. Beginners and Advanced students alike will be placed in small groups with other musicians with similar levels of experience.",
  },
  {
    question: "Which instruments do you accept?",
    answer:
      "Students can enroll in voice, guitar, keyboard, bass, or drums for our Performance Camp.",
  },
  {
    question: "Does my child need an instrument to participate?",
    answer:
      "It is highly encouraged that your child has their own instrument to use in rehearsal and practice at home. If they do not, we are able to provide students with an instrument to use on a first-come first-served basis.",
  },
  {
    question: "Will there be a designated time for lunch between rehearsals?",
    answer:
      "We will have a designated lunch time to eat here at the school everyday at 12:15PM. Students are encouraged to bring their own lunch, but they can also order delivery if they prefer.",
  },
  {
    question: "Do you provide after care?",
    answer:
      "Yes! Our after care hours are from 3:30-5:00PM at a cost of $25 per day. Students can also take private lessons after camp sessions (separate program/cost).",
  },
  {
    question: "Where can I park?",
    answer:
      "A parking lot is available along the western wall of the school. Additional parking is available along 29th street and 13th ave.",
  },
  {
    question: "What is the cancelation policy?",
    answer:
      "Cancelations with at least 14 days (2 weeks) notice will receive a full refund on the deposit, 7-13 days cancelation notice will receive a 50% refund on the deposit, and 0-6 days cancelation notice will NOT receive a refund.",
  },
  {
    question: "How do I reserve a spot for my child?",
    answer:
      "In order to secure your child\u2019s spot in any session for summer camp, payment must be processed with a 50% deposit on the total price for the summer camp. The remaining balance will be charged to the card on file on the first day of each session reserved. Fill out our contact form below to sign up!",
  },
];

export default function MusicPerformanceCampPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-12 pb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-black text-white">
            Your Camp Experience
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Camp Details + Session Dates */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 md:gap-12">
            {/* Left Column - Camp Info */}
            <div className="w-full md:w-1/2">
              <div className="mb-6">
                <p className="font-body text-white font-bold text-lg">MUSIC PERFORMANCE CAMP</p>
                <p className="font-body text-white font-bold text-lg">9:00 AM - 3:30 PM</p>
                <p className="font-body text-white font-bold text-lg">AGES 8-14</p>
                <p className="font-body text-white font-bold text-lg">$425 PER WEEK</p>
              </div>

              <div className="mb-6">
                <p className="font-body text-white font-bold text-lg">
                  EARLY SIGN-UP DISCOUNT! $375 IF ENROLLED
                </p>
                <p className="font-body text-white font-bold text-lg">
                  BEFORE MAY 15TH, 2026
                </p>
              </div>

              <p className="font-body text-wsm-gray text-base leading-relaxed mb-6">
                Our all-level Music Performance Camp is a fully immersive experience
                where students step into the life of a performing musician. Campers are
                grouped into beginner and intermediate bands to ensure everyone gets
                the right mix of support and challenge.
              </p>

              <p className="font-body text-wsm-gray text-base leading-relaxed mb-6">
                Beginners will see rapid progress as they pick up an instrument for the
                first time, learning to play songs and perform with confidence.
                Intermediate musicians will take on new challenges that push their
                skills to the next level.
              </p>

              <p className="font-body text-wsm-gray text-base leading-relaxed">
                Each day includes guided band rehearsals, instrument sectionals,
                music theory and composition workshops, and engaging music
                education classes.
              </p>
            </div>

            {/* Right Column - Image + Session Dates */}
            <div className="w-full md:w-1/2">
              {/* Camp group photo */}
              <div className="relative w-full aspect-[4/3] mb-10">
                <Image
                  src="/images/camp/camp-hero.jpg"
                  alt="Wynwood School of Music students performing as a band on stage"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Session Dates */}
              <div>
                <h3 className="font-body text-white font-bold text-lg mb-4">
                  2026 SUMMER CAMP SESSION DATES:
                </h3>
                <div className="space-y-4">
                  {sessionDates.map((session) => (
                    <p key={session.label} className="font-body text-wsm-gray text-base">
                      {session.label} | {session.dates}
                    </p>
                  ))}
                </div>
                <p className="font-body text-wsm-gray text-base mt-6">
                  Final performances will be held on the Friday of each session{" "}
                  <span role="img" aria-label="sparkles">&#10024;</span>
                </p>
                <div className="mt-6">
                  <Button href="/contact">Save Your Spot!</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="bg-wsm-dark px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="md:w-1/2">
            <h3 className="font-body text-white font-bold text-lg uppercase mb-2">
              Daily Sample Schedule:
            </h3>
            <p className="font-body text-wsm-gray text-base italic mb-6">
              Every camp week ends with a high-energy performance where all bands take the stage
            </p>

            <div className="space-y-2">
              {scheduleItems.map((item) => (
                <p key={item.time} className="font-body text-wsm-gray text-base">
                  <span className="font-bold text-white">{item.time}</span> - {item.activity}
                </p>
              ))}
            </div>

            <div className="mt-6">
              <p className="font-body text-wsm-gray text-base">
                <span className="font-bold text-white">*3:30-5:00</span> - Aftercare
              </p>
              <p className="font-body text-wsm-gray text-base italic">
                *Available for an additional fee of $25/day
              </p>
            </div>

            <div className="mt-8">
              <Button href="/contact">Save Your Spot!</Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* FAQ Section */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl uppercase font-black text-white mb-4">
            Answers To All Your Questions
          </h2>
          <hr className="border-wsm-gray-dark mb-10" />

          <div className="flex flex-col md:flex-row gap-10 md:gap-12">
            {/* FAQ List */}
            <div className="w-full md:w-1/2">
              <div className="space-y-8">
                {faqItems.map((faq) => (
                  <div key={faq.question}>
                    <p className="font-body text-white font-bold text-base mb-2">
                      {faq.question}
                    </p>
                    <p className="font-body text-wsm-gray text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Images */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src="/images/camp/camp-faq-2.jpg"
                  alt="Campers performing live on stage"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative w-full aspect-[3/2]">
                <Image
                  src="/images/camp/camp-faq-3.webp"
                  alt="Campers at Wynwood School of Music summer camp"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative w-full aspect-[2/1]">
                <Image
                  src="/images/camp/camp-faq-1.jpg"
                  alt="Young camper learning keyboard with an instructor"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center mt-12">
            <Button href="/contact">Save Your Spot!</Button>
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="bg-wsm-dark py-8" />
    </>
  );
}
