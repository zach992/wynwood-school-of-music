import Image from "next/image";
import CampSignupForm from "@/components/CampSignupForm";

export const metadata = {
  title: "Save Your Spot! Sign Up for Summer Camp",
  description:
    "Reserve your child's spot in the Wynwood School of Music Summer Performance Camp. Limited sessions available June through August.",
};

export default function CampSignupPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-10 md:pt-14 pb-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase font-black text-white leading-tight">
            Save Your Spot! Sign Up for Summer Camp!
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Two-column layout */}
      <section className="bg-wsm-dark px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
          {/* Left column — Intro + Form */}
          <div>
            <div className="mb-8">
              <p className="font-body text-wsm-gray text-sm leading-relaxed">
                Please fill out the form below and someone from our team will
                reach out to you to secure your child&rsquo;s spot in our
                summer camp sessions!
              </p>
            </div>

            <CampSignupForm />
          </div>

          {/* Right column — Contact Info + Photos */}
          <div>
            <div className="mb-8">
              <h2 className="font-heading text-2xl uppercase font-black text-white mb-6">
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

            {/* Camp Photos */}
            <div className="space-y-4">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/camp/camp-hero.jpg"
                  alt="Wynwood School of Music summer camp performance"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 320px, 100vw"
                />
              </div>
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/camp/camp-faq-3.webp"
                  alt="Campers at Wynwood School of Music summer camp"
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
