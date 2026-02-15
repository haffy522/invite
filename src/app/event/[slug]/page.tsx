"use client";

import { useEffect, useState, use } from "react";
import Stars from "@/components/Stars";
import CrescentMoon from "@/components/CrescentMoon";
import Lantern from "@/components/Lantern";
import type { Event, RSVP } from "@/lib/supabase";
import { getGoogleCalendarUrl, getOutlookCalendarUrl } from "@/lib/calendar";

type RSVPForm = {
  first_name: string;
  attending: boolean;
  note: string;
  phone: string;
  sms_opt_in: boolean;
};

export default function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<RSVPForm>({
    first_name: "",
    attending: true,
    note: "",
    phone: "",
    sms_opt_in: false,
  });

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data.event);
        setRsvps(data.rsvps);
      } catch {
        setError("Event not found");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [slug]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: event.id,
          first_name: form.first_name,
          attending: form.attending,
          note: form.note || null,
          phone: form.phone || null,
          sms_opt_in: form.sms_opt_in,
        }),
      });

      if (!res.ok) throw new Error("Failed to RSVP");

      const newRsvp = await res.json();
      setRsvps([...rsvps, newRsvp]);
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const attendingGuests = rsvps.filter((r) => r.attending);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center paper-texture">
        <Stars count={15} />
        <div className="relative z-10 text-center">
          <CrescentMoon className="w-16 h-16 mx-auto mb-4 opacity-60 animate-pulse" />
          <p className="text-teal-300 font-light">Loading invitation...</p>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen flex items-center justify-center paper-texture">
        <Stars count={15} />
        <div className="relative z-10 text-center">
          <CrescentMoon className="w-16 h-16 mx-auto mb-4 opacity-40" />
          <h1 className="font-serif text-3xl text-gold-300 mb-2">
            Invitation Not Found
          </h1>
          <p className="text-teal-400">
            This invite link may have expired or is invalid.
          </p>
        </div>
      </main>
    );
  }

  const calendarParams = new URLSearchParams({
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.location,
    description: event.host_note || `You're invited to ${event.title}`,
  });

  return (
    <main className="relative min-h-screen paper-texture">
      <Stars count={30} />

      {/* Decorative elements */}
      <Lantern className="absolute top-0 left-6 w-10 opacity-25 hidden md:block" />
      <Lantern className="absolute top-0 right-10 w-12 opacity-20 hidden md:block" />
      <Lantern className="absolute top-0 left-1/3 w-8 opacity-15 hidden lg:block" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 md:py-16">
        {/* Invite Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <CrescentMoon className="w-24 h-24 mx-auto mb-6 opacity-80" />

          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase mb-3 font-light">
            You are invited to
          </p>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold-300 mb-4 leading-tight">
            {event.title}
          </h1>

          {event.host_note && (
            <p className="text-teal-200 text-lg font-light italic max-w-md mx-auto leading-relaxed">
              &ldquo;{event.host_note}&rdquo;
            </p>
          )}
        </div>

        {/* Event Details Card */}
        <div
          className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-8 border border-teal-700/30 shadow-xl mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-gold-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-teal-400 mb-0.5">Date & Time</p>
                <p className="text-white text-lg">{formatDate(event.date)}</p>
                <p className="text-gold-300 font-serif text-lg">
                  {formatTime(event.time)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-gold-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-teal-400 mb-0.5">Location</p>
                <p className="text-white text-lg">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-gold-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-teal-400 mb-0.5">Hosted by</p>
                <p className="text-white text-lg">{event.host_name}</p>
              </div>
            </div>
          </div>

          {/* Add to Calendar */}
          <div className="mt-8 pt-6 border-t border-teal-700/30">
            <p className="text-sm text-teal-400 mb-3">Add to Calendar</p>
            <div className="flex flex-wrap gap-2">
              <a
                href={getGoogleCalendarUrl({
                  title: event.title,
                  date: event.date,
                  time: event.time,
                  location: event.location,
                  description:
                    event.host_note || `You're invited to ${event.title}`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-teal-800/60 hover:bg-teal-700/60 border border-teal-600/30 rounded-lg text-sm text-teal-200 hover:text-white transition-colors"
              >
                Google Calendar
              </a>
              <a
                href={`/api/calendar?${calendarParams.toString()}`}
                download
                className="px-4 py-2 bg-teal-800/60 hover:bg-teal-700/60 border border-teal-600/30 rounded-lg text-sm text-teal-200 hover:text-white transition-colors"
              >
                Apple Calendar
              </a>
              <a
                href={getOutlookCalendarUrl({
                  title: event.title,
                  date: event.date,
                  time: event.time,
                  location: event.location,
                  description:
                    event.host_note || `You're invited to ${event.title}`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-teal-800/60 hover:bg-teal-700/60 border border-teal-600/30 rounded-lg text-sm text-teal-200 hover:text-white transition-colors"
              >
                Outlook
              </a>
            </div>
          </div>
        </div>

        {/* RSVP Section */}
        {!submitted ? (
          <div
            className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-8 border border-teal-700/30 shadow-xl mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <h2 className="font-serif text-2xl text-gold-300 mb-6">
              RSVP
            </h2>

            <form onSubmit={handleRSVP} className="space-y-5">
              <div>
                <label className="block text-sm text-teal-200 mb-1.5">
                  Your First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-teal-950/80 border border-teal-700/50 rounded-xl text-white placeholder:text-teal-600"
                />
              </div>

              <div>
                <label className="block text-sm text-teal-200 mb-2">
                  Will you be attending?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, attending: true })}
                    className={`flex-1 py-3 rounded-xl border transition-all cursor-pointer ${
                      form.attending
                        ? "bg-gold-500/20 border-gold-400 text-gold-300"
                        : "bg-teal-950/80 border-teal-700/50 text-teal-400 hover:border-teal-500"
                    }`}
                  >
                    Yes, I&apos;ll be there
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, attending: false })}
                    className={`flex-1 py-3 rounded-xl border transition-all cursor-pointer ${
                      !form.attending
                        ? "bg-teal-700/30 border-teal-500 text-teal-200"
                        : "bg-teal-950/80 border-teal-700/50 text-teal-400 hover:border-teal-500"
                    }`}
                  >
                    Can&apos;t make it
                  </button>
                </div>
              </div>

              {event.enable_guest_notes && form.attending && (
                <div>
                  <label className="block text-sm text-teal-200 mb-1.5">
                    Note for the host{" "}
                    <span className="text-teal-500">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Dietary needs, special requests, or a warm message..."
                    value={form.note}
                    onChange={(e) =>
                      setForm({ ...form, note: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-teal-950/80 border border-teal-700/50 rounded-xl text-white placeholder:text-teal-600 resize-none"
                  />
                </div>
              )}

              {event.enable_sms_reminders && form.attending && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.sms_opt_in}
                      onChange={(e) =>
                        setForm({ ...form, sms_opt_in: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-teal-600 bg-teal-950 text-gold-500"
                    />
                    <div>
                      <span className="text-white group-hover:text-gold-200 transition-colors">
                        Send me a reminder
                      </span>
                      <p className="text-sm text-teal-400">
                        Get a text {event.sms_reminder_hours} hour
                        {event.sms_reminder_hours > 1 ? "s" : ""} before the
                        event
                      </p>
                    </div>
                  </label>

                  {form.sms_opt_in && (
                    <div>
                      <label className="block text-sm text-teal-200 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required={form.sms_opt_in}
                        placeholder="+1 (555) 123-4567"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-teal-950/80 border border-teal-700/50 rounded-xl text-white placeholder:text-teal-600"
                      />
                      <p className="text-xs text-teal-500 mt-1">
                        Your number is kept private and only used for the
                        reminder.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-serif text-xl text-teal-950 font-semibold gold-shimmer shadow-lg hover:shadow-gold-500/20 transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Submit RSVP"}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation */
          <div
            className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gold-500/30 shadow-xl mb-8 text-center animate-fade-in-up"
          >
            <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gold-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="font-serif text-2xl text-gold-300 mb-2">
              {form.attending
                ? "We look forward to seeing you!"
                : "Thank you for letting us know"}
            </h2>
            <p className="text-teal-300 mb-6">
              {form.attending
                ? `Your RSVP has been received, ${form.first_name}. May this gathering be filled with warmth and blessings.`
                : `We'll miss you, ${form.first_name}. Perhaps next time, insha'Allah.`}
            </p>

            {/* Share */}
            <div className="pt-4 border-t border-teal-700/30">
              <p className="text-sm text-teal-400 mb-3">
                Share this invite with others
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="px-6 py-2 bg-teal-800/60 hover:bg-teal-700/60 border border-teal-600/30 rounded-lg text-sm text-teal-200 hover:text-white transition-colors cursor-pointer"
              >
                Copy Invite Link
              </button>
            </div>
          </div>
        )}

        {/* Guest List */}
        {event.show_guest_list && attendingGuests.length > 0 && (
          <div
            className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-8 border border-teal-700/30 shadow-xl mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.45s" }}
          >
            <h2 className="font-serif text-xl text-gold-300 mb-4">
              Guests Attending ({attendingGuests.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {attendingGuests.map((rsvp) => (
                <span
                  key={rsvp.id}
                  className="px-4 py-1.5 bg-teal-800/50 border border-teal-600/20 rounded-full text-sm text-teal-200"
                >
                  {rsvp.first_name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-teal-700 text-sm mt-8">
          Crafted with Noor
        </p>
      </div>
    </main>
  );
}
