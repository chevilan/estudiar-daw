import { diffLines } from "diff";

import { cn } from "@/lib/utils";

type DiffViewerProps = {
  oldValue: string;
  newValue: string;
  className?: string;
};

export default function DiffViewer({
  oldValue,
  newValue,
  className,
}: DiffViewerProps) {
  const changes = diffLines(oldValue, newValue);

  return (
    <div
      className={cn(
        "overflow-auto rounded-md border bg-code font-mono text-xs text-code-foreground",
        className,
      )}
    >
      <div className="grid">
        {changes.map((change, index) => {
          const lines = change.value.split("\n");
          // Remove trailing empty line created by split when value ends with \n
          const displayLines =
            lines[lines.length - 1] === "" ? lines.slice(0, -1) : lines;

          return displayLines.map((line, lineIndex) => {
            const key = `${index}-${lineIndex}`;
            const isAdded = change.added;
            const isRemoved = change.removed;

            return (
              <div
                key={key}
                className={cn(
                  "grid grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-1 px-2 py-0.5",
                  isAdded && "bg-emerald-950/60 text-emerald-300",
                  isRemoved && "bg-red-950/60 text-red-300",
                )}
              >
                <span className="select-none text-right tabular-nums text-muted-foreground/60">
                  {isAdded ? "+" : isRemoved ? "-" : " "}
                </span>
                <span className="whitespace-pre-wrap break-all leading-snug">
                  {line || " "}
                </span>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
