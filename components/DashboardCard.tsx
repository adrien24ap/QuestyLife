import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  value?: string;
  note?: string;
  children?: ReactNode;
};

export function DashboardCard({ title, value, note, children }: DashboardCardProps) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {value ? <div className="metric">{value}</div> : null}
      {note ? <p className="subtle">{note}</p> : null}
      {children}
    </section>
  );
}
