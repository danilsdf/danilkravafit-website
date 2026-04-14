import { MacroTotals, RecipePopulated } from "../models/recipe";

export type RecipeUI = {
  id: string;
  title: string;
  imageUrl?: string | null;
  description?: string | null;
  tags: string[];

  servings: number;
  servingUnit?: string | null;

  // quick preview fields (optional but useful for cards)
  previewIngredients: string[]; // ingredient names
  macrosPerServing?: MacroTotals | null;
  macrosPerRecipe?: MacroTotals | null;

  status: string;
  createdAt: string;
  updatedAt: string;
};

export function toRecipeUI(r: RecipePopulated): RecipeUI {
  return {
    id: r._id.toString(),
    title: r.title,
    imageUrl: r.imageUrl ?? null,
    description: r.description ?? null,
    tags: r.tags ?? [],
    servings: r.servings,
    servingUnit: r.servingUnit ?? null,
    previewIngredients: r.ingredients
      .map((x) => x.ingredient?.name)
      .filter(Boolean)
      .slice(0, 3) as string[],
    macrosPerServing: r.nutritionTotals?.perServing ?? null,
    macrosPerRecipe: r.nutritionTotals?.perRecipe ?? null,
    status: String(r.status),
    createdAt: new Date(r.createdAt).toISOString(),
    updatedAt: new Date(r.updatedAt).toISOString(),
  };
}
