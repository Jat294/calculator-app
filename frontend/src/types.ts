export type Operation =
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "power"
  | "sqrt"
  | "percentage";

export type OperationMode = "binary" | "unary";

export interface CalculationRequest {
  operation: Operation;
  left?: number;
  right?: number;
}

export interface CalculationResponse {
  result: number;
}

export interface OperationDefinition {
  value: Operation;
  label: string;
  symbol: string;
  description: string;
  mode: OperationMode;
}
