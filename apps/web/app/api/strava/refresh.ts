import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

const STRAVA_ACCESS_TOKEN = process.env.STRAVA_ACCESS_TOKEN!; // For demo, use a static token
const CACHE_PATH = "./strava-activities-cache.json";

export async function POST(req: NextRequest) {
  // Fetch activities from Strava
  const res = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=30", {
    headers: {
      Authorization: `Bearer ${STRAVA_ACCESS_TOKEN}`,
    },
  });
  const activities = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: activities }, { status: 400 });
  }

  // Save to file
  await fs.writeFile(CACHE_PATH, JSON.stringify({ activities, updated: new Date().toISOString() }, null, 2));

  return NextResponse.json({ ok: true, count: activities.length });
}
