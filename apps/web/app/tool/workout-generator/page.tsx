export default function GymWorkoutGeneratorPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-12 text-neutral-900 dark:text-neutral-100">
      {/* TITLE */}
      <section className="mb-12 text-center">
        <h1 className="text-xl font-semibold sm:text-2xl text-yellow-600 dark:text-yellow-400">
          Gym Workout Generator.
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Create and customize your workout instantly.
        </p>
      </section>

      {/* TWO FEATURE CARDS */}
      <section className="mb-12 grid gap-6 sm:grid-cols-2">
        <FeatureCard
          title="Custom Plans."
          description="Build workouts tailored to your gym goals."
        />
        <FeatureCard
          title="Exercise Library."
          description="Browse exercises with demos and tips."
          iconShape="circle"
        />
      </section>

      {/* LARGE VISUAL + TEXT */}
      <section className="mb-16">
        <div className="h-72 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800 sm:h-96" />
        <div className="mt-4 max-w-xl">
          <h2 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">Build Your Session</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
            Select your target muscle groups, equipment, and time—Hybrid®
            generates a workout for you. Instantly see sets, reps, and suggested
            weights. Adapt for strength, hypertrophy, or cardio focus with one
            click.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h3 className="text-base font-semibold text-yellow-600 dark:text-yellow-400">Start Your Workout.</h3>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Personalize every routine for maximum results.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-yellow-600 dark:bg-yellow-400 px-6 py-2 text-xs font-semibold text-white dark:text-black transition hover:bg-yellow-700 dark:hover:bg-yellow-300"
        >
          Generate Now
        </button>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  iconShape = "square",
}: {
  title: string;
  description: string;
  iconShape?: "square" | "circle";
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-44 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      <div>
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h4>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
      </div>
    </div>
  );
}
