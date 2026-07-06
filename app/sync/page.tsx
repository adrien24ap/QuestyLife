import { CloudSync } from "@/components/CloudSync";

export default function SyncPage() {
  return (
    <>
      <section className="page-header">
        <span className="eyebrow">Cloud</span>
        <h1>Synchronisation</h1>
        <p className="subtle">
          Connecte QuestyLife pour retrouver les mêmes données sur ton ordinateur et ton téléphone.
        </p>
      </section>
      <CloudSync />
    </>
  );
}
