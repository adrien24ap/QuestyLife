import { HistoryList } from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <>
      <section className="page-header">
        <span className="eyebrow">Archives</span>
        <h1>Historique</h1>
        <p className="subtle">Retrouve tes pesées, séances, missions, eau et récaps par date ou par type.</p>
      </section>
      <HistoryList />
    </>
  );
}
