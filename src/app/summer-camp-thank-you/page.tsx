import Button from "@/components/Button";

export const metadata = {
  title: "Thanks for Signing Up — Summer Camp",
  description:
    "Your summer camp signup has been received. Our team will reach out within 2 business days.",
  robots: { index: false, follow: true },
};

export default function SummerCampThankYouPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-wsm-dark px-4 pt-16 md:pt-24 pb-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-6xl uppercase font-black text-white leading-tight">
            Thanks for Signing Up!
          </h1>
        </div>
      </section>

      {/* Body copy */}
      <section className="bg-wsm-dark px-4 pb-12 md:pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed">
            Your information has been sent to our team. We will reach out to
            you within 2 business days to touch base and answer any questions
            you may have about summer camp. We&rsquo;re excited to have your
            child begin their musical journey with us. Please don&rsquo;t
            hesitate to contact us in the meantime with any questions or
            concerns.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Button href="/musicperformancecamp">Camp Details</Button>
            <Button href="/" variant="outline">
              Back to Home
            </Button>
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
