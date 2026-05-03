import Image from "next/image";
import TrialLessonForm from "@/components/TrialLessonForm";

export const metadata = {
  title: "Play Your First Song in 30 Days — Guaranteed",
  description:
    "Try a free private music lesson at Wynwood School of Music. Expert instructors, flexible times, and an easy plan to get you playing music you love.",
};

const benefits = [
  "A 30-minute private lesson with a professional music instructor",
  "Use of an instrument during your lesson — no need to bring your own",
  "A personalized “First Song” plan tailored to your goals",
  "Lesson notes sent after your session to help you keep practicing",
  "No commitment. No payment. Just music.",
];

const faqs = [
  {
    q: "Is the trial really free?",
    a: "Yes — no pressure, no payment. We place a card on file to reserve your time, but you won’t be charged unless you miss your lesson or choose to continue.",
  },
  {
    q: "What if I've never played music before?",
    a: "Perfect — most of our students start from zero. Your teacher will guide you step-by-step and make sure you leave the lesson feeling confident and excited.",
  },
  {
    q: "Do I need my own instrument?",
    a: "Not for the trial — we’ll provide one when you come in. If you decide to keep going, we strongly recommend getting your own so you can practice at home and progress faster. (We’ll help you choose the right one when you’re ready.)",
  },
  {
    q: "Can I choose the genre of music I learn?",
    a: "Absolutely. Whether it’s pop, jazz, rock, classical, or something else — we build your lessons around your taste and goals.",
  },
  {
    q: "What ages do you teach?",
    a: "We work with kids (age 6+), teens, and adults of all experience levels. It’s never too early — or too late — to start playing music.",
  },
];

const testimonials = [
  {
    quote:
      "Wynwood’s private lessons shaped me into a more confident musician and a stronger performer.",
    attribution: "Student | Guitar",
  },
  {
    quote:
      "Wynwood gave our son the confidence to try new instruments, take musical risks, and grow as a young musician. He started with drums and now plays bass too!",
    attribution: "Parent | Drums + Bass",
  },
  {
    quote:
      "I was shy about singing in front of others. Wynwood’s voice lessons helped me build real confidence to perform — and enjoy it!",
    attribution: "Student | Voice",
  },
];

const nextSteps = [
  {
    n: "1",
    title: "We Call You",
    body: "You’ll get a quick call from our team during business hours to match you with an instructor and schedule your trial.",
  },
  {
    n: "2",
    title: "We Reserve Your Spot",
    body: "We’ll place a card on file — no charge unless you no-show or choose to continue.",
  },
  {
    n: "3",
    title: "You Come Play Music",
    body: "Bring nothing but yourself. You’ll walk out with a song plan, lesson notes, and a smile.",
  },
];

export default function TrialMusicLessonPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-wsm-dark px-4 pt-10 md:pt-14 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase font-black text-white leading-[1.05]">
              Play Your First Song in 30 Days&mdash;Guaranteed.
            </h1>
            <p className="font-body text-wsm-gray text-base leading-relaxed mt-6">
              Try a free private music lesson at Wynwood School of Music
              &mdash; with expert instructors, flexible times, and an easy plan
              to get you playing music you love.
            </p>
            <p className="font-body text-white text-base font-semibold leading-relaxed mt-4">
              Our First Song Formula&trade; helps beginners play real songs
              faster than they thought possible &mdash; without skipping
              fundamentals.
            </p>
            <div className="mt-8">
              <a
                href="#signup"
                className="inline-block rounded-full bg-wsm-accent text-white px-10 py-3 text-sm font-black uppercase tracking-wider hover:bg-wsm-accent-hover transition-colors"
              >
                Claim Your Free Trial Lesson
              </a>
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] md:aspect-[4/5] overflow-hidden">
            <Image
              src="/images/private-lessons/pillars-keyboard.webp"
              alt="Young musician playing at the Wynwood School of Music"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-wsm-dark px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-black text-white mb-6">
            Here&rsquo;s What You Get With Your Free Trial Lesson:
          </h2>
          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="text-wsm-accent text-lg leading-6 shrink-0"
                >
                  &#10003;
                </span>
                <span className="font-body text-wsm-gray text-base leading-relaxed">
                  {b}
                </span>
              </li>
            ))}
          </ul>
          <p className="font-body text-wsm-gray text-sm leading-relaxed mt-6 italic">
            After your trial, we&rsquo;ll show you what it looks like to
            continue with weekly lessons &mdash; no pressure, just next steps if
            you&rsquo;re ready to keep playing.
          </p>
          <div className="mt-8 text-center">
            <a
              href="#signup"
              className="inline-block rounded-full bg-wsm-accent text-white px-10 py-3 text-sm font-black uppercase tracking-wider hover:bg-wsm-accent-hover transition-colors"
            >
              Claim Your Free Trial Lesson
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t) => (
            <blockquote
              key={t.attribution}
              className="border-l-4 border-wsm-accent pl-4"
            >
              <p className="font-body text-wsm-gray text-base italic leading-relaxed mb-3">
                &ldquo;{t.quote}&rdquo;
              </p>
              <cite className="font-body text-wsm-gray-dark text-xs not-italic uppercase tracking-wider">
                &mdash; {t.attribution}
              </cite>
            </blockquote>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* FAQ */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl uppercase font-black text-white mb-8">
            FAQ&rsquo;s
          </h2>
          <div className="divide-y divide-wsm-gray-dark border-y border-wsm-gray-dark">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer">
                  <span className="font-heading text-base md:text-lg uppercase font-black text-white tracking-wide">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-wsm-accent text-2xl leading-none transition-transform group-open:rotate-45 ml-4 shrink-0"
                  >
                    +
                  </span>
                </summary>
                <p className="font-body text-wsm-gray text-base leading-relaxed mt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Sign-up section */}
      <section
        id="signup"
        className="bg-wsm-dark px-4 py-12 md:py-16 scroll-mt-24"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl uppercase font-black text-white mb-4">
            Ready to Play Your First Song? Let&rsquo;s Make It Happen.
          </h2>
          <p className="font-body text-wsm-gray text-base leading-relaxed mb-10">
            Just fill out the form below and we&rsquo;ll call you to schedule
            your free trial lesson.
          </p>
          <TrialLessonForm />
        </div>
      </section>

      {/* What happens after */}
      <section className="bg-wsm-darker px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-black text-white text-center mb-10">
            What Happens After You Sign Up?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {nextSteps.map((s) => (
              <div key={s.n} className="text-center md:text-left">
                <p className="font-heading text-5xl md:text-6xl text-wsm-accent font-black leading-none mb-3">
                  {s.n}
                </p>
                <h3 className="font-heading text-lg uppercase font-black text-white mb-2">
                  {s.title}
                </h3>
                <p className="font-body text-wsm-gray text-sm leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
