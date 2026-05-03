import Image from "next/image";
import Button from "@/components/Button";
import ImageCarousel from "@/components/ImageCarousel";

const recipientImages = [
  { src: "/images/friendsofwsm/recipients/recipient-01.webp", alt: "Current scholarship recipient performing" },
  { src: "/images/friendsofwsm/recipients/recipient-02-magdalena-ruseva.webp", alt: "Magdalena Ruseva" },
  { src: "/images/friendsofwsm/recipients/recipient-03-live-at-norm-fount.webp", alt: "Scholarship recipients live at Norm Fount" },
  { src: "/images/friendsofwsm/recipients/recipient-04-spring-recital.webp", alt: "Scholarship recipient at WSM Spring Recital 2025" },
  { src: "/images/friendsofwsm/recipients/recipient-05-spring-recital.webp", alt: "Scholarship recipient at WSM Spring Recital 2025" },
];

export const metadata = {
  title: "Friends of WSM",
  description:
    "Friends of the Wynwood School of Music breaks down financial barriers so young musicians can pursue their passion as a pathway to college and career.",
};

const alumniRecipients = [
  {
    name: "Jeremy A. Chavarria",
    school: "Berklee College of Music",
    classYear: "Class of 2026",
    image: "/images/friendsofwsm/jeremy-chavarria.jpeg",
  },
  {
    name: "Micaela Godoy",
    school: "The New School",
    classYear: "Class of 2029",
    image: "/images/friendsofwsm/micaela-godoy.jpeg",
  },
  {
    name: "Guerwen Gue",
    school: "Berklee College of Music",
    classYear: "Class of 2027",
    image: "/images/friendsofwsm/guerwen-gue.jpg",
  },
  {
    name: "Stella Rodriguez",
    school: "The New School",
    classYear: "Class of 2029",
    image: "/images/friendsofwsm/stella-rodriguez.jpg",
  },
  {
    name: "Deo Budnevich",
    school: "Berklee College of Music",
    classYear: "Class of 2026",
    image: "/images/friendsofwsm/deo-budnevich.jpg",
  },
  {
    name: "Christian Barcelata",
    school: "Berklee College of Music",
    classYear: "Class of 2029",
    image: "/images/friendsofwsm/christian-barcelata.jpg",
  },
  {
    name: "Alberto Almarza",
    school: "Miami Dade College",
    classYear: "Class of 2028",
    image: "/images/friendsofwsm/alberto-almarza.jpg",
  },
  {
    name: "Ambar Diaz",
    school: "The New School",
    classYear: "Class of 2029",
    image: "/images/friendsofwsm/ambar-diaz.jpg",
  },
  {
    name: "Estelle Morales",
    school: "Young Musicians Unite",
    classYear: "",
    image: "/images/friendsofwsm/estelle-morales.jpeg",
  },
];

export default function FriendsOfWSMPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px]">
        <Image
          src="/images/friendsofwsm/hero.jpg"
          alt="Friends of Wynwood School of Music"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl uppercase font-bold text-white max-w-4xl leading-tight">
            Friends of Wynwood School of Music
          </h1>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="bg-wsm-dark px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-center">
            <div className="w-full md:w-[45%] shrink-0">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src="/images/friendsofwsm/our-impact.jpg"
                  alt="WSM student performing on stage"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-[55%]">
              <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold text-white mb-6">
                Our Impact
              </h2>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-6">
                Since its launch, Friends of Wynwood School of Music has helped
                young musicians transform their passion into professional and
                academic success.
              </p>
              <ul className="font-body text-wsm-gray text-base leading-relaxed space-y-3">
                <li>
                  <strong className="text-white">$2 Million</strong> in college
                  scholarships earned
                </li>
                <li>
                  <strong className="text-white">9</strong> full-ride
                  scholarship recipients to top music schools
                </li>
                <li>
                  <strong className="text-white">40%</strong> first-generation
                  college students supported
                </li>
                <li>
                  Graduates attending{" "}
                  <strong className="text-white">
                    Berklee College of Music, The New School, NYU, Frost School
                    of Music,
                  </strong>{" "}
                  and{" "}
                  <strong className="text-white">Miami-Dade College</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-[#222222] px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
            <div className="w-full md:w-[55%]">
              <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold text-white mb-6">
                Mission
              </h2>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-6">
                Friends of the Wynwood School of Music breaks down financial
                barriers so young musicians can pursue their passion as a
                pathway to college and career.
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-6">
                Through scholarships for private lessons and band ensemble
                programs, we equip students with mentorship, training, and
                performance experiences that prepare them for college
                scholarships and professional opportunities in the music and
                entertainment industry.
              </p>
              <Button href="https://docs.google.com/forms/d/e/1FAIpQLSecKLf56CCA-BO4XOjU-E3yn9u-nrZyxVLrWL0Yoyy7ljtr4g/viewform">
                Apply Here
              </Button>
            </div>
            <div className="w-full md:w-[45%] shrink-0">
              <div className="relative w-full aspect-video overflow-hidden rounded">
                <iframe
                  src="https://www.youtube.com/embed/1ks9BOYaIlo"
                  title="Spotlight: Stella Rodriguez — Friends of Wynwood School of Music"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="bg-wsm-dark px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14">
            <div className="w-full md:w-[55%]">
              <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold text-white mb-6">
                History
              </h2>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-4">
                The Music Matters Scholarship Fund, founded by Levi Gans in
                2022, was created to open doors for highly talented, under-resourced
                students who show exceptional potential in music but lack access
                to private instruction. From this initiative, the Friends of the
                Wynwood School of Music was born, a program where scholarship
                students receive fully funded, intensive one-on-one lessons with
                professional instructors at the Wynwood School of Music.
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-4">
                Students chosen for this opportunity must demonstrate a strong
                commitment to both their academic success and musical growth. The
                program is designed to prepare them for the next level, whether
                that means competing for a full-ride college music scholarship or
                advancing through pre-professional training.
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed mb-4">
                By removing financial barriers, the Music Matters Scholarship
                unlocks the full potential of Miami&apos;s next generation of
                musicians. All donations are fully tax-deductible and go directly
                toward instruction, materials, and personalized coaching for
                deserving students.
              </p>
              <p className="font-body text-wsm-gray text-base leading-relaxed">
                Music matters. For these students, it&apos;s a pathway to
                college, and your support makes it possible.
              </p>
            </div>
            <div className="w-full md:w-[45%] shrink-0">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src="/images/friendsofwsm/history.jpg"
                  alt="Micaela Godoy, scholarship recipient, performing live"
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Scholarship Recipients */}
      <section className="bg-wsm-dark px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold text-white mb-10 text-center">
            Current Scholarship Recipients
          </h2>
          <ImageCarousel images={recipientImages} aspectClass="aspect-[4/3]" visible={2} />
        </div>
      </section>

      {/* Alumni Scholarship Recipients */}
      <section className="bg-wsm-dark px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl uppercase font-bold text-white mb-10 text-center">
            Alumni Scholarship Recipients
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {alumniRecipients.map((recipient) => (
              <div key={recipient.name} className="text-center">
                <div className="relative w-full aspect-square overflow-hidden mb-3">
                  <Image
                    src={recipient.image}
                    alt={recipient.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="font-body text-white text-sm font-semibold">
                  {recipient.name}
                </p>
                <p className="font-body text-wsm-gray text-xs">
                  {recipient.school}
                  {recipient.classYear && ` (${recipient.classYear})`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Contact */}
      <section className="bg-wsm-dark px-4 py-16 md:py-20 border-t border-wsm-gray-dark">
        <div className="max-w-5xl mx-auto">
          <div className="font-body text-wsm-gray text-sm leading-relaxed space-y-1">
            <p>
              <strong className="text-white">President/CEO:</strong> Levi Gans
            </p>
            <p>
              <strong className="text-white">Address:</strong> 1260 NW 29th
              Street #103, Miami, FL 33142
            </p>
            <p>
              <strong className="text-white">Phone:</strong> 305-359-5515
            </p>
            <p>
              <strong className="text-white">Email:</strong>{" "}
              <a
                href="mailto:info@friendsofwsm.org"
                className="text-wsm-accent hover:text-wsm-accent-hover"
              >
                info@friendsofwsm.org
              </a>
            </p>
            <p>
              Registered 501(c)(3), EIN: 99-4110235
            </p>
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="bg-wsm-dark py-8" />
    </>
  );
}
