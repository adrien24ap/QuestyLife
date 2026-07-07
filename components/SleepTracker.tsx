"use client";

import { Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { formatDate, sortByDateDesc, todayIso } from "@/lib/dates";
import { makeId, useLocalStorage } from "@/lib/storage";
import type { SleepEntry } from "@/types";

function calculateDurationHours(bedtime: string, wakeTime: string) {
  if (!bedtime || !wakeTime) return 0;
  const [bedHour, bedMinute] = bedtime.split(":").map(Number);
  const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);
  const bedTotal = bedHour * 60 + bedMinute;
  let wakeTotal = wakeHour * 60 + wakeMinute;
  if (wakeTotal <= bedTotal) wakeTotal += 24 * 60;
  return Number(((wakeTotal - bedTotal) / 60).toFixed(1));
}

export function SleepTracker({ compact = false }: { compact?: boolean }) {
  const [entries, setEntries] = useLocalStorage<SleepEntry[]>("questylife.sleep", []);
  const [date, setDate] = useState(todayIso());
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState(7);
  const [comment, setComment] = useState("");
  const durationHours = calculateDurationHours(bedtime, wakeTime);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entry: SleepEntry = {
      id: makeId("sleep"),
      date,
      bedtime,
      wakeTime,
      durationHours,
      quality,
      comment: comment.trim()
    };
    setEntries([entry, ...entries.filter((item) => item.date !== date)]);
    setComment("");
  }

  return (
    <section className="card">
      <h2>Sommeil</h2>
      <form className="form-grid" onSubmit={save}>
        <div className="grid grid-2">
          <div className="field">
            <label htmlFor="sleep-date">Date</label>
            <input className="input" id="sleep-date" onChange={(event) => setDate(event.target.value)} type="date" value={date} />
          </div>
          <div>
            <span className="subtle">Durée calculée</span>
            <div className="metric">{durationHours.toFixed(1)} h</div>
          </div>
          <div className="field">
            <label htmlFor="sleep-bedtime">Coucher</label>
            <input className="input" id="sleep-bedtime" onChange={(event) => setBedtime(event.target.value)} type="time" value={bedtime} />
          </div>
          <div className="field">
            <label htmlFor="sleep-waketime">Réveil</label>
            <input className="input" id="sleep-waketime" onChange={(event) => setWakeTime(event.target.value)} type="time" value={wakeTime} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="sleep-quality">Qualité /10</label>
          <input className="input" id="sleep-quality" max="10" min="1" onChange={(event) => setQuality(Number(event.target.value))} type="number" value={quality} />
        </div>
        <div className="field">
          <label htmlFor="sleep-comment">Commentaire</label>
          <textarea className="textarea" id="sleep-comment" onChange={(event) => setComment(event.target.value)} value={comment} />
        </div>
        <button className="btn" type="submit">
          <Save size={18} aria-hidden="true" />
          Enregistrer le sommeil
        </button>
      </form>

      {!compact ? (
        <div className="table-wrap" style={{ marginTop: 18 }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Durée</th>
                <th>Qualité</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {sortByDateDesc(entries).map((entry) => (
                <tr key={entry.id}>
                  <td>{formatDate(entry.date)}</td>
                  <td>{entry.durationHours.toFixed(1)} h</td>
                  <td>{entry.quality}/10</td>
                  <td>{entry.comment || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
