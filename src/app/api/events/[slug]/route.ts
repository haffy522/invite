import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { db, useLocalDb } from "@/lib/local-db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (useLocalDb()) {
    const event = db.events.findBySlug(slug);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const rsvps = db.rsvps.findByEventId(event.id);
    return NextResponse.json({ event, rsvps });
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (eventError || !event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const { data: rsvps, error: rsvpError } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: true });

  if (rsvpError) {
    return NextResponse.json({ error: rsvpError.message }, { status: 500 });
  }

  return NextResponse.json({ event, rsvps: rsvps || [] });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();

  if (useLocalDb()) {
    const event = db.events.updateBySlug(slug, body);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  }

  const { data, error } = await supabase
    .from("events")
    .update(body)
    .eq("slug", slug)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
