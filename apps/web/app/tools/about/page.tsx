"use client";

import { useState } from "react";

const TOOLS = [
  {
    title: "Macro Calculator",
    summary: "Estimate your daily calorie and macronutrient needs.",
    body: `Enter your age, weight, height, and activity level to get a personalized breakdown of calories, protein, carbs, and fats. Use this to guide your nutrition for training or body composition goals.`
  },
  {
    title: "Meal Prep Helper",
    summary: "Calculate your weekly meal plan based on your calorie target and available ingredients.",
    body: `Input your daily calorie goal, macro split, and the ingredients you have on hand. The tool will generate a meal prep plan for the week, showing how to combine your ingredients to meet your nutritional targets.`
  },
  {
    title: "Workout Generator",
    summary: "Build a custom gym routine with a single click.",
    body: `Pick your training split (full body, upper/lower, push/pull/legs) and equipment. The generator will create a workout with sets, reps, and rest times. Use it as a base and modify as needed.`
  },
];

export default function ToolsAboutPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-10 text-black dark:text-white">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-[#d2a852] dark:text-[#f0c46a] mb-8">About the Tools</h1>
      <p className="mb-8 text-neutral-500 dark:text-neutral-300">Learn what each tool does and how to get the most out of it. Click on a tool to expand details and usage instructions.</p>
      <div className="flex flex-col gap-4">
        {TOOLS.map((tool, idx) => (
          <div key={tool.title} className="rounded-2xl border border-neutral-200 dark:border-[#23232a] bg-neutral-100 dark:bg-[#23232a]">
            <button
              className="w-full text-left px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#d2a852] dark:focus:ring-[#f0c46a] flex items-center justify-between"
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
              aria-controls={`tool-body-${idx}`}
            >
              <span className="text-lg font-semibold text-[#d2a852] dark:text-[#f0c46a]">{tool.title}</span>
              <span className="ml-4 text-[#d2a852] dark:text-[#f0c46a] text-xl">{open === idx ? "−" : "+"}</span>
            </button>
            <div
              id={`tool-body-${idx}`}
              className={`px-6 pb-4 text-neutral-700 dark:text-neutral-200 text-sm transition-all duration-300 ease-in-out ${open === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
              aria-hidden={open !== idx}
            >
              <div className="mb-2 font-medium text-neutral-900 dark:text-neutral-100">{tool.summary}</div>
              <div>{tool.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
