"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Stars from "@/components/Stars";
import CrescentMoon from "@/components/CrescentMoon";
import Lantern from "@/components/Lantern";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "18:30",
    location: "",
    host_name: "",
    host_note: "",
    enable_guest_notes: true,
    enable_sms_reminders: false,
    sms_reminder_hours: 3,
    show_guest_list: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create event");

      const data = await res.json();
      router.push(`/event/${data.slug}`);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen paper-texture">
      <Stars count={25} />

      {/* Decorative elements */}
      <Lantern className="absolute top-0 left-8 w-12 opacity-30 hidden md:block" />
      <Lantern className="absolute top-0 right-12 w-10 opacity-20 hidden md:block" />
      <CrescentMoon className="absolute top-6 right-1/4 w-16 opacity-25 hidden md:block" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <CrescentMoon className="w-20 h-20 mx-auto mb-4 opacity-80" />
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-gold-300 mb-3">
            Noor
          </h1>
          <p className="text-teal-200 text-lg font-light tracking-wide">
            Create a beautiful invite for your gathering
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-8 border border-teal-700/30 shadow-xl">
            <h2 className="font-serif text-2xl text-gold-300 mb-6">
              Event Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-teal-200 mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ramadan Iftar Gathering"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-teal-950/80 border border-teal-700/50 rounded-xl text-white placeholder:text-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-teal-200 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-teal-950/80 border border-teal-700/50 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-teal-200 mb-1.5">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) =>
                      setForm({ ...form, time: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-teal-950/80 border border-teal-700/50 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-teal-200 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="123 Main Street, City"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-teal-950/80 border border-teal-700/50 rounded-xl text-white placeholder:text-teal-600"
                />
              </div>

              <div>
                <label className="block text-sm text-teal-200 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.host_name}
                  onChange={(e) =>
                    setForm({ ...form, host_name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-teal-950/80 border border-teal-700/50 rounded-xl text-white placeholder:text-teal-600"
                />
              </div>

              <div>
                <label className="block text-sm text-teal-200 mb-1.5">
                  Personal Note{" "}
                  <span className="text-teal-500">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="A warm message for your guests..."
                  value={form.host_note}
                  onChange={(e) =>
                    setForm({ ...form, host_note: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-teal-950/80 border border-teal-700/50 rounded-xl text-white placeholder:text-teal-600 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-teal-900/60 backdrop-blur-sm rounded-2xl p-8 border border-teal-700/30 shadow-xl">
            <h2 className="font-serif text-2xl text-gold-300 mb-6">
              Options
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.enable_guest_notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      enable_guest_notes: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-teal-600 bg-teal-950 text-gold-500 focus:ring-gold-400/30"
                />
                <div>
                  <span className="text-white group-hover:text-gold-200 transition-colors">
                    Allow guest notes
                  </span>
                  <p className="text-sm text-teal-400">
                    Guests can share dietary needs or special requests
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.show_guest_list}
                  onChange={(e) =>
                    setForm({ ...form, show_guest_list: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-teal-600 bg-teal-950 text-gold-500 focus:ring-gold-400/30"
                />
                <div>
                  <span className="text-white group-hover:text-gold-200 transition-colors">
                    Show guest list
                  </span>
                  <p className="text-sm text-teal-400">
                    Display first names of guests who RSVP&apos;d Yes
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.enable_sms_reminders}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      enable_sms_reminders: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-teal-600 bg-teal-950 text-gold-500 focus:ring-gold-400/30"
                />
                <div>
                  <span className="text-white group-hover:text-gold-200 transition-colors">
                    Enable SMS reminders
                  </span>
                  <p className="text-sm text-teal-400">
                    Guests can opt into a text reminder before the event
                  </p>
                </div>
              </label>

              {form.enable_sms_reminders && (
                <div className="ml-8">
                  <label className="block text-sm text-teal-200 mb-1.5">
                    Remind guests how many hours before?
                  </label>
                  <select
                    value={form.sms_reminder_hours}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sms_reminder_hours: Number(e.target.value),
                      })
                    }
                    className="px-4 py-2 bg-teal-950/80 border border-teal-700/50 rounded-xl text-white"
                  >
                    <option value={1}>1 hour before</option>
                    <option value={2}>2 hours before</option>
                    <option value={3}>3 hours before</option>
                    <option value={6}>6 hours before</option>
                    <option value={24}>1 day before</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-serif text-xl text-teal-950 font-semibold gold-shimmer shadow-lg hover:shadow-gold-500/20 transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Creating your invite..." : "Create Invite"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-teal-600 text-sm mt-12">
          Noor — crafted with care for intimate gatherings
        </p>
      </div>
    </main>
  );
}
