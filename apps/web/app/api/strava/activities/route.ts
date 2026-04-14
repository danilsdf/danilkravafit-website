import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

const CACHE_PATH = "./strava-activities-cache.json";
const STRAVA_ACCESS_TOKEN = "bdd34c29474c49a4aff68b8d241f0debeb5586c2" // For demo, use a static token;

async function fetchAndCacheActivities() {
  const res = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=30", {
    headers: {
      Authorization: `Bearer ${STRAVA_ACCESS_TOKEN}`,
    },
  });
  const activities = await res.json();
  console.log("Fetching fresh data from Strava API, response status:", res);
  if (!res.ok) throw new Error("Failed to fetch from Strava");
  const cacheData = { activities, updated: new Date().toISOString() };
  await fs.writeFile(CACHE_PATH, JSON.stringify(cacheData, null, 2));
  return cacheData;
}

export async function GET(req: NextRequest) {
  try {
    const data = await fs.readFile(CACHE_PATH, "utf-8");
    const parsed = JSON.parse(data);
    return NextResponse.json(parsed);
  } catch (e) {
    // If file doesn't exist, fetch and cache
    try {
      const fresh = await fetchAndCacheActivities();
      return NextResponse.json(fresh);
    } catch (err) {
      return NextResponse.json({ activities: [], updated: null, error: "Unable to fetch Strava data" }, { status: 500 });
    }
  }
}
