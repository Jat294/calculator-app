import { useMemo, useState } from 'react';
import { calculate } from './api/calculator';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultPanel } from './components/ResultPanel';
import type { Operation, OperationDefinition } from './types';

const operations: OperationDefinition[] = [
  { value: 'add', label: 'Addition', symbol: '+', description: 'Adds two numbers together.', mode: 'binary' },
  { value: 'subtract', label: 'Subtraction', symbol: '−', description: 'Subtracts the second number from the first.', mode: 'binary' },
  { value: 'multiply', label: 'Multiplication', symbol: '×', description: 'Multiplies two numbers.', mode: 'binary' },
  { value: 'divide', label: 'Division', symbol: '÷', description: 'Divides the first number by the second.', mode: 'binary' },
  { value: 'power', label: 'Exponentiation', symbol: '^', description: 'Raises the first number to the power of the second.', mode: 'binary' },
  { value: 'sqrt', label: 'Square root', symbol: '√', description: 'Calculates the square root of the first number.', mode: 'unary' },
  { value: 'percentage', label: 'Percentage', symbol: '%', description: 'Calculates the given percentage of the first value.', mode: 'binary' },
];

function isFiniteNumber(value: string): boolean {
  if (value.trim() === '') {
    return false;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed);
}

export default function App() {
  const [operation, setOperation] = useState<Operation>('add');
  const [leftValue, setLeftValue] = useState('');
  const [rightValue, setRightValue] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentOperation = useMemo(
    () => operations.find((item) => item.value === operation) ?? operations[0],
    [operation],
  );

  const formula = useMemo(() => {
    if (result === null) {
      return 'Enter values and calculate to see the result.';
    }

    return `${currentOperation.label} completed successfully.`;
  }, [currentOperation.label, result]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!isFiniteNumber(leftValue)) {
      setError('The first value must be a valid number.');
      return;
    }

    if (currentOperation.mode === 'binary' && !isFiniteNumber(rightValue)) {
      setError('The second value must be a valid number.');
      return;
    }

    const left = Number(leftValue);
    const right = currentOperation.mode === 'binary' ? Number(rightValue) : undefined;

    if (operation === 'divide' && right === 0) {
      setError('Division by zero is not allowed.');
      return;
    }

    if (operation === 'sqrt' && left < 0) {
      setError('Square root requires a non-negative number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const value = await calculate({ operation, left, right });
      setResult(value);
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Calculation failed.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">React + Go</p>
          <h1>Calculator App</h1>
          <p className="hero-text">
            A responsive, testable calculator with a React frontend and a Go API that validates inputs and returns JSON.
          </p>
        </div>

        <div className="hero-grid">
          <CalculatorForm
            operation={operation}
            operations={operations}
            leftValue={leftValue}
            rightValue={rightValue}
            isSubmitting={isSubmitting}
            error={error}
            onOperationChange={setOperation}
            onLeftValueChange={setLeftValue}
            onRightValueChange={setRightValue}
            onSubmit={handleSubmit}
          />

          <ResultPanel result={result} formula={formula} />
        </div>
      </section>
    </main>
  );
}
