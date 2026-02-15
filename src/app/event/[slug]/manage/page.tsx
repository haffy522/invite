"use client";

import { useEffect, useState, use } from "react";
import Stars from "@/components/Stars";
import CrescentMoon from "@/components/CrescentMoon";
import type { Event, RSVP } from "@/lib/supabase";

export default function ManagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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

  const toggleGuestList = async () => {
    if (!event) return;
    const newValue = !event.show_guest_list;

    try {
      await fetch(`/api/events/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ show_guest_list: newValue }),
      });
      setEvent({ ...event, show_guest_list: newValue });
    } catch {
      alert("Failed to update setting.");
    }
  };

  const copyLink = () => {
    const inviteUrl = `${window.location.origin}/event/${slug}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const attending = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center paper-texture">
        <Stars count={10} />
        <div className="relative z-10 text-center">
          <CrescentMoon className="w-16 h-16 mx-auto mb-4 opacity-60 animate-pulse" />
          <p className="text-teal-300 font-light">Loading...</p>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen flex items-center justify-center paper-texture">
        <Stars count={10} />
        <div className="relative z-10 text-center">
          <h1 className="font-serif text-3xl text-gold-300 mb-2">
            Event Not Found
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen paper-texture">
      <Stars count={20} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <CrescentMoon className="w-16 h-16 mx-auto mb-3 opacity-70" />
          <h1 className="font-serif text-3xl md:text-4xl text-gold-300 mb-1">
            {event.title}
          </h1>
          <p className="text-teal-400 text-sm">Manage your event</p>
        </div>

        {/* Share Link */}
        <div className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-6 border border-teal-700/30 shadow-xl mb-6 animate-fade-in-up">
          <h2 className="font-serif text-xl text-gold-300 mb-3">
            Invite Link
          </h2>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-2.5 bg-teal-950/80 border border-teal-700/50 rounded-lg text-teal-200 text-sm truncate">
              {typeof window !== "undefined"
                ? `${window.location.origin}/event/${slug}`
                : `/event/${slug}`}
            </code>
            <button
              onClick={copyLink}
              className="px-5 py-2.5 gold-shimmer rounded-lg text-teal-950 font-medium text-sm transition-all cursor-pointer"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Settings */}
        <div
          className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-6 border border-teal-700/30 shadow-xl mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="font-serif text-xl text-gold-300 mb-4">Settings</h2>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={event.show_guest_list}
              onChange={toggleGuestList}
              className="w-5 h-5 rounded border-teal-600 bg-teal-950 text-gold-500"
            />
            <div>
              <span className="text-white group-hover:text-gold-200 transition-colors">
                Show guest list on invite
              </span>
              <p className="text-sm text-teal-400">
                Display first names of guests who RSVP&apos;d Yes
              </p>
            </div>
          </label>
        </div>

        {/* RSVP Summary */}
        <div
          className="grid grid-cols-3 gap-4 mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-5 border border-teal-700/30 text-center">
            <p className="text-3xl font-serif text-gold-300">
              {rsvps.length}
            </p>
            <p className="text-sm text-teal-400 mt-1">Total RSVPs</p>
          </div>
          <div className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-5 border border-gold-500/20 text-center">
            <p className="text-3xl font-serif text-gold-400">
              {attending.length}
            </p>
            <p className="text-sm text-teal-400 mt-1">Attending</p>
          </div>
          <div className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-5 border border-teal-700/30 text-center">
            <p className="text-3xl font-serif text-teal-300">
              {declined.length}
            </p>
            <p className="text-sm text-teal-400 mt-1">Declined</p>
          </div>
        </div>

        {/* Guest Details */}
        {attending.length > 0 && (
          <div
            className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-6 border border-teal-700/30 shadow-xl mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <h2 className="font-serif text-xl text-gold-300 mb-4">
              Attending ({attending.length})
            </h2>
            <div className="space-y-3">
              {attending.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="flex items-start justify-between p-3 bg-teal-950/50 rounded-xl"
                >
                  <div>
                    <p className="text-white font-medium">
                      {rsvp.first_name}
                    </p>
                    {rsvp.note && (
                      <p className="text-sm text-teal-400 mt-0.5 italic">
                        &ldquo;{rsvp.note}&rdquo;
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {rsvp.sms_opt_in && (
                      <span className="px-2 py-0.5 bg-teal-800/60 rounded text-xs text-teal-300">
                        SMS
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {declined.length > 0 && (
          <div
            className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-6 border border-teal-700/30 shadow-xl mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <h2 className="font-serif text-xl text-teal-400 mb-4">
              Unable to Attend ({declined.length})
            </h2>
            <div className="space-y-2">
              {declined.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="p-3 bg-teal-950/50 rounded-xl"
                >
                  <p className="text-teal-300">{rsvp.first_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {rsvps.length === 0 && (
          <div className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-8 border border-teal-700/30 shadow-xl text-center">
            <p className="text-teal-400">
              No RSVPs yet. Share your invite link to get started!
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-teal-700 text-sm mt-10">
          Crafted with Noor
        </p>
      </div>
    </main>
  );
}
