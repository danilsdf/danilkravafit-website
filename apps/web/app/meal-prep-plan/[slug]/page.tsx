"use client";

import mockPlans from "@/mocked/mockedMealPrepPlans.json";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import MealPlanDetailBody from "@/components/pages/MealPlanDetailBody";

export default function MealPrepPlanDetailsPage() {
  const params = useParams();
  const slug = params?.slug;
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const plan = mockPlans.find((p) => p.id == slug);
    setPlan(plan);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return <div className="text-center py-10 text-neutral-400">Loading...</div>;
  }
  if (error || !plan) {
    return <div className="text-center py-10 text-red-500">Plan not found.</div>;
  }
  return <MealPlanDetailBody plan={plan} backHref="/meal-prep-plans" />;
}
