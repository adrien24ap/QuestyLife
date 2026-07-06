import { WeightTracker } from "@/components/WeightTracker";

export default function WeightPage() {
  return (
    <>
      <section className="page-header">
        <span className="eyebrow">Progression</span>
        <h1>Poids</h1>
        <p className="subtle">Enregistre tes pesées et observe la tendance sans te juger au jour le jour.</p>
      </section>
      <WeightTracker />
    </>
  );
}
