export const metadata = {
  title: "Thank You — Trial Lesson Confirmed",
  description:
    "Your free trial lesson request has been received. Here's exactly what to expect from the Wynwood School of Music team.",
  robots: { index: false, follow: true },
};

const nextSteps = [
  {
    n: "1)",
    title: "We Call You",
    body: "You’ll get a quick call from our team during business hours to match you with an instructor and schedule your trial.",
  },
  {
    n: "2)",
    title: "We Reserve Your Spot",
    body: "We’ll place a card on file — no charge unless you no-show or choose to continue.",
  },
  {
    n: "3)",
    title: "You Come Play Music",
    body: "Bring nothing but yourself. You’ll walk out with a song plan, lesson notes, and a smile.",
  },
];

export default function YourTrialPage() {
  return (
    <>
      {/* Heading */}
      <section className="bg-wsm-dark px-4 pt-10 md:pt-14 pb-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-black text-white leading-tight">
            Thank You
          </h1>
        </div>
      </section>

      {/* Next steps */}
      <section className="bg-wsm-dark px-4 pb-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-xl md:text-2xl uppercase font-black text-white mb-6">
            What Happens After You Sign Up?
          </h2>

          <div className="space-y-5 max-w-3xl">
            {nextSteps.map((s) => (
              <div key={s.n}>
                <p className="font-body text-white text-base font-bold">
                  {s.n} {s.title}
                </p>
                <p className="font-body text-wsm-gray text-base leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <hr className="border-wsm-gray-dark mt-10" />
        </div>
      </section>

      {/* Contact + Map */}
      <section className="bg-wsm-dark px-4 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <div>
            <h3 className="font-heading text-lg uppercase font-black text-white mb-5">
              Contact Us
            </h3>
            <p className="font-body text-white text-sm font-bold uppercase tracking-wide">
              Wynwood School of Music
            </p>
            <p className="font-body text-wsm-gray text-sm leading-relaxed mt-2">
              1260 NW 29th St. Suite 103
              <br />
              Miami, FL 33142
            </p>
            <p className="font-body text-wsm-gray text-sm mt-4">
              305-359-5515
            </p>
            <p className="font-body text-wsm-gray text-sm mt-1">
              info@wynwoodschoolofmusic.com
            </p>
          </div>

          <div className="relative w-full aspect-[4/3]">
            <iframe
              title="Map to Wynwood School of Music"
              src="https://www.google.com/maps?q=1260+NW+29th+St+Unit+103,+Miami,+FL+33142&output=embed"
              loading="lazy"
              className="absolute inset-0 w-full h-full border-0"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </>
  );
}
