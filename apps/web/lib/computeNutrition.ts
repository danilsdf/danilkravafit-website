import type { Db } from "mongodb";
import { ObjectId } from "mongodb";
import type { NutritionTotals, MacroTotals } from "@/app/data/models/recipe";

type IngredientLine = {
  ingredientId: string;
  quantity: number | null;
  unit: string;
};

type IngredientDoc = {
  _id: ObjectId;
  kcalPer1g: number;
  proteinPer1g: number;
  carbsPer1g: number;
  fatPer1g: number;
  unitConversions?: { unit: string; grams: number }[];
};

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

function toObjectId(id: string): ObjectId | null {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

function resolveGrams(line: IngredientLine, ing: IngredientDoc): number | null {
  if (line.unit === "g" || line.unit === "ml") return line.quantity;
  const conv = ing.unitConversions?.find((c) => c.unit === line.unit);
  return conv && line.quantity != null ? line.quantity * conv.grams : null;
}

function macrosFromLine(line: IngredientLine, ing: IngredientDoc) {
  if (line.quantity == null) return null;
  const grams = resolveGrams(line, ing);
  if (grams === null) return null;
  return {
    kcal: grams * ing.kcalPer1g,
    protein: grams * ing.proteinPer1g,
    carbs: grams * ing.carbsPer1g,
    fat: grams * ing.fatPer1g,
  };
}

function buildMacroTotals(t: { kcal: number; protein: number; carbs: number; fat: number }): MacroTotals {
  return {
    kcal: round1(t.kcal),
    protein: round1(t.protein),
    carbs: round1(t.carbs),
    fat: round1(t.fat),
  };
}

export async function computeNutritionTotals(
  db: Db,
  ingredients: IngredientLine[],
  servings: number
): Promise<NutritionTotals> {
  if (!ingredients?.length) return {};

  const ids = ingredients.flatMap((line) => {
    const oid = toObjectId(line.ingredientId);
    return oid ? [oid] : [];
  });
  if (!ids.length) return {};

  const ingDocs = await db
    .collection("Ingredients")
    .find({ _id: { $in: ids } })
    .toArray() as IngredientDoc[];

  const ingMap = new Map(ingDocs.map((ing) => [ing._id.toString(), ing]));

  const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  let hasAny = false;

  for (const line of ingredients) {
    const ing = ingMap.get(line.ingredientId);
    if (!ing) continue;
    const macros = macrosFromLine(line, ing);
    if (!macros) continue;
    totals.kcal += macros.kcal;
    totals.protein += macros.protein;
    totals.carbs += macros.carbs;
    totals.fat += macros.fat;
    hasAny = true;
  }

  if (!hasAny) return {};

  const s = Math.max(1, servings);
  return {
    perRecipe: buildMacroTotals(totals),
    perServing: buildMacroTotals({
      kcal: totals.kcal / s,
      protein: totals.protein / s,
      carbs: totals.carbs / s,
      fat: totals.fat / s,
    }),
  };
}
