"use client";

import { Edit3, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { missionCompletion } from "@/lib/calculations";
import { todayIso } from "@/lib/dates";
import { makeId, useLocalStorage } from "@/lib/storage";
import type { Mission } from "@/types";
import { ProgressBar } from "./ProgressBar";

const defaultLabels = [
  "Boire 2 L d'eau",
  "Ne pas boire pendant un repas",
  "Prendre mes vitamines",
  "Prévoir une collation correcte le soir",
  "Faire une séance de sport",
  "Me coucher plus tôt",
  "Marcher ou bouger"
];

function defaultMissions(date: string): Mission[] {
  return defaultLabels.map((label) => ({
    id: makeId("mission"),
    label,
    completed: false,
    date
  }));
}

export function MissionTracker() {
  const today = todayIso();
  const [missions, setMissions] = useLocalStorage<Mission[]>("questylife.missions", []);
  const [newMission, setNewMission] = useState("");

  const todaysMissions = useMemo(
    () => missions.filter((mission) => mission.date === today),
    [missions, today]
  );

  const visibleMissions = todaysMissions.length > 0 ? todaysMissions : defaultMissions(today);
  const completion = missionCompletion(visibleMissions);

  function persistToday(nextToday: Mission[]) {
    setMissions([...missions.filter((mission) => mission.date !== today), ...nextToday]);
  }

  function toggleMission(id: string) {
    persistToday(
      visibleMissions.map((mission) =>
        mission.id === id ? { ...mission, completed: !mission.completed } : mission
      )
    );
  }

  function addMission() {
    const label = newMission.trim();
    if (!label) return;
    persistToday([...visibleMissions, { id: makeId("mission"), label, completed: false, date: today }]);
    setNewMission("");
  }

  function editMission(id: string) {
    const current = visibleMissions.find((mission) => mission.id === id);
    if (!current) return;
    const label = window.prompt("Modifier la mission", current.label)?.trim();
    if (!label) return;
    persistToday(visibleMissions.map((mission) => (mission.id === id ? { ...mission, label } : mission)));
  }

  function removeMission(id: string) {
    persistToday(visibleMissions.filter((mission) => mission.id !== id));
  }

  return (
    <section className="card">
      <div className="metric-row">
        <div>
          <h2>Missions du jour</h2>
          <p className="subtle">{completion}% validé</p>
        </div>
        <span className="pill">{visibleMissions.filter((m) => m.completed).length}/{visibleMissions.length}</span>
      </div>
      <ProgressBar value={completion} />

      <div style={{ marginTop: 12 }}>
        {visibleMissions.map((mission) => (
          <div className="mission-row" key={mission.id}>
            <input
              className="check"
              checked={mission.completed}
              onChange={() => toggleMission(mission.id)}
              type="checkbox"
              aria-label={`Valider ${mission.label}`}
            />
            <span>{mission.label}</span>
            <div className="actions">
              <button className="btn secondary icon" onClick={() => editMission(mission.id)} type="button" title="Modifier">
                <Edit3 size={16} aria-hidden="true" />
              </button>
              <button className="btn warning icon" onClick={() => removeMission(mission.id)} type="button" title="Supprimer">
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="actions" style={{ marginTop: 14 }}>
        <input
          className="input"
          onChange={(event) => setNewMission(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") addMission();
          }}
          placeholder="Nouvelle mission"
          value={newMission}
        />
        <button className="btn" onClick={addMission} type="button">
          <Plus size={18} aria-hidden="true" />
          Ajouter
        </button>
      </div>
    </section>
  );
}
