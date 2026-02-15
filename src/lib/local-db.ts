import { randomUUID } from "crypto";
import type { Event, RSVP } from "./supabase";

// In-memory store for local development when Supabase is not configured.
// Data resets on server restart. Connect Supabase for persistence.
// Uses globalThis so data is shared across module instances in dev mode.

type Store = {
  events: Event[];
  rsvps: RSVP[];
};

const g = globalThis as unknown as { __noorStore?: Store };
if (!g.__noorStore) {
  g.__noorStore = { events: [], rsvps: [] };
}
const store = g.__noorStore;

export const db = {
  events: {
    insert(data: Omit<Event, "id" | "created_at">): Event {
      const event: Event = {
        ...data,
        id: randomUUID(),
        created_at: new Date().toISOString(),
      };
      store.events.push(event);
      return event;
    },

    findBySlug(slug: string): Event | undefined {
      return store.events.find((e) => e.slug === slug);
    },

    updateBySlug(slug: string, patch: Partial<Event>): Event | undefined {
      const idx = store.events.findIndex((e) => e.slug === slug);
      if (idx === -1) return undefined;
      store.events[idx] = { ...store.events[idx], ...patch };
      return store.events[idx];
    },

    findWithSmsReminders(): Event[] {
      return store.events.filter((e) => e.enable_sms_reminders);
    },
  },

  rsvps: {
    insert(data: Omit<RSVP, "id" | "created_at">): RSVP {
      const rsvp: RSVP = {
        ...data,
        id: randomUUID(),
        created_at: new Date().toISOString(),
      };
      store.rsvps.push(rsvp);
      return rsvp;
    },

    findByEventId(eventId: string): RSVP[] {
      return store.rsvps
        .filter((r) => r.event_id === eventId)
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
    },

    findOptedInByEventId(eventId: string): RSVP[] {
      return store.rsvps.filter(
        (r) =>
          r.event_id === eventId &&
          r.attending &&
          r.sms_opt_in &&
          r.phone
      );
    },
  },
};

export function useLocalDb(): boolean {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
