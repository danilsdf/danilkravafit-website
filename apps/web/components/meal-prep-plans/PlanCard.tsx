import { MealPrepPlan } from "@/app/data/models/meal-prep-plan";
import { useRouter } from "next/navigation";

function formatRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const fmt = (d: Date) => d.toLocaleString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)}–${fmt(end)}`;
}

export default function PlanCard({ plan }: { plan: MealPrepPlan }) {
  const router = useRouter();
  const range = formatRange(plan.startDate, plan.endDate);

  const recipeCount = plan.recipes?.length ?? 0;

  const preview = plan.ingredientNames.slice(0, 2).join(", ");
  const hasMore = plan.ingredientNames.length > 2;

  const go = () => router.push(`/meal-prep-plan/${plan.id}`);

  return (
    <div
      onClick={go}
      className="
        group cursor-pointer
        grid grid-cols-1 gap-4
        sm:grid-cols-[128px_1fr] sm:items-start
        lg:grid-cols-[150px_1fr_140px] lg:items-center
        rounded-2xl border border-slate-200
        bg-white
        shadow-sm
        dark:border-white/10
        dark:bg-[#171c25]
        dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_12px_26px_rgba(0,0,0,0.45)]
        transition duration-200
        hover:bg-slate-50 hover:-translate-y-[2px]
        dark:hover:bg-[#1A2236]
        px-4 py-4
      "
    >
      {/* Image */}
      <div className="h-[180px] w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 dark:bg-[#0F1424] dark:ring-white/5 sm:h-[128px] sm:w-[128px] lg:h-[144px] lg:w-[144px]">
        <img
          src={
            plan.imageUrl ??
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
          }
          alt={plan.title}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Middle content */}
      <div className="min-w-0 self-start">
        {/* Title + date (compact like screenshot) */}
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800 dark:text-[#E5E7EB] sm:truncate">
            {plan.title}
          </h2>
          <span className="text-slate-500 dark:text-[#9CA3AF]">{recipeCount} {recipeCount === 1 ? "meal" : "meals"}</span>
        </div>

        {/* Macro pills (small) */}
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-md bg-blue-100 px-2.5 py-1 text-[14px] font-semibold text-blue-600 ring-1 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/20">
            {plan.protein}g protein
          </span>
          <span className="rounded-md bg-violet-100 px-2.5 py-1 text-[14px] font-semibold text-violet-600 ring-1 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-200 dark:ring-violet-300/20">
            {plan.fat}g fat
          </span>
          <span className="rounded-md bg-amber-100 px-2.5 py-1 text-[14px] font-semibold text-amber-600 ring-1 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-300/20">
            {plan.carbs}g carbs
          </span>
        </div>

        {/* Ingredients preview (single line) */}
        <div className="mt-5 truncate text-[14px] text-slate-500 dark:text-[#9CA3AF]">
          {preview}
          {hasMore ? ", …" : ""}
        </div>
      </div>

      {/* Right column */}
      <div className="flex h-full flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between lg:col-span-1 lg:flex-col lg:items-end lg:justify-between lg:gap-0">
        {/* Top right calories label */}
        <div className="text-[14px]">
          <span className="font-semibold text-slate-500 dark:text-[#6d737f]">Calories: </span><span className="font-bold">{plan.calories}</span>
        </div>

        {/* CTA */}
        <button
          className="
            w-full rounded-2xl bg-blue-100 px-8 py-2 sm:w-auto
            text-[14px] font-semibold text-blue-700
            shadow-sm ring-1 ring-blue-200
            dark:bg-blue-500/20 dark:text-white dark:ring-white/10
            transition
            hover:bg-blue-500 hover:text-white
          "
          onClick={(e) => {
            e.stopPropagation();
            go();
          }}
        >
          View Plan
        </button>
      </div>
    </div>
  );
}
