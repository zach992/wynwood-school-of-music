import Image from "next/image";
import RepairForm from "@/components/RepairForm";

export const metadata = {
  title: "Repair",
  description:
    "Guitar, bass, and amplifier repair services at the Wynwood School of Music in Miami. Quick turnaround, reasonable prices, and expert service.",
};

export default function RepairPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative w-full aspect-[16/7] md:aspect-[16/6] overflow-hidden">
        <Image
          src="/images/repair/hero.jpg"
          alt="Wynwood School of Music Repair Shop"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-end pb-8 md:pb-12 px-4">
          <div className="max-w-5xl mx-auto w-full">
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl uppercase font-black text-white drop-shadow-lg">
              Repair Shop Is Open!
            </h1>
          </div>
        </div>
      </section>

      {/* Caption */}
      <div className="bg-wsm-dark px-4 py-2">
        <div className="max-w-5xl mx-auto">
          <p className="font-body text-wsm-gray-dark text-xs italic">
            Instrument Repair Room at the Wynwood School of Music.
          </p>
        </div>
      </div>

      {/* Shop Photos */}
      <section className="bg-wsm-dark px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src="/images/repair/shop-1.jpg"
              alt="Repair workshop with tools and instruments"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src="/images/repair/shop-2.jpg"
              alt="Repair workshop workbench"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-wsm-dark px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left - Address & Phone */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-lg uppercase font-black text-white mb-2">
                Address
              </h3>
              <p className="font-body text-wsm-gray text-sm leading-relaxed">
                1260 NW 29th St. Unit 103
                <br />
                Miami, FL 33142
              </p>
            </div>
            <div>
              <h3 className="font-heading text-lg uppercase font-black text-white mb-2">
                Phone Number
              </h3>
              <p className="font-body text-wsm-gray text-sm">305-359-5515</p>
            </div>
          </div>

          {/* Right - Hours & Turnaround */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-lg uppercase font-black text-white mb-2">
                Workshop Hours
              </h3>
              <p className="font-body text-wsm-gray text-sm leading-relaxed">
                Monday-Thursday 2-9PM
                <br />
                Friday 2-7:30PM
                <br />
                Saturday CLOSED
                <br />
                Sunday 11AM-8PM
              </p>
            </div>
            <div>
              <h3 className="font-heading text-lg uppercase font-black text-white mb-2">
                Expected Turn Around Time
              </h3>
              <p className="font-body text-wsm-gray text-sm leading-relaxed">
                Up to 7 Days (1 Week) From Initial Drop-Off &amp; Diagnostics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <blockquote className="border-l-4 border-wsm-accent pl-6 md:pl-8">
            <p className="font-body text-wsm-gray text-lg md:text-xl italic leading-relaxed mb-4">
              &ldquo;I have now had two excellent experiences in getting amplifier
              repairs at the Wynwood School of Music. Their turnaround time is
              quick and prices are reasonable. Plus you get great customer service
              and attention from the staff there. I would highly recommend the spot
              if you need to get your gear fixed.&rdquo;
            </p>
            <cite className="font-body text-wsm-gray-dark text-sm not-italic">
              &mdash; 5 Star Google Review
            </cite>
          </blockquote>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Repairs & Services Pricing */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl uppercase font-black text-white text-center mb-4">
            Repairs &amp; Services
          </h2>
          <p className="font-body text-wsm-gray text-sm text-center mb-10">
            <em>
              Note: Prices <strong>DO NOT</strong> include the cost of strings
              and/or parts
            </em>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            {/* Left Column - Restringing/Setup */}
            <div>
              <h3 className="font-heading text-lg uppercase font-black text-white mb-6">
                Guitar &amp; Bass Restringing/Setup:
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="font-body text-white text-sm font-semibold mb-1">
                    Restringing - $30{" "}
                    <span className="text-wsm-gray font-normal">
                      (+$5 Non-Standard Tuning System)
                    </span>
                  </p>
                  <p className="font-body text-wsm-gray text-sm leading-relaxed">
                    Includes polish and fretboard conditioner. Applicable to
                    ukuleles.
                  </p>
                </div>

                <div>
                  <p className="font-body text-white text-sm font-semibold mb-1">
                    Basic Setup - $70{" "}
                    <span className="text-wsm-gray font-normal">
                      (+$10 Non-Standard Setup)
                    </span>
                  </p>
                  <p className="font-body text-wsm-gray text-sm leading-relaxed">
                    Includes neck and action calibration, restring, polish, and
                    fretboard conditioner.
                  </p>
                </div>

                <div>
                  <p className="font-body text-white text-sm font-semibold mb-1">
                    Detailed Setup - $110
                  </p>
                  <p className="font-body text-wsm-gray text-sm leading-relaxed">
                    Includes neck and action calibration, restring, polish,
                    fretboard conditioner, hardware cleaning for excessively dirty
                    instruments or extreme bow neck/bridge issues.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Services */}
            <div>
              <h3 className="font-heading text-lg uppercase font-black text-white mb-6">
                Guitar &amp; Bass Addt&apos;l Services/Repairs:
              </h3>
              <ul className="space-y-2 font-body text-sm">
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    5-Way Switch Replacement
                  </span>{" "}
                  - $50
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">Bridge Reglue</span>{" "}
                  - $150
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">Crack Repair</span>{" "}
                  - $40 per inch
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Hardware Cleaning
                  </span>{" "}
                  - $45
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Headstock Repair
                  </span>{" "}
                  - Custom{" "}
                  <span className="text-wsm-gray-dark text-xs">
                    (estimate after inspection)
                  </span>
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Install Single Tuning Machine
                  </span>{" "}
                  - $15
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Install Tuning Machine Set
                  </span>{" "}
                  - $65
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">Jack Repair</span> -
                  $35
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Level, Crown, Repolish
                  </span>{" "}
                  - $140
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Nut Replacement
                  </span>{" "}
                  - $120
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Pickguard + Electronics
                  </span>{" "}
                  - $35
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Pickup Install (Acoustic Guitar)
                  </span>{" "}
                  - $100
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Set of Pickups Install (Electric Guitar)
                  </span>{" "}
                  - $75
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Single Pickup Install (Electric Guitar)
                  </span>{" "}
                  - $50
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Single Pot Replacement
                  </span>{" "}
                  - $35
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Standard Switch Replacement
                  </span>{" "}
                  - $45
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">
                    Strap Button Install
                  </span>{" "}
                  - $30
                </li>
                <li className="text-wsm-gray">
                  <span className="text-white font-semibold">Wiring</span> - $30
                  per wire{" "}
                  <span className="text-wsm-gray-dark text-xs">
                    (capped at $135)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Strip */}
      <section className="bg-wsm-dark px-4 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src="/images/repair/gallery-1.jpg"
              alt="Repair workshop detail"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src="/images/repair/gallery-2.jpg"
              alt="Repair workshop detail"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src="/images/repair/gallery-3.jpg"
              alt="Repair workshop detail"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src="/images/repair/gallery-4.jpg"
              alt="Repair workshop detail"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-wsm-darker px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-black text-white text-center mb-2">
            Need a Repair or Service?
          </h2>
          <h2 className="font-heading text-2xl md:text-3xl uppercase font-black text-white text-center mb-10">
            Contact Us Today!
          </h2>
          <RepairForm />
        </div>
      </section>
    </>
  );
}
