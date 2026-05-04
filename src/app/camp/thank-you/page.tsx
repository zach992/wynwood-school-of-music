import Button from "@/components/Button";

export const metadata = {
  title: "Deposit Received — Summer Camp",
  description:
    "Your camp deposit has been received. We'll be in touch with next steps and the balance invoice.",
};

export default function CampDepositThankYouPage() {
  return (
    <>
      <section className="bg-wsm-dark px-4 pt-16 md:pt-24 pb-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-6xl uppercase font-black text-white leading-tight">
            You&rsquo;re In!
          </h1>
          <p className="font-body text-wsm-yellow uppercase tracking-widest text-sm mt-4">
            Deposit Received · Spot Reserved
          </p>
        </div>
      </section>

      <section className="bg-wsm-dark px-4 pb-12 md:pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed">
            Thanks for reserving your camper&rsquo;s spot. Your 50% deposit is
            in, and a confirmation receipt is on its way to your email.
          </p>
          <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed mt-4">
            We&rsquo;ll email an invoice for the remaining balance before camp
            begins, along with a welcome packet covering drop-off, what to
            bring, and the showcase performance schedule.
          </p>
          <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed mt-4">
            Questions in the meantime? Reach out anytime.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Button href="/musicperformancecamp">Camp Details</Button>
            <Button href="/" variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </section>

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
          <p className="font-body text-wsm-gray text-sm mt-4">305-359-5515</p>
          <p className="font-body text-wsm-gray text-sm">
            info@wynwoodschoolofmusic.com
          </p>
        </div>
      </section>
    </>
  );
}
