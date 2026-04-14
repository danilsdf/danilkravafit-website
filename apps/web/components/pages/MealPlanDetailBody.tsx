import React from "react";
import mealPlanRecipes from "@/mocked/mockedMealPlanRecipe.json";
import allRecipes from "@/mocked/mockedRecipes.json";
import Link from "next/link";
import { MealPrepPlan } from "@/app/data/models/meal-prep-plan";

function formatDate(iso: string) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type MealPlanDetailBodyProps = {
    plan: MealPrepPlan;
    backHref: string
    focusIngredients?: boolean;
};

const MealPlanDetailBody: React.FC<MealPlanDetailBodyProps> = ({
    plan,
    backHref,
    focusIngredients = false,
}) => {
    const dateRange = `${formatDate(plan.startDate)} – ${formatDate(plan.endDate)}`;

    // Find all recipe connections for this plan
    const planRecipes = (mealPlanRecipes as any[])
        .filter((x) => x.mealPrepId === plan.id)
        .sort((a, b) => a.order - b.order);

    // Group recipes by type
    const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

    const recipesByType: Record<string, any[]> = {};
    mealTypes.forEach((type) => {
        recipesByType[type] = planRecipes.filter((x) => x.type === type);
    });

    // Helper to get recipe details by _id
    const getRecipe = (id: string) => (allRecipes as any[]).find((r) => r._id === id);

    return (
        <main className="min-h-dvh from-slate-100 via-slate-100 to-slate-200">
            <div className="mx-auto max-w-3xl px-4 pb-12 pt-10 sm:px-6">
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition group mb-4"
                >
                    <svg className="w-4 h-4 text-sky-400 group-hover:text-sky-300 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Back to plans
                </Link>

                {/* Meal Prep Image and Details */}
                <header
                    className="mt-4 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25] sm:flex-row sm:items-center sm:gap-6 sm:p-5"
                    style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.35)' }}
                >
                    <div className="relative w-full group sm:w-auto">
                        <img
                            src={plan.imageUrl ?? "/home-page/results/meal-prep.jpg"}
                            alt={plan.title}
                            className="h-44 w-full rounded-2xl border border-slate-200 object-cover shadow-lg transition-transform duration-200 group-hover:scale-105 dark:border-slate-700 sm:h-36 sm:w-36"
                        />
                        {/* Current week badge */}
                        {plan.isCurrentWeek && (
                            <span className="absolute left-2 top-2 rounded-full bg-sky-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm animate-pulse sm:text-xs">● CURRENT WEEK</span>
                        )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400 sm:text-4xl">{plan.calories} kcal
                        </h1>
                        <div className="mb-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200 tracking-wider">{plan.protein}g PROTEIN</span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-200 tracking-wider">{plan.fat}g FAT</span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200 tracking-wider">{plan.carbs}g CARBS</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{dateRange}</span>
                        </div>
                        {/* Macro distribution bar (optional) */}
                        {/* Macro distribution bar: 1 line, 3 colors */}
                        <div className="mb-2 flex h-2 w-full overflow-hidden rounded bg-slate-200 dark:bg-slate-800 sm:max-w-sm">
                            {(() => {
                                const total = plan.protein * 4 + plan.fat * 9 + plan.carbs * 4;
                                const proteinPct = total ? (plan.protein * 4 / total) * 100 : 0;
                                const fatPct = total ? (plan.fat * 9 / total) * 100 : 0;
                                const carbsPct = total ? (plan.carbs * 4 / total) * 100 : 0;
                                return (
                                    <>
                                        <div style={{ width: `${proteinPct}%` }} className="h-2 bg-blue-400" />
                                        <div style={{ width: `${fatPct}%` }} className="h-2 bg-purple-400" />
                                        <div style={{ width: `${carbsPct}%` }} className="h-2 bg-amber-400" />
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </header>

                {/* Recipes by Meal Type */}
                <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25] sm:p-5">
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6 tracking-wider">PLAN RECIPES</h2>
                    {mealTypes.map((type) => (
                        recipesByType[type].length > 0 && (
                            <div key={type} className="mb-6 sm:mb-8">
                                <div className="uppercase text-xs tracking-[0.12em] text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
                                    {type}
                                    <span className="flex-1 border-b border-slate-200 dark:border-slate-700" />
                                </div>
                                <div className="space-y-3">
                                    {recipesByType[type].map((conn) => {
                                        const recipe = getRecipe(conn.recipeId);
                                        if (!recipe) return null;
                                        return (
                                            <Link
                                                key={recipe._id}
                                                href={{ pathname: `/recipe/${recipe.slug}` }}
                                                className="group flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#1f2937] dark:hover:bg-[#263244] sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                                                style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.35)' }}
                                            >
                                                <img
                                                    src={recipe.imageUrl || "/home-page/results/meal-prep.jpg"}
                                                    alt={recipe.title}
                                                    className="h-44 w-full rounded-xl border border-slate-200 bg-slate-100 object-cover transition-transform duration-200 group-hover:scale-105 dark:border-slate-700 dark:bg-slate-900 sm:h-20 sm:w-20"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">{recipe.title}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{recipe.description}</div>
                                                </div>
                                                <div className="flex w-full flex-row items-center justify-between gap-2 sm:w-auto sm:min-w-[90px] sm:flex-col sm:items-end sm:justify-start sm:gap-1">
                                                    <span className="text-xl font-bold leading-none text-sky-600 dark:text-sky-400 sm:text-2xl">{recipe.servings}
                                                        <span className="text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wider"> SERVINGS</span>
                                                    </span>
                                                    
                                                    {/* Macro preview per serving */}
                                                    {recipe.nutritionTotals.perServing && (
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {recipe.nutritionTotals.perServing.calories !== undefined && (
                                                                <span className="text-xs text-sky-600 dark:text-sky-300 mt-1">{recipe.nutritionTotals.perServing.calories} kcal</span>
                                                            )}
                                                            {recipe.nutritionTotals.perServing.protein !== undefined && (
                                                                <span className="text-xs text-blue-600 dark:text-blue-200 mt-1">P {recipe.nutritionTotals.perServing.protein}g</span>
                                                            )}
                                                            {recipe.nutritionTotals.perServing.fat !== undefined && (
                                                                <span className="text-xs text-purple-600 dark:text-purple-200 mt-1">F {recipe.nutritionTotals.perServing.fat}g</span>
                                                            )}
                                                            {recipe.nutritionTotals.perServing.carbs !== undefined && (
                                                                <span className="text-xs text-amber-600 dark:text-amber-200 mt-1">C {recipe.nutritionTotals.perServing.carbs}g</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ))}
                </section>

                {/* Ingredients Section */}
                <section
                    id="ingredients"
                    className={["mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#171c25] sm:p-5", focusIngredients ? "ring-2 ring-sky-400/50" : ""].join(" ")}
                >
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 tracking-wider">INGREDIENTS</h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
                        {plan.ingredientNames.map((x) => (
                            <li key={x}>{x}</li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
};

export default MealPlanDetailBody;