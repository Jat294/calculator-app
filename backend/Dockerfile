FROM golang:1.27-alpine AS build

WORKDIR /src

COPY go.mod ./
COPY cmd ./cmd
COPY internal ./internal

RUN go test ./...
RUN go build -o /out/calculator-api ./cmd/api

FROM alpine:3.21

WORKDIR /app
COPY --from=build /out/calculator-api /app/calculator-api

EXPOSE 8080
CMD ["/app/calculator-api"]
