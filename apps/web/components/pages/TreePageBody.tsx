"use client";
import { useState } from "react";

export default function TreePageBody() {
  const [copied, setCopied] = useState(false);
  return (
    <main className="min-h-screen flex justify-center px-4 sm:px-0">
      {/* Phone card */}
      <div
        className="w-full max-w-[390px] h-full mt-0 bg-background bg-card rounded-[28px] shadow-2xl px-6 py-8 text-center relative
        sm:mt-10 sm:rounded-[28px] sm:shadow-2xl sm:px-6 sm:py-8
        min-h-screen min-w-screen fixed top-0 left-0 right-0 bottom-0 m-0 rounded-none shadow-none px-0 py-0 sm:min-h-0 sm:min-w-0 sm:relative sm:m-0 sm:rounded-[28px] sm:shadow-2xl sm:px-6 sm:py-8
        "
      >
        {/* Top icons */}
        <button
          type="button"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-sm hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer"
          title="Copy link"
          aria-label="Share"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          <span>🔗</span>
          {copied && (
            <span className="absolute top-12 right-6 translate-x-1/2 bg-primary text-white text-xs rounded px-2 py-1 shadow z-10 whitespace-nowrap transition-opacity duration-200 opacity-100 pointer-events-none select-none">
              Link copied!
            </span>
          )}
        </button>

        {/* Avatar */}
        <div className="mt-6 flex justify-center">
          <img
            src="/avatar.webp"
            alt="Danil avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/30"
          />
        </div>

        {/* Name */}
        <h1 className="mt-4 text-xl font-semibold text-primary">
          Danil | Hybrid Athlete
        </h1>

        {/* Bio */}
        <p className="mt-2 text-sm text-primary/80 leading-relaxed">
          Full-time worker · Hybrid athlete 🏃‍♂️ <br />
          Helping busy people get fit 💪 <br />
          Daily routines, meal prep & recovery tips
        </p>

        {/* Social icons */}
        <div className="mt-4 flex justify-center gap-4 text-primary text-xl">
          <a href="https://instagram.com/danilkravafit" target="_blank" rel="noopener" aria-label="Instagram">
            <img src="/social/instagram.png" alt="Instagram" className="h-5 w-5 opacity-70 hover:opacity-100 transition" />
          </a>
          <a href="https://www.strava.com/athletes/66921238" target="_blank" rel="noopener" aria-label="Strava">
            <img src="/social/strava.png" alt="Strava" className="h-5 w-5 opacity-70 hover:opacity-100 transition" />
          </a>
          <a href="https://tiktok.com/@danilkravafit" target="_blank" rel="noopener" aria-label="TikTok">
            <img src="/social/tiktok.png" alt="TikTok" className="h-5 w-5 opacity-70 hover:opacity-100 transition" />
          </a>
          <a href="https://www.linkedin.com/in/kravchenkodanil/" target="_blank" rel="noopener" aria-label="LinkedIn">
            <img src="/social/linkedin.png" alt="LinkedIn" className="h-5 w-5 opacity-70 hover:opacity-100 transition" />
          </a>
        </div>

        {/* Links */}
        <div className="mt-6 space-y-4">
          <LinkButton label="Current meal prep" link="/meal-prep-plan/high-protein-cut" blank={false} />
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 border-t border-primary/15" />
            <span className="text-xs text-primary/40 uppercase tracking-widest select-none"></span>
            <div className="flex-1 border-t border-primary/15" />
          </div>
          <LinkButton label="Meal prep helper" link="/tool/meal-prep-helper" blank={false} />
          <LinkButton label="Strava" link="https://www.strava.com/athletes/66921238" blank={true} />
          <LinkButton label="Instagram" link="https://instagram.com/danilkravafit" blank={true} />
          <LinkButton label="TikTok" link="https://tiktok.com/@danilkravafit" blank={true} />
          <LinkButton label="Calories calculator" link="/tool/calories-calculator" blank={false} />
          <LinkButton label="About me" link="/about-me" blank={false} />
        </div>
      </div>
    </main>
  );
}

type LinkButtonProps = {
  label: string;
  link?: string;
  blank?: boolean;
};

function LinkButton({ label, link, blank }: LinkButtonProps) {
  const content = (
    <button
      className="w-full bg-white dark:bg-neutral-800 rounded-full py-4 px-6 flex items-center justify-center relative shadow transition-colors duration-150 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 group cursor-pointer"
    >
      <span className="text-primary font-medium group-hover:text-primary/90 transition-colors duration-150">{label}</span>
      <span className="absolute right-4 text-primary/60 group-hover:text-primary transition-colors duration-150">⋮</span>
    </button>
  );
  return link ? (
    <a href={link} target={blank ? "_blank" : undefined} rel={blank ? "noopener noreferrer" : undefined} className="block w-full">{content}</a>
  ) : content;
}
