// components/DrillDetailBody.tsx
import Link from "next/link";

export type DrillStep = {
  title: string;
  stepLabel?: string; // e.g. "Step 1" (optional, will auto-generate if missing)
};

type DrillDetailBodyProps = {
  title: string;
  description: string;
  date?: string;
  backHref: string;
  steps: DrillStep[];
  topMediaUrl?: string;     // optional – for future real video/image
  bottomMediaUrl?: string;  // optional – second block at bottom
};

export function DrillDetailBody({
  title,
  description,
  date,
  backHref,
  steps,
  topMediaUrl,
  bottomMediaUrl,
}: DrillDetailBodyProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-8 text-black dark:text-white">
      {/* Back link */}
      <div className="mb-4">
        <Link
          href={backHref}
          className="text-xs font-medium text-black/60 dark:text-white/60 hover:text-[#d2a852] dark:hover:text-[#f0c46a]"
        >
          ← Back to drills
        </Link>
      </div>

        <h1 className="text-xl font-semibold text-black dark:text-white sm:text-2xl mb-3 text-center">
            {title}
        </h1>

      {/* TOP MEDIA */}
      <section>
        {topMediaUrl ? (
          <img
            src={topMediaUrl}
            alt={title}
            className="h-64 w-full rounded-xl object-cover sm:h-80 md:h-96"
          />
        ) : (
          <div className="h-64 w-full rounded-xl bg-black/10 dark:bg-white/10 sm:h-80 md:h-96" />
        )}
      </section>

      {/* TITLE + DESCRIPTION */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-black dark:text-white sm:text-xl">
          {title}
        </h2>
        {date && (
          <p className="mt-1 text-xs text-black/60 dark:text-white/60">{date}</p>
        )}
        <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
          {description}
        </p>
      </section>

      {/* STEPS LIST */}
      <section className="mt-10 border-t border-black/10 dark:border-white/10 pt-4">
        {steps.map((step, index) => (
          <DrillStepRow
            key={step.title + index}
            title={step.title}
            stepLabel={step.stepLabel ?? `Step ${index + 1}`}
          />
        ))}
      </section>

      {/* BOTTOM MEDIA (OPTIONAL) */}
      {(bottomMediaUrl || true) && (
        <section className="mt-12">
          {bottomMediaUrl ? (
            <img
              src={bottomMediaUrl}
              alt={`${title} – demo`}
              className="h-64 w-full rounded-xl object-cover sm:h-80 md:h-96"
            />
          ) : (
            <div className="h-64 w-full rounded-xl bg-black/10 dark:bg-white/10 sm:h-80 md:h-96" />
          )}
        </section>
      )}
    </div>
  );
}

function DrillStepRow({
  title,
  stepLabel,
}: {
  title: string;
  stepLabel: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 py-3 text-sm">
      <span className="text-black dark:text-white">{title}</span>
      <span className="text-xs font-medium text-black/60 dark:text-white/60">
        {stepLabel}
      </span>
    </div>
  );
}
