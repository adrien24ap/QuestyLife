"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { formatDate, sortByDateDesc, todayIso } from "@/lib/dates";
import { makeId, useLocalStorage } from "@/lib/storage";
import type { Exercise, ExerciseSet, SportSession, SportType } from "@/types";

const sportTypes: SportType[] = ["Push", "Pull", "Legs", "Cardio", "Autre"];

function emptySet(): ExerciseSet {
  return { id: makeId("set"), reps: 10, weightKg: 0, restSeconds: 90 };
}

function emptyExercise(): Exercise {
  return { id: makeId("exercise"), name: "", sets: [emptySet()], comment: "" };
}

export function SportSessionForm({ compact = false }: { compact?: boolean }) {
  const [sessions, setSessions] = useLocalStorage<SportSession[]>("questylife.sport", []);
  const [date, setDate] = useState(todayIso());
  const [type, setType] = useState<SportType>("Push");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [feeling, setFeeling] = useState(7);
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([emptyExercise()]);

  function updateExercise(id: string, patch: Partial<Exercise>) {
    setExercises((current) => current.map((exercise) => (exercise.id === id ? { ...exercise, ...patch } : exercise)));
  }

  function updateSet(exerciseId: string, setId: string, patch: Partial<ExerciseSet>) {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: exercise.sets.map((set) => (set.id === setId ? { ...set, ...patch } : set)) }
          : exercise
      )
    );
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = exercises
      .map((exercise) => ({
        ...exercise,
        name: exercise.name.trim(),
        comment: exercise.comment?.trim()
      }))
      .filter((exercise) => exercise.name);

    const session: SportSession = {
      id: makeId("sport"),
      date,
      type,
      durationMinutes,
      feeling,
      notes: notes.trim(),
      exercises: cleaned
    };

    setSessions([session, ...sessions]);
    setNotes("");
    setExercises([emptyExercise()]);
  }

  return (
    <section className="card">
      <h2>Nouvelle séance</h2>
      <form className="form-grid" onSubmit={save}>
        <div className="grid grid-2">
          <div className="field">
            <label htmlFor="sport-date">Date</label>
            <input className="input" id="sport-date" onChange={(e) => setDate(e.target.value)} type="date" value={date} />
          </div>
          <div className="field">
            <label htmlFor="sport-type">Type</label>
            <select className="select" id="sport-type" onChange={(e) => setType(e.target.value as SportType)} value={type}>
              {sportTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sport-duration">Durée en minutes</label>
            <input className="input" id="sport-duration" min="1" onChange={(e) => setDurationMinutes(Number(e.target.value))} type="number" value={durationMinutes} />
          </div>
          <div className="field">
            <label htmlFor="sport-feeling">Ressenti /10</label>
            <input className="input" id="sport-feeling" max="10" min="1" onChange={(e) => setFeeling(Number(e.target.value))} type="number" value={feeling} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="sport-notes">Notes</label>
          <textarea className="textarea" id="sport-notes" onChange={(e) => setNotes(e.target.value)} value={notes} />
        </div>

        <h3>Exercices</h3>
        {exercises.map((exercise, exerciseIndex) => (
          <div className="card" key={exercise.id} style={{ boxShadow: "none" }}>
            <div className="exercise-row">
              <span className="pill">Exercice {exerciseIndex + 1}</span>
              <input className="input" onChange={(e) => updateExercise(exercise.id, { name: e.target.value })} placeholder="Développé couché" value={exercise.name} />
              <button className="btn warning icon" onClick={() => setExercises(exercises.filter((item) => item.id !== exercise.id))} type="button" title="Supprimer l'exercice">
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
            {exercise.sets.map((set, setIndex) => (
              <div className="grid grid-3" key={set.id} style={{ marginTop: 10 }}>
                <div className="field">
                  <label>Série {setIndex + 1} - reps</label>
                  <input className="input" min="0" onChange={(e) => updateSet(exercise.id, set.id, { reps: Number(e.target.value) })} type="number" value={set.reps} />
                </div>
                <div className="field">
                  <label>Poids kg</label>
                  <input className="input" min="0" onChange={(e) => updateSet(exercise.id, set.id, { weightKg: Number(e.target.value) })} step="0.5" type="number" value={set.weightKg ?? 0} />
                </div>
                <div className="field">
                  <label>Repos sec.</label>
                  <input className="input" min="0" onChange={(e) => updateSet(exercise.id, set.id, { restSeconds: Number(e.target.value) })} type="number" value={set.restSeconds ?? 0} />
                </div>
              </div>
            ))}
            <div className="actions" style={{ marginTop: 10 }}>
              <button className="btn secondary" onClick={() => updateExercise(exercise.id, { sets: [...exercise.sets, emptySet()] })} type="button">
                <Plus size={18} aria-hidden="true" />
                Série
              </button>
            </div>
          </div>
        ))}
        <div className="actions">
          <button className="btn secondary" onClick={() => setExercises([...exercises, emptyExercise()])} type="button">
            <Plus size={18} aria-hidden="true" />
            Exercice
          </button>
          <button className="btn" type="submit">
            <Save size={18} aria-hidden="true" />
            Enregistrer la séance
          </button>
        </div>
      </form>

      {!compact ? (
        <div className="table-wrap" style={{ marginTop: 18 }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Séance</th>
                <th>Exercices</th>
              </tr>
            </thead>
            <tbody>
              {sortByDateDesc(sessions).map((session) => (
                <tr key={session.id}>
                  <td>{formatDate(session.date)}</td>
                  <td>{session.type}, {session.durationMinutes} min, ressenti {session.feeling}/10</td>
                  <td>{session.exercises.map((exercise) => `${exercise.name} (${exercise.sets.length} séries)`).join(", ") || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
