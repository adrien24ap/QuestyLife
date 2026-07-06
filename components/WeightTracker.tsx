"use client";

import { Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { currentWeight, GOAL_WEIGHT_KG, START_WEIGHT_KG, weightGoalProgress, weightLoss } from "@/lib/calculations";
import { formatDate, sortByDateDesc, todayIso } from "@/lib/dates";
import { makeId, useLocalStorage } from "@/lib/storage";
import type { WeightEntry } from "@/types";
import { ProgressBar } from "./ProgressBar";

export function WeightTracker({ compact = false }: { compact?: boolean }) {
  const [entries, setEntries] = useLocalStorage<WeightEntry[]>("questylife.weights", []);
  const [date, setDate] = useState(todayIso());
  const [weightKg, setWeightKg] = useState("");
  const [comment, setComment] = useState("");
  const sorted = sortByDateDesc(entries);
  const progress = weightGoalProgress(entries);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(weightKg);
    if (!date || !parsed) return;
    setEntries([{ id: makeId("weight"), date, weightKg: parsed, comment: comment.trim() }, ...entries]);
    setWeightKg("");
    setComment("");
  }

  return (
    <section className="card">
      <h2>Suivi du poids</h2>
      <div className="grid grid-3">
        <div>
          <span className="subtle">Actuel</span>
          <div className="metric">{currentWeight(entries).toFixed(1)} kg</div>
        </div>
        <div>
          <span className="subtle">Départ</span>
          <div className="metric">{START_WEIGHT_KG.toFixed(1)}</div>
        </div>
        <div>
          <span className="subtle">Objectif</span>
          <div className="metric">{GOAL_WEIGHT_KG.toFixed(1)}</div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <ProgressBar value={progress} label={`${weightLoss(entries).toFixed(1)} kg perdus - ${progress}% du chemin`} />
      </div>

      {!compact ? (
        <>
          <form className="form-grid" onSubmit={save} style={{ marginTop: 18 }}>
            <div className="grid grid-2">
              <div className="field">
                <label htmlFor="weight-date">Date</label>
                <input className="input" id="weight-date" onChange={(e) => setDate(e.target.value)} type="date" value={date} />
              </div>
              <div className="field">
                <label htmlFor="weight-kg">Poids</label>
                <input className="input" id="weight-kg" min="1" onChange={(e) => setWeightKg(e.target.value)} step="0.1" type="number" value={weightKg} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="weight-comment">Commentaire</label>
              <input className="input" id="weight-comment" onChange={(e) => setComment(e.target.value)} value={comment} />
            </div>
            <button className="btn" type="submit">
              <Save size={18} aria-hidden="true" />
              Enregistrer la pesée
            </button>
          </form>

          <div className="table-wrap" style={{ marginTop: 18 }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Poids</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((entry) => (
                  <tr key={entry.id}>
                    <td>{formatDate(entry.date)}</td>
                    <td>{entry.weightKg.toFixed(1)} kg</td>
                    <td>{entry.comment || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </section>
  );
}
