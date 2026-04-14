import { useEffect, useState } from "react";
export default LogLine;

function LogLine({ activity }: { activity: any }) {
  const sportLabel = getSportTypeLabel(activity.sport_type);
  return (
    <a
      href={`https://www.strava.com/activities/${activity.id}`}
      className="block group"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center gap-3 rounded-xl bg-black/5 dark:bg-white/5 px-3 py-2 transition-colors duration-150 hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-lg">
        <div className="h-8 w-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center overflow-hidden">
          {getActivityIcon(activity)}
        </div>
        <div>
          <div className="text-[11px] font-semibold text-black dark:text-white">{sportLabel}</div>
          <div className="text-[10px] text-black/60 dark:text-white/60 flex flex-row flex-wrap gap-x-3 gap-y-1 items-center">
            <span className="truncate text-xs text-black/60 dark:text-white/60 max-w-xs">{activity.name}</span>
            <span className="text-xs text-[#d2a852] font-semibold whitespace-nowrap bg-[#d2a852]/10 rounded px-2 py-0.5">
              {activity.distance > 0 ? (activity.distance / 1000).toFixed(2) + ' km' : ''}
            </span>
            <span className="text-xs text-black/60 dark:text-white/60 whitespace-nowrap">
              {activity.moving_time ? Math.round(activity.moving_time / 60) + ' min' : ''}
            </span>
            <span className="text-xs text-black/40 dark:text-white/40 whitespace-nowrap">
              <LocalizedDate dateString={activity.start_date} />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}


function getSportTypeLabel(sportType: string): string {
  if (!sportType) return "Other";
  return sportType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function getActivityIcon(activity: any) {
    const type = (activity.sport_type || "").toLowerCase();
    if (type.includes("run")) {
      return <span className="text-lg">🏃‍♂️</span>;
    }
    if (type.includes("workout")) {
      return <span className="text-lg">🥊</span>;
    }
    if (type.includes("gym") || type.includes("strength") || type.includes("weight")) {
      return <span className="text-lg">🏋️‍♂️</span>;
    }
    // fallback
    return <span className="text-lg">🏃</span>;
}

function LocalizedDate({ dateString }: { dateString: string }) {
    const [local, setLocal] = useState<string>("");
    useEffect(() => {
        if (dateString) {
        setLocal(new Date(dateString).toLocaleString());
        }
    }, [dateString]);
    return <>{local || dateString || ""}</>;
}