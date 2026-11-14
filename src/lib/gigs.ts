export const TIMEZONE = "America/Toronto";

export type Gig = {
  datetime: string;
  date: string;
  event: string;
  location?: string;
};

export function gigTitle(gig: Gig) {
  return gig.location ? `${gig.event} — ${gig.location}` : gig.event;
}

function montrealDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addCalendarDays(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

export function splitGigs(gigs: Gig[], now: Date) {
  const today = montrealDateKey(now);
  const dated = gigs.map((gig) => ({
    ...gig,
    time: new Date(gig.datetime),
  }));

  const upcoming = dated
    .filter((gig) => montrealDateKey(gig.time) >= today)
    .sort((a, b) => b.time.getTime() - a.time.getTime());

  const past = dated
    .filter((gig) => montrealDateKey(gig.time) < today)
    .sort((a, b) => b.time.getTime() - a.time.getTime());

  const next =
    dated
      .filter((gig) => gig.time.getTime() > now.getTime())
      .sort((a, b) => a.time.getTime() - b.time.getTime())[0] ?? null;

  const last = past[0] ?? null;
  const isThankYouDay = last
    ? addCalendarDays(montrealDateKey(last.time), 1) === today
    : false;

  return { upcoming, past, next, last, isThankYouDay };
}
