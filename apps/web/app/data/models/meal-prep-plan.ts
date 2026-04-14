export type MealPrepPlan = {
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
};
