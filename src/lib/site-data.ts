export const siteData = {
  name: "Wynwood School of Music",
  phone: "305-359-5515",
  email: "info@wynwoodschoolofmusic.com",
  address: {
    street: "1260 NW 29th St. Unit 103",
    city: "Miami",
    state: "FL",
    zip: "33142",
  },
  hours: {
    regular: [
      { days: "Monday-Thursday", time: "2-9PM" },
      { days: "Friday", time: "2-7:30PM" },
      { days: "Saturday", time: "CLOSED" },
      { days: "Sunday", time: "11AM-8PM" },
    ],
    holidayClosures: {
      "Fall 2025": [
        'Monday, September 1st "Labor Day"',
        'Friday, October 31st "Halloween"',
      ],
      "Spring 2026": [
        'Sunday, April 5th "Easter Sunday"',
        'Sunday, May 10th "Mother\'s Day"',
        'Monday, May 25th "Memorial Day"',
      ],
      "Summer 2026": [
        'Sunday, June 21st "Father\'s Day"',
      ],
    },
  },
  social: {
    facebook: "https://www.facebook.com/wynwoodschoolofmusic",
    instagram: "https://www.instagram.com/wynwoodschoolofmusic",
    youtube: "https://www.youtube.com/@wynwoodschoolofmusic",
    spotify: "https://open.spotify.com/artist/wynwoodschoolofmusic",
  },
  announcement: {
    text: "YOUR FIRST MUSIC LESSON IS ON US - CLICK TO START!",
    link: "/contact",
  },
};

export const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/our-story",
    children: [
      { label: "Our Story", href: "/our-story" },
      { label: "Team", href: "/team" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Friends of WSM", href: "/friendsofwsm" },
    ],
  },
  {
    label: "Programs",
    href: "/programs-and-pricing",
    children: [
      { label: "Programs & Pricing", href: "/programs-and-pricing" },
      { label: "Private Lessons", href: "/private-lessons" },
      { label: "Band Programs", href: "/our-bands" },
    ],
  },
  {
    label: "Summer Camp",
    href: "/musicperformancecamp",
    highlight: true,
  },
  { label: "Recitals", href: "/recitals" },
  { label: "Contact Us", href: "/contact" },
];
