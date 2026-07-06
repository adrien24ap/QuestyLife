"use client";

import { useMemo, useState } from "react";
import { formatDate, sortByDateDesc } from "@/lib/dates";
import { useLocalStorage } from "@/lib/storage";
import type { DailyRecap, HistoryItem, HistoryKind, Mission, SportSession, WaterLog, WeightEntry } from "@/types";

const filters: Array<"all" | HistoryKind> = ["all", "poids", "sport", "recap", "missions", "eau"];

export function HistoryList() {
  const [filter, setFilter] = useState<"all" | HistoryKind>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [weights] = useLocalStorage<WeightEntry[]>("questylife.weights", []);
  const [sport] = useLocalStorage<SportSession[]>("questylife.sport", []);
  const [recaps] = useLocalStorage<DailyRecap[]>("questylife.recaps", []);
  const [missions] = useLocalStorage<Mission[]>("questylife.missions", []);
  const [water] = useLocalStorage<WaterLog[]>("questylife.water", []);

  const items = useMemo<HistoryItem[]>(() => {
    const groupedMissions = Object.values(
      missions.reduce<Record<string, Mission[]>>((acc, mission) => {
        acc[mission.date] = [...(acc[mission.date] ?? []), mission];
        return acc;
      }, {})
    );

    return [
      ...weights.map((entry) => ({
        id: entry.id,
        date: entry.date,
        type: "poids" as const,
        title: `${entry.weightKg.toFixed(1)} kg`,
        detail: entry.comment || "Pesée enregistrée"
      })),
      ...sport.map((session) => ({
        id: session.id,
        date: session.date,
        type: "sport" as const,
        title: `${session.type} - ${session.durationMinutes} min`,
        detail: session.exercises.map((exercise) => `${exercise.name}: ${exercise.sets.length} séries`).join(", ") || session.notes || "Séance enregistrée"
      })),
      ...recaps.map((recap) => ({
        id: recap.id,
        date: recap.date,
        type: "recap" as const,
        title: `Humeur ${recap.mood}/10 - énergie ${recap.energy}/10`,
        detail: recap.success || recap.note || "Récap enregistré"
      })),
      ...groupedMissions.map((day) => ({
        id: `missions-${day[0].date}`,
        date: day[0].date,
        type: "missions" as const,
        title: `${day.filter((mission) => mission.completed).length}/${day.length} missions`,
        detail: day.filter((mission) => mission.completed).map((mission) => mission.label).join(", ") || "Aucune mission validée"
      })),
      ...water.map((entry) => ({
        id: `water-${entry.date}`,
        date: entry.date,
        type: "eau" as const,
        title: `${(entry.amountMl / 1000).toFixed(2)} L`,
        detail: `Objectif ${(entry.goalMl / 1000).toFixed(1)} L`
      }))
    ];
  }, [weights, sport, recaps, missions, water]);

  const visible = sortByDateDesc(
    items.filter((item) => (filter === "all" || item.type === filter) && (!dateFilter || item.date === dateFilter))
  );

  return (
    <section className="card">
      <div className="grid grid-2">
        <div className="field">
          <label htmlFor="history-type">Type</label>
          <select className="select" id="history-type" onChange={(e) => setFilter(e.target.value as "all" | HistoryKind)} value={filter}>
            {filters.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "Tout" : item}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="history-date">Date</label>
          <input className="input" id="history-date" onChange={(e) => setDateFilter(e.target.value)} type="date" value={dateFilter} />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {visible.length === 0 ? <p className="subtle">Aucune donnée pour ce filtre.</p> : null}
        {visible.map((item) => (
          <article className="history-row" key={`${item.type}-${item.id}`}>
            <span className="pill">{item.type}</span>
            <div>
              <h3>{item.title}</h3>
              <p className="subtle">{item.detail}</p>
            </div>
            <strong>{formatDate(item.date)}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
