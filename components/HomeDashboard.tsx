"use client";

import Link from "next/link";
import { ArrowRight, Dumbbell, NotebookPen } from "lucide-react";
import { currentWeight, GOAL_WEIGHT_KG, missionCompletion, percent, weightGoalProgress } from "@/lib/calculations";
import { todayIso } from "@/lib/dates";
import { useLocalStorage } from "@/lib/storage";
import type { Mission, SportSession, WaterLog, WeightEntry } from "@/types";
import { DashboardCard } from "./DashboardCard";
import { MissionTracker } from "./MissionTracker";
import { ProgressBar } from "./ProgressBar";
import { WaterTracker } from "./WaterTracker";

export function HomeDashboard() {
  const today = todayIso();
  const [weights] = useLocalStorage<WeightEntry[]>("questylife.weights", []);
  const [missions] = useLocalStorage<Mission[]>("questylife.missions", []);
  const [water] = useLocalStorage<WaterLog[]>("questylife.water", []);
  const [sport] = useLocalStorage<SportSession[]>("questylife.sport", []);

  const todaysMissions = missions.filter((mission) => mission.date === today);
  const todaysWater = water.find((item) => item.date === today);
  const nextSession = sport[0];
  const missionPercent = todaysMissions.length ? missionCompletion(todaysMissions) : 0;
  const waterPercent = todaysWater ? percent(todaysWater.amountMl, todaysWater.goalMl) : 0;

  return (
    <>
      <section className="page-header">
        <span className="eyebrow">Dashboard personnel</span>
        <h1>QuestyLife</h1>
        <p className="subtle">Une V1 simple pour suivre tes habitudes, ton poids, tes séances et tes journées.</p>
      </section>

      <section className="grid grid-3">
        <DashboardCard title="Poids actuel" value={`${currentWeight(weights).toFixed(1)} kg`} note={`Objectif ${GOAL_WEIGHT_KG.toFixed(1)} kg`}>
          <ProgressBar value={weightGoalProgress(weights)} label={`${weightGoalProgress(weights)}% de progression`} />
        </DashboardCard>
        <DashboardCard title="Missions" value={`${missionPercent}%`} note="Validation du jour">
          <ProgressBar value={missionPercent} />
        </DashboardCard>
        <DashboardCard title="Eau" value={`${((todaysWater?.amountMl ?? 0) / 1000).toFixed(2)} L`} note="Objectif quotidien 2 L">
          <ProgressBar value={waterPercent} />
        </DashboardCard>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <DashboardCard title="Prochaine séance" value={nextSession ? nextSession.type : "À planifier"} note={nextSession ? `${nextSession.durationMinutes} min - ressenti ${nextSession.feeling}/10` : "Push, Pull, Legs ou Cardio"}>
          <Link className="btn secondary" href="/sport">
            <Dumbbell size={18} aria-hidden="true" />
            Ouvrir le sport
          </Link>
        </DashboardCard>
        <DashboardCard title="Récap du jour" note="Note ton humeur, ton énergie, ta faim et ce qui compte aujourd'hui.">
          <Link className="btn" href="/recap">
            <NotebookPen size={18} aria-hidden="true" />
            Faire mon récap
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </DashboardCard>
      </section>

      <section className="grid grid-2" style={{ marginTop: 16 }}>
        <MissionTracker />
        <WaterTracker />
      </section>
    </>
  );
}
