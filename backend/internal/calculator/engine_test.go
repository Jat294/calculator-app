package calculator

import "testing"

func TestCalculateAdd(t *testing.T) {
	engine := NewEngine()
	left := 7.0
	right := 5.0

	result, err := engine.Calculate(Input{Operation: OperationAdd, Left: &left, Right: &right})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if result != 12 {
		t.Fatalf("expected 12, got %v", result)
	}
}

func TestCalculateDivisionByZero(t *testing.T) {
	engine := NewEngine()
	left := 10.0
	right := 0.0

	_, err := engine.Calculate(Input{Operation: OperationDivide, Left: &left, Right: &right})
	if err != ErrDivisionByZero {
		t.Fatalf("expected division by zero error, got %v", err)
	}
}

func TestCalculateSquareRootNegative(t *testing.T) {
	engine := NewEngine()
	value := -9.0

	_, err := engine.Calculate(Input{Operation: OperationSquareRoot, Left: &value})
	if err != ErrNegativeSquareRoot {
		t.Fatalf("expected square root error, got %v", err)
	}
}

func TestCalculatePercentage(t *testing.T) {
	engine := NewEngine()
	left := 200.0
	right := 15.0

	result, err := engine.Calculate(Input{Operation: OperationPercentage, Left: &left, Right: &right})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if result != 30 {
		t.Fatalf("expected 30, got %v", result)
	}
}
