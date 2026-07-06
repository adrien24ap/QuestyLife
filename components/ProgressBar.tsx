type ProgressBarProps = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: ProgressBarProps) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div className="grid" style={{ gap: 8 }}>
      {label ? <span className="subtle">{label}</span> : null}
      <div className="progress-track" aria-label={label ?? "Progression"}>
        <div className="progress-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
