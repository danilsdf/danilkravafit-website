import { ObjectId } from "mongodb";
import { Ingredient, RecipeStatus } from "./ingredient";

/** Recipes */
export type QuantityUnit =
  | "g"
  | "ml"
  | "tbsp"
  | "tsp"
  | "cup"
  | "piece"
  | "to taste"
  | string; // allow custom units

export interface RecipeIngredientLine {
  ingredientId: ObjectId; // ref -> Ingredient._id

  // Use null for "to taste" etc
  quantity: number | null;
  unit: QuantityUnit;

  // If you resolve unit conversions, store grams for macro calculation
  grams?: number | null;

  note?: string | null;
}

export interface InstructionTiming {
  activeMin?: number | null;
  minutes?: number | null;
  ovenC?: number | null;
}

export interface InstructionBlock {
  section: string;
  steps: string[];
  timing?: InstructionTiming;
}

export interface MealPrepInfo {
  fridgeDays?: number | null;
  freezerDays?: number | null;
  reheatNotes?: string | null;
}

export interface MacroTotals {
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

export interface NutritionTotals {
  perRecipe?: MacroTotals;
  perServing?: MacroTotals;
}

export interface Recipe {
  _id: ObjectId;

  title: string;
  imageUrl?: string | null;
  description?: string | null;
  tags?: string[];

  servings: number;         // e.g. 5
  servingUnit?: string;     // e.g. "container"

  ingredients: RecipeIngredientLinePopulated[];
  instructions: InstructionBlock[];

  mealPrep?: MealPrepInfo;

  nutritionTotals?: NutritionTotals;

  status: RecipeStatus;
  createdBy?: ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

/** Helpful: populated recipe shape (after lookup/populate) */
export interface RecipeIngredientLinePopulated extends Omit<RecipeIngredientLine, "ingredientId"> {
  ingredient: Ingredient;
}

export interface RecipePopulated extends Omit<Recipe, "ingredients"> {
  ingredients: RecipeIngredientLinePopulated[];
}

/** Create DTOs (no _id, timestamps) */
export type IngredientCreateInput = Omit<
  Ingredient,
  "_id" | "createdAt" | "updatedAt"
>;

export type RecipeCreateInput = Omit<
  Recipe,
  "_id" | "createdAt" | "updatedAt"
>;
