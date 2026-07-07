"use client";

import { Award, Lock } from "lucide-react";
import { buildBadges, calculateXp, levelFromXp } from "@/lib/rewards";
import { useLocalStorage } from "@/lib/storage";
import type { DailyRecap, Mission, SleepEntry, SportSession, WaterLog } from "@/types";
import { ProgressBar } from "./ProgressBar";

export function RewardsPanel() {
  const [missions] = useLocalStorage<Mission[]>("questylife.missions", []);
  const [water] = useLocalStorage<WaterLog[]>("questylife.water", []);
  const [recaps] = useLocalStorage<DailyRecap[]>("questylife.recaps", []);
  const [sport] = useLocalStorage<SportSession[]>("questylife.sport", []);
  const [sleep] = useLocalStorage<SleepEntry[]>("questylife.sleep", []);
  const data = { missions, water, recaps, sport, sleep };
  const xp = calculateXp(data);
  const level = levelFromXp(xp);
  const badges = buildBadges(data);

  return (
    <section className="card">
      <div className="metric-row">
        <div>
          <h2>Progression</h2>
          <div className="metric">Niveau {level.level}</div>
          <p className="subtle">{xp} XP gagnés</p>
        </div>
        <span className="brand-mark">
          <Award size={20} aria-hidden="true" />
        </span>
      </div>
      <ProgressBar value={(level.currentLevelXp / level.nextLevelXp) * 100} label={`${level.currentLevelXp}/${level.nextLevelXp} XP vers le prochain niveau`} />
      <div className="badge-grid" style={{ marginTop: 16 }}>
        {badges.map((badge) => (
          <article className={`badge-card ${badge.unlocked ? "unlocked" : ""}`} key={badge.id}>
            {badge.unlocked ? <Award size={18} aria-hidden="true" /> : <Lock size={18} aria-hidden="true" />}
            <div>
              <h3>{badge.title}</h3>
              <p className="subtle">{badge.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
