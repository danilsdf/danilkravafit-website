"use client";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { RecipeDetailBody } from "@/components/pages/RecipeDetailBody";
import type { Recipe, RecipeIngredientLinePopulated } from "@/app/data/models/recipe";
import mockedRecipes from "@/mocked/mockedRecipes.json";
import mockedRecipes2 from "@/mocked/mockedRecipes2.json";
import mockedIngredients from "@/mocked/mockedIngredients.json";

const allRawRecipes = [...mockedRecipes, ...mockedRecipes2];

// Build a lookup map: ingredient _id -> ingredient object
const ingredientMap = new Map(
  mockedIngredients.map((ing) => [String(ing._id), ing])
);

// Populate ingredient references for a raw recipe JSON
function populateRecipe(raw: (typeof allRawRecipes)[number]): Recipe {
  const ingredients: RecipeIngredientLinePopulated[] = raw.ingredients.map((line) => {
    const ingredient = ingredientMap.get(String(line.ingredientId));
    return {
      quantity: line.quantity,
      unit: line.unit,
      grams: line.grams ?? null,
      note: line.note ?? null,
      ingredient: ingredient as any,
    };
  });

  return {
    ...raw,
    _id: raw._id as any,
    ingredients,
    mealPrep: raw.mealPrep ?? undefined,
    status: raw.status as any,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  } as Recipe;
}

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const recipe = useMemo(() => {
    const raw = allRawRecipes.find((r) => r.slug === slug);
    return raw ? populateRecipe(raw) : null;
  }, [slug]);
  
  // Custom back handler: go back if possible, else go to /recipes
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/recipes");
    }
  };

  if (!recipe) {
    return <div className="text-center py-10 text-red-500">Recipe not found.</div>;
  }

  return <RecipeDetailBody recipe={recipe} onBack={handleBack} />;
}
