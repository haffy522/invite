import { NextResponse } from "next/server";
import { generateICS } from "@/lib/calendar";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Event";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "18:00";
  const location = searchParams.get("location") || "";
  const description = searchParams.get("description") || "";

  const icsContent = generateICS({ title, date, time, location, description });

  return new NextResponse(icsContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${title.replace(/[^a-zA-Z0-9]/g, "_")}.ics"`,
    },
  });
}
