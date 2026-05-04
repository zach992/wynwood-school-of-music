export interface TeamBio {
  slug: string;
  name: string;
  role: string;
  portraitSrc: string;
  portraitPosition?: string;
  bioParagraphs: string[];
  philosophy?: string;
  social?: string;
  isFounder?: boolean;
}

export const teamBios: TeamBio[] = [
  {
    slug: "leo-cattani",
    name: "Leo Cattani",
    role: "Piano, Trumpet, Music Theory",
    portraitSrc: "/images/team/bios/leo-cattani.png",
    bioParagraphs: [
      "Leo Cattani is a Miami-born pianist and trumpeter. He plays regularly in South Florida and is currently pursuing his B.M. in Music Education at FIU.",
      "Leo plays music across a variety of genres, with a specialty in jazz performance as he is currently a member of the FIU Studio Jazz Big Band Ensemble.",
      'Leo also plays keyboard with the group "Mustard Service", a band that performs within the "Zest-Pop" genre, a term coined by the band when asked to define their style of playing.',
    ],
    philosophy:
      "I want all my students to have a fun time while learning, it's so important for fun to be a part of the learning process! Also, for my students to always feel encouraged to do their best so they play and perform their best!",
    social: "@MUSTARDSERVICE / @FOOMFAMILY",
  },
  {
    slug: "alex-ibanez",
    name: "Alex Ibanez",
    role: "Drums, Percussion",
    portraitSrc: "/images/team/bios/alex-ibanez.png",
    bioParagraphs: [
      "Alex Ibanez is a drummer/percussionist with 20 years experience in the music business. He has played drums with countless groups that range in genres from rock, pop, funk, jazz and Cuban music.",
    ],
    philosophy:
      "I hope to instill confidence and a passion in every one of my students; for them to most importantly have fun each and every time they walk into my classroom.",
    social: "@alexibanezzz",
  },
  {
    slug: "vale-penaranda",
    name: "Vale Peñaranda",
    role: "Voice, Keyboard, Music Production, Songwriting",
    portraitSrc: "/images/team/bios/vale-penaranda.jpg",
    portraitPosition: "center 22%",
    bioParagraphs: [
      "Vale Peñaranda is a Bolivian artist based in Miami—a singer-songwriter, producer, arranger, sound engineer, and classically trained pianist who began her musical journey at age 10.",
      "Her work blends pop, Latin rock, and soul, and she has performed on international stages, including the Suena Caracas Festival and the Berklee Performance Center.",
      "She studied at Berklee College of Music and the Frost School of Music, where she worked with Grammy-winning mentors and developed her career both as an artist and in music production.",
      "In 2022, she received the Eduardo Abaroa Award for Best Artistic Music Video and was selected for the Latin GRAMMY Cultural Foundation's Leading Ladies of Entertainment mentorship.",
      "Now based in Miami, Vale continues to grow her career as both an artist and educator, bringing her experience on stage and behind the scenes into her teaching to inspire and guide her students.",
    ],
    philosophy: undefined,
    social: "@valepenarandamusic",
  },
  {
    slug: "augusto-di-catarina",
    name: "Augusto Di Catarina",
    role: "Vocals, Guitar, Bass",
    portraitSrc: "/images/team/bios/augusto-di-catarina.png",
    bioParagraphs: [
      "Vocalist and guitarist, Augusto Di Catarina graduated from Florida International University in the spring of 2019, earning a B.A. in Music Business with Jazz Voice as his primary instrument. He studied vocals under Dr. Lisanne Lyons and has performed with many student ensembles at his university.",
      "Augusto is a multi-instrumentalist who performs professionally with guitar, voice, bass, etc, throughout the South Florida area. In September of 2018, he toured across the United States opening each night with his band for The Spanish rock group, Hinds. Here he played in thirteen different cities, including Santa Barbara, Phoenix, Tucson, Austin, Dallas and Baton Rouge.",
      "As a teacher, he builds a strong background in the theory of music, but will also guarantee the development of an extensive repertoire best suited for each of his students. He also encourages and prepares them to feel comfortable playing in small groups and even in live recitals if this is indeed a goal for the student. But most importantly, he will make sure the learning environment is as fun and encouraging as it can be.",
    ],
    philosophy: undefined,
    social: "@touteaux",
  },
  {
    slug: "renzo-vargas",
    name: "Renzo Vargas",
    role: "Drums, Percussion",
    portraitSrc: "/images/team/bios/renzo-vargas.png",
    bioParagraphs: [
      "I started playing drums in 1995 when I was 13 years old went to Asm music studied with Over 15 different Drum teachers till I went to Miami-Dade college and studied with Jack Ciano, was fortunate to be able to play with Ed Calle popular music ensemble, Started teaching drums in 2008 after five years of private lessons schools around miami started to hear about my work and began working with different music schools, I am very fortunate to be able to work with kids ages 3 1/2 and up, and be part of wynwood school of music, YMU young musicians unite, South Pointe Elementary School, forte music academy, and private students",
      "I love working with Wynwood School Of Music by acting as both a mentor and role model.",
      "I want to show them that there is more to music than just sound. Teaching a child to read and perform on the drums is a gift, it means giving them the ability to express themselves musically. I love seeing the students work on their songs and reading exercises, It is truly an honor to be able to work with Wynwood School Of Music and connect with my students through music and Drums. I live to teach my students to hear the beauty in every drum beat and every note. It is a rewarding experience that brightens both our futures.",
    ],
    philosophy:
      "Teaching a child to read and perform on the drums is a gift, it means giving them the ability to express themselves musically.",
    social: "@flexostudents",
  },
  {
    slug: "angel-perez",
    name: "Angel Perez",
    role: "Keyboard, Music Theory",
    portraitSrc: "/images/team/bios/angel-perez.jpg",
    bioParagraphs: [
      "Angel is a Pianist, composer, and arranger who was born and raised in Miami Beach, Florida. His love for music began when he was young, and since then, he has continued developing his music skills. He graduated with his B.M in Jazz Performance at the University of Miami and continues to perform, as well as teach, in the south Florida area.",
      "Angel has performed at concerts, festivals, and competitions including The Essentially Ellington Competition, Sankofa Jazz Festival, Miami Downtown jazz festival/competition, Okeechobee Music Festival, and III Points music festival.",
      "Angel has always been connected to music, but believes that it is important to connect with others through music as well. He incorporates this by listening and supporting the people he works with.",
      "Angel Looks forward to supporting you in reaching your goals!",
    ],
    philosophy: undefined,
    social: "@angelprz__",
  },
  {
    slug: "yamil-granda",
    name: "Yamil Granda",
    role: "Bass, Guitar",
    portraitSrc: "/images/team/bios/yamil-granda.jpg",
    bioParagraphs: [
      "Yamil started off playing guitar and bass for church services and developed an enjoyment for playing live music. He now plays and records for various local acts in and around Miami Fl.",
      "Yamil has been teaching music around 5 years and has experience with all types of age ranges and skill levels. He believes that everyone should enjoy playing music, whether casually with friends, professionally with a band, or anywhere in between! He has guided many students to their own unique and specific goals.",
      "As a teacher, he believes in the individuality of the student and using their musical likes and interests to create a unique path forward for them to progress while enjoying the level they are in. Being self taught for the first part of his musical journey, Yamil knows what it's like to feel aimless and frustrated with progress and uses that knowledge to keep an engaging path for students while focusing on technique and avoiding pitfalls that can cause frustration or pains later on.",
    ],
    philosophy: undefined,
    social: "@Yamil_Granda",
  },
  {
    slug: "patricio-acevedo",
    name: "Patricio Acevedo",
    role: "Cello, Viola, Violin",
    portraitSrc: "/images/team/bios/patricio-acevedo.png",
    bioParagraphs: [
      "Hey there! I'm Patricio Acevedo, a Miami-based music educator. My musical journey started in elementary school when my music teacher gave me the opportunity to play violin in orchestra. Once I reached high school, though, I switched to cello - which has remained my primary instrument ever since – and took up percussion in marching band as well.",
      "My experiences in public school music motivated me to study at Miami Dade College, where I earned my Associate of Arts in Music in 2019. On top of my general music coursework, I played with the Chamber Music and Film Scoring Orchestra ensembles. During this time, I also cofounded the local rock band Slim Glasses as a cellist, electric bassist, and a vocalist.",
      "Just as my teachers provided me with a variety of opportunities to involve myself in music, I want to create the same open environment for my students to explore music through the cello. No matter what type of music you enjoy – classical, pop, folk, rock, or any other – there is a space ready for you in my studio.",
    ],
    philosophy: undefined,
    social: "@patricello",
  },
  {
    slug: "sergio-zavala",
    name: "Sergio Zavala",
    role: "Guitar",
    portraitSrc: "/images/team/bios/sergio-zavala.png",
    bioParagraphs: [
      "Guitarist Sergio Zavala graduated from Florida International University in 2018 earning a B.A in Jazz guitar performance and again in 2021 with a M.A in the same field. He studied guitar under Tom Limpincott and performed with the schools top ensembles. Currently, he is performing all over Florida with multiple bands playing different styles ranging from Jazz to R'nB, Rock, Soul, and Funk.",
      "As a teacher, Sergio aims to provide you with the strong foundation that you need to become fluent in guitar and music. Whether your goals are to learn music to play in a band or to write your own, Sergio will guide you through the necessary steps to reach them. He believes in maintaining a positive and encouraging learning environment that allows room for growth and understanding.",
    ],
    philosophy: undefined,
    social: "@sergio_zavala_3",
  },
  {
    slug: "aj-hill",
    name: "AJ Hill",
    role: "Saxophone, Vocals, Drums",
    portraitSrc: "/images/team/bios/aj-hill.png",
    bioParagraphs: [
      'Twice Grammy-nominated, one Oscar nomination; I\'ve shared the same billing as a child with Betty Wright, George and Gwen McRae & Clarence Reid, and as an adult with Page McConnell, Otielle Burbridge and Russell Batiste, worked with Sly & the Family Stone and recorded with Ralph Hunter, Andrew Woolfolk and Larry Dunn (Earth Wind and Fire), invited to jam with The Funky Meters. I\'ve helped to develop what\'s known as the "Miami Sound," through my work with The Spamallstars. Currently working as Artistic Director of the Miami Beach Rock Ensemble.',
    ],
    philosophy: undefined,
    social: undefined,
  },
  {
    slug: "jake-mongin",
    name: "Jake Mongin",
    role: "Guitar, Bass, Keyboard, Music Theory",
    portraitSrc: "/images/team/bios/jake-mongin.png",
    bioParagraphs: [
      "Born in Detroit, jazz guitarist Jake Mongin has been a part of the jazz scene in South Florida and abroad since 2019. After moving to Orlando in 2010, Jake has participated in numerous festival, concert and club performances with musicians from all generations. As a leader, Jake has performed in jazz clubs throughout the state of Florida from the Blue Bamboo in Orlando to the London Club in Naples. Despite having a background in jazz, Jake has appeared on various recordings and live bands in all genres from pop and hard rock.",
    ],
    philosophy: undefined,
    social: "@jakemongin",
  },
  {
    slug: "nestor-rigaud",
    name: "Nestor Rigaud",
    role: "Music Production, Guitar, Bass",
    portraitSrc: "/images/team/bios/nestor-rigaud.png",
    bioParagraphs: [
      "Nestor has played guitar and bass for 15 years and through that, he fell in love with recording music both as a producer and a recording engineer. He went on to study music production and recording at Berklee college of music where he developed his recording and playing skills further.",
      "Nestor has been recording himself and local acts for over 10 years and has lots of experience in different styles and how to achieve many different sounds. He loves creating in the moment and if he has any free time you can find him creating little songs and beats. Nestor has been teaching music for 8 years and is focused in figuring out what you want to do and how to arrive there.",
      "As a producer, one of the most important skills one can have is creating and finishing an idea so, Nestor emphasizes creativity in his production lessons as well as getting you familiar with recording software and gear.",
      "Nestor wants to help you get that song out of your head and into the world!",
    ],
    philosophy: undefined,
    social: "@nestjrig",
  },
];
