package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"calculatorapp/internal/calculator"
	"calculatorapp/internal/httpapi"
)

func main() {
	port := getEnv("PORT", "8080")
	allowedOrigins := parseCSV(getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173"))
	portNumber := parsePort(port)

	engine := calculator.NewEngine()
	handler := httpapi.NewHandler(engine, allowedOrigins)

	server := &http.Server{
		Addr:              ":" + strconv.Itoa(portNumber),
		Handler:           handler.Routes(),
		ReadTimeout:       5 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("calculator API listening on %s", server.Addr)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}

func getEnv(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func parseCSV(value string) []string {
	parts := strings.Split(value, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}

func parsePort(value string) int {
	parsed, err := strconv.Atoi(value)
	if err != nil || parsed <= 0 {
		return 8080
	}
	return parsed
}
