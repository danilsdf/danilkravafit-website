/* MealPrepResultsWidget.tsx */
import React, { useMemo } from "react";
import "./styles.css";

type Macro = { currentG: number; targetG: number };
type Nutrients = { protein: Macro; fat: Macro; carbs: Macro };

type MealPrepWidgetProps = {
  goalKcal: number;
  intakeKcal: number;
  burnedKcal: number;
  nutrients: Nutrients;

  title?: string;
  showMenuDots?: boolean;
  // Optional: if true, ring uses intake only (not net)
  ringMode?: "net" | "intake";
  // Optional: bars overflow styling (keep 100% cap by default)
  showOverflow?: boolean;
  onBackCalories?: () => void;
};

export default function NutritionDashboardCard({
  goalKcal,
  intakeKcal,
  burnedKcal,
  nutrients,
  title,
  showMenuDots = true,
  ringMode = "net",
  showOverflow = false,
    onBackCalories,
}: MealPrepWidgetProps) {
  const net = intakeKcal - burnedKcal;
  const ringBase = ringMode === "intake" ? intakeKcal : net;

  const diff = ringBase - goalKcal;
  const isOver = diff > 0;
  const diffAbs = Math.abs(diff);

  const ringValue = useMemo(() => {
    if (!goalKcal || goalKcal <= 0) return 0;
    return clamp01(ringBase / goalKcal);
  }, [ringBase, goalKcal]);

  return (
    <section className="mpw">
      {title ? <h3 className="mpw__title">{title}</h3> : null}

      <div className="mpw__widget">
        <div className="mpw__topGrid">
          {/* Goal */}
          <div className="mpw-card mpw-card--goal relative">
            <button
                type="button"
                className="absolute top-2 right-2 p-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700"
                title="Edit calorie/macro goal"
                onClick={onBackCalories}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-600 dark:text-yellow-400">
                    <path d="M15.232 5.232a2.5 2.5 0 0 0-3.535 0l-7.071 7.07A2 2 0 0 0 4 15h3.5a.5.5 0 0 0 .5-.5V13a.5.5 0 0 1 .146-.354l7.07-7.07a2.5 2.5 0 0 0 0-3.535zM13.5 3.5a1.5 1.5 0 0 1 2.121 2.121l-1.06 1.06-2.12-2.12 1.06-1.06z" />
                    <path d="M2 17.5A.5.5 0 0 1 2.5 17H17a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5z" />
                </svg>
            </button>
            <div className="mpw__cardHeader">
              <span className="mpw__cardLabel">Goal</span>
            </div>

            <div className="mpw__goalCenter">
              <RingProgress value={ringValue} size={50} stroke={5} isOver={isOver} />
              <div className="mpw__goalText">
                <div className="mpw__goalValue">{diffAbs.toFixed(1)}</div>
                <div className="mpw__goalSub">
                  <span className="mpw__goalSubUnit">kcal</span>
                  <span className="mpw__goalSubWord">{isOver ? "Over" : "Left"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Intake */}
          <div className="mpw-card mpw-card--intake">
            <div className="mpw__cardHeader mpw__cardHeader--withIcon">
              <span className="mpw__cardLabel">Intake</span>
              <span className="mpw__iconBadge">
                <BowlIcon />
              </span>
            </div>

            <div className="mpw__bigNumberRow">
              <span className="mpw__bigNumber">{intakeKcal.toFixed(1)}</span>
              <span className="mpw__unit">kcal</span>
            </div>
          </div>
        </div>

        {/* Nutrients */}
        <div className="mpw-card mpw-card--nutrients">
          <div className="mpw__nutrientsHeader">
            <span className="mpw__nutrientsTitle">Nutrients</span>
          </div>

          <div className="mpw__nutrientsGrid">
            <MacroBlock
              title="Protein"
              variant="protein"
              valueText={`${nutrients.protein.currentG.toFixed(1)}/${nutrients.protein.targetG.toFixed(1)}g`}
              progress={ratio(nutrients.protein.currentG, nutrients.protein.targetG)}
              showOverflow={showOverflow}
            />
            <MacroBlock
              title="Fat"
              variant="fat"
              valueText={`${nutrients.fat.currentG.toFixed(1)}/${nutrients.fat.targetG.toFixed(1)}g`}
              progress={ratio(nutrients.fat.currentG, nutrients.fat.targetG)}
              showOverflow={showOverflow}
            />
            <MacroBlock
              title="Carbs"
              variant="carbs"
              valueText={`${nutrients.carbs.currentG.toFixed(1)}/${nutrients.carbs.targetG.toFixed(1)}g`}
              progress={ratio(nutrients.carbs.currentG, nutrients.carbs.targetG)}
              showOverflow={showOverflow}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Subcomponents -------------------- */

function MacroBlock({
  title,
  variant,
  valueText,
  progress,
  showOverflow,
}: {
  title: string;
  variant: "protein" | "fat" | "carbs";
  valueText: string;
  progress: number; // can be > 1
  showOverflow: boolean;
}) {
  const pct = progress * 100;
  const fillWidth = showOverflow ? Math.min(140, pct) : Math.min(100, pct);
  const isOverflow = pct > 100;
  const resolvedValueEmphasis = isOverflow ? "good" : "";

  return (
    <div className="mpw__macro">
      <div className="mpw__macroTitle">{title}</div>

      <div className="mpw__barTrack">
        <div
          className={[
            "mpw__barFill",
            `mpw__barFill--${variant}`,
            isOverflow && showOverflow ? "mpw__barFill--overflow" : "",
          ].join(" ")}
          style={{ width: `${fillWidth}%` }}
        />
      </div>

      <div className={["mpw__macroValue", resolvedValueEmphasis === "good" ? "mpw__macroValue--good" : ""].join(" ")}>
        {valueText}
      </div>
    </div>
  );
}

function RingProgress({
  value,
  size,
  stroke,
  isOver,
}: {
  value: number; // 0..1
  size: number;
  stroke: number;
  isOver: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = clamp01(value);
  const dash = c * v;

  return (
    <svg className="mpw__ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle className="mpw__ringTrack" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
      <circle
        className={`mpw__ringFill ${isOver ? "mpw__ringFill--over" : "mpw__ringFill--left"}`}
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

/* -------------------- Icons -------------------- */

function BowlIcon() {
  return (
    <svg className="mpw__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8H4z" className="mpw__bowl" />
      <path
        d="M7 10c.3-1.8 1.9-3 3.8-3 1.6 0 2.8.7 3.4 1.9.3-.2.8-.4 1.3-.4 1.2 0 2.2.7 2.5 1.5"
        className="mpw__bowlStroke"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------- Utils -------------------- */

function ratio(current: number, target: number) {
  if (!target || target <= 0) return 0;
  return current / target;
}
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}
