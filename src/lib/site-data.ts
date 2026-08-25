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
    /**
     * Source of truth: public/documents/wsm-calendar-pricing-2026-2027.pdf
     * ("Holiday Closures" per semester). Refresh this whenever a new school-year
     * calendar PDF is posted.
     */
    holidayClosures: {
      "Fall 2026": [
        'Monday, September 7th "Labor Day"',
        'Saturday, October 31st "Halloween"',
      ],
      "Spring 2027": [
        'Sunday, March 28th "Easter Sunday"',
        'Sunday, May 9th "Mother\'s Day"',
      ],
      "Summer 2027": [
        'Monday, May 31st "Memorial Day"',
        'Sunday, June 20th "Father\'s Day"',
        'Sunday, July 4th "Independence Day"',
      ],
    },
  },
  social: {
    facebook: "https://www.facebook.com/wynwoodschoolofmusic",
    instagram: "https://www.instagram.com/wynwoodschoolofmusic",
    youtube: "https://www.youtube.com/@wynwoodschoolofmusic5152",
  },
  announcement: {
    text: "YOUR FIRST MUSIC LESSON IS ON US - CLICK TO START!",
    link: "/contact",
  },
};

export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  /**
   * Renders a top-level item in promo yellow instead of the usual white, to pull
   * attention to whatever we're actively pushing. Seasonal: set it while a
   * program is being promoted, drop it once that season is over. Nothing uses it
   * right now (Summer Camp had it through summer 2026).
   */
  highlight?: boolean;
};

export const navLinks: NavLink[] = [
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
      { label: "Summer Camp", href: "/musicperformancecamp" },
    ],
  },
  { label: "Recitals", href: "/recitals" },
  { label: "Contact Us", href: "/contact" },
];
