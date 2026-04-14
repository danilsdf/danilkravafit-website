import React, { useMemo, useRef, useState } from "react";
import "./styles.css";

type Macro = "protein" | "fat" | "carbs";

type Props = {
  // Optional totals (used only to show grams like in your screenshot)
  totalProteinG?: number;
  totalFatG?: number;
  totalCarbsG?: number;

  // Starting split
  initial?: { protein: number; fat: number; carbs: number };

  // Minimum % per segment
  minPct?: number;

  // Callback when user changes split
  onChange?: (v: { protein: number; fat: number; carbs: number }) => void;
};

export default function MacroSplitSlider({
  totalProteinG = 189.8,
  totalFatG = 76.7,
  totalCarbsG = 212.8,
  initial = { protein: 33, fat: 30, carbs: 37 },
  minPct = 5,
  onChange,
}: Props) {
  // Handles represent boundaries:
  // h1 = end of protein
  // h2 = end of protein+fat
  const [h1, setH1] = useState(initial.protein);
  const [h2, setH2] = useState(initial.protein + initial.fat);

  const barRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef<null | "h1" | "h2">(null);

  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

  const split = useMemo(() => {
    const protein = Math.round(h1);
    const fat = Math.round(h2 - h1);
    const carbs = Math.round(100 - h2);
    return { protein, fat, carbs };
  }, [h1, h2]);

  const grams = useMemo(() => {
    // Scale grams proportionally from the provided “100% totals”
    const p = (totalProteinG * split.protein) / 100;
    const f = (totalFatG * split.fat) / 100;
    const c = (totalCarbsG * split.carbs) / 100;
    return { protein: p, fat: f, carbs: c };
  }, [split, totalProteinG, totalFatG, totalCarbsG]);

  const emit = (nextH1: number, nextH2: number) => {
    const protein = Math.round(nextH1);
    const fat = Math.round(nextH2 - nextH1);
    const carbs = Math.round(100 - nextH2);
    onChange?.({ protein, fat, carbs });
  };

  const pctFromClientX = (clientX: number) => {
    const el = barRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const x = clientX - r.left;
    return (x / r.width) * 100;
  };

  const onPointerDown = (which: "h1" | "h2") => (e: React.PointerEvent) => {
    dragging.current = which;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;

    const pct = pctFromClientX(e.clientX);

    if (dragging.current === "h1") {
      // protein boundary
      const nextH1 = clamp(pct, minPct, h2 - minPct);
      setH1(nextH1);
      emit(nextH1, h2);
    } else {
      // fat boundary
      const nextH2 = clamp(pct, h1 + minPct, 100 - minPct);
      setH2(nextH2);
      emit(h1, nextH2);
    }
  };

  const onPointerUp = () => {
    dragging.current = null;
  };

  return (
    <div className="wrap">
      {/* Top cards */}
      <div className="cardsRow">
        <MacroCard
          title="Protein"
          dot="#B26BCB"
          bg="#2B203A"
          pct={split.protein}
          grams={grams.protein}
        />
        <MacroCard title="Fat" dot="#7AC48B" bg="#1E2A24" pct={split.fat} grams={grams.fat} />
        <MacroCard
          title="Carbs"
          dot="#FF9A4D"
          bg="#3A241C"
          pct={split.carbs}
          grams={grams.carbs}
        />
      </div>

      {/* Slider */}
      <div className="sliderArea">
        <div
          ref={barRef}
          className="bar"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* segments */}
          <div className="seg" style={{ width: `${h1}%`, background: "#B26BCB" }} />
          <div className="seg" style={{ width: `${h2 - h1}%`, background: "#7AC48B" }} />
          <div className="seg" style={{ width: `${100 - h2}%`, background: "#FF9A4D" }} />

          {/* handle 1 */}
          <Handle leftPct={h1} onPointerDown={onPointerDown("h1")} />
          {/* handle 2 */}
          <Handle leftPct={h2} onPointerDown={onPointerDown("h2")} />
        </div>
      </div>
    </div>
  );
}

function MacroCard({
  title,
  dot,
  bg,
  pct,
  grams,
}: {
  title: string;
  dot: string;
  bg: string;
  pct: number;
  grams: number;
}) {
  return (
    <div className="card" style={{ background: bg }}>
      <div className="cardTop">
        <div className="cardTitle">
          <span className="dot" style={{ background: dot }} />
          <span className="cardTitleText">{title}</span>
        </div>

        {/* edit icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.9 }}>
          <path
            d="M14 3H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-7"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M21 3l-9 9"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17 3h4v4"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="cardValue">
        {pct}%/{grams.toFixed(1)}g
      </div>
    </div>
  );
}

function Handle({
  leftPct,
  onPointerDown,
}: {
  leftPct: number;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  return (
    <div className="handleWrap" style={{ left: `${leftPct}%` }}>
      <div className="handleLine" />
      <div className="handleKnob" onPointerDown={onPointerDown} role="slider" tabIndex={0}>
        {/* left/right arrows */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M10 8l-4 4 4 4"
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 8l4 4-4 4"
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}