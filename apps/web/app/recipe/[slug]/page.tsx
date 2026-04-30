"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RecipeDetailBody } from "@/components/pages/RecipeDetailBody";
import type { Recipe } from "@/app/data/models/recipe";

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/recipes/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setRecipe(data ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/recipes");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-neutral-400">Loading...</div>;
  }

  if (!recipe) {
    return <div className="text-center py-10 text-red-500">Recipe not found.</div>;
  }

  return <RecipeDetailBody recipe={recipe} onBack={handleBack} />;
}
