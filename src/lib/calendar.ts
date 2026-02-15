export function generateICS(event: {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
}): string {
  const dateObj = new Date(`${event.date}T${event.time}`);
  const endDate = new Date(dateObj.getTime() + 3 * 60 * 60 * 1000); // 3 hour default duration

  const formatDate = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Noor//Invite//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${formatDate(dateObj)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${event.description || "You're invited!"}`,
    "STATUS:CONFIRMED",
    `UID:${Date.now()}@noor-invite`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function getGoogleCalendarUrl(event: {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
}): string {
  const dateObj = new Date(`${event.date}T${event.time}`);
  const endDate = new Date(dateObj.getTime() + 3 * 60 * 60 * 1000);

  const formatDate = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatDate(dateObj)}/${formatDate(endDate)}`,
    location: event.location,
    details: event.description || "You're invited!",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl(event: {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
}): string {
  const dateObj = new Date(`${event.date}T${event.time}`);
  const endDate = new Date(dateObj.getTime() + 3 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: dateObj.toISOString(),
    enddt: endDate.toISOString(),
    location: event.location,
    body: event.description || "You're invited!",
  });

  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}
