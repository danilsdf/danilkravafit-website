"use client";

import { useEffect, useState } from "react";
import { isToday, isYesterday, isThisWeek, parseISO, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from "date-fns";
import type { Day } from "date-fns";
import LogLine from "@/components/LogRow";

export default function TrainingLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [updated, setUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/strava/activities")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.activities || []);
        setUpdated(data.updated || null);
        setLoading(false);
      });
  }, []);

  // Helper for last week
  function isLastWeek(date: Date, options?: { weekStartsOn?: number }) {
    const weekStartsOn = (options?.weekStartsOn ?? 1) as Day;
    const now = new Date();
    const start = startOfWeek(subWeeks(now, 1), { weekStartsOn });
    const end = endOfWeek(subWeeks(now, 1), { weekStartsOn });
    return isWithinInterval(date, { start, end });
  }

  // Grouping helpers
  function groupActivities(logs: any[]) {
    const today: any[] = [];
    const yesterday: any[] = [];
    const thisWeek: any[] = [];
    const lastWeek: any[] = [];
    const rest: any[] = [];
    const now = new Date();
    for (const act of logs) {
      const d = parseISO(act.start_date);
      if (isToday(d)) today.push(act);
      else if (isYesterday(d)) yesterday.push(act);
      else if (isThisWeek(d, { weekStartsOn: 1 }) && d < now) thisWeek.push(act);
      else if (isLastWeek(d, { weekStartsOn: 1 })) lastWeek.push(act);
      else rest.push(act);
    }
    return { today, yesterday, thisWeek, lastWeek, rest };
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 text-neutral-900 dark:text-neutral-100">
      {/* PAGE TITLE */}
      <section className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-neutral-900 dark:text-neutral-100">
          Training Logs
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Last 30 days workouts, sorted by category. See progress by date.
        </p>
        {updated && (
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">Last updated: {new Date(updated).toLocaleString()}</p>
        )}
      </section>

      {loading ? (
        <div className="text-neutral-400 dark:text-neutral-500">Loading...</div>
      ) : logs.length === 0 ? (
        <div className="text-neutral-400 dark:text-neutral-500">No logs found.</div>
      ) : (
        (() => {
          const groups = groupActivities(logs);
          return (
            <div className="flex flex-col gap-8">
              {groups.today.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-bold text-yellow-600 dark:text-yellow-400">Today</h2>
                  <ul className="flex flex-col gap-4">
                    {groups.today.map((activity) => (
                      <li key={activity.id}><LogLine activity={activity} /></li>
                    ))}
                  </ul>
                </div>
              )}
              {groups.yesterday.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-bold text-yellow-600 dark:text-yellow-400">Yesterday</h2>
                  <ul className="flex flex-col gap-4">
                    {groups.yesterday.map((activity) => (
                      <li key={activity.id}><LogLine activity={activity} /></li>
                    ))}
                  </ul>
                </div>
              )}
              {groups.thisWeek.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-bold text-yellow-600 dark:text-yellow-400">This Week</h2>
                  <ul className="flex flex-col gap-4">
                    {groups.thisWeek.map((activity) => (
                      <li key={activity.id}><LogLine activity={activity} /></li>
                    ))}
                  </ul>
                </div>
              )}
              {groups.lastWeek.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-bold text-yellow-600 dark:text-yellow-400">Last Week</h2>
                  <ul className="flex flex-col gap-4">
                    {groups.lastWeek.map((activity) => (
                      <li key={activity.id}><LogLine activity={activity} /></li>
                    ))}
                  </ul>
                </div>
              )}
              {groups.rest.length > 0 && (
                <div>
                  <h2 className="mb-2 text-lg font-bold text-yellow-600 dark:text-yellow-400">Earlier</h2>
                  <ul className="flex flex-col gap-4">
                    {groups.rest.map((activity) => (
                      <li key={activity.id}><LogLine activity={activity} /></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })()
      )}
      {/* Strava profile link */}
      <div className="mt-12 flex justify-center">
        <a
          href="https://www.strava.com/athletes/66921238"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 rounded-lg bg-orange-600 text-white font-semibold shadow hover:bg-yellow-600 dark:hover:bg-yellow-400 transition-colors text-lg"
        >
          View my Strava profile ↗
        </a>
      </div>
    </div>
  );
}
