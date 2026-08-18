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
  /**
   * Feeds the schema.org description only — not rendered on the page.
   * Search results still want a sentence; the page itself doesn't.
   */
  seoDescription: string;
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
        seoDescription: "Student bands perform full sets, live.",
        date: "2026-12-11",
        price: "$20",
      },
      {
        id: "winter-2026-private-lesson-recitals-sat",
        name: "Private Lesson Recitals",
        seoDescription: "Students from across the school perform.",
        date: "2026-12-12",
        price: "$15",
      },
      {
        id: "winter-2026-private-lesson-recitals-sun",
        name: "Private Lesson Recitals",
        seoDescription: "Students from across the school perform.",
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
        seoDescription: "Student bands perform full sets, live.",
        date: "2027-05-21",
        price: "$20",
      },
      {
        id: "spring-2027-private-lesson-recitals-sat",
        name: "Private Lesson Recitals",
        seoDescription: "Students from across the school perform.",
        date: "2027-05-22",
        price: "$15",
      },
      {
        id: "spring-2027-private-lesson-recitals-sun",
        name: "Private Lesson Recitals",
        seoDescription: "Students from across the school perform.",
        date: "2027-05-23",
        price: "$15",
      },
    ],
  },
];

/** Shows are in Miami; a date is only "past" once that local day is over. */
const VENUE_TZ = "America/New_York";

/** Offset (local - UTC, in ms) that VENUE_TZ was observing at a given instant. */
function venueOffsetMs(instant: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: VENUE_TZ,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(new Date(instant))
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second)
  );
  return asIfUtc - instant;
}

/**
 * Noon UTC — used only to format the date label, never to decide what's past.
 * Midday keeps the calendar date stable whichever way a formatter leans.
 */
export function eventTime(event: RecitalEvent): number {
  return Date.parse(`${event.date}T12:00:00Z`);
}

/**
 * The instant the event's local calendar day ends in Miami.
 *
 * Filtering on this rather than on the date itself matters: the Winter
 * showcase is an evening show, and anchoring to noon UTC would have dropped it
 * from the page at 7am local — about twelve hours before doors.
 */
export function eventEndOfDay(event: RecitalEvent): number {
  const [year, month, day] = event.date.split("-").map(Number);
  const nextMidnightUtc = Date.UTC(year, month - 1, day + 1, 0, 0, 0);
  return nextMidnightUtc - venueOffsetMs(nextMidnightUtc);
}

/** Seasons reduced to events that haven't finished yet; empty seasons drop out. */
export function upcomingSeasons(now: number = Date.now()): RecitalSeason[] {
  return recitalSeasons
    .map((season) => ({
      ...season,
      events: season.events.filter((e) => eventEndOfDay(e) > now),
    }))
    .filter((season) => season.events.length > 0);
}
