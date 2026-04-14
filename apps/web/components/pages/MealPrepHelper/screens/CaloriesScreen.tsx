import MacroSplitSlider from "@/components/MealPrepHelper/MacroSplitSlider";
import React from "react";

type Macros = { protein: number; fat: number; carbs: number };

interface CaloriesScreenProps {
  calorieGoal: number;
  setCalorieGoal: (n: number) => void;
  macros: Macros;
  setMacros: (m: Macros) => void;
  days: number;
  setDays: (n: number) => void;
  onContinue: () => void;
}

export default function CaloriesScreen({
  calorieGoal,
  setCalorieGoal,
  macros,
  setMacros,
  days,
  setDays,
  onContinue,
}: CaloriesScreenProps) {
  type MealName = 'Breakfast' | 'Breakfast 2' | 'Lunch' | 'Lunch 2' | 'Snack' | 'Dinner';

  const [meals, setMeals] = React.useState<Record<MealName, boolean>>({
    Breakfast: true,
    'Breakfast 2': false,
    Lunch: true,
    'Lunch 2': true,
    Snack: false,
    Dinner: true,
  });

  const handleMealChange = (meal: MealName) => {
    setMeals(prev => {
      const updated = { ...prev, [meal]: !prev[meal] };
      // If Breakfast is unchecked, also uncheck Breakfast 2
      if (meal === 'Breakfast' && !updated['Breakfast']) updated['Breakfast 2'] = false;
      // If Lunch is unchecked, also uncheck Lunch 2
      if (meal === 'Lunch' && !updated['Lunch']) updated['Lunch 2'] = false;
      return updated;
    });
  };

  return (
    <div>
      {/* CALORIE GOAL & MACRO SPLIT */}
      <section className="mb-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="calorieGoal" className="text-sm font-semibold">Calorie goal:</label>
          <input
            id="calorieGoal"
            type="number"
            min={1000}
            max={5000}
            value={calorieGoal}
            onChange={e => setCalorieGoal(Number(e.target.value))}
            className="rounded border px-2 py-1 text-sm w-24 bg-neutral-50 dark:bg-neutral-900"
          />
          <a href="/tool/calories-calculator" className="ml-2 text-xs text-yellow-600 dark:text-yellow-400 underline">Calories calculator</a>
        </div>
        <MacroSplitSlider
          initial={macros}
          minPct={10}
          totalProteinG={calorieGoal/4}
          totalFatG={calorieGoal/9}
          totalCarbsG={calorieGoal/4}
          onChange={setMacros}
        />
      </section>

      {/* MEALS & DAYS */}
      <section className="mb-8">
        <div className="mb-4 justify-center items-center w-full text-center">
          <label className="text-sm font-semibold">Days:</label>
          <input
            type="number"
            min={1}
            max={5}
            value={days === 0 ? "" : days}
            onChange={e => setDays(e.target.value === "" ? 0 : Number(e.target.value))}
            className="ml-2 rounded border px-2 py-1 text-sm w-16 bg-neutral-50 dark:bg-neutral-900"
          />
        </div>
        {/* <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Meals:</label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={meals['Breakfast']} onChange={() => handleMealChange('Breakfast')} />
            Breakfast
          </label>
          {meals['Breakfast'] && (
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={meals['Breakfast 2']} onChange={() => handleMealChange('Breakfast 2')} />
              Breakfast 2
            </label>
          )}
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={meals['Lunch']} onChange={() => handleMealChange('Lunch')} />
            Lunch
          </label>
          {meals['Lunch'] && (
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={meals['Lunch 2']} onChange={() => handleMealChange('Lunch 2')} />
              Lunch 2
            </label>
          )}
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={meals['Snack']} onChange={() => handleMealChange('Snack')} />
            Snack
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={meals['Dinner']} onChange={() => handleMealChange('Dinner')} />
            Dinner
          </label>
        </div> */}
      </section>
      {/* CONTINUE BUTTON */}
      <section className="mb-10 text-center">
        <button
          type="button"
          className="rounded-full bg-yellow-600 dark:bg-yellow-400 px-6 py-2 text-xs font-semibold text-white dark:text-black transition hover:bg-yellow-700 dark:hover:bg-yellow-300"
          onClick={onContinue}
        >
          Continue
        </button>
      </section>
    </div>
  );
}