export type MealPlanRecipeEntry = {
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  order: number;
  recipeId: string;
  recipe?: {
    _id: string;
    title: string;
    slug: string;
    imageUrl?: string | null;
    description?: string | null;
    servings: number;
    servingUnit?: string;
    nutritionTotals?: {
      perServing?: { kcal: number | null; protein: number | null; carbs: number | null; fat: number | null };
      perRecipe?: { kcal: number | null; protein: number | null; carbs: number | null; fat: number | null };
    };
  };
};

export type MealPrepPlan = {
  _id: string;
  id: string;

  title: string;
  startDate: string; // ISO: "2026-10-23"
  endDate: string;   // ISO

  calories: number; // per day
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams

  ingredientNames: string[]; // e.g. ["Chicken Breast", "Ground Turkey", ...]
  imageUrl?: string | null;
  isCurrentWeek?: boolean;
  isActive?: boolean;
  recipes?: MealPlanRecipeEntry[];
};
