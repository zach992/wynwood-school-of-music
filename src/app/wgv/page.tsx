import Image from "next/image";
import WgvForm from "@/components/WgvForm";

export const metadata = {
  title: "Walt Grace Vintage Lesson Signup",
  description:
    "Congratulations on your Walt Grace Vintage purchase! Redeem your free 30-minute lesson at the Wynwood School of Music.",
  robots: { index: false, follow: true },
};

export default function WgvPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-12 pb-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase font-black text-white leading-tight">
            Congratulations On Your New Walt Grace Vintage Purchase
          </h1>
        </div>
      </section>

      {/* Co-brand wordmarks */}
      <section className="bg-wsm-dark px-4 pb-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          <Image
            src="/images/logo.png"
            alt="Wynwood School of Music"
            width={220}
            height={110}
            className="h-20 md:h-24 w-auto object-contain"
          />
          <div className="hidden md:block w-px h-16 bg-wsm-gray-dark" />
          <Image
            src="/images/walt-grace-vintage.jpg"
            alt="Walt Grace Vintage — Cars + Guitars"
            width={300}
            height={120}
            className="h-20 md:h-24 w-auto object-contain invert"
          />
        </div>
        <div className="max-w-5xl mx-auto mt-8">
          <hr className="border-wsm-gray-dark" />
        </div>
      </section>

      {/* Two-column: intro + form / image + map */}
      <section className="bg-wsm-dark px-4 pb-12 md:pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-14">
          {/* Left — intro + form */}
          <div>
            <h2 className="font-heading text-xl md:text-2xl uppercase font-black text-white mb-4">
              A Lifelong Love of Music Starts Here.
            </h2>
            <p className="font-body text-wsm-gray text-sm leading-relaxed mb-6">
              We&rsquo;re excited to welcome the Walt Grace family to the
              Wynwood School of Music. By providing high-quality private
              lessons, youth bands, and performing ensembles, Wynwood School of
              Music offers students of all ages a fun and safe community to
              realize their full potential as musicians.
            </p>

            <h3 className="font-heading text-lg md:text-xl uppercase font-black text-white mb-6">
              Sign Up to Redeem Your Free 30 Minute Lesson and One of Our Team
              Members Will Be in Touch Within 24 Hours.
            </h3>

            <WgvForm />
          </div>

          {/* Right — student image + contact card */}
          <div className="space-y-6">
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src="/images/private-lessons/sax.webp"
                alt="Student playing at the Wynwood School of Music"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 360px, 100vw"
              />
            </div>

            <blockquote className="border-l-4 border-wsm-accent pl-4 py-2">
              <p className="font-body text-wsm-gray text-base italic leading-relaxed mb-2">
                &ldquo;The Wynwood School of Music is a fun and inspiring
                environment. The staff are friendly and the facility is
                awesome.&rdquo;
              </p>
              <cite className="font-body text-wsm-gray-dark text-xs not-italic">
                &mdash; 5 Star Google Review
              </cite>
            </blockquote>

            <div>
              <h3 className="font-heading text-lg uppercase font-black text-white mb-3">
                Contact Us
              </h3>
              <p className="font-body text-white text-sm font-bold">
                WYNWOOD SCHOOL OF MUSIC
              </p>
              <p className="font-body text-wsm-gray text-sm leading-relaxed mb-3">
                1260 NW 29th St. Unit 103
                <br />
                Miami, FL 33142
              </p>
              <p className="font-body text-wsm-gray text-sm">305-359-5515</p>
              <p className="font-body text-wsm-gray text-sm">
                info@wynwoodschoolofmusic.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
