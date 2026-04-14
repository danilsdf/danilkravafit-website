import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me | Hybrid Athlete Hub",
  description: "Learn more about Danil Kravchenko, a hybrid athlete and professional, and his approach to fitness, nutrition, and life.",
  openGraph: {
    title: "About Me | Hybrid Athlete Hub",
    description: "Learn more about Danil Kravchenko, a hybrid athlete and professional, and his approach to fitness, nutrition, and life.",
    url: "https://danilkrava.fit/about-me",
    siteName: "Danil Kravchenko",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me | Hybrid Athlete Hub",
    description: "Learn more about Danil Kravchenko, a hybrid athlete and professional, and his approach to fitness, nutrition, and life.",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-12 text-black dark:text-white">
      <section className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#d2a852] dark:text-[#f0c46a] sm:text-3xl">Danil Kravchenko</h1>
          <p className="mt-1 text-base font-semibold text-neutral-500 dark:text-neutral-400">Hybrid Athlete</p>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-200">
          <p>I'm Danil—a hybrid athlete balancing a full-time job and training. My story is about fitting lifting, boxing, and running into real life, not chasing perfection. Early mornings, late nights, and meal prep became my routine. This site is my logbook: honest progress, mistakes, and what works for me.</p>
          <p>If you want to connect or follow my journey, check out the links below. I am always happy to chat and share what I've learned.</p>

          {/* 2026 Goals Section */}
          <h2 className="mt-8 text-lg font-bold text-[#d2a852] dark:text-[#f0c46a]">My 2026 Goals</h2>
          <ul className="list-disc ml-6">
            <li><strong>Jan–Mar:</strong> 60-day fat loss (discipline, structure, visible results)</li>
            <li><strong>May:</strong> Marathon prep (endurance, mental toughness)</li>
            <li><strong>July:</strong> Spartan / hybrid event (strength + grit)</li>
            <li><strong>September:</strong> Second marathon</li>
            <li><strong>Oct–Jan:</strong> Bulking</li>
          </ul>
          {/* Shortened sections */}
          <h2 className="mt-8 text-lg font-bold text-[#d2a852] dark:text-[#f0c46a]">Why this exists</h2>
          <p>Fitness advice rarely fits real life. I work, train, and track progress as best I can. This site is for busy people who want results without burnout or extremes.</p>

          <h2 className="mt-8 text-lg font-bold text-[#d2a852] dark:text-[#f0c46a]">What I actually do</h2>
          <p>Hybrid training: strength, boxing, running, and structured nutrition. I share routines, meal prep, and honest progress—what works for me, mistakes included.</p>

          <h2 className="mt-8 text-lg font-bold text-[#d2a852] dark:text-[#f0c46a]">Who this is for</h2>
          <p>If you work a normal job, want to lose fat, and stay fit without wrecking your energy, you’ll relate. It’s about staying healthy while life keeps moving.</p>

          <h2 className="mt-8 text-lg font-bold text-[#d2a852] dark:text-[#f0c46a]">What you’ll find here</h2>
          <p>Simple fat-loss principles, meal prep tips, training structure, honest updates, and tools to make decisions easier.</p>
        </div>
        {/* Connect section */}
        <div className="mt-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Connect</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <a href="https://instagram.com/danilkravafit" target="_blank" rel="noreferrer" className="rounded-full border border-[#d2a852] dark:border-[#f0c46a] bg-[#f7f7f7] dark:bg-[#23232a] px-4 py-1 font-medium text-[#d2a852] dark:text-[#f0c46a] hover:bg-[#d2a852] hover:text-[#18181b] dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] transition-colors">Instagram</a>
            <a href="https://www.strava.com/athletes/66921238" target="_blank" rel="noreferrer" className="rounded-full border border-[#d2a852] dark:border-[#f0c46a] bg-[#f7f7f7] dark:bg-[#23232a] px-4 py-1 font-medium text-[#d2a852] dark:text-[#f0c46a] hover:bg-[#d2a852] hover:text-[#18181b] dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] transition-colors">Strava</a>
            <a href="https://www.linkedin.com/in/kravchenkodanil/" target="_blank" rel="noreferrer" className="rounded-full border border-[#d2a852] dark:border-[#f0c46a] bg-[#f7f7f7] dark:bg-[#23232a] px-4 py-1 font-medium text-[#d2a852] dark:text-[#f0c46a] hover:bg-[#d2a852] hover:text-[#18181b] dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] transition-colors">LinkedIn</a>
            <a href="mailto:danil.kravchenko.dev@gmail.com" className="rounded-full border border-[#d2a852] dark:border-[#f0c46a] bg-[#f7f7f7] dark:bg-[#23232a] px-4 py-1 font-medium text-[#d2a852] dark:text-[#f0c46a] hover:bg-[#d2a852] hover:text-[#18181b] dark:hover:bg-[#f0c46a] dark:hover:text-[#23232a] transition-colors">Email</a>
          </div>
        </div>
      </section>
    </div>
  );
}
