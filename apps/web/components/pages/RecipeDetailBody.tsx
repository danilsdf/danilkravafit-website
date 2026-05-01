// components/RecipeDetailBody.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/app/data/models/recipe";
import { useCurrentUser } from "@/lib/useCurrentUser";

// ── Macro adjustment helpers ────────────────────────────────────────────────
type PrimaryMacro = "protein" | "carbs" | "fat";

type AdjustedIngredient = {
  name: string;
  originalGrams: number;
  newGrams: number;
  primaryMacro: PrimaryMacro;
};

function getIngredientGrams(line: {
  quantity: number | null;
  unit: string;
  grams?: number | null;
}): number | null {
  if (line.grams != null) return line.grams;
  if (line.unit === "g" && line.quantity != null) return line.quantity;
  return null;
}

function getPrimaryMacro(ing: {
  proteinPer1g: number;
  carbsPer1g: number;
  fatPer1g: number;
}): PrimaryMacro {
  const pCal = ing.proteinPer1g * 4;
  const cCal = ing.carbsPer1g * 4;
  const fCal = ing.fatPer1g * 9;
  if (pCal >= cCal && pCal >= fCal) return "protein";
  if (cCal >= fCal) return "carbs";
  return "fat";
}

function computeAdjustedIngredients(
  recipe: Recipe,
  targetCalPerServing: number,
  split: { protein: number; carbs: number; fat: number },
): AdjustedIngredient[] {
  const servings = recipe.servings || 1;
  const tProtein = (targetCalPerServing * split.protein) / 100 / 4;
  const tCarbs = (targetCalPerServing * split.carbs) / 100 / 4;
  const tFat = (targetCalPerServing * split.fat) / 100 / 9;

  const groups: Record<PrimaryMacro, { baseMacroG: number }> = {
    protein: { baseMacroG: 0 },
    carbs: { baseMacroG: 0 },
    fat: { baseMacroG: 0 },
  };

  const lines = recipe.ingredients.map((line) => {
    const rawGrams = getIngredientGrams(line);
    const gramsPerServing = rawGrams != null ? rawGrams / servings : null;
    const primary = getPrimaryMacro(line.ingredient);
    if (gramsPerServing != null) {
      const macroPerGram =
        primary === "protein"
          ? line.ingredient.proteinPer1g
          : primary === "carbs"
            ? line.ingredient.carbsPer1g
            : line.ingredient.fatPer1g;
      groups[primary].baseMacroG += gramsPerServing * macroPerGram;
    }
    return { line, gramsPerServing, primary };
  });

  const scales: Record<PrimaryMacro, number> = {
    protein: groups.protein.baseMacroG > 0 ? tProtein / groups.protein.baseMacroG : 1,
    carbs: groups.carbs.baseMacroG > 0 ? tCarbs / groups.carbs.baseMacroG : 1,
    fat: groups.fat.baseMacroG > 0 ? tFat / groups.fat.baseMacroG : 1,
  };

  return lines
    .filter(({ gramsPerServing }) => gramsPerServing != null)
    .map(({ line, gramsPerServing, primary }) => ({
      name: line.ingredient.name,
      originalGrams: Math.round((gramsPerServing as number) * 10) / 10,
      newGrams: Math.round((gramsPerServing as number) * scales[primary] * 10) / 10,
      primaryMacro: primary,
    }));
}
// ─────────────────────────────────────────────────────────────────────────────

type RecipeDetailBodyProps = {
  recipe: Recipe | null;
  onBack: () => void;
};

export function RecipeDetailBody({ recipe, onBack }: RecipeDetailBodyProps) {
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  // modal: null = closed | "ask" = prompt | "adjust" = calories+macros editor
  const [modal, setModal] = useState<null | "ask" | "adjust">(null);
  const [targetCalories, setTargetCalories] = useState("");
  const [macroSplit, setMacroSplit] = useState({ protein: 30, carbs: 40, fat: 30 });

  useEffect(() => {
    if (userLoading || !user || !recipe) return;
    fetch(`/api/recipes/${recipe.slug}/save`)
      .then((r) => r.json())
      .then((data) => {
        setSaved(!!data?.saved);
        if (data?.targetCalories) setTargetCalories(String(data.targetCalories));
        if (data?.targetMacroSplit) setMacroSplit(data.targetMacroSplit);
      })
      .catch(() => {});
  }, [user, userLoading, recipe?.slug]);

  async function doSave(
    calories: number | null,
    split: { protein: number; fat: number; carbs: number } | null = null,
  ) {
    if (!recipe) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/recipes/${recipe.slug}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCalories: calories, targetMacroSplit: split }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
      setModal(null);
    }
  }

  async function handleUnsave() {
    if (!recipe) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/recipes/${recipe.slug}/save`, { method: "DELETE" });
      if (res.ok) { setSaved(false); setTargetCalories(""); }
    } finally {
      setSaving(false);
    }
  }

  function handleMacroChange(macro: PrimaryMacro, newVal: number) {
    setMacroSplit((prev) => {
      const others = (["protein", "carbs", "fat"] as const).filter((k) => k !== macro);
      const remaining = 100 - newVal;
      const currentSum = prev[others[0]] + prev[others[1]];
      if (currentSum === 0) {
        const half = Math.floor(remaining / 2);
        return { ...prev, [macro]: newVal, [others[0]]: half, [others[1]]: remaining - half };
      }
      const a = Math.round((prev[others[0]] / currentSum) * remaining);
      return { ...prev, [macro]: newVal, [others[0]]: a, [others[1]]: remaining - a };
    });
  }

  function handleSaveClick() {
    if (!user) {
      router.push(`/login?redirect=/recipe/${recipe?.slug}`);
      return;
    }
    if (saved) {
      handleUnsave();
      return;
    }
    const nutrition = recipe?.nutritionTotals?.perServing ?? recipe?.nutritionTotals?.perRecipe ?? null;
    if (nutrition && !saved) {
      const { kcal, protein, carbs, fat } = nutrition;
      if (kcal && kcal > 0) setTargetCalories(String(Math.round(kcal)));
      const pCal = (protein ?? 0) * 4;
      const cCal = (carbs ?? 0) * 4;
      const fCal = (fat ?? 0) * 9;
      const total = pCal + cCal + fCal;
      if (total > 0) {
        const p = Math.round((pCal / total) * 100);
        const c = Math.round((cCal / total) * 100);
        setMacroSplit({ protein: p, carbs: c, fat: 100 - p - c });
      }
    }
    setModal("ask");
  }

  if (!recipe) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-24 text-center text-red-600 dark:text-red-400">
        Recipe not found.
      </div>
    );
  }

  const targetCalNum = Number.parseFloat(targetCalories);
  const adjustedIngredients =
    !Number.isNaN(targetCalNum) && targetCalNum > 0
      ? computeAdjustedIngredients(recipe, targetCalNum, macroSplit)
      : [];

  // Nutrition
  const macros = recipe.nutritionTotals?.perServing || recipe.nutritionTotals?.perRecipe || null;
  const createdDate = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "";

  return (
    <main className="min-h-dvh from-slate-100 via-slate-100 to-slate-200">
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-24 sm:px-6">
      {/* Back link + Save button */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition hover:text-sky-300"
        >
          <span aria-hidden="true" className="text-sky-400 transition group-hover:text-sky-300">←</span>
          Back
        </button>
        <button
          onClick={handleSaveClick}
          disabled={saving}
          title={saved ? "Remove from saved" : "Save recipe"}
          className={[
            "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 border",
            saved
              ? "bg-sky-500 border-sky-500 text-white hover:bg-sky-600 hover:border-sky-600"
              : "bg-transparent border-sky-400 text-sky-400 hover:bg-sky-400/10",
            saving ? "opacity-60 cursor-not-allowed" : "",
          ].join(" ")}
        >
          <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {saved ? "Saved" : "Save recipe"}
        </button>
      </div>

      {/* Save modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* backdrop */}
          <button
            aria-label="Close dialog"
            tabIndex={-1}
            className="absolute inset-0 bg-black/60 cursor-default"
            onClick={() => setModal(null)}
          />
          <dialog
            open
            aria-modal
            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#171c25] max-h-[85vh] overflow-y-auto"
          >
            {modal === "ask" && (
              <>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">Save recipe</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Do you want to adjust calories and macros? Ingredient weights will be scaled automatically.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal("adjust")}
                    className="flex-1 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition"
                  >
                    Yes, adjust
                  </button>
                  <button
                    onClick={() => doSave(null)}
                    disabled={saving}
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    No, save as-is
                  </button>
                </div>
              </>
            )}
            {modal === "adjust" && (
              <>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">Adjust calories & macros</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">Ingredient weights will be scaled to hit your targets.</p>

                {/* Target calories */}
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                  Target calories per serving
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="e.g. 450"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1f2937] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 mb-6"
                />

                {/* Macro split sliders */}
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">Macro split</p>
                <div className="space-y-4 mb-2">
                  {(["protein", "carbs", "fat"] as const).map((macro) => {
                    const pct = macroSplit[macro];
                    const calNum = Number.parseFloat(targetCalories);
                    const grams =
                      !Number.isNaN(calNum) && calNum > 0
                        ? macro === "fat"
                          ? Math.round((calNum * pct) / 100 / 9)
                          : Math.round((calNum * pct) / 100 / 4)
                        : null;
                    const styles: Record<string, { accent: string; label: string }> = {
                      protein: { accent: "accent-blue-500", label: "text-blue-600 dark:text-blue-400" },
                      carbs: { accent: "accent-amber-500", label: "text-amber-600 dark:text-amber-400" },
                      fat: { accent: "accent-purple-500", label: "text-purple-600 dark:text-purple-400" },
                    };
                    return (
                      <div key={macro}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-xs font-bold capitalize ${styles[macro].label}`}>{macro}</span>
                          <span className="text-xs text-slate-400">
                            {pct}%{grams != null ? ` · ${grams}g` : ""}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={5}
                          max={90}
                          value={pct}
                          onChange={(e) => handleMacroChange(macro, Number(e.target.value))}
                          className={`w-full h-1.5 rounded-full cursor-pointer ${styles[macro].accent}`}
                        />
                      </div>
                    );
                  })}
                  <div className="flex justify-end">
                    <span
                      className={`text-xs font-semibold ${
                        macroSplit.protein + macroSplit.carbs + macroSplit.fat === 100
                          ? "text-green-500"
                          : "text-red-400"
                      }`}
                    >
                      Total: {macroSplit.protein + macroSplit.carbs + macroSplit.fat}%
                    </span>
                  </div>
                </div>

                {/* Live ingredient weight preview */}
                {adjustedIngredients.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                      Ingredient weights per serving
                    </p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {adjustedIngredients.map((item) => {
                        const diff = Math.round((item.newGrams - item.originalGrams) * 10) / 10;
                        const macroLabel: Record<string, string> = {
                          protein: "text-blue-600 dark:text-blue-400",
                          carbs: "text-amber-600 dark:text-amber-400",
                          fat: "text-purple-600 dark:text-purple-400",
                        };
                        return (
                          <div
                            key={item.name}
                            className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5"
                          >
                            <span className={`text-xs font-medium truncate ${macroLabel[item.primaryMacro]}`}>
                              {item.name}
                            </span>
                            <span className="text-xs text-slate-400 shrink-0">
                              {item.originalGrams}g{" →"}{" "}
                              <span className="font-semibold text-slate-700 dark:text-slate-200">
                                {item.newGrams}g
                              </span>
                              {diff !== 0 && (
                                <span className={diff > 0 ? " text-green-500" : " text-red-400"}>
                                  {" "}{diff > 0 ? "+" : ""}{diff}g
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const cal = Number.parseFloat(targetCalories);
                      doSave(!Number.isNaN(cal) && cal > 0 ? cal : null, macroSplit);
                    }}
                    disabled={saving}
                    className="flex-1 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setModal("ask")}
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </dialog>
        </div>
      )}

      {/* TITLE + TAGS + DATE */}
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.35)' }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 sm:text-4xl text-center">
          {recipe.title}
        </h1>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {recipe.tags.map((tag) => (
              <span key={tag} className="rounded-full px-3 py-1 text-xs font-semibold tracking-wider bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {createdDate && <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1">Created {createdDate}</span>}
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1">{recipe.servings} {recipe.servingUnit || "servings"}</span>
        </div>
      </section>

      {/* IMAGE (placeholder for now) */}
      <section className="mt-5">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-60 w-full rounded-2xl border border-slate-200 dark:border-slate-700 object-cover shadow-lg sm:h-72 md:h-96"
          />
        ) : (
          <div className="h-60 w-full rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900 shadow-lg sm:h-72 md:h-96" />
        )}
      </section>

      {/* DESCRIPTION */}
      {recipe.description && (
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25] dark:text-slate-300 sm:text-base">
          {recipe.description}
        </section>
      )}

      {/* MACROS & SERVINGS */}
      <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Nutrition
          </h2>
          {macros ? (
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <li className="rounded-xl bg-sky-100 px-3 py-2 text-slate-700 dark:bg-sky-900/30 dark:text-slate-200">Calories: <span className="font-semibold text-sky-600 dark:text-sky-300">{macros.kcal ?? "-"}</span></li>
              <li className="rounded-xl bg-blue-100 px-3 py-2 text-slate-700 dark:bg-blue-900/30 dark:text-slate-200">Protein: <span className="font-semibold text-blue-600 dark:text-blue-300">{macros.protein ?? "-"}g</span></li>
              <li className="rounded-xl bg-amber-100 px-3 py-2 text-slate-700 dark:bg-amber-900/30 dark:text-slate-200">Carbs: <span className="font-semibold text-amber-600 dark:text-amber-300">{macros.carbs ?? "-"}g</span></li>
              <li className="rounded-xl bg-purple-100 px-3 py-2 text-slate-700 dark:bg-purple-900/30 dark:text-slate-200">Fat: <span className="font-semibold text-purple-600 dark:text-purple-300">{macros.fat ?? "-"}g</span></li>
            </ul>
          ) : (
            <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">No nutrition info</div>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Servings
          </h2>
          <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            {recipe.servings} {recipe.servingUnit || "servings"}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Adjust ingredient quantities based on your target number of portions.</p>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]">
        <h2 className="mb-2 text-lg font-extrabold tracking-wider text-slate-900 dark:text-white">
          Ingredients
        </h2>
        <ul className="space-y-2">
          {Array.isArray(recipe.ingredients) && recipe.ingredients.map((line, idx) => (
            <li key={idx} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-600 dark:border-slate-700 dark:bg-[#1f2937] dark:text-slate-300">
              {/* If populated, show ingredient name, else fallback */}
              <span className="font-medium text-slate-900 dark:text-white">{line.ingredient?.name ?? "Ingredient"}</span>
              {line.quantity !== null && (
                <span className="ml-2 text-slate-600 dark:text-slate-300">
                  {line.quantity} {line.unit}
                </span>
              )}
              {line.note && (
                <span className="ml-2 italic text-slate-500 dark:text-slate-400">({line.note})</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* INSTRUCTIONS */}
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]">
        <h2 className="mb-2 text-lg font-extrabold tracking-wider text-slate-900 dark:text-white">
          Instructions
        </h2>
        {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
          <div className="space-y-5">
            {recipe.instructions.map((block, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-[#1f2937]">
                {block.section && (
                  <div className="mb-1 text-sm font-semibold text-sky-600 dark:text-sky-300">
                    {block.section}
                  </div>
                )}
                <ol className="list-decimal pl-5 space-y-2">
                  {block.steps.map((step, sidx) => (
                    <li key={sidx} className="text-sm text-slate-700 dark:text-slate-200 sm:text-base">
                      {step}
                    </li>
                  ))}
                </ol>
                {block.timing && (
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {block.timing.activeMin && <span>Active: {block.timing.activeMin} min. </span>}
                    {block.timing.minutes && <span>Total: {block.timing.minutes} min. </span>}
                    {block.timing.ovenC && <span>Oven: {block.timing.ovenC}&deg;C</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400">No instructions provided.</div>
        )}
      </section>

      {/* MEAL PREP INFO */}
      {recipe.mealPrep && (
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25]">
          <h2 className="mb-2 text-lg font-extrabold tracking-wider text-slate-900 dark:text-white">
            Meal Prep Info
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {recipe.mealPrep.fridgeDays && (
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-[#1f2937]">Fridge: <span className="font-medium text-slate-900 dark:text-white">{recipe.mealPrep.fridgeDays} days</span></li>
            )}
            {recipe.mealPrep.freezerDays && (
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-[#1f2937]">Freezer: <span className="font-medium text-slate-900 dark:text-white">{recipe.mealPrep.freezerDays} days</span></li>
            )}
            {recipe.mealPrep.reheatNotes && (
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-[#1f2937]">Reheat: <span className="italic text-slate-500 dark:text-slate-400">{recipe.mealPrep.reheatNotes}</span></li>
            )}
          </ul>
        </section>
      )}
      </div>
    </main>
  );
}
