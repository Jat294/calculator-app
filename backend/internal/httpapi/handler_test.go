package httpapi

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"calculatorapp/internal/calculator"
)

func TestCalculateEndpoint(t *testing.T) {
	handler := NewHandler(calculator.NewEngine(), []string{"http://localhost:5173"})
	server := handler.Routes()

	body, _ := json.Marshal(calculateRequest{Operation: "multiply", Left: floatPtr(6), Right: floatPtr(7)})
	req := httptest.NewRequest(http.MethodPost, "/api/calculate", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Origin", "http://localhost:5173")
	resp := httptest.NewRecorder()

	server.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.Code)
	}

	var payload calculateResponse
	if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if payload.Result != 42 {
		t.Fatalf("expected 42, got %v", payload.Result)
	}
	if got := resp.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5173" {
		t.Fatalf("expected cors header, got %q", got)
	}
}

func TestCalculateEndpointRejectsDivisionByZero(t *testing.T) {
	handler := NewHandler(calculator.NewEngine(), nil)
	server := handler.Routes()

	body, _ := json.Marshal(calculateRequest{Operation: "divide", Left: floatPtr(5), Right: floatPtr(0)})
	req := httptest.NewRequest(http.MethodPost, "/api/calculate", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp := httptest.NewRecorder()

	server.ServeHTTP(resp, req)

	if resp.Code != http.StatusUnprocessableEntity {
		t.Fatalf("expected status 422, got %d", resp.Code)
	}
}

func TestHealthz(t *testing.T) {
	handler := NewHandler(calculator.NewEngine(), nil)
	server := handler.Routes()

	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	resp := httptest.NewRecorder()

	server.ServeHTTP(resp, req)

	if resp.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", resp.Code)
	}
}

func floatPtr(value float64) *float64 {
	return &value
}
