/**
 * Recital schedule — the single source of truth for /recitals.
 *
 * Dates, venues and prices come from the school-year welcome packet
 * (public/documents/wsm-calendar-pricing-2026-2027.pdf). When a new packet
 * lands, edit this file and nothing else: the page derives everything from it,
 * including which events are still upcoming and what structured data to emit.
 *
 * `ticketsUrl` and `flyer` are both optional on purpose. Dates get published as
 * soon as they're confirmed; artwork and Eventbrite links drop in later without
 * touching the page.
 */

export type RecitalEvent = {
  /** Stable id, used as a React key and schema.org fragment. */
  id: string;
  name: string;
  /** One line on who plays and what it is. */
  blurb: string;
  /** Date-only ISO (YYYY-MM-DD). Set times aren't published yet, so we don't invent them. */
  date: string;
  price: string;
  /** Absent until the Eventbrite event exists — the page shows a status instead of a dead button. */
  ticketsUrl?: string;
  /** Absent until artwork exists. */
  flyer?: string;
};

export type RecitalVenue = {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type RecitalSeason = {
  label: string;
  venue: RecitalVenue;
  events: RecitalEvent[];
};

const inkub8: RecitalVenue = {
  name: "Inkub8 Studio",
  street: "355 NW 54th St",
  city: "Miami",
  state: "FL",
  zip: "33127",
};

export const recitalSeasons: RecitalSeason[] = [
  {
    label: "Winter 2026",
    venue: inkub8,
    events: [
      {
        id: "winter-2026-band-showcase",
        name: "Winter Band Showcase",
        blurb: "Student bands perform full sets, live.",
        date: "2026-12-11",
        price: "$20",
      },
      {
        id: "winter-2026-private-lesson-recitals-sat",
        name: "Private Lesson Recitals",
        blurb: "Students from across the school perform.",
        date: "2026-12-12",
        price: "$15",
      },
      {
        id: "winter-2026-private-lesson-recitals-sun",
        name: "Private Lesson Recitals",
        blurb: "Students from across the school perform.",
        date: "2026-12-13",
        price: "$15",
      },
    ],
  },
  {
    label: "Spring 2027",
    venue: inkub8,
    events: [
      {
        id: "spring-2027-band-showcase",
        name: "Spring Band Showcase",
        blurb: "Student bands perform full sets, live.",
        date: "2027-05-21",
        price: "$20",
      },
      {
        id: "spring-2027-private-lesson-recitals-sat",
        name: "Private Lesson Recitals",
        blurb: "Students from across the school perform.",
        date: "2027-05-22",
        price: "$15",
      },
      {
        id: "spring-2027-private-lesson-recitals-sun",
        name: "Private Lesson Recitals",
        blurb: "Students from across the school perform.",
        date: "2027-05-23",
        price: "$15",
      },
    ],
  },
];

/** Parsed as noon UTC so the calendar date can't slip a day across time zones. */
export function eventTime(event: RecitalEvent): number {
  return Date.parse(`${event.date}T12:00:00Z`);
}

/** Seasons reduced to events that haven't happened yet; empty seasons drop out. */
export function upcomingSeasons(now: number = Date.now()): RecitalSeason[] {
  return recitalSeasons
    .map((season) => ({
      ...season,
      events: season.events.filter((e) => eventTime(e) >= now),
    }))
    .filter((season) => season.events.length > 0);
}
