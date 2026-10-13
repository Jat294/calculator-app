import type { CalculationRequest, CalculationResponse } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

function buildUrl(path: string): string {
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
}

export async function calculate(request: CalculationRequest): Promise<number> {
  const response = await fetch(buildUrl("/api/calculate"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const payload = (await response.json().catch(() => null)) as
    | CalculationResponse
    | { error?: string }
    | null;

  if (!response.ok) {
    const message =
      payload && "error" in payload && payload.error
        ? payload.error
        : "Unable to calculate";
    throw new Error(message);
  }

  return (payload as CalculationResponse).result;
}
