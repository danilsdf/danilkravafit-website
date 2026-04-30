"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import MealPlanDetailBody from "@/components/pages/MealPlanDetailBody";
import type { MealPrepPlan } from "@/app/data/models/meal-prep-plan";

export default function MealPrepPlanDetailsPage() {
  const params = useParams();
  const slug = params?.slug;
  const [plan, setPlan] = useState<MealPrepPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/meal-prep-plans/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setPlan(data ?? null);
        if (!data) setError("Plan not found.");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load plan.");
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="text-center py-10 text-neutral-400">Loading...</div>;
  }
  if (error || !plan) {
    return <div className="text-center py-10 text-red-500">Plan not found.</div>;
  }
  return <MealPlanDetailBody plan={plan} backHref="/meal-prep-plans" />;
}
