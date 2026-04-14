export default function HybridTemplatesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-12 text-neutral-900 dark:text-neutral-100">
      {/* TITLE */}
      <section className="mb-10 text-center">
        <h1 className="text-xl font-semibold sm:text-2xl text-yellow-600 dark:text-yellow-400">
          Hybrid Athlete.
        </h1>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Templates to crush every session.
        </p>
      </section>

      {/* TOP FEATURE CARDS */}
      <section className="mb-10 grid gap-6 sm:grid-cols-3">
        <MiniFeatureCard
          title="Custom schedules."
          description="Set your weekly plan in minutes using hybrid templates."
        />
        <MiniFeatureCard
          title="Weekly calendars."
          description="Block out your mornings, sessions, and recovery."
          iconShape="circle"
        />
        <MiniFeatureCard
          title="Printable plans."
          description="Download and print ready-to-follow daily plans."
          iconShape="triangle"
        />
      </section>

      {/* TEMPLATE LIST (STACKED) */}
      <section className="space-y-10">
        <TemplateCard
          title="Hybrid Strength+Cardio Template"
          description="A 7-day structure balancing running, gym, and boxing. Built around energy management and recovery."
        />
        <TemplateCard
          title="Endurance + Mobility Focus"
          description="A week of steady aerobic work + structured mobility sessions to keep you moving fast and pain-free."
        />
        <TemplateCard
          title="HIIT & Performance Hybrid"
          description="Templates built for high-intensity circuits, sprint intervals, and strength work to push output."
        />
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <h2 className="text-base font-semibold text-yellow-600 dark:text-yellow-400">
          Download full templates.
        </h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          Get a printable PDF to follow for your hybrid week.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-yellow-600 dark:bg-yellow-400 px-6 py-2 text-xs font-semibold text-white dark:text-black transition hover:bg-yellow-700 dark:hover:bg-yellow-300"
        >
          Get Templates
        </button>
      </section>

      {/* BOTTOM TEXT (matches the long white space + footer heading vibe) */}
      <section className="mt-20 text-center">
        <h3 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">Hybrid Templates.</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Unlock your</p>
      </section>
    </div>
  );
}

function MiniFeatureCard({
  title,
  description,
  iconShape = "square",
}: {
  title: string;
  description: string;
  iconShape?: "square" | "circle" | "triangle";
}) {
  return (
    <div>
      <div className="mb-3 h-20 w-full rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h4>
      <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
        {description}
      </p>
    </div>
  );
}

function TemplateCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="h-56 w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800 sm:h-72" />
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </div>
  );
}
