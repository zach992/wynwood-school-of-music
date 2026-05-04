import Button from "@/components/Button";

export const metadata = {
  title: "Thank You",
  description:
    "Your inquiry has been received. Here's what to expect next from the Wynwood School of Music team.",
  robots: { index: false, follow: true },
};

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

export default function ThankYouPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-wsm-dark px-4 pt-16 md:pt-24 pb-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-7xl uppercase font-black text-white leading-tight">
            Thank You
          </h1>
          <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed mt-6 max-w-2xl mx-auto">
            Your information is on its way to our team. We&rsquo;ll be in
            touch shortly to get you set up.
          </p>
        </div>
      </section>

      {/* What happens next */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-black text-white text-center mb-10">
            Here&rsquo;s What Will Happen Next:
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

          <div className="flex justify-center mt-12">
            <Button href="/">Back to Home</Button>
          </div>
        </div>
      </section>

      {/* Contact card */}
      <section className="bg-wsm-darker px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-heading text-xl uppercase font-black text-white mb-4">
            Wynwood School of Music
          </h3>
          <p className="font-body text-wsm-gray text-sm leading-relaxed">
            1260 NW 29th St. Unit 103
            <br />
            Wynwood, Miami, FL 33142
          </p>
          <p className="font-body text-wsm-gray text-sm mt-4">
            305-359-5515
          </p>
          <p className="font-body text-wsm-gray text-sm">
            info@wynwoodschoolofmusic.com
          </p>
        </div>
      </section>
    </>
  );
}
