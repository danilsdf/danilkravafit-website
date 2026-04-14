"use client"

import MainFooter from "@/components/footer/MainFooter";
import MainHeader from "@/components/headers/MainHeader";
import PainPointsStrip from "@/components/PainPointsStrip";

type ToolLink = {
  href: string;
  label: string;
  description: string;
  icon?: string;
};

const toolLinks: ToolLink[] = [
  {
    href: "/tool/calories-calculator",
    label: "Calories Calculator",
    description: "Dial in calories and macros for hybrid training.",
    icon: "🍽️",
  },
  {
    href: "/tool/meal-plan-generator",
    label: "Meal Plans",
    description: "Auto-generate weekly meal prep based on your macros.",
    icon: "📆",
  },
  {
    href: "/tool/training-templates",
    label: "Training Templates",
    description: "Ready-to-use hybrid training week templates.",
    icon: "📑",
  },
  {
    href: "/tool/workout-generator",
    label: "Workout Gen",
    description: "Build structured gym sessions around your goals.",
    icon: "🏋️‍♂️",
  },
];

export default function HomePage() {
  return (
    <>
      <MainHeader />
      <div className="bg-[#1a1a1a] text-white min-h-screen flex flex-col font-sans">
        {/* Hero Section */}
        <section className="relative flex flex-col md:flex-row min-h-[90vh]">
          {/* Split Background Images */}
          <div className="absolute flex w-full h-full z-0">
            <div className="w-1/2 h-full hidden md:block">
              <img src="/home-page/home-working.jpg" alt="Professional" className="w-full h-full object-cover object-center" />
            </div>
            <div className="w-1/2 h-full hidden md:block">
              <img src="/home-page/home-athlete.PNG" alt="Athlete" className="w-full h-full object-cover object-center" />
            </div>
            {/* Mobile: Stacked images */}
            <div className="w-full h-1/2 md:hidden">
              <img src="/home-page/home-working.jpg" alt="Professional" className="w-full h-full object-cover object-center" />
            </div>
            <div className="w-full h-1/2 md:hidden">
              <img src="/home-page/home-athlete.PNG" alt="Athlete" className="w-full h-full object-cover object-center" />
            </div>
            <div className="absolute bg-gradient-to-b from-[#1a1a1a]/80 to-[#2d2d2d]/90"></div>
          </div>
          {/* Glassmorphism Card - bottom half overlay */}
          <div className="absolute bottom-0 left-0 w-full flex justify-center z-10 pointer-events-none">
            <div className="pointer-events-auto bg-[#232323]/90 border border-white/10 w-full mx-auto p-6 md:p-10 flex flex-col items-center text-center shadow-xl">
              <h1 className="text-2xl md:text-4xl font-extrabold mb-3 text-white leading-tight">Training for a better body with a full-time job</h1>
              <p className="text-base md:text-lg text-white/80 mb-6 font-medium">Early mornings, late nights, and meal prep became my routine. This site is my logbook: honest progress, mistakes, and what works for me.

If you want to connect or follow my journey, check out the links below. I am always happy to chat and share what I've learned.</p>
              {/* <a href="#lead-magnet" className="w-full md:w-auto inline-block bg-[#e5ae51] text-[#1a1a1a] font-bold text-base md:text-lg px-8 py-4 rounded-full shadow-lg hover:bg-[#f0c46a] transition mb-1 md:mb-2" id="main-cta">Download Free 7-Day Meal Plan</a> */}
            </div>
          </div>
        </section>

        <PainPointsStrip></PainPointsStrip>

        {/* Instagram/Proof Section */}
        <section className="bg-[#2e2f30] py-16 px-4" id="transformations">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">Real Progress in Real Time</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <a href="https://www.instagram.com/danilkravafit/reel/DT-3n1RifCo/" target="_blank" className="relative aspect-square group block">
                <img src="/home-page/results/routines.jpg" alt="Routines" className="w-full h-full object-cover rounded-xl group-hover:opacity-90 transition" />
                <span className="absolute bottom-2 left-2 bg-[#1a1a1a]/80 text-[#e5ae51] text-xs md:text-sm font-bold px-3 py-1 rounded-full group-hover:bg-[#e5ae51]/80 group-hover:text-[#1a1a1a] transition">Routines</span>
              </a>
              <a href="https://www.instagram.com/danilkravafit/reel/DUG3iIbCXzv/" target="_blank" className="relative aspect-square group block">
                <img src="/home-page/results/tips.jpg" alt="Tips" className="w-full h-full object-cover rounded-xl group-hover:opacity-90 transition" />
                <span className="absolute bottom-2 left-2 bg-[#1a1a1a]/80 text-[#e5ae51] text-xs md:text-sm font-bold px-3 py-1 rounded-full group-hover:bg-[#e5ae51]/80 group-hover:text-[#1a1a1a] transition">Tips</span>
              </a>
              <a href="https://www.instagram.com/danilkravafit/reel/DSa9uYSifqg/" target="_blank" className="relative aspect-square group block">
                <img src="/home-page/results/nutritions.jpg" alt="Nutritions" className="w-full h-full object-cover rounded-xl group-hover:opacity-90 transition" />
                <span className="absolute bottom-2 left-2 bg-[#1a1a1a]/80 text-[#e5ae51] text-xs md:text-sm font-bold px-3 py-1 rounded-full group-hover:bg-[#e5ae51]/80 group-hover:text-[#1a1a1a] transition">Nutritions</span>
              </a>
              <a href="https://www.instagram.com/danilkravafit/reel/DUTYVuVkczg/" target="_blank" className="relative aspect-square group block">
                <img src="/home-page/results/progress.png" alt="Progress" className="w-full h-full object-cover rounded-xl group-hover:opacity-90 transition" />
                <span className="absolute bottom-2 left-2 bg-[#1a1a1a]/80 text-[#e5ae51] text-xs md:text-sm font-bold px-3 py-1 rounded-full group-hover:bg-[#e5ae51]/80 group-hover:text-[#1a1a1a] transition">Progress</span>
              </a>
            </div>
            <div className="flex justify-center">
              <a href="https://instagram.com/danilkravafit" target="_blank" className="px-6 py-2 rounded-full border-2 border-[#e5ae51] text-[#e5ae51] font-bold hover:bg-[#e5ae51] hover:text-[#1a1a1a] transition">Follow on Instagram</a>
            </div>
          </div>
        </section>

        {/* The Solution (How it Works) */}
        {/* <section className="max-w-5xl mx-auto py-16 px-4" id="about">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center bg-[#2d2d2d] rounded-2xl p-8 shadow hover:shadow-lg transition">
              <img src="/home-page/solution/meals.png" alt="Custom Nutrition" className="h-13 w-14 mb-3 object-contain" />
              <h3 className="font-bold text-lg mb-2">Custom Nutrition</h3>
              <p className="text-white/80">A personalized meal plan that fits your work and life</p>
              <span className="mt-4 text-xs uppercase tracking-widest text-[#e5ae51] font-bold">The Fuel</span>
            </div>
            <div className="flex flex-col items-center text-center bg-[#2d2d2d] rounded-2xl p-8 shadow hover:shadow-lg transition">
              <img src="/home-page/solution/workouts.png" alt="Efficient Workouts" className="h-14 w-14 mb-3 object-contain" />
              <h3 className="font-bold text-lg mb-2">Efficient Workouts</h3>
              <p className="text-white/80">Sessions you can do anywhere, designed for real results</p>
              <span className="mt-4 text-xs uppercase tracking-widest text-[#e5ae51] font-bold">The Engine</span>
            </div>
            <div className="flex flex-col items-center text-center bg-[#2d2d2d] rounded-2xl p-8 shadow hover:shadow-lg transition">
              <img src="/home-page/solution/chat.png" alt="1-on-1 Accountability" className="h-14 w-14 mb-3 object-contain" />
              <h3 className="font-bold text-lg mb-2">1-on-1 Accountability</h3>
              <p className="text-white/80">Daily check-ins and support from your coach — never go it alone</p>
              <span className="mt-4 text-xs uppercase tracking-widest text-[#e5ae51] font-bold">The Driver</span>
            </div>
          </div>
        </section> */}

        {/* Lead Magnet / Contact Form */}
        {/* <section id="lead-magnet" className="max-w-2xl mx-auto py-16 px-4">
          <div className="bg-[#2d2d2d] rounded-2xl p-8 shadow-lg flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-4">Get Your Free Full Week Meal Plan</h2>
            <p className="text-white/80 text-center mb-8">Enter your details below and get instant access to simple, high-protein recipes for busy workdays.</p>
            <form className="w-full flex flex-col gap-4" id="lead-form" onSubmit={e => { e.preventDefault(); document.getElementById('thankyou')?.classList.remove('hidden'); }}>
              <input type="text" name="name" placeholder="Name" required className="w-full rounded-lg border border-[#e5ae51]/30 px-4 py-3 bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-[#e5ae51] font-medium" />
              <input type="email" name="email" placeholder="Email" required className="w-full rounded-lg border border-[#e5ae51]/30 px-4 py-3 bg-[#1a1a1a] text-white focus:outline-none focus:ring-2 focus:ring-[#e5ae51] font-medium" />
              <button type="submit" className="bg-[#e5ae51] text-[#1a1a1a] font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-[#f0c46a] transition">Send Me Free Meal Plan</button>
            </form>
            <div id="thankyou" className="hidden mt-6 text-[#e5ae51] font-bold text-center">Thank you! Check your inbox for your meal plan.</div>
          </div>
        </section> */}
      </div>
      <MainFooter />
    </>
  );
}
