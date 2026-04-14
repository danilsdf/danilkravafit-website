import type { ObjectId } from "mongodb";

/** Common */
export type NutritionBasis = "dry" | "raw" | "cooked";
export type RecipeStatus = "draft" | "published" | "archived";

/** Ingredients */
export interface UnitConversion {
  unit: string;      // e.g. "tbsp", "cup", "tsp"
  grams: number;     // how many grams in 1 unit
}

export interface Ingredient {
  _id: ObjectId;

  name: string;
  aliases?: string[];

  brand?: string | null;
  category?: string | null;

  // Nutrition per 1 gram of the specified basis
  nutritionBasis: NutritionBasis;
  kcalPer1g: number;
  proteinPer1g: number;
  carbsPer1g: number;
  fatPer1g: number;

  // Optional future fields
  fiberPer1g?: number | null;
  sugarPer1g?: number | null;
  sodiumMgPer1g?: number | null;

  unitConversions?: UnitConversion[];

  isActive: boolean;

  // Optional: flag for your workflow (not required by schema, but used in script)
  needsNutritionReview?: boolean;

  createdAt: Date;
  updatedAt: Date;
}