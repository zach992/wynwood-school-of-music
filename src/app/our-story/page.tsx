import Image from "next/image";
import Button from "@/components/Button";

export const metadata = {
  title: "Our Story | Wynwood School of Music",
  description:
    "Learn about the Wynwood School of Music, founded by Sammy Gonzalez Zeira and Zach Larmer in the heart of Miami's art district.",
};

export default function OurStoryPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-12 pb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-bold text-white">
            Our Story
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Founders Section */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Founders Photo */}
            <div className="w-full md:w-[40%] shrink-0">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src="/images/our-story/founders.jpg"
                  alt="Sammy Gonzalez Zeira and Zach Larmer, founders of Wynwood School of Music"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Founders Text */}
            <div className="w-full md:w-[60%]">
              <h2 className="font-heading text-2xl md:text-3xl uppercase font-bold text-white mb-6 leading-snug">
                We Believe in the Power of Music Education
              </h2>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-6">
                Wynwood School of Music is an after-school and weekend music
                program in the heart of Miami&apos;s art district led by music
                education giants and professional musicians, Sammy Gonzalez
                Zeira and Zach Larmer.
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-8">
                After Sammy and Zach established themselves in the music
                education community by serving over 36,000 students through
                Young Musicians Unite - a non-profit providing free music
                education in Miami-Dade County public schools - they realized
                there was still an unmet need for private, individualized
                instruction for students who are looking to take music
                seriously. In 2019, the Wynwood School of Music was born.
              </p>
              <Button href="/programs-and-pricing">View Programs</Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Facility Section */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-10 h-12 shrink-0">
              <Image
                src="/images/our-story/facility-icon.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold text-white">
              Facility
            </h2>
          </div>
          <p className="font-body text-wsm-gray text-base leading-relaxed mb-8 md:ml-14">
            Our custom-designed facility features 3 band rooms, 8 private
            lesson rooms, and a retail space for music instruments,
            accessories, and equipment.
          </p>

          {/* Facility Photo Placeholder */}
          <div className="relative w-full aspect-[16/9] bg-wsm-darker rounded overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-wsm-gray-dark">
              <span className="font-body text-sm">Facility Photo</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Location Section */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-10 h-12 shrink-0">
              <Image
                src="/images/our-story/location-icon.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold text-white">
              Location
            </h2>
          </div>
          <div className="md:ml-14">
            <p className="font-body text-wsm-gray text-base leading-relaxed mb-4">
              The Wynwood School of Music is a 3,000 square foot
              state-of-the-art music campus located at{" "}
              <strong className="text-white">
                1260 NW 29th Street Suite 103
              </strong>
              .
            </p>
            <p className="font-body text-wsm-gray text-base leading-relaxed">
              Located adjacent to I-95, 5 minutes from Midtown Miami, 10
              minutes from Downtown Miami, 15 minutes from Miami Beach, and 20
              minutes from Coconut Grove.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Parking Section */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-10 h-12 shrink-0">
              <Image
                src="/images/our-story/parking-icon.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold text-white">
              Parking
            </h2>
          </div>
          <p className="font-body text-wsm-gray text-base leading-relaxed md:ml-14">
            A parking lot reserved for clients is located directly next to the
            school. Clients are also welcome to park along the streets using
            street parking.
          </p>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="bg-wsm-dark py-8" />
    </>
  );
}
