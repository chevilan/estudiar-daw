import { CheckCircle2, Circle, XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ValidationResult } from "../lib/types";

type ValidationPanelProps = {
  results: ValidationResult[];
  successMessage: string;
  hasRunValidation: boolean;
};

export default function ValidationPanel({
  results,
  successMessage,
  hasRunValidation,
}: ValidationPanelProps) {
  const passed = results.length > 0 && results.every((result) => result.passed);

  return (
    <Card className="p-4" aria-label="Validación">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {passed ? (
          <CheckCircle2 size={16} className="text-success" aria-hidden />
        ) : (
          <Circle size={16} className="text-muted-foreground" aria-hidden />
        )}
        <h2 className="m-0 text-sm font-semibold">Validaciones</h2>
      </div>

      {!hasRunValidation ? (
        <p className="m-0 mb-3 text-sm text-muted-foreground">
          Pulsa comprobar cuando quieras medir tu solución.
        </p>
      ) : (
        <div
          className={cn(
            "mb-3 rounded-md border px-3 py-2 text-sm font-medium",
            passed
              ? "border-success/30 bg-success-soft text-success"
              : "border-warning/30 bg-warning-soft text-warning",
          )}
        >
          {passed ? successMessage : "Aún queda algún punto por ajustar."}
        </div>
      )}

      <ul className="m-0 grid list-none gap-1.5 p-0">
        {results.map((result) => {
          const state = !hasRunValidation
            ? "pending"
            : result.passed
              ? "passed"
              : "failed";

          return (
            <li
              key={result.message}
              className={cn(
                "grid grid-cols-[16px_minmax(0,1fr)] items-start gap-2 rounded-md border px-3 py-2 text-sm leading-snug",
                state === "pending" && "border-border bg-secondary/60 text-muted-foreground",
                state === "passed" && "border-success/30 bg-success-soft text-success",
                state === "failed" && "border-destructive/30 bg-destructive/5 text-destructive",
              )}
            >
              <span className="mt-0.5">
                {state === "pending" ? (
                  <Circle size={14} aria-hidden />
                ) : state === "passed" ? (
                  <CheckCircle2 size={14} aria-hidden />
                ) : (
                  <XCircle size={14} aria-hidden />
                )}
              </span>
              <span>{result.message}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
