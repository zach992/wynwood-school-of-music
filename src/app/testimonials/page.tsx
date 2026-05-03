import Image from "next/image";

export const metadata = {
  title: "Testimonials",
  description:
    "Hear from current students, alumni, and parents about their experiences at the Wynwood School of Music.",
};

const currentStudents = [
  {
    name: "Sammy Greenwald",
    image: "/images/testimonials/sammy-greenwald.jpg",
    quote:
      "WSM has been so great for me over the past few years - I've been able to learn so many different genres on electric guitar, as well as classical and recording. I've been taught by so many different teachers and have had great experiences with all of them, it's been so great learning at WSM.",
  },
  {
    name: "Armando Segrera",
    image: "/images/testimonials/armando-segrera.jpg",
    quote:
      "I enjoy taking lessons at WSM because it heightens my experience as a musician and helps me in my pursuits of musical theater through learning about music theory and as well learning to be disciplined and on top of my work and practicing.",
  },
  {
    name: "Alice Mocci",
    image: "/images/testimonials/alice-mocci.jpg",
    quote:
      "Going to Wynwood School of Music has been amazing. I've explored new styles with my voice and discovered talents I didn't know I had. The supportive teachers and creative environment make it a great place for any singer to grow.",
  },
  {
    name: "Salem Palacios",
    image: "/images/testimonials/salem-palacios.jpg",
    quote:
      "I really like taking lessons here because the instruments are taken good care of and help me sound better. I also really enjoy how easy-going and understanding the instructors are, helping students slowly deconstruct music in order to learn their respective instrument. It's a peaceful place without stress, I really enjoy it here.",
  },
  {
    name: "Micaela Godoy",
    image: "/images/testimonials/micaela-godoy.jpg",
    quote:
      "I love taking lessons at WSM cause I get to learn from some of the best musicians and I get to meet a bunch of other musicians my age. It's such a welcoming environment and I feel like every student can connect with their teacher and leave their lesson feeling like they've learned something new! Every lesson feels like unlocking a new chapter of skills, taking lessons has helped me improve so much as a musician in such a short amount of time.",
  },
  {
    name: "Ava Pantoja",
    image: "/images/testimonials/ava-pantoja.jpg",
    quote:
      "I enjoy taking classes at WSM because they fit my lessons so I can learn to the best of my ability, and it also gives me an opportunity to showcase what I've been working on.",
  },
];

const alumni = [
  {
    name: "Kane Akar",
    image: "/images/testimonials/kane-akar.png",
    quote:
      "It wasn't until Sammy sat me down in front of my parents and made me perform my first piece that I realized what I had accomplished. I wasn't just dabbling anymore; I was a musician. I eventually graduated high school to join the rowing team for the University of Pennsylvania, from which I graduated with a B.A. in Mathematics. I now work in Los Angeles as a consultant for Heidrick & Struggles.",
  },
  {
    name: "James Gerrard",
    image: "/images/testimonials/james-gerrard.png",
    quote:
      "Playing and studying music during high school really helped shape my future. Getting to play in Avalanche not only developed my musicianship but gave me a passion for music as a whole and taught me more than any class ever will. I now attend Belmont University, where I'm pursuing a career in audio engineering playing drums in every band I can.",
  },
  {
    name: "Sebastian Zel",
    image: "/images/testimonials/sebastian-zel.png",
    quote:
      'I studied guitar, songwriting, and music production with Sammy Gonzalez from ages 8-17. I\'ve since graduated with honors from NYU Steinhardt with a degree in Music Composition & Theory and have carved out a career as a professional composer, producer, and instrumentalist in New York City. Most recently, I composed a soundtrack for Andrew Garcia\'s "La Piel De Ayer" which premiered in May 2019 on HBO.',
  },
];

const testimonials = [
  {
    name: "Ilich Budnevich",
    role: "Parent",
    quote:
      "What can you say about WSM?..... Oh I know what I can say. WSM is AWESOME!. I am an adult, and maybe I could choose better adjectives to describe the school, but that's what comes to my mind and heart simply AWESOME. The teachers, the staff, the building, the atmosphere, the memories, the experiences. It's a second home for my son, it's a place of music of friendship and a place of learning. Clean, professional and engaged with their students and their parents. Like I said before....... AWESOME!",
  },
  {
    name: "Wences Chavez",
    role: "Parent",
    quote:
      "The staff is courteous and kind. My son is taking piano lessons with Leo and he's just fantastic! He is so patient and flexible. There have been days where I had to suddenly change the scheduled lesson and there has never been an issue. The young lady at the front desk is phenomenal! She always follows up and sends reminders! Give WSM a try!",
  },
  {
    name: "Jackie Amazon",
    role: "Parent",
    quote:
      "My son started taking music lessons there a few months ago and we love it!! Cool vibes and amazingly talented staff. I highly recommend them.",
  },
  {
    name: "Helen Mopsick",
    role: "Parent",
    quote:
      "WSM has become a second home for our family. Our oldest son started taking guitar lessons with Sammy years ago and once WSM opened, transitioned with Sammy to the school. Our youngest son followed and took his drums to the next level. We loved how much our kids were learning (and how much fun they were having!) so my husband and I both decided to take up lessons too! We can't say enough about the school. The school has a very rare mix of creativity, nurturing, and methodology that fosters a love for learning your instrument. I highly recommend Wynwood School of Music and feel lucky to be part of their community.",
  },
  {
    name: "Stacey Chopp",
    role: "Parent",
    quote:
      "Sammy has been my son's guitar instructor since he was in first grade. He is an amazing teacher who is dedicated to his students and the Miami music community.",
  },
  {
    name: "Smadar Katzman",
    role: "Adult Student",
    quote:
      "Wynwood school of music is an exciting addition to Miami music scene. Students from all ages are welcomed. The array of instruments and styles offered inspired me, an adult, to take drum lessons. I feel very welcomed here and my teacher Gibb is dedicated professional teacher. I am excited to go further on my journey of becoming a drummer.",
  },
  {
    name: "Alberto de la Portilla",
    role: "Parent",
    quote:
      "My son has been playing guitar for 5 years but since we decided to join Zach Larmer's music program, we have seen our son elevate his interest & playing to new heights. I would strongly recommend any musician looking to step up their game to consider the Wynwood School of Music.",
  },
  {
    name: "John Verea",
    role: "Adult Student",
    quote:
      "After trying several different music teachers in Miami, I was blessed to meet Zach Larmer. I finally understand this incredible instrument and am on my way to fulfilling a life long dream of playing the guitar. I highly recommend this school to everyone from 2 to 99!!!",
  },
  {
    name: "Jessica Benitez",
    role: "Parent",
    quote:
      "I have 2 kids who take lessons here (drums and electric guitar) and we are all super happy with the school! Zach and Sammy have brought together an amazingly talented group of musicians to teach these classes. We especially love Anthony (drums) and Ben (guitar)! But even if we happen to get a sub one week - the teacher is always top notch!",
  },
  {
    name: "Manuela Menendez",
    role: "Parent",
    quote:
      "Great communication, wonderful teachers, amazing front office staff, well maintained and clean studios & an all around awesome vibe. Highly Recommend.",
  },
  {
    name: "Cristina Leon",
    role: "Parent",
    quote:
      "This school is a great motivator for my kids. Excellent instruction!",
  },
  {
    name: "James Orlowsky",
    role: "Parent",
    quote:
      "Our son has had a great experience at the Wynwood School of Music. He is making tremendous progress and his confidence is soaring. Corey is a superb instructor and a great person. Highly recommended!",
  },
  {
    name: "Max Bast",
    role: "Student",
    quote:
      "Zach and Sammy are two of the most amazing musicians, teachers, and people I know. I feel very fortunate to have learned from the best. For anyone looking to improve their skills as a musician, I couldn't think of a better place than this school. I 100% recommend this spot. 5 stars!!",
  },
  {
    name: "Virginia Akar",
    role: "Parent",
    quote:
      "Sammy and Zach are both incredibly talented musicians with a unique ability and passion for teaching. My son was lucky to have Sammy as his guitar teacher for 6 years until he left for college, guitar in tow.",
  },
];

function ProfileCard({
  name,
  image,
  quote,
}: {
  name: string;
  image: string;
  quote: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start py-8">
      <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-full overflow-hidden relative mx-auto sm:mx-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="128px"
        />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-heading text-xl uppercase font-black text-white mb-3">
          {name}
        </h3>
        <p className="font-body text-wsm-gray text-sm leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-12 pb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-black text-white">
            Our Success
          </h1>
          <p className="font-body text-wsm-gray text-base leading-relaxed mt-6">
            Our students have gone to schools such as Berklee School of Music,
            New England Conservatory, NYU, Harvard University, Yale University,
            Georgetown University, and have performed at venues such as the
            Kennedy Center, Carnegie Hall, and Adrienne Arsht Center.
          </p>
          <hr className="border-wsm-gray-dark mt-8" />
        </div>
      </section>

      {/* Current Students Section */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl uppercase font-black text-white mb-4">
            Current Students
          </h2>
          <div className="divide-y divide-wsm-gray-dark/40">
            {currentStudents.map((student) => (
              <ProfileCard
                key={student.name}
                name={student.name}
                image={student.image}
                quote={student.quote}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Alumni Section */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl uppercase font-black text-white mb-4">
            Alumni
          </h2>
          <div className="divide-y divide-wsm-gray-dark/40">
            {alumni.map((alum) => (
              <ProfileCard
                key={alum.name}
                name={alum.name}
                image={alum.image}
                quote={alum.quote}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Text Testimonials Section */}
      <section className="bg-wsm-dark px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl uppercase font-black text-white mb-8">
            Parent Testimonials
          </h2>
          <div className="divide-y divide-wsm-gray-dark/40">
            {testimonials.map((t) => (
              <div key={t.name} className="py-8">
                <div className="flex items-baseline gap-3 mb-3">
                  <h3 className="font-heading text-lg uppercase font-black text-white">
                    {t.name}
                  </h3>
                  <span className="font-body text-wsm-accent text-sm">
                    {t.role}
                  </span>
                </div>
                <p className="font-body text-wsm-gray text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="bg-wsm-dark py-8" />
    </>
  );
}
