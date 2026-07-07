"use client";

import { CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/dates";
import { useLocalStorage } from "@/lib/storage";
import type { DailyRecap, Mission, SleepEntry, SportSession, WaterLog, WeightEntry } from "@/types";

export function DayDetails({ date }: { date: string }) {
  const [recaps] = useLocalStorage<DailyRecap[]>("questylife.recaps", []);
  const [missions] = useLocalStorage<Mission[]>("questylife.missions", []);
  const [water] = useLocalStorage<WaterLog[]>("questylife.water", []);
  const [sleep] = useLocalStorage<SleepEntry[]>("questylife.sleep", []);
  const [sport] = useLocalStorage<SportSession[]>("questylife.sport", []);
  const [weights] = useLocalStorage<WeightEntry[]>("questylife.weights", []);

  const recap = recaps.find((entry) => entry.date === date);
  const dayMissions = missions.filter((entry) => entry.date === date);
  const waterEntry = water.find((entry) => entry.date === date);
  const sleepEntry = sleep.find((entry) => entry.date === date);
  const sportEntries = sport.filter((entry) => entry.date === date);
  const weightEntry = weights.find((entry) => entry.date === date);

  return (
    <section className="card">
      <div className="metric-row">
        <div>
          <h2>Journée du {formatDate(date)}</h2>
          <p className="subtle">Toutes les notes enregistrées pour cette date.</p>
        </div>
        <span className="brand-mark">
          <CalendarDays size={20} aria-hidden="true" />
        </span>
      </div>

      <div className="detail-grid" style={{ marginTop: 16 }}>
        <article>
          <h3>Récap</h3>
          {recap ? (
            <>
              <p>Humeur {recap.mood}/10, énergie {recap.energy}/10, faim {recap.hunger}/10, stress {recap.stress}/10</p>
              <p><strong>Réussi :</strong> {recap.success || "-"}</p>
              <p><strong>Difficile :</strong> {recap.difficulty || "-"}</p>
              <p><strong>Note :</strong> {recap.note || "-"}</p>
            </>
          ) : (
            <p className="subtle">Aucun récap.</p>
          )}
        </article>

        <article>
          <h3>Missions</h3>
          {dayMissions.length ? (
            <ul className="plain-list">
              {dayMissions.map((mission) => (
                <li key={mission.id}>{mission.completed ? "OK" : "À faire"} - {mission.label}</li>
              ))}
            </ul>
          ) : (
            <p className="subtle">Aucune mission.</p>
          )}
        </article>

        <article>
          <h3>Eau et sommeil</h3>
          <p>Eau : {waterEntry ? `${(waterEntry.amountMl / 1000).toFixed(2)} L / ${(waterEntry.goalMl / 1000).toFixed(1)} L` : "-"}</p>
          <p>Sommeil : {sleepEntry ? `${sleepEntry.durationHours.toFixed(1)} h, qualité ${sleepEntry.quality}/10` : "-"}</p>
          {sleepEntry?.comment ? <p>{sleepEntry.comment}</p> : null}
        </article>

        <article>
          <h3>Poids et sport</h3>
          <p>Poids : {weightEntry ? `${weightEntry.weightKg.toFixed(1)} kg` : "-"}</p>
          {sportEntries.length ? (
            <ul className="plain-list">
              {sportEntries.map((session) => (
                <li key={session.id}>{session.type} - {session.durationMinutes} min - {session.exercises.length} exercice(s)</li>
              ))}
            </ul>
          ) : (
            <p className="subtle">Aucune séance.</p>
          )}
        </article>
      </div>
    </section>
  );
}
