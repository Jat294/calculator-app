interface ResultPanelProps {
  result: number | null;
  formula: string;
}

const visibleFractionDigits = 8;

function formatResult(result: number): string {
  if (!Number.isFinite(result)) {
    return String(result);
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: visibleFractionDigits,
    useGrouping: false,
  }).format(result);
}

export function ResultPanel({ result, formula }: ResultPanelProps) {
  const resultLabel = result === null ? 'Waiting for a calculation' : formatResult(result);

  return (
    <section className="result-panel" aria-live="polite">
      <div>
        <p className="section-label">Result</p>
        <h2 title={result === null ? undefined : String(result)}>{resultLabel}</h2>
      </div>
      <p className="result-formula">{formula}</p>
    </section>
  );
}
