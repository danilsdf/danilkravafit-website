"use client";

import { useState, useEffect } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Day = {
  day: string;
  iso: string;        // YYYY-MM-DD for comparison
  dateLabel: string;
  training: string;
  run?: string;
  bold?: boolean;     // long run / race highlight
};

type Week = {
  id: number;
  title: string;
  subtitle: string;
  volume: string;
  days?: Day[];
};

const WEEKS: Week[] = [
  {
    id: 1,
    title: "Week 1",
    subtitle: "Base Rebuild",
    volume: "~63 km",
    days: [
      { day: "Mon", iso: "2026-03-09", dateLabel: "Mar 9",  training: "Chest + 6 km easy",                            run: "6"  },
      { day: "Tue", iso: "2026-03-10", dateLabel: "Mar 10", training: "10 km run: 6 easy + 4 @ 4:35–4:40",            run: "10" },
      { day: "Wed", iso: "2026-03-11", dateLabel: "Mar 11", training: "Back + 6 km recovery",                         run: "6"  },
      { day: "Thu", iso: "2026-03-12", dateLabel: "Mar 12", training: "12 km aerobic",                                run: "12" },
      { day: "Fri", iso: "2026-03-13", dateLabel: "Mar 13", training: "Shoulders + 6 km easy",                        run: "6"  },
      { day: "Sat", iso: "2026-03-14", dateLabel: "Mar 14", training: "Long Run: 18 km easy",                         run: "18", bold: true },
      { day: "Sun", iso: "2026-03-15", dateLabel: "Mar 15", training: "Legs + 5 km recovery",                         run: "5"  },
    ],
  },
  {
    id: 2,
    title: "Week 2",
    subtitle: "Pre-Trip Stimulus",
    volume: "~40 km",
    days: [
      { day: "Mon", iso: "2026-03-16", dateLabel: "Mar 16", training: "Chest + 8 km easy",                            run: "8"  },
      { day: "Tue", iso: "2026-03-17", dateLabel: "Mar 17", training: "12 km run (3 easy + 6 @ MP + 3 easy)",         run: "12" },
      { day: "Wed", iso: "2026-03-18", dateLabel: "Mar 18", training: "Back + 6 km recovery",                         run: "6"  },
      { day: "Thu", iso: "2026-03-19", dateLabel: "Mar 19", training: "14 km aerobic",                                run: "14" },
      { day: "Fri", iso: "2026-03-20", dateLabel: "Mar 20", training: "Travel",                                       run: "—"  },
    ],
  },
  {
    id: 3,
    title: "Week 3",
    subtitle: "Costa Rica",
    volume: "~14 km running",
    days: [
      { day: "Sat", iso: "2026-03-21", dateLabel: "Mar 21", training: "Costa Rica — travel",                          run: "—"  },
      { day: "Sun", iso: "2026-03-22", dateLabel: "Mar 22", training: "Costa Rica",                                   run: "—"  },
      { day: "Mon", iso: "2026-03-23", dateLabel: "Mar 23", training: "Travel",                                       run: "—"  },
      { day: "Tue", iso: "2026-03-24", dateLabel: "Mar 24", training: "6–8 km beach run",                             run: "7"  },
      { day: "Wed", iso: "2026-03-25", dateLabel: "Mar 25", training: "30 km hike (2500 m elevation)",                run: "—", bold: true  },
      { day: "Thu", iso: "2026-03-26", dateLabel: "Mar 26", training: "Recovery swim / walk",                         run: "—"  },
      { day: "Fri", iso: "2026-03-27", dateLabel: "Mar 27", training: "30 km hike",                                   run: "—", bold: true  },
      { day: "Sat", iso: "2026-03-28", dateLabel: "Mar 28", training: "6 km beach run",                               run: "6"  },
      { day: "Sun", iso: "2026-03-29", dateLabel: "Mar 29", training: "Rest",                                         run: "—"  },
      { day: "Mon", iso: "2026-03-30", dateLabel: "Mar 30", training: "Travel + evening easy 6 km run",               run: "6"  },
    ],
  },
  {
    id: 4,
    title: "Week 4",
    subtitle: "Return to Running",
    volume: "~67 km",
    days: [
      { day: "Tue", iso: "2026-03-31", dateLabel: "Mar 31", training: "12 km (7 easy + 5 @ MP)",                     run: "12" },
      { day: "Wed", iso: "2026-04-01", dateLabel: "Apr 1",  training: "Back + 6 km recovery",                        run: "6"  },
      { day: "Thu", iso: "2026-04-02", dateLabel: "Apr 2",  training: "14 km aerobic",                               run: "14" },
      { day: "Fri", iso: "2026-04-03", dateLabel: "Apr 3",  training: "6 km recovery",                               run: "6"  },
      { day: "Sat", iso: "2026-04-04", dateLabel: "Apr 4",  training: "Long Run: 22 km (last 5 @ MP)",               run: "22", bold: true },
      { day: "Sun", iso: "2026-04-05", dateLabel: "Apr 5",  training: "Rest or 5 km jog",                            run: "5"  },
    ],
  },
  {
    id: 5,
    title: "Week 5",
    subtitle: "Peak Training Week",
    volume: "~87 km",
    days: [
      { day: "Mon", iso: "2026-04-06", dateLabel: "Apr 6",  training: "Chest + 8 km easy",                           run: "8"  },
      { day: "Tue", iso: "2026-04-07", dateLabel: "Apr 7",  training: "14 km (3 easy + 6 @ threshold + 5 easy)",     run: "14" },
      { day: "Wed", iso: "2026-04-08", dateLabel: "Apr 8",  training: "Back + 8 km recovery",                        run: "8"  },
      { day: "Thu", iso: "2026-04-09", dateLabel: "Apr 9",  training: "16 km aerobic",                               run: "16" },
      { day: "Fri", iso: "2026-04-10", dateLabel: "Apr 10", training: "6 km recovery",                               run: "6"  },
      { day: "Sat", iso: "2026-04-11", dateLabel: "Apr 11", training: "Long Run: 30 km (10 easy + 15 @ MP + 5 easy)", run: "30", bold: true },
      { day: "Sun", iso: "2026-04-12", dateLabel: "Apr 12", training: "Legs + 5 km recovery",                        run: "5"  },
    ],
  },
  {
    id: 6,
    title: "Week 6",
    subtitle: "10K Race Week",
    volume: "~60 km",
    days: [
      { day: "Mon", iso: "2026-04-13", dateLabel: "Apr 13", training: "8 km easy",                                   run: "8"  },
      { day: "Tue", iso: "2026-04-14", dateLabel: "Apr 14", training: "10 km (4 km @ MP inside run)",               run: "10" },
      { day: "Wed", iso: "2026-04-15", dateLabel: "Apr 15", training: "6 km recovery",                               run: "6"  },
      { day: "Thu", iso: "2026-04-16", dateLabel: "Apr 16", training: "10 km aerobic",                               run: "10" },
      { day: "Fri", iso: "2026-04-17", dateLabel: "Apr 17", training: "5 km shakeout",                               run: "5"  },
      { day: "Sat", iso: "2026-04-18", dateLabel: "Apr 18", training: "Toronto 10K Race — target 42–44 min",         run: "10", bold: true },
      { day: "Sun", iso: "2026-04-19", dateLabel: "Apr 19", training: "Long Run: 24 km easy",                        run: "24", bold: true },
    ],
  },
  {
    id: 7,
    title: "Week 7",
    subtitle: "Taper + Halifax",
    volume: "~52 km",
    days: [
      { day: "Mon", iso: "2026-04-20", dateLabel: "Apr 20", training: "8 km easy (Halifax)",                         run: "8"  },
      { day: "Tue", iso: "2026-04-21", dateLabel: "Apr 21", training: "12 km (4 km @ MP)",                           run: "12" },
      { day: "Wed", iso: "2026-04-22", dateLabel: "Apr 22", training: "Rest",                                        run: "—"  },
      { day: "Thu", iso: "2026-04-23", dateLabel: "Apr 23", training: "10 km aerobic",                               run: "10" },
      { day: "Fri", iso: "2026-04-24", dateLabel: "Apr 24", training: "6 km recovery",                               run: "6"  },
      { day: "Sat", iso: "2026-04-25", dateLabel: "Apr 25", training: "Long Run: 16 km (last 6 @ MP)",               run: "16", bold: true },
      { day: "Sun", iso: "2026-04-26", dateLabel: "Apr 26", training: "Rest",                                        run: "—"  },
    ],
  },
  {
    id: 8,
    title: "Race Week",
    subtitle: "Marathon",
    volume: "May 3, 2026",
    days: [
      { day: "Mon", iso: "2026-04-27", dateLabel: "Apr 27", training: "8 km easy",                                   run: "8"  },
      { day: "Tue", iso: "2026-04-28", dateLabel: "Apr 28", training: "6 km (2 km @ MP)",                            run: "6"  },
      { day: "Wed", iso: "2026-04-29", dateLabel: "Apr 29", training: "10 km aerobic",                               run: "10" },
      { day: "Thu", iso: "2026-04-30", dateLabel: "Apr 30", training: "Rest",                                        run: "—"  },
      { day: "Fri", iso: "2026-05-01", dateLabel: "May 1",  training: "5 km easy",                                   run: "5"  },
      { day: "Sat", iso: "2026-05-02", dateLabel: "May 2",  training: "Rest",                                        run: "—"  },
      { day: "Sun", iso: "2026-05-03", dateLabel: "May 3",  training: "MARATHON — Goal 3:20 (4:30/km)",              run: "42", bold: true },
    ],
  },
];

function getCurrentWeekIndex(todayIso: string): number {
  for (let i = 0; i < WEEKS.length; i++) {
    const days = WEEKS[i].days;
    if (!days) continue;
    const first = days[0].iso;
    const last = days[days.length - 1].iso;
    if (todayIso >= first && todayIso <= last) return i;
  }
  if (todayIso < (WEEKS[0].days?.[0].iso ?? "")) return 0;
  return WEEKS.length - 1;
}

export default function TrainingPage() {
  const [todayIso, setTodayIso] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const iso = new Date().toISOString().split("T")[0];
    setTodayIso(iso);
    setActiveIndex(getCurrentWeekIndex(iso));
  }, []);

  const activeWeek = WEEKS[activeIndex];
  const isCurrentWeek =
    todayIso !== "" && activeIndex === getCurrentWeekIndex(todayIso);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 px-5 pt-24 pb-10 md:px-10 lg:px-20">
        <div className="absolute inset-0 bg-[url('/home-page/home-background.png')] bg-cover bg-[75%_center] opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />

        <div className="relative z-10 max-w-7xl">
          <h1 className="max-w-2xl text-6xl font-black uppercase leading-none tracking-tight md:text-8xl">
            Training Program
          </h1>

          <p className="mt-6 max-w-md text-lg uppercase tracking-widest text-white/60">
            8 weeks. One goal. Discipline every day.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 rounded-xl border border-white/15 bg-white/[0.04] p-5 backdrop-blur md:grid-cols-4">
            {[
              ["8", "Weeks"],
              ["~440 km", "Total Running"],
              ["3:20:00", "Goal Time"],
              ["May 3, 2026", "Target Race"],
            ].map(([value, label]) => (
              <div key={label} className="border-white/10 md:border-r last:border-r-0">
                <p className="text-2xl font-black">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="grid gap-6 px-5 py-8 md:px-10 lg:grid-cols-[260px_1fr] lg:px-20">
        {/* SIDEBAR — horizontal scroll on mobile, sticky sidebar on lg */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:rounded-xl lg:border lg:border-white/10 lg:bg-white/[0.03] lg:p-3 lg:pb-3">
            {WEEKS.map((week, index) => {
              const isActive = index === activeIndex;
              const isCurrent =
                todayIso !== "" && index === getCurrentWeekIndex(todayIso);
              return (
                <button
                  key={week.title}
                  onClick={() => setActiveIndex(index)}
                  className={`shrink-0 rounded-lg p-3 text-left transition lg:w-full lg:p-4 ${
                    isActive
                      ? "bg-white/10 ring-1 ring-white/20"
                      : "bg-white/[0.04] hover:bg-white/[0.08]"
                  }`}
                >
                  <p className="text-sm font-black uppercase tracking-widest whitespace-nowrap lg:whitespace-normal">
                    {week.title}
                    {isCurrent && (
                      <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-white/50">
                        ← now
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-white/55 hidden lg:block">
                    {week.subtitle}
                  </p>
                </button>
              );
            })}

            <div className="hidden rounded-lg border border-white/10 p-4 lg:block">
              <p className="mb-3 text-xs font-black uppercase tracking-widest">
                Program Overview
              </p>
              <p className="text-sm text-white/70">8 weeks</p>
              <p className="text-sm text-white/70">~440 km running</p>
              <p className="text-sm text-white/70">Goal: 3:20 marathon</p>
              <p className="mt-4 text-xs italic leading-relaxed text-white/45">
                Discipline is doing what needs to be done even when you don't feel
                like doing it.
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="space-y-4">
          <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="flex flex-col gap-1 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-black uppercase tracking-wide">
                {activeWeek.title} — {activeWeek.subtitle}
                {isCurrentWeek && (
                  <span className="ml-3 text-sm font-normal normal-case tracking-normal text-white/45">
                    (current week)
                  </span>
                )}
              </h2>
              <p className="text-xs uppercase tracking-widest text-white/55">
                Weekly Volume: {activeWeek.volume}
              </p>
            </div>

            {activeWeek.days ? (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 text-xs uppercase tracking-widest text-white/45">
                      <tr>
                        <th className="px-5 py-4">Day</th>
                        <th className="px-5 py-4">Date</th>
                        <th className="px-5 py-4">Training</th>
                        <th className="px-5 py-4 text-right">Run</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeWeek.days.map((row) => {
                        const isToday = row.iso === todayIso;
                        const isPast = todayIso !== "" && row.iso < todayIso;
                        return (
                          <tr
                            key={row.iso}
                            className={`border-b border-white/10 last:border-b-0 ${
                              isToday
                                ? "bg-white text-black"
                                : isPast
                                ? "opacity-40"
                                : ""
                            }`}
                          >
                            <td className={`px-5 py-4 font-bold ${isToday ? "text-black/70" : "text-white/80"}`}>
                              {row.day}
                              {isToday && (
                                <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-black/50">
                                  today
                                </span>
                              )}
                            </td>
                            <td className={`px-5 py-4 ${isToday ? "text-black/55" : "text-white/55"}`}>
                              {row.dateLabel}
                            </td>
                            <td className="px-5 py-4 font-medium">
                              {row.bold ? <strong>{row.training}</strong> : row.training}
                            </td>
                            <td className={`px-5 py-4 text-right ${isToday ? "text-black/70" : "text-white/70"}`}>
                              {row.run} km
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden divide-y divide-white/10">
                  {activeWeek.days.map((row) => {
                    const isToday = row.iso === todayIso;
                    const isPast = todayIso !== "" && row.iso < todayIso;
                    return (
                      <div
                        key={row.iso}
                        className={`flex items-start justify-between gap-3 px-4 py-3.5 ${
                          isToday
                            ? "bg-white text-black"
                            : isPast
                            ? "opacity-40"
                            : ""
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className={`text-[11px] font-black uppercase tracking-widest mb-1 ${isToday ? "text-black/55" : "text-white/45"}`}>
                            {row.day} · {row.dateLabel}
                            {isToday && (
                              <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-black/40">
                                today
                              </span>
                            )}
                          </div>
                          <p className={`text-sm leading-snug ${row.bold ? "font-bold" : "font-medium"}`}>
                            {row.training}
                          </p>
                        </div>
                        <span className={`shrink-0 text-xs font-bold pt-0.5 ${isToday ? "text-black/60" : "text-white/50"}`}>
                          {row.run} km
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="px-5 py-8 text-sm text-white/40">
                No data available for this week yet.
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
