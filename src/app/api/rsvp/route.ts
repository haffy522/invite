import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.event_id || !body.first_name || body.attending === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: event_id, first_name, attending" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("rsvps")
      .insert({
        event_id: body.event_id,
        first_name: body.first_name.trim(),
        attending: body.attending,
        note: body.note?.trim() || null,
        phone: body.phone?.trim() || null,
        sms_opt_in: body.sms_opt_in ?? false,
      })
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
