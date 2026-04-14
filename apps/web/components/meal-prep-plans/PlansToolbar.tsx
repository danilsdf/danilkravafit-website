"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SortKey = "date" | "calories" | "protein";

const options: { key: SortKey; label: string; order?: string }[] = [
  { key: "date", label: "Date", order: "Date (earliest first)" },
  { key: "calories", label: "Calories", order: "Calories (high to low)" },
  { key: "protein", label: "Protein", order: "Protein (high to low)" },
];

export default function PlansToolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const sort = (sp.get("sort") as SortKey) || "date";

  const setSort = (key: SortKey) => {
    const next = new URLSearchParams(sp.toString());
    next.set("sort", key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const activeLabel = useMemo(
    () => options.find((o) => o.key === sort)?.order ?? "Date (earliest first)",
    [sort]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((o) => {
        const isActive = o.key === sort;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => setSort(o.key)}
            aria-pressed={isActive}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition",
              "border backdrop-blur",
              isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "border-slate-200 bg-white/60 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-600 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}

      <div className="ml-auto hidden text-sm font-semibold md:block" aria-live="polite">
        Sorting: <span className="text-emerald-700 dark:text-emerald-400">{activeLabel}</span>
      </div>
    </div>
  );
}
