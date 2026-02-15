import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { db, useLocalDb } from "@/lib/local-db";

// This endpoint can be called by a cron job to send SMS reminders
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const reminders: { phone: string; message: string }[] = [];

    if (useLocalDb()) {
      const events = db.events.findWithSmsReminders();
      for (const event of events) {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const reminderTime = new Date(
          eventDateTime.getTime() - event.sms_reminder_hours * 60 * 60 * 1000
        );
        const diffMs = Math.abs(now.getTime() - reminderTime.getTime());
        if (diffMs > 15 * 60 * 1000) continue;

        const optedIn = db.rsvps.findOptedInByEventId(event.id);
        for (const rsvp of optedIn) {
          reminders.push({
            phone: rsvp.phone!,
            message: `Salam ${rsvp.first_name}! Reminder: ${event.title} is today at ${event.time} — ${event.location}. Looking forward to seeing you!`,
          });
        }
      }
    } else {
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .eq("enable_sms_reminders", true);

      if (eventsError) {
        return NextResponse.json(
          { error: eventsError.message },
          { status: 500 }
        );
      }

      for (const event of events || []) {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const reminderTime = new Date(
          eventDateTime.getTime() - event.sms_reminder_hours * 60 * 60 * 1000
        );
        const diffMs = Math.abs(now.getTime() - reminderTime.getTime());
        if (diffMs > 15 * 60 * 1000) continue;

        const { data: rsvps } = await supabase
          .from("rsvps")
          .select("*")
          .eq("event_id", event.id)
          .eq("attending", true)
          .eq("sms_opt_in", true);

        for (const rsvp of rsvps || []) {
          if (!rsvp.phone) continue;
          reminders.push({
            phone: rsvp.phone,
            message: `Salam ${rsvp.first_name}! Reminder: ${event.title} is today at ${event.time} — ${event.location}. Looking forward to seeing you!`,
          });
        }
      }
    }

    // Send via Twilio if configured
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (twilioSid && twilioToken && twilioPhone) {
      for (const reminder of reminders) {
        try {
          const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
          await fetch(twilioUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization:
                "Basic " +
                Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64"),
            },
            body: new URLSearchParams({
              From: twilioPhone,
              To: reminder.phone,
              Body: reminder.message,
            }),
          });
        } catch (err) {
          console.error("Failed to send SMS:", err);
        }
      }
    }

    return NextResponse.json({
      sent: reminders.length,
      twilioConfigured: !!(twilioSid && twilioToken && twilioPhone),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
