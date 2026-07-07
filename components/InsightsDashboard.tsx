"use client";

import { useMemo, useState } from "react";
import { formatDate, recentDays } from "@/lib/dates";
import { useLocalStorage } from "@/lib/storage";
import type { DailyRecap, SleepEntry, WaterLog } from "@/types";
import { RewardsPanel } from "./RewardsPanel";

type MetricPoint = {
  date: string;
  value: number;
  label: string;
};

function Bars({ points, max, suffix }: { points: MetricPoint[]; max: number; suffix: string }) {
  return (
    <div className="mini-chart">
      {points.map((point) => {
        const height = max > 0 ? Math.max(4, Math.min(100, (point.value / max) * 100)) : 4;
        return (
          <div className="mini-chart-item" key={point.date}>
            <div className="mini-chart-bar-wrap">
              <div className="mini-chart-bar" style={{ height: `${height}%` }} title={`${point.label}: ${point.value}${suffix}`} />
            </div>
            <span>{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function InsightsDashboard() {
  const [range, setRange] = useState<7 | 30>(7);
  const [water] = useLocalStorage<WaterLog[]>("questylife.water", []);
  const [sleep] = useLocalStorage<SleepEntry[]>("questylife.sleep", []);
  const [recaps] = useLocalStorage<DailyRecap[]>("questylife.recaps", []);

  const days = useMemo(() => recentDays(range), [range]);
  const points = useMemo(() => {
    return days.map((date) => {
      const waterEntry = water.find((entry) => entry.date === date);
      const sleepEntry = sleep.find((entry) => entry.date === date);
      const recap = recaps.find((entry) => entry.date === date);
      const label = range === 7 ? formatDate(date).slice(0, 6) : date.slice(8, 10);
      return {
        date,
        label,
        waterLiters: Number(((waterEntry?.amountMl ?? 0) / 1000).toFixed(2)),
        sleepHours: sleepEntry?.durationHours ?? 0,
        mood: recap?.mood ?? 0,
        stress: recap?.stress ?? 0
      };
    });
  }, [days, range, recaps, sleep, water]);

  return (
    <>
      <section className="page-header">
        <span className="eyebrow">Analyse</span>
        <h1>Bilan</h1>
        <p className="subtle">Observe ta semaine ou ton mois : eau, sommeil, humeur et stress.</p>
      </section>

      <section className="card">
        <div className="actions">
          <button className={`btn ${range === 7 ? "" : "secondary"}`} onClick={() => setRange(7)} type="button">
            Semaine
          </button>
          <button className={`btn ${range === 30 ? "" : "secondary"}`} onClick={() => setRange(30)} type="button">
            Mois
          </button>
        </div>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <section className="card">
          <h2>Eau bue</h2>
          <Bars points={points.map((point) => ({ date: point.date, label: point.label, value: point.waterLiters }))} max={2.5} suffix=" L" />
        </section>
        <section className="card">
          <h2>Sommeil</h2>
          <Bars points={points.map((point) => ({ date: point.date, label: point.label, value: point.sleepHours }))} max={10} suffix=" h" />
        </section>
        <section className="card">
          <h2>Humeur</h2>
          <Bars points={points.map((point) => ({ date: point.date, label: point.label, value: point.mood }))} max={10} suffix="/10" />
        </section>
        <section className="card">
          <h2>Stress</h2>
          <Bars points={points.map((point) => ({ date: point.date, label: point.label, value: point.stress }))} max={10} suffix="/10" />
        </section>
      </section>

      <div style={{ marginTop: 16 }}>
        <RewardsPanel />
      </div>
    </>
  );
}
