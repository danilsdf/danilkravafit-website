  "use client"

  import { useState, useRef } from "react";
  import { Listbox } from "@headlessui/react";

  export default function MacrosPage() {
  // React state for unit switch and form fields
  const [units, setUnits] = useState<'imperial' | 'metric'>('metric');
  const [age, setAge] = useState(25);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(8);
  const [heightCm, setHeightCm] = useState(180);
  const [weightLbs, setWeightLbs] = useState(170);
  const [weightKg, setWeightKg] = useState(75);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const activityOptions = [
    {
      value: 'basal',
      short: 'Basal Metabolic Rate (BMR)',
      label: 'Basal Metabolic Rate (BMR)',
      factor: 1,
    },
    {
      value: 'sedentary',
      short: 'Sedentary',
      label: 'Sedentary: little or no exercise',
      factor: 1.2,
    },
    {
      value: 'light',
      short: 'Light',
      label: 'Light: exercise 1–3 times/week',
      factor: 1.375,
    },
    {
      value: 'moderate',
      short: 'Moderate',
      label: 'Moderate: exercise 4–5 times/week',
      factor: 1.55,
    },
    {
      value: 'active',
      short: 'Active',
      label: 'Active: daily exercise or intense exercise 3–4 times/week',
      factor: 1.725,
    },
    {
      value: 'very',
      short: 'Very Active',
      label: 'Very Active: intense exercise 6–7 times/week',
      factor: 1.9,
    },
    {
      value: 'extra',
      short: 'Extra Active',
      label: 'Extra Active: very intense exercise daily, or physical job',
      factor: 2.0,
    },
  ];
  const formulaOptions = [
    {
      value: "mifflin",
      label: "Mifflin–St Jeor (modern standard)",
      description: "Use when you don’t know body fat. Good population average. Ignores muscle vs fat.",
      formula: (sex: string, weight: number, height: number, age: number, _lbm: number, _fat: number) =>
        sex === "male"
          ? (10 * weight) + (6.25 * height) - (5 * age) + 5
          : (10 * weight) + (6.25 * height) - (5 * age) - 161,
      pros: ["Good population average", "Stable"],
      cons: ["Ignores muscle vs fat", "Underestimates lean athletes"],
    },
    {
      value: "harris",
      label: "Harris–Benedict (legacy)",
      description: "Historical reference. Slightly higher for muscular people. Overestimates fat mass metabolism.",
      formula: (sex: string, weight: number, height: number, age: number, _lbm: number, _fat: number) =>
        sex === "male"
          ? 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)
          : 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age),
      pros: ["Slightly higher for muscular people", "Common in gyms"],
      cons: ["Overestimates fat mass metabolism", "Old dataset"],
    },
    {
      value: "katch",
      label: "Katch–McArdle (LBM-based)",
      description: "Best if you know your body fat %. Directly muscle-driven.",
      formula: (_sex: string, _weight: number, _height: number, _age: number, lbm: number, _fat: number) =>
        370 + (21.6 * lbm),
      pros: ["Directly muscle-driven", "Explains why two 85 kg bodies differ"],
      cons: ["Garbage in → garbage out if BF% is wrong"],
      needsLBM: true,
    },
    {
      value: "cunningham",
      label: "Cunningham Equation (athlete-biased)",
      description: "Aggressive, assumes trained muscle. Use for high training volume.",
      formula: (_sex: string, _weight: number, _height: number, _age: number, lbm: number, _fat: number) =>
        500 + (22 * lbm),
      pros: ["Reflects real athletes better", "Closer to lab results for trained men"],
      cons: ["Overestimates for casual lifters"],
      needsLBM: true,
    },
    {
      value: "nelson",
      label: "Nelson / Fat-Mass–Adjusted (advanced)",
      description: "Splits metabolism into fat and lean mass. Requires precise body composition.",
      formula: (_sex: string, _weight: number, _height: number, _age: number, lbm: number, fat: number) =>
        25.80 * lbm + 4.04 * fat + 19.6,
      pros: ["Theoretically clean"],
      cons: ["Requires precise body composition", "Rarely implemented correctly online"],
      needsLBM: true,
      needsFat: true,
    },
  ];
  const [formula, setFormula] = useState(formulaOptions[0]);
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [lbm, setLBM] = useState<number | null>(null);

  const [activity, setActivity] = useState(activityOptions[2]);
  const [goal, setGoal] = useState('maintain');
  const [lastCalculatedGoal, setLastCalculatedGoal] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const resultRef = useRef<HTMLHeadingElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (age < 10 || age > 120) newErrors.age = "Enter a valid age (10–120)";
    if (units === 'imperial') {
      if (heightFt < 3 || heightFt > 8) newErrors.heightFt = "Height (ft) should be 3–8";
      if (heightIn < 0 || heightIn > 11) newErrors.heightIn = "Height (in) should be 0–11";
      if (weightLbs < 50 || weightLbs > 700) newErrors.weightLbs = "Weight (lbs) should be 50–700";
      if (formula.needsLBM && (lbm !== null && (lbm < 30 || lbm > 600))) newErrors.lbm = "LBM (lbs) should be 30–600";
    } else {
      if (heightCm < 90 || heightCm > 250) newErrors.heightCm = "Height (cm) should be 90–250";
      if (weightKg < 20 || weightKg > 320) newErrors.weightKg = "Weight (kg) should be 20–320";
      if (formula.needsLBM && (lbm !== null && (lbm < 15 || lbm > 270))) newErrors.lbm = "LBM (kg) should be 15–270";
    }
    if (formula.needsFat && (bodyFat === null || isNaN(bodyFat) || bodyFat < 2 || bodyFat > 70)) {
      newErrors.bodyFat = "Body fat % should be 2–70";
    }
    if (formula.needsLBM && (lbm === null || isNaN(lbm) || lbm <= 0)) {
      newErrors.lbm = "Enter your lean body mass";
    }
    return newErrors;
  };

  // Calculation logic
  const [result, setResult] = useState<number | null>(null);
  const [lossResults, setLossResults] = useState<{ mild: number, normal: number, extreme: number } | null>(null);
  const [gainResults, setGainResults] = useState<{ mild: number, normal: number, extreme: number } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateInputs();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setTimeout(() => {
        if (formRef.current) {
          const y = formRef.current.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);
      return;
    }

    let weight = units === 'imperial' ? weightLbs * 0.453592 : weightKg;
    let height = units === 'imperial' ? ((heightFt * 12 + heightIn) * 2.54) : heightCm;
    let calculatedLBM = bodyFat !== null ? weight * (1 - bodyFat / 100) : 0;
    let usedLBM = lbm !== null && !isNaN(lbm)
      ? (units === 'imperial' ? lbm * 0.453592 : lbm)
      : calculatedLBM;
    let fat = bodyFat !== null ? weight * (bodyFat / 100) : 0;

    let bmr: number;
    if (formula.value === "katch" || formula.value === "cunningham" || formula.value === "nelson") {
      if ((formula.needsLBM && (lbm === null || isNaN(lbm)) && (bodyFat === null || isNaN(bodyFat)))) {
        setResult(null);
        setLossResults(null);
        setGainResults(null);
        return;
      }
      if (formula.value === "nelson") {
        bmr = formula.formula(sex, weight, height, age, usedLBM, fat);
      } else {
        bmr = formula.formula(sex, weight, height, age, usedLBM, 0);
      }
    } else {
      bmr = formula.formula(sex, weight, height, age, 0, 0);
    }

    let activityFactor = activity.factor;
    let calories = bmr * activityFactor;

    setLastCalculatedGoal(goal);
    if (goal === 'lose') {
      setResult(Math.round(calories * 0.88));
      setLossResults({
        mild: Math.round(calories * 0.88),
        normal: Math.round(calories * 0.76),
        extreme: Math.round(calories * 0.52),
      });
      setGainResults(null);
    } else if (goal === 'gain') {
      setResult(Math.round(calories * 1.12));
      setGainResults({
        mild: Math.round(calories * 1.12),
        normal: Math.round(calories * 1.24),
        extreme: Math.round(calories * 1.48),
      });
      setLossResults(null);
    } else {
      setResult(Math.round(calories));
      setLossResults(null);
      setGainResults(null);
    }

    setTimeout(() => {
      if (resultRef.current) {
        const y = resultRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-4 pt-12 text-black dark:text-white">
      {/* TITLE */}
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#d2a852] dark:text-[#f0c46a]">
          Calorie Calculator
        </h1>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-100">
          Use the calorie calculator to estimate the number of daily calories your body needs to maintain your current weight.
        </p>
      </section>

      {/* CALCULATOR FORM */}
      <section className="mx-auto mb-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium mb-1">Formula</label>
          <Listbox value={formula} onChange={setFormula}>
            <Listbox.Button className="w-full rounded border px-3 py-2 text-left">
              {formula.label}
            </Listbox.Button>
            <Listbox.Options className="mt-1 max-h-60 w-full overflow-auto rounded border border-neutral-300 dark:border-neutral-700 text-black dark:text-white bg-white dark:bg-neutral-900 shadow-lg">
              {formulaOptions.map(f => (
                <Listbox.Option
                  key={f.value}
                  value={f}
                  className="cursor-pointer px-3 py-2 text-sm whitespace-normal"
                >
                  <div className="font-semibold">{f.label}</div>
                  <div className="text-xs text-neutral-700 dark:text-neutral-200">{f.description}</div>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
        <form ref={formRef} className="space-y-6" onSubmit={handleCalculate}>
          {/* Unit Switch */}
          <div className="flex items-center justify-center gap-4 my-4">
            <span className="text-sm font-medium">Units:</span>
            <button type="button" className={`px-3 py-1 rounded text-xs font-semibold ${units === 'metric' ? 'bg-[#d2a852] dark:bg-[#f0c46a] text-black dark:text-[#23232a]' : 'bg-neutral-200 dark:bg-[#23232a]'}`} onClick={() => setUnits('metric')}>Metric</button>
            <button type="button" className={`px-3 py-1 rounded text-xs font-semibold ${units === 'imperial' ? 'bg-[#d2a852] dark:bg-[#f0c46a] text-black dark:text-[#23232a]' : 'bg-neutral-200 dark:bg-[#23232a]'}`} onClick={() => setUnits('imperial')}>US units</button>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium mb-1">Age (years)</label>
            <input type="number" value={age === 0 ? "" : age} onChange={e => setAge(e.target.value === "" ? 0 : Number(e.target.value))}
              className="w-full rounded border px-3 py-2 text-black dark:text-white bg-white dark:bg-[#0f1418]" />
            {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
          </div>

          {/* Height */}
          {units === 'imperial' ? (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Height (ft)</label>
                <input type="number" value={heightFt === 0 ? "" : heightFt} onChange={e => setHeightFt(e.target.value === "" ? 0 : Number(e.target.value))} className="w-full rounded border px-3 py-2 text-black dark:text-white bg-white dark:bg-[#0f1418]" />
                {errors.heightFt && <p className="text-xs text-red-500 mt-1">{errors.heightFt}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Height (in)</label>
                <input type="number" value={heightIn === 0 ? "" : heightIn} onChange={e => setHeightIn(e.target.value === "" ? 0 : Number(e.target.value))} className="w-full rounded border px-3 py-2 text-black dark:text-white bg-white dark:bg-[#0f1418]" />
                {errors.heightIn && <p className="text-xs text-red-500 mt-1">{errors.heightIn}</p>}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">Height (cm)</label>
              <input type="number" value={heightCm === 0 ? "" : heightCm} onChange={e => setHeightCm(e.target.value === "" ? 0 : Number(e.target.value))} className="w-full rounded border px-3 py-2 text-black dark:text-white bg-white dark:bg-[#0f1418]" />
              {errors.heightCm && <p className="text-xs text-red-500 mt-1">{errors.heightCm}</p>}
            </div>
          )}

          {/* Weight */}
          {units === 'imperial' ? (
            <div>
              <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
              <input type="number" value={weightLbs === 0 ? "" : weightLbs} onChange={e => setWeightLbs(e.target.value === "" ? 0 : Number(e.target.value))} className="w-full rounded border px-3 py-2 text-black dark:text-white bg-white dark:bg-[#0f1418]" />
              {errors.weightLbs && <p className="text-xs text-red-500 mt-1">{errors.weightLbs}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">Weight (kg)</label>
              <input type="number" step="any" value={weightKg === 0 ? "" : weightKg} onChange={e => setWeightKg(e.target.value === "" ? 0 : Number(e.target.value))} className="w-full rounded border px-3 py-2 text-black dark:text-white bg-white dark:bg-[#0f1418]" />
              {errors.weightKg && <p className="text-xs text-red-500 mt-1">{errors.weightKg}</p>}
            </div>
          )}

          {formula.needsFat && (
            <div>
              <label className="block text-sm font-medium mb-1">Body Fat (%)</label>
              <input
                type="number"
                max="70"
                step="any"
                value={bodyFat === null ? "" : bodyFat}
                onChange={e => setBodyFat(e.target.value === "" ? null : Number(e.target.value))}
                className="w-full rounded border px-3 py-2 text-black dark:text-white bg-white dark:bg-[#0f1418]"
                placeholder="e.g. 15"
              />
              {errors.bodyFat && <p className="text-xs text-red-500 mt-1">{errors.bodyFat}</p>}
            </div>
          )}

          {formula.needsLBM && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Lean Body Mass ({units === 'imperial' ? 'lbs' : 'kg'})
              </label>
              <input
                type="number"
                step="any"
                value={lbm === null ? "" : lbm}
                onChange={e => setLBM(e.target.value === "" ? null : Number(e.target.value))}
                className="w-full rounded border px-3 py-2 text-black dark:text-white bg-white dark:bg-[#0f1418]"
                placeholder={units === 'imperial' ? "e.g. 150" : "e.g. 68"}
              />
              {errors.lbm && <p className="text-xs text-red-500 mt-1">{errors.lbm}</p>}
              <p className="text-xs text-neutral-500 mt-1">
                {bodyFat !== null && !isNaN(bodyFat) && bodyFat != 0 && (
                  <>
                    (Auto-calc: {units === 'imperial'
                      ? (weightLbs * (1 - (bodyFat ?? 0) / 100)).toFixed(1)
                      : (weightKg * (1 - (bodyFat ?? 0) / 100)).toFixed(1)
                    } {units === 'imperial' ? 'lbs' : 'kg'} from weight and body fat)
                  </>
                )}
              </p>
            </div>
          )}

          {/* Sex */}
          <div>
            <label className="block text-sm font-medium mb-1">Sex</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="sex" value="male" checked={sex === 'male'} onChange={() => setSex('male')} className="accent-[#d2a852]" /> Male
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="sex" value="female" checked={sex === 'female'} onChange={() => setSex('female')} className="accent-[#d2a852]" /> Female
              </label>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium mb-1">Activity Level</label>
            <Listbox value={activity} onChange={setActivity}>
              <Listbox.Button className="w-full rounded border px-3 py-2 text-left">
                {activity.short}
              </Listbox.Button>

              <Listbox.Options className="mt-1 max-h-60 w-full overflow-auto rounded border border-neutral-300 dark:border-neutral-700 text-black dark:text-white bg-white dark:bg-neutral-900 shadow-lg">
                {activityOptions.map(o => (
                  <Listbox.Option
                    key={o.value}
                    value={o}
                    className="cursor-pointer px-3 py-2 text-sm whitespace-normal"
                  >
                    {o.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-medium mb-1">Goal</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="goal" value="lose" checked={goal === 'lose'} onChange={() => setGoal('lose')} className="accent-[#d2a852]" /> Lose
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="goal" value="maintain" checked={goal === 'maintain'} onChange={() => setGoal('maintain')} className="accent-[#d2a852]" /> Maintain
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="goal" value="gain" checked={goal === 'gain'} onChange={() => setGoal('gain')} className="accent-[#d2a852]" /> Gain
              </label>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="text-center pt-4">
            <button type="submit" className="rounded-full bg-[#d2a852] dark:bg-[#f0c46a] px-6 py-2 text-xs font-semibold text-black dark:text-[#23232a] transition hover:bg-[#bfa14a] dark:hover:bg-[#d2a852]">
              {result === null ? 'Calculate' : 'Recalculate'}
            </button>
          </div>
        </form>
        {result !== null && (
          <div className="mt-8 text-center" style={{minHeight: 300}}>
            <h4 id="estimated-calories-title" ref={resultRef} className="text-lg font-semibold text-[#d2a852] dark:text-[#f0c46a]">
              {lastCalculatedGoal === 'lose' && 'Estimated Calories for Weight Loss'}
              {lastCalculatedGoal === 'gain' && 'Estimated Calories for Weight Gain'}
              {lastCalculatedGoal === 'maintain' && 'Estimated Daily Calories'}
            </h4>
            <p className="mt-2 text-2xl font-bold">{result} kcal</p>
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">This is the estimated number of calories you need per day based on your answers.</p>
            {lastCalculatedGoal === 'lose' && lossResults && (
              <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
                <div>
                  <span className="font-semibold text-[#d2a852] dark:text-[#f0c46a]">Mild weight loss</span> – <span className="font-mono">{lossResults.mild} kcal</span> <span className="text-xs text-neutral-500">(88%)</span>
                  <div className="text-xs text-neutral-400">~0.5 lb/week</div>
                </div>
                <div>
                  <span className="font-semibold text-[#d2a852] dark:text-[#f0c46a]">Weight loss</span> – <span className="font-mono">{lossResults.normal} kcal</span> <span className="text-xs text-neutral-500">(76%)</span>
                  <div className="text-xs text-neutral-400">~1 lb/week</div>
                </div>
                <div>
                  <span className="font-semibold text-[#d2a852] dark:text-[#f0c46a]">Extreme weight loss</span> – <span className="font-mono">{lossResults.extreme} kcal</span> <span className="text-xs text-neutral-500">(52%)</span>
                  <div className="text-xs text-neutral-400">~2 lb/week</div>
                </div>
              </div>
            )}
            {lastCalculatedGoal === 'gain' && gainResults && (
              <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
                <div>
                  <span className="font-semibold text-[#d2a852] dark:text-[#f0c46a]">Mild weight gain</span> – <span className="font-mono">{gainResults.mild} kcal</span> <span className="text-xs text-neutral-500">(112%)</span>
                  <div className="text-xs text-neutral-400">~0.5 lb/week</div>
                </div>
                <div>
                  <span className="font-semibold text-[#d2a852] dark:text-[#f0c46a]">Weight gain</span> – <span className="font-mono">{gainResults.normal} kcal</span> <span className="text-xs text-neutral-500">(124%)</span>
                  <div className="text-xs text-neutral-400">~1 lb/week</div>
                </div>
                <div>
                  <span className="font-semibold text-[#d2a852] dark:text-[#f0c46a]">Extreme weight gain</span> – <span className="font-mono">{gainResults.extreme} kcal</span> <span className="text-xs text-neutral-500">(148%)</span>
                  <div className="text-xs text-neutral-400">~2 lb/week</div>
                </div>
              </div>
            )}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              {/* Meal prep search button with image */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
                  alt="Meal prep"
                  className="rounded-lg shadow-md w-48 h-32 object-cover"
                  loading="lazy"
                />
                <a
                  href={`https://www.google.com/search?q=meal+prep+recipes+${result}+calories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-[#d2a852] dark:bg-[#f0c46a] px-6 py-2 text-xs font-semibold text-black dark:text-[#23232a] transition hover:bg-[#bfa14a] dark:hover:bg-[#d2a852] mt-2"
                >
                  Search {result} kcal MEAL PREP
                </a>
              </div>
              {/* Program promo image and button */}
              {/* <div className="mt-8 flex flex-col items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                  alt={
                    lastCalculatedGoal === 'lose'
                      ? "Fat loss program"
                      : lastCalculatedGoal === 'gain'
                      ? "Muscle gain program"
                      : "Maintenance program"
                  }
                  className="rounded-lg shadow-md w-48 h-32 object-cover"
                  loading="lazy"
                />
                <a
                  href="#"
                  className="inline-block rounded-full bg-[#d2a852] dark:bg-[#f0c46a] px-6 py-2 text-xs font-semibold text-black dark:text-[#23232a] transition hover:bg-[#bfa14a] dark:hover:bg-[#d2a852] mt-2"
                >
                  GET the FREE Week of Program
                </a>
              </div> */}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
