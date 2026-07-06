import { DailyRecapForm } from "@/components/DailyRecapForm";

export default function RecapPage() {
  return (
    <>
      <section className="page-header">
        <span className="eyebrow">Journal</span>
        <h1>Récap</h1>
        <p className="subtle">Un point simple sur ta journée pour repérer ce qui t'aide vraiment.</p>
      </section>
      <DailyRecapForm />
    </>
  );
}
