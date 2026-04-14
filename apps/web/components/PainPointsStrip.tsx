
import React from "react";


const items = [
  {
    title: "No Time",
    description: "Long work hours and meetings leave little time for fitness.",
    image: "/home-page/painpoints/clock.png",
    imageAlt: "Clock icon",
  },
  {
    title: "Decision Fatigue",
    description: "Confusing advice and too many choices make it hard to start.",
    image: "/home-page/painpoints/brain.png",
    imageAlt: "Brain icon",
  },
  {
    title: "Slow Progress",
    description: "You work hard, but results are slow and motivation fades.",
    image: "/home-page/painpoints/chart.png",
    imageAlt: "Bar chart icon",
  },
];

export default function PainPointsStrip() {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-[#252525]">
      {/* background glow / vignette */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(245,158,11,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_160%_at_50%_100%,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-neutral-950/10 to-neutral-950/50" />
      </div>

      {/* small top handle (as in screenshot) */}
      <div className="pointer-events-none absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-white/70" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 md:gap-10">
          {items.map(({ title, description, image, imageAlt }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center"
            >
              <img src={image} alt={imageAlt} className="h-12 w-12 object-contain mb-1" />
              <h3 className="mt-3 text-lg font-semibold tracking-wide text-white sm:text-xl">
                {title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-300/80 sm:text-[15px]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
