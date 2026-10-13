package calculator

import (
	"errors"
	"fmt"
	"math"
)

type Operation string

const (
	OperationAdd        Operation = "add"
	OperationSubtract   Operation = "subtract"
	OperationMultiply   Operation = "multiply"
	OperationDivide     Operation = "divide"
	OperationPower      Operation = "power"
	OperationSquareRoot Operation = "sqrt"
	OperationPercentage Operation = "percentage"
)

var (
	ErrInvalidInput       = errors.New("invalid input")
	ErrUnsupported        = errors.New("unsupported operation")
	ErrDivisionByZero     = errors.New("division by zero")
	ErrNegativeSquareRoot = errors.New("square root of negative number")
)

type Input struct {
	Operation Operation
	Left      *float64
	Right     *float64
}

type Engine struct{}

func NewEngine() Engine {
	return Engine{}
}

func (Engine) Calculate(input Input) (float64, error) {
	switch input.Operation {
	case OperationAdd:
		left, right, err := binaryOperands(input)
		if err != nil {
			return 0, err
		}
		return left + right, nil
	case OperationSubtract:
		left, right, err := binaryOperands(input)
		if err != nil {
			return 0, err
		}
		return left - right, nil
	case OperationMultiply:
		left, right, err := binaryOperands(input)
		if err != nil {
			return 0, err
		}
		return left * right, nil
	case OperationDivide:
		left, right, err := binaryOperands(input)
		if err != nil {
			return 0, err
		}
		if right == 0 {
			return 0, ErrDivisionByZero
		}
		return left / right, nil
	case OperationPower:
		left, right, err := binaryOperands(input)
		if err != nil {
			return 0, err
		}
		return math.Pow(left, right), nil
	case OperationSquareRoot:
		value, err := unaryOperand(input)
		if err != nil {
			return 0, err
		}
		if value < 0 {
			return 0, ErrNegativeSquareRoot
		}
		return math.Sqrt(value), nil
	case OperationPercentage:
		left, right, err := binaryOperands(input)
		if err != nil {
			return 0, err
		}
		return left * right / 100, nil
	default:
		return 0, fmt.Errorf("%w: %s", ErrUnsupported, input.Operation)
	}
}

func binaryOperands(input Input) (float64, float64, error) {
	if input.Left == nil || input.Right == nil {
		return 0, 0, ErrInvalidInput
	}
	return *input.Left, *input.Right, nil
}

func unaryOperand(input Input) (float64, error) {
	if input.Left == nil {
		return 0, ErrInvalidInput
	}
	return *input.Left, nil
}
