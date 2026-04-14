// app/layout.tsx
export default function MainFooter() {
  return (
    <footer className="mt-12 border-t border-black/10 dark:border-white/10 p-4 text-[10px] text-black/40 dark:text-white/40 flex flex-col items-center gap-2">
        <div className="flex gap-4 mb-1">
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
        <span>Hybrid Athlete Hub · Built for strength & endurance.</span>
    </footer>
  );
}
