// components/RecipeDetailBody.tsx

import type { Recipe } from "@/app/data/models/recipe";

type RecipeDetailBodyProps = {
  recipe: Recipe | null;
  onBack: () => void;
};

export function RecipeDetailBody({ recipe, onBack }: RecipeDetailBodyProps) {
  if (!recipe) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-8 text-center text-red-600 dark:text-red-400">
        Recipe not found.
      </div>
    );
  }

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
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-10 sm:px-6">
      {/* Back link */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition hover:text-sky-300"
        >
          <span aria-hidden="true" className="text-sky-400 transition group-hover:text-sky-300">←</span>
          Back
        </button>
      </div>

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
