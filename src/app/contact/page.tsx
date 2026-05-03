import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us",
  description:
    "Sign up for private music lessons or band programs at the Wynwood School of Music in Miami. Contact us today to start your musical journey.",
};

export default function ContactPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-10 md:pt-14 pb-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase font-bold text-white leading-tight">
            Start Your Musical Journey Today
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Two-column layout */}
      <section className="bg-wsm-dark px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
          {/* Left column — Intro + Form */}
          <div>
            {/* Intro Text */}
            <div className="mb-8">
              <p className="font-body text-wsm-gray text-sm leading-relaxed mb-4">
                If you or your child is interested in signing up for a private
                lesson or band program, please fill out the form below and our
                team will contact you within 24 hours.
              </p>
              <p className="font-body text-wsm-gray text-sm leading-relaxed">
                Please note: Private lessons may be taken in-person or
                virtually. Band rehearsals take place in-person here at the
                school.
              </p>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>

          {/* Right column — Contact Info + Photos */}
          <div>
            {/* Contact Info */}
            <div className="mb-8">
              <h2 className="font-heading text-2xl uppercase font-bold text-white mb-6">
                Contact Us
              </h2>

              <div className="space-y-5">
                <div>
                  <p className="font-body text-white text-sm font-bold">
                    WYNWOOD SCHOOL OF MUSIC
                  </p>
                  <p className="font-body text-wsm-gray text-sm leading-relaxed">
                    1260 NW 29th St. Unit 103
                    <br />
                    Miami, FL 33142
                  </p>
                </div>

                <div>
                  <p className="font-body text-white text-sm font-bold">
                    PHONE NUMBER
                  </p>
                  <p className="font-body text-wsm-gray text-sm">
                    305-359-5515
                  </p>
                </div>

                <div>
                  <p className="font-body text-white text-sm font-bold">
                    EMAIL
                  </p>
                  <p className="font-body text-wsm-gray text-sm">
                    info@wynwoodschoolofmusic.com
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Photos */}
            <div className="space-y-4">
              <div className="relative w-full aspect-[2/3] overflow-hidden">
                <Image
                  src="/images/contact/performance-1.webp"
                  alt="Adult music lessons at Wynwood School of Music"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 320px, 100vw"
                />
              </div>
              <div className="relative w-full aspect-[2/3] overflow-hidden">
                <Image
                  src="/images/contact/performance-2.webp"
                  alt="Youth music lessons at Wynwood School of Music"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 320px, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
