"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeHeader from "@/components/headers/HomeHeader";
import MainFooter from "@/components/footer/MainFooter";
import MacroSplitSlider from "@/components/MealPrepHelper/MacroSplitSlider";

type SavedPlanItem = {
  savedAt: string;
  plan: {
    id: string;
    title: string;
    imageUrl?: string | null;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    startDate: string;
    endDate: string;
    isCurrentWeek?: boolean;
  };
};

type SavedRecipeItem = {
  savedAt: string;
  targetCalories?: number | null;
  targetMacroSplit?: { protein: number; fat: number; carbs: number } | null;
  recipe: {
    title: string;
    slug: string;
    imageUrl?: string | null;
    description?: string | null;
    tags?: string[];
    servings: number;
    servingUnit?: string;
    nutritionTotals?: {
      perServing?: { kcal: number | null; protein: number | null; carbs: number | null; fat: number | null };
    };
  };
};

function formatDateShort(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type ProfileData = {
  fullName: string;
  email: string;
  role: string;
  weight?: number | null;
  height?: number | null;
  age?: number | null;
  gender?: "male" | "female" | null;
  goal?: "maintain" | "lose" | "gain" | null;
  dailyCalories?: number | null;
  macroSplit?: { protein: number; fat: number; carbs: number } | null;
};

function StatCard({
  label,
  value,
  unit,
}: Readonly<{ label: string; value: number | null | undefined; unit: string }>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-1">
      <p className="text-xs font-bold uppercase tracking-widest text-white/40">{label}</p>
      {value == null ? (
        <p className="text-2xl font-bold text-white/20">—</p>
      ) : (
        <p className="text-3xl font-extrabold">
          {value}
          <span className="text-base font-semibold text-white/40 ml-1">{unit}</span>
        </p>
      )}
    </div>
  );
}

function hasMissingFields(d: ProfileData): boolean {
  return d.weight == null || d.height == null || d.age == null || d.gender == null || d.goal == null;
}

function applyMeasurementUpdate(
  p: ProfileData,
  weight: string,
  height: string,
  age: string,
  gender: "male" | "female" | "",
  goal: "maintain" | "lose" | "gain" | ""
): ProfileData {
  return {
    ...p,
    weight: weight === "" ? null : Number(weight),
    height: height === "" ? null : Number(height),
    age: age === "" ? null : Number(age),
    gender: gender === "" ? null : gender,
    goal: goal === "" ? null : goal,
  };
}

function getCaloriesLabel(dailyCalories: number | null | undefined): string {
  return dailyCalories == null
    ? "I know my calories"
    : `I know my calories · ${dailyCalories} kcal/day`;
}

function getCalCardContent(
  showInput: boolean,
  profile: ProfileData
): { title: string; description: string } {
  if (showInput) {
    return {
      title: "Enter your daily calories",
      description: "If you use a smart watch and know your average daily calories, save it here.",
    };
  }
  const prefillNote =
    profile.weight && profile.height && profile.age
      ? " Your saved data will be pre-filled."
      : " Save your weight, height and age above to pre-fill the calculator.";
  return {
    title: "Know your daily calories",
    description: `Calculate your exact calorie needs based on your measurements, activity level and goal.${prefillNote}`,
  };
}

function SavedPlansList({ loading, items }: Readonly<{ loading: boolean; items: SavedPlanItem[] }>) {
  if (loading) return <p className="text-sm text-white/30">Loading…</p>;
  if (items.length === 0) return <p className="text-sm text-white/30">No saved meal prep plans yet.</p>;
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Link
          key={item.plan.id}
          href={`/meal-prep-plan/${item.plan.id}`}
          className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
        >
          <img
            src={item.plan.imageUrl ?? "/home-page/results/meal-prep.jpg"}
            alt={item.plan.title}
            className="h-14 w-14 rounded-lg object-cover shrink-0 border border-white/10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white truncate">
                {formatDateShort(item.plan.startDate)} – {formatDateShort(item.plan.endDate)}
              </span>
              {item.plan.isCurrentWeek && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">Current week</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-xs text-orange-400 font-semibold">{item.plan.calories} kcal</span>
              <span className="text-xs text-blue-400">{item.plan.protein}g P</span>
              <span className="text-xs text-purple-400">{item.plan.fat}g F</span>
              <span className="text-xs text-amber-400">{item.plan.carbs}g C</span>
            </div>
          </div>
          <svg className="w-4 h-4 text-white/20 group-hover:text-white/50 transition shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  );
}

function SavedRecipesList({ loading, items }: Readonly<{ loading: boolean; items: SavedRecipeItem[] }>) {
  if (loading) return <p className="text-sm text-white/30">Loading…</p>;
  if (items.length === 0) return <p className="text-sm text-white/30">No saved recipes yet.</p>;
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const macros = item.recipe.nutritionTotals?.perServing ?? null;
        return (
          <Link
            key={item.recipe.slug}
            href={`/recipe/${item.recipe.slug}`}
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
          >
            <img
              src={item.recipe.imageUrl ?? "/home-page/results/meal-prep.jpg"}
              alt={item.recipe.title}
              className="h-14 w-14 rounded-lg object-cover shrink-0 border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{item.recipe.title}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {item.targetCalories != null && (
                  <span className="text-xs text-orange-400 font-semibold">{item.targetCalories} kcal target</span>
                )}
                {macros?.kcal != null && item.targetCalories == null && (
                  <span className="text-xs text-orange-400">{macros.kcal} kcal</span>
                )}
                {macros?.protein != null && <span className="text-xs text-blue-400">{macros.protein}g P</span>}
                {macros?.fat != null && <span className="text-xs text-purple-400">{macros.fat}g F</span>}
                {macros?.carbs != null && <span className="text-xs text-amber-400">{macros.carbs}g C</span>}
              </div>
            </div>
            <svg className="w-4 h-4 text-white/20 group-hover:text-white/50 transition shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        );
      })}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // form state
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain" | "">("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCaloriesInput, setShowCaloriesInput] = useState(false);
  const [showCaloriesCalculator, setShowCaloriesCalculator] = useState(false);
  const [knownCalories, setKnownCalories] = useState("");
  const [caloriesSaving, setCaloriesSaving] = useState(false);
  const [caloriesSuccess, setCaloriesSuccess] = useState(false);
  const [macroSplit, setMacroSplit] = useState({ protein: 33, fat: 30, carbs: 37 });
  const [macroSaving, setMacroSaving] = useState(false);
  const [macroSuccess, setMacroSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [savedPlans, setSavedPlans] = useState<SavedPlanItem[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeItem[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [tab, setTab] = useState<"main" | "plans" | "recipes">("main");

  useEffect(() => {
    fetch("/api/auth/profile")
      .then((r) => {
        if (r.status === 401) { router.push("/login"); return null; }
        return r.json();
      })
      .then((data: ProfileData | null) => {
        if (!data) return;
        setProfile(data);
        setWeight(data.weight == null ? "" : String(data.weight));
        setHeight(data.height == null ? "" : String(data.height));
        setAge(data.age == null ? "" : String(data.age));
        setGender(data.gender ?? "");
        setGoal(data.goal ?? "");
        setKnownCalories(data.dailyCalories == null ? "" : String(data.dailyCalories));
        if (data.macroSplit) setMacroSplit(data.macroSplit);
        // Open form automatically if any measurement is missing
        setFormOpen(hasMissingFields(data));
      })
      .finally(() => setLoading(false));

    // Fetch saved items in parallel
    Promise.all([
      fetch("/api/user/saved-plans").then((r) => r.ok ? r.json() : []),
      fetch("/api/user/saved-recipes").then((r) => r.ok ? r.json() : []),
    ]).then(([plans, recipes]) => {
      setSavedPlans(plans);
      setSavedRecipes(recipes);
    }).catch(() => {}).finally(() => setSavedLoading(false));
  }, [router]);

  async function handleSave(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weight: weight === "" ? null : weight,
        height: height === "" ? null : height,
        age: age === "" ? null : age,
        gender: gender === "" ? null : gender,
        goal: goal === "" ? null : goal,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to save.");
      return;
    }

    setSuccess(true);
    setProfile((p) => (p ? applyMeasurementUpdate(p, weight, height, age, gender, goal) : p));
    setFormOpen(false);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function handleSaveCalories() {
    setCaloriesSaving(true);
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dailyCalories: knownCalories === "" ? null : knownCalories }),
    });
    setCaloriesSaving(false);
    const saved = knownCalories === "" ? null : Number(knownCalories);
    if (res.ok) {
      setProfile((p) => (p ? { ...p, dailyCalories: saved } : p));
      setShowCaloriesInput(false);
      setShowCaloriesCalculator(false);
      setCaloriesSuccess(true);
      setTimeout(() => setCaloriesSuccess(false), 3000);
    }
  }

  async function handleSaveMacros() {
    setMacroSaving(true);
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ macroSplit }),
    });
    setMacroSaving(false);
    if (res.ok) {
      setProfile((p) => (p ? { ...p, macroSplit } : p));
      setMacroSuccess(true);
      setTimeout(() => setMacroSuccess(false), 3000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <svg className="w-6 h-6 animate-spin text-white/30" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  if (!profile) return null;

  const bmi =
    profile.weight && profile.height
      ? (profile.weight / (profile.height / 100) ** 2).toFixed(1)
      : null;

  const caloriesLabel = getCaloriesLabel(profile.dailyCalories);
  const { title: calTitle, description: calDescription } = getCalCardContent(showCaloriesInput, profile);

  return (
    <>
      <HomeHeader showTraining={false} />
      <main className="min-h-screen bg-neutral-950 text-white pt-28 pb-20 px-4">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">
              <Link href="/" className="hover:text-white transition">Home</Link>
              {" / "}Profile
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-xl font-extrabold uppercase">
                {profile.fullName?.[0] ?? profile.email[0]}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">{profile.fullName}</h1>
                <p className="text-sm text-white/40">{profile.email}</p>
                <span
                  className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    profile.role === "Admin"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-white/5 text-white/30 border-white/10"
                  }`}
                >
                  {profile.role}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-white/10">
            {(["main", "plans", "recipes"] as const).map((t) => {
              const labels = { main: "Main", plans: "Saved Meal Plans", recipes: "Saved Recipes" };
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={[
                    "px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px",
                    tab === t
                      ? "border-white text-white"
                      : "border-transparent text-white/40 hover:text-white/70",
                  ].join(" ")}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>

          {tab === "main" && (
            <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard label="Weight" value={profile.weight} unit="kg" />
            <StatCard label="Height" value={profile.height} unit="cm" />
            <StatCard label="Age" value={profile.age} unit="yrs" />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">BMI</p>
              {bmi ? (
                <p className="text-3xl font-extrabold">{bmi}</p>
              ) : (
                <p className="text-2xl font-bold text-white/20">—</p>
              )}
            </div>
          </div>

          {/* Goal / Gender badges */}
          {(profile.goal != null || profile.gender != null) && (
            <div className="flex flex-wrap gap-2 mb-10">
              {profile.goal != null && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-white/60">
                  <svg className="w-3 h-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3l9 9-9 9" />
                  </svg>
                  Goal: {profile.goal}
                </span>
              )}
            </div>
          )}

          {/* Edit form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold">Your data and goals</h2>
              {!formOpen && (
                <button
                  type="button"
                  onClick={() => setFormOpen(true)}
                  className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition px-3 py-1.5 border border-white/10 rounded-lg hover:border-white/30"
                >
                  Update
                </button>
              )}
            </div>

            {success && (
              <p className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-400 mb-5">
                Saved successfully.
              </p>
            )}

            {formOpen ? (
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Gender */}
                  <div className="sm:col-span-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5">Gender</p>
                    <div className="flex gap-3">
                      {(["male", "female"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(gender === g ? "" : g)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition capitalize ${
                            gender === g
                              ? "bg-white text-black border-white"
                              : "bg-white/5 text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="mt-2">
                    <label
                      htmlFor="weight"
                      className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5"
                    >
                      Weight (kg)
                    </label>
                    <input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="1"
                      max="500"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 78.5"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition"
                    />
                  </div>

                  {/* Height */}
                  <div className="mt-2">
                    <label
                      htmlFor="height"
                      className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5"
                    >
                      Height (cm)
                    </label>
                    <input
                      id="height"
                      type="number"
                      step="1"
                      min="1"
                      max="300"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 182"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition"
                    />
                  </div>

                  {/* Age */}
                  <div className="mt-2">
                    <label
                      htmlFor="age"
                      className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5"
                    >
                      Age
                    </label>
                    <input
                      id="age"
                      type="number"
                      step="1"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition"
                    />
                  </div>
                </div>



                  {/* Goal */}
                  <div className="sm:col-span-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5">Goal</p>
                    <div className="flex gap-3">
                      {(["lose", "maintain", "gain"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGoal(goal === g ? "" : g)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition capitalize ${
                            goal === g
                              ? "bg-white text-black border-white"
                              : "bg-white/5 text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                {error && (
                  <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 transition"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFormOpen(false); setError(""); }}
                    className="px-5 py-3 text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/30 rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-white/30">All data saved. Click Update to edit.</p>
            )}
          </div>

          {/* Calories section */}
          {profile.dailyCalories != null && !showCaloriesCalculator ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400/70 mb-2">Daily Calories</p>
                <p className="text-4xl font-extrabold">
                  {profile.dailyCalories}
                  <span className="text-base font-semibold text-white/40 ml-1">kcal/day</span>
                </p>
                {caloriesSuccess && (
                  <p className="mt-2 text-xs text-green-400">Daily calories saved.</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => { setShowCaloriesCalculator(true); setShowCaloriesInput(false); }}
                className="shrink-0 flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold rounded-xl transition whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Update calories
              </button>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400/70 mb-2">Calories</p>
                <h2 className="text-lg font-extrabold mb-1">{calTitle}</h2>
                <p className="text-sm text-white/50 max-w-sm">{calDescription}</p>
                {caloriesSuccess && (
                  <p className="mt-2 text-xs text-green-400">Daily calories saved.</p>
                )}
              </div>
              {showCaloriesInput ? (
                <div className="shrink-0 flex flex-col gap-3 w-full sm:w-56">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="1"
                      min="500"
                      max="9999"
                      value={knownCalories}
                      onChange={(e) => setKnownCalories(e.target.value)}
                      placeholder="e.g. 2400"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      disabled={caloriesSaving}
                      onClick={handleSaveCalories}
                      className="shrink-0 px-4 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition"
                    >
                      {caloriesSaving ? "…" : "Save"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowCaloriesInput(false); if (profile.dailyCalories != null) setShowCaloriesCalculator(false); }}
                    className="text-xs text-white/30 hover:text-white/60 transition text-left"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-3">
                  <Link
                    href={`/tool/calories-calculator?age=${profile.age ?? ""}&weight=${profile.weight ?? ""}&height=${profile.height ?? ""}&gender=${profile.gender ?? ""}&goal=${profile.goal ?? ""}`}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold rounded-xl transition whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Calculate calories
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowCaloriesInput(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition self-start"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {caloriesLabel}
                  </button>
                  {profile.dailyCalories != null && (
                    <button
                      type="button"
                      onClick={() => setShowCaloriesCalculator(false)}
                      className="text-xs text-white/30 hover:text-white/60 transition text-left"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Macro Split section — only when daily calories are saved */}
          {profile.dailyCalories != null && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] py-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold pl-8">Macro Split</h2>
                {macroSuccess && (
                  <p className="text-xs text-green-400">Saved!</p>
                )}
              </div>
              <MacroSplitSlider
                key={profile.dailyCalories}
                totalProteinG={profile.dailyCalories / 4}
                totalFatG={profile.dailyCalories / 9}
                totalCarbsG={profile.dailyCalories / 4}
                initial={macroSplit}
                onChange={setMacroSplit}
              />
              <div className="mt-4 mr-8 flex justify-end">
                <button
                  type="button"
                  disabled={macroSaving}
                  onClick={handleSaveMacros}
                  className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 transition"
                >
                  {macroSaving ? "Saving…" : "Save macro split"}
                </button>
              </div>
            </div>
          )}
          </>
          )}

          {tab === "plans" && (
            <SavedPlansList loading={savedLoading} items={savedPlans} />
          )}

          {tab === "recipes" && (
            <SavedRecipesList loading={savedLoading} items={savedRecipes} />
          )}
        </div>
      </main>
      <MainFooter />
    </>
  );
}
