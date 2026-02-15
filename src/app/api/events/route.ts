import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { db, useLocalDb } from "@/lib/local-db";
import { generateSlug } from "@/lib/slug";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = generateSlug();

    const eventData = {
      slug,
      title: body.title,
      date: body.date,
      time: body.time,
      location: body.location,
      host_name: body.host_name,
      host_note: body.host_note || null,
      enable_guest_notes: body.enable_guest_notes ?? true,
      enable_sms_reminders: body.enable_sms_reminders ?? false,
      sms_reminder_hours: body.sms_reminder_hours ?? 3,
      show_guest_list: body.show_guest_list ?? false,
    };

    if (useLocalDb()) {
      const event = db.events.insert(eventData);
      return NextResponse.json(event, { status: 201 });
    }

    const { data, error } = await supabase
      .from("events")
      .insert(eventData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
