import type { Operation, OperationDefinition } from '../types';

interface CalculatorFormProps {
  operation: Operation;
  operations: OperationDefinition[];
  leftValue: string;
  rightValue: string;
  isSubmitting: boolean;
  error: string;
  onOperationChange: (operation: Operation) => void;
  onLeftValueChange: (value: string) => void;
  onRightValueChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function CalculatorForm({
  operation,
  operations,
  leftValue,
  rightValue,
  isSubmitting,
  error,
  onOperationChange,
  onLeftValueChange,
  onRightValueChange,
  onSubmit,
}: CalculatorFormProps) {
  const currentOperation = operations.find((item) => item.value === operation) ?? operations[0];

  return (
    <form className="calculator-form" onSubmit={onSubmit}>
      <div className="field-group">
        <label htmlFor="operation">Operation</label>
        <select
          id="operation"
          value={operation}
          onChange={(event) => onOperationChange(event.target.value as Operation)}
        >
          {operations.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <p className="field-help">{currentOperation.description}</p>
      </div>

      <div className="inputs-grid">
        <div className="field-group">
          <label htmlFor="left">First value</label>
          <input
            id="left"
            name="left"
            inputMode="decimal"
            type="number"
            step="any"
            placeholder="Enter a number"
            value={leftValue}
            onChange={(event) => onLeftValueChange(event.target.value)}
          />
        </div>

        {currentOperation.mode === 'binary' ? (
          <div className="field-group">
            <label htmlFor="right">Second value</label>
            <input
              id="right"
              name="right"
              inputMode="decimal"
              type="number"
              step="any"
              placeholder="Enter a number"
              value={rightValue}
              onChange={(event) => onRightValueChange(event.target.value)}
            />
          </div>
        ) : (
          <div className="field-group readonly-field">
            <label htmlFor="right">Second value</label>
            <input id="right" type="text" value="Not needed for square root" disabled />
          </div>
        )}
      </div>

      {error ? <p className="error-message" role="alert">{error}</p> : null}

      <button type="submit" className="primary-button" disabled={isSubmitting}>
        {isSubmitting ? 'Calculating...' : 'Calculate'}
      </button>
    </form>
  );
}
