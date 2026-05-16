import { Table2 } from "lucide-react";
import { useMemo } from "react";

import { Card } from "@/components/ui/card";
import type { TableQuestion } from "@/lib/types";

type TableAnswerProps = {
  question: TableQuestion;
  value: string;
  onChange: (value: string) => void;
};

function parseValue(value: string): Record<string, Record<string, string>> {
  try {
    const parsed = JSON.parse(value);

    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, Record<string, string>>;
    }
  } catch {
    return {};
  }

  return {};
}

export default function TableAnswer({
  question,
  value,
  onChange,
}: TableAnswerProps) {
  const answers = useMemo(() => parseValue(value), [value]);
  const options = question.options ?? ["N", "R"];

  const handleChange = (row: string, column: string, nextValue: string) => {
    onChange(
      JSON.stringify(
        {
          ...answers,
          [row]: {
            ...(answers[row] ?? {}),
            [column]: nextValue,
          },
        },
        null,
        2,
      ),
    );
  };

  return (
    <Card className="overflow-hidden" aria-label="Respuesta en tabla">
      <div className="flex items-center gap-2 border-b px-4 py-3 text-sm font-semibold">
        <Table2 size={16} className="text-muted-foreground" aria-hidden />
        <h2 className="m-0 text-sm font-semibold">Tu tabla</h2>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border bg-secondary px-3 py-2 text-left font-semibold">
                Texto
              </th>
              {question.columns.map((column) => (
                <th
                  key={column}
                  className="border bg-secondary px-3 py-2 text-center font-semibold"
                >
                  <code className="font-mono text-xs">{column}</code>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {question.rows.map((row) => (
              <tr key={row}>
                <th className="border px-3 py-2 text-left font-medium">{row}</th>
                {question.columns.map((column) => (
                  <td key={`${row}-${column}`} className="border p-2">
                    <select
                      value={answers[row]?.[column] ?? ""}
                      onChange={(event) =>
                        handleChange(row, column, event.target.value)
                      }
                      aria-label={`${row} con ${column}`}
                      className="h-9 w-full rounded-md border bg-background px-2 text-center font-mono text-sm font-semibold outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">?</option>
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
