"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PlansToolbar from "@/components/meal-prep-plans/PlansToolbar";
import PlanCard from "@/components/meal-prep-plans/PlanCard";
import type { MealPrepPlan } from "@/app/data/models/meal-prep-plan";

type SortKey = "date" | "calories" | "protein";

function MealPrepPlansContent() {
  const sp = useSearchParams();
  const sortParam = sp.get("sort");
  const sort: SortKey =
    sortParam === "calories" || sortParam === "protein" || sortParam === "date"
      ? sortParam
      : "date";

  const [plans, setPlans] = useState<MealPrepPlan[]>([]);

  useEffect(() => {
    fetch("/api/meal-prep-plans")
      .then((res) => res.json())
      .then((data) => setPlans(Array.isArray(data) ? data : []));
  }, []);

  const sortedPlans = useMemo(() => {
    const list = [...plans];

    if (sort === "calories") {
      return list.sort((a, b) => b.calories - a.calories);
    }

    if (sort === "protein") {
      return list.sort((a, b) => b.protein - a.protein);
    }

    return list.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }, [plans, sort]);

  return (

    <main className="min-h-dvh text-slate-900 dark:text-[#F3F4F6]">
      <div className="mx-auto w-full max-w-6xl px-2 pb-16 pt-24 sm:px-6">
        <header className="mb-1 flex flex-col items-center text-center">
          <h1 className="text-[42px] font-bold tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
            Meal Prep Plans
          </h1>
          <p className="text-base max-w-2xl text-slate-500 dark:text-[#9CA3AF] mb-10" style={{ fontSize: 16 }}>
            Discover, plan, and organize your weekly meals with ease. Browse curated plans or create your own!
          </p>
        </header>

        <div className="mb-8">
          <PlansToolbar />
        </div>

        {/* Cards Grid */}
        <section className="mt-4">
          <div className="grid gap-6 grid-cols-1">
            {sortedPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function MealPrepPlansPage() {
  return (
    <Suspense fallback={<main className="min-h-dvh text-slate-900 dark:text-[#F3F4F6]" />}>
      <MealPrepPlansContent />
    </Suspense>
  );
}
