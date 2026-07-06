import { SportSessionForm } from "@/components/SportSessionForm";

export default function SportPage() {
  return (
    <>
      <section className="page-header">
        <span className="eyebrow">Musculation et cardio</span>
        <h1>Sport</h1>
        <p className="subtle">Crée une séance, ajoute tes exercices et garde une trace de tes charges.</p>
      </section>
      <SportSessionForm />
    </>
  );
}
