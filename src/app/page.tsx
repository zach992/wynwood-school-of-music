import Image from "next/image";
import Button from "@/components/Button";
import HeroCarousel from "@/components/HeroCarousel";

const heroImages = [
  { src: "/images/homepage/hero/hero-01.jpg", alt: "WSM students on stage at the Spring 2025 recital" },
  { src: "/images/homepage/hero/hero-02.jpg", alt: "Young guitarist performing live" },
  { src: "/images/homepage/hero/hero-03.jpg", alt: "WSM students performing together" },
  { src: "/images/homepage/hero/hero-04.jpg", alt: "Acoustic guitar lesson at Wynwood School of Music" },
  { src: "/images/homepage/hero/hero-05.jpg", alt: "Live band performance under stage lights" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroCarousel images={heroImages} className="min-h-[80vh]">
        <div className="text-center px-4">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl uppercase font-bold text-white mb-8 max-w-4xl mx-auto leading-tight">
            A lifelong love of music starts here
          </h1>
          <Button href="/contact" variant="primary">
            Sign Up
          </Button>
        </div>
      </HeroCarousel>

      {/* Introduction Section */}
      <section className="bg-wsm-dark py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-heading text-xl md:text-2xl uppercase font-semibold text-white mb-6 leading-relaxed">
            Discover your musical talents through our dynamic music programs, led
            by industry professionals, Sammy Gonzalez and Zach Larmer
          </h3>
          <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed">
            Wynwood School of Music offers high-quality private lessons and band
            programs in a fun and safe community where you can realize your full
            potential as a musician.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-wsm-darker py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <blockquote className="text-center px-4">
              <p className="font-heading text-lg md:text-xl italic text-wsm-gray leading-relaxed mb-4">
                &ldquo;Great musicians, really inspire others to learn and
                dedicate time to play music.&rdquo;
              </p>
              <footer className="text-wsm-accent text-sm uppercase tracking-wider font-semibold">
                &#9733;&#9733;&#9733;&#9733;&#9733; &mdash; 5 Star Google Review
              </footer>
            </blockquote>
            <blockquote className="text-center px-4">
              <p className="font-heading text-lg md:text-xl italic text-wsm-gray leading-relaxed mb-4">
                &ldquo;The Wynwood School of Music is a fun and inspiring
                environment. The staff are friendly and the facility is
                awesome.&rdquo;
              </p>
              <footer className="text-wsm-accent text-sm uppercase tracking-wider font-semibold">
                &#9733;&#9733;&#9733;&#9733;&#9733; &mdash; 5 Star Thumbtack
                Review
              </footer>
            </blockquote>
          </div>
          <div className="text-center mt-12">
            <Button href="/testimonials" variant="outline">
              Read More Testimonies Here!
            </Button>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="bg-wsm-dark py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Private Lessons Card */}
            <div className="text-center">
              <h3 className="font-heading text-2xl md:text-3xl uppercase font-bold text-white mb-6">
                Private Lessons
              </h3>
              <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded">
                <Image
                  src="/images/homepage/private-lessons.jpg"
                  alt="Private music lessons at Wynwood School of Music"
                  fill
                  className="object-cover"
                />
              </div>
              <Button href="/private-lessons" variant="primary">
                Learn More
              </Button>
            </div>
            {/* Band Programs Card */}
            <div className="text-center">
              <h3 className="font-heading text-2xl md:text-3xl uppercase font-bold text-white mb-6">
                Band Programs
              </h3>
              <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded">
                <Image
                  src="/images/homepage/band-programs.jpg"
                  alt="Band programs at Wynwood School of Music"
                  fill
                  className="object-cover"
                />
              </div>
              <Button href="/our-bands" variant="primary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Repair Banner */}
      <section className="relative flex items-center justify-center min-h-[50vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/homepage/repair.jpg"
            alt="Instrument repair shop"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h2 className="font-heading text-4xl md:text-5xl uppercase font-bold text-white mb-4">
            Need a Repair?
          </h2>
          <p className="font-body text-wsm-gray text-lg mb-8">
            Check out our in-house repair shop here!
          </p>
          <Button href="/repair" variant="primary">
            Learn More
          </Button>
        </div>
      </section>

      {/* Band Banner */}
      <section className="relative flex items-center justify-center min-h-[50vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/homepage/band-banner.jpg"
            alt="Band performance at Wynwood School of Music"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h2 className="font-heading text-3xl md:text-5xl uppercase font-bold text-white mb-8 max-w-3xl mx-auto leading-tight">
            Play Together. Grow Together. Perform Together.
          </h2>
          <Button href="/our-bands" variant="primary">
            Learn More
          </Button>
        </div>
      </section>
    </>
  );
}
