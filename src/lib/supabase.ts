import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) {
        throw new Error(
          "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables"
        );
      }
      _supabase = createClient(url, key);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_supabase as any)[prop as string];
  },
});

export type Event = {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  host_name: string;
  host_note: string | null;
  enable_guest_notes: boolean;
  enable_sms_reminders: boolean;
  sms_reminder_hours: number;
  show_guest_list: boolean;
  created_at: string;
};

export type RSVP = {
  id: string;
  event_id: string;
  first_name: string;
  attending: boolean;
  note: string | null;
  phone: string | null;
  sms_opt_in: boolean;
  created_at: string;
};
