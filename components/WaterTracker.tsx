"use client";

import { Minus, Plus } from "lucide-react";
import { percent, WATER_GOAL_ML } from "@/lib/calculations";
import { todayIso } from "@/lib/dates";
import { useLocalStorage } from "@/lib/storage";
import type { WaterLog } from "@/types";
import { ProgressBar } from "./ProgressBar";

export function WaterTracker() {
  const today = todayIso();
  const [logs, setLogs] = useLocalStorage<WaterLog[]>("questylife.water", []);
  const log = logs.find((item) => item.date === today) ?? { date: today, amountMl: 0, goalMl: WATER_GOAL_ML };
  const progress = percent(log.amountMl, log.goalMl);

  function update(amountMl: number) {
    const next = { ...log, amountMl: Math.max(0, log.amountMl + amountMl) };
    setLogs([...logs.filter((item) => item.date !== today), next]);
  }

  return (
    <section className="card">
      <div className="metric-row">
        <div>
          <h2>Eau</h2>
          <div className="metric">{(log.amountMl / 1000).toFixed(2)} L</div>
        </div>
        <span className="pill">Objectif {(log.goalMl / 1000).toFixed(1)} L</span>
      </div>
      <ProgressBar value={progress} label={`${progress}% de l'objectif`} />
      <div className="actions" style={{ marginTop: 14 }}>
        <button className="btn secondary" onClick={() => update(250)} type="button">
          <Plus size={18} aria-hidden="true" />
          250 ml
        </button>
        <button className="btn secondary" onClick={() => update(500)} type="button">
          <Plus size={18} aria-hidden="true" />
          500 ml
        </button>
        <button className="btn warning" onClick={() => update(-250)} type="button">
          <Minus size={18} aria-hidden="true" />
          250 ml
        </button>
      </div>
    </section>
  );
}
