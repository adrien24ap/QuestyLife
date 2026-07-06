"use client";

import { Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { formatDate, sortByDateDesc, todayIso } from "@/lib/dates";
import { makeId, useLocalStorage } from "@/lib/storage";
import type { DailyRecap } from "@/types";

export function DailyRecapForm({ compact = false }: { compact?: boolean }) {
  const [recaps, setRecaps] = useLocalStorage<DailyRecap[]>("questylife.recaps", []);
  const [form, setForm] = useState({
    date: todayIso(),
    mood: 7,
    energy: 6,
    hunger: 5,
    stress: 5,
    success: "",
    difficulty: "",
    note: ""
  });

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const recap: DailyRecap = {
      id: makeId("recap"),
      ...form,
      success: form.success.trim(),
      difficulty: form.difficulty.trim(),
      note: form.note.trim()
    };
    setRecaps([recap, ...recaps.filter((item) => item.date !== form.date)]);
  }

  function update(field: keyof typeof form, value: string | number) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <section className="card">
      <h2>Récap de journée</h2>
      <form className="form-grid" onSubmit={save}>
        <div className="field">
          <label htmlFor="recap-date">Date</label>
          <input className="input" id="recap-date" onChange={(e) => update("date", e.target.value)} type="date" value={form.date} />
        </div>
        <div className="grid grid-2">
          {(["mood", "energy", "hunger", "stress"] as const).map((field) => (
            <div className="field" key={field}>
              <label htmlFor={`recap-${field}`}>
                {field === "mood" ? "Humeur" : field === "energy" ? "Énergie" : field === "hunger" ? "Faim" : "Stress"} /10
              </label>
              <input
                className="input"
                id={`recap-${field}`}
                max="10"
                min="1"
                onChange={(e) => update(field, Number(e.target.value))}
                type="number"
                value={form[field]}
              />
            </div>
          ))}
        </div>
        <div className="field">
          <label htmlFor="recap-success">Ce que j'ai bien réussi</label>
          <textarea className="textarea" id="recap-success" onChange={(e) => update("success", e.target.value)} value={form.success} />
        </div>
        <div className="field">
          <label htmlFor="recap-difficulty">Ce qui a été difficile</label>
          <textarea className="textarea" id="recap-difficulty" onChange={(e) => update("difficulty", e.target.value)} value={form.difficulty} />
        </div>
        <div className="field">
          <label htmlFor="recap-note">Note libre</label>
          <textarea className="textarea" id="recap-note" onChange={(e) => update("note", e.target.value)} value={form.note} />
        </div>
        <button className="btn" type="submit">
          <Save size={18} aria-hidden="true" />
          Enregistrer le récap
        </button>
      </form>

      {!compact ? (
        <div className="table-wrap" style={{ marginTop: 18 }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Scores</th>
                <th>Réussite</th>
              </tr>
            </thead>
            <tbody>
              {sortByDateDesc(recaps).map((recap) => (
                <tr key={recap.id}>
                  <td>{formatDate(recap.date)}</td>
                  <td>Humeur {recap.mood}/10, énergie {recap.energy}/10, faim {recap.hunger}/10, stress {recap.stress}/10</td>
                  <td>{recap.success || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
