import { Code2, FileCode2, Paintbrush, RotateCcw, TerminalSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { CodeFiles, ValidationField } from "../lib/types";

type CodeEditorProps = {
  files: CodeFiles;
  activeFile: ValidationField;
  onActiveFileChange: (file: ValidationField) => void;
  onChange: (file: ValidationField, value: string) => void;
  onReset: () => void;
};

const fileTabs: Array<{
  key: ValidationField;
  label: string;
  icon: typeof FileCode2;
}> = [
  { key: "html", label: "HTML", icon: FileCode2 },
  { key: "css", label: "CSS", icon: Paintbrush },
  { key: "javascript", label: "JS", icon: TerminalSquare },
];

export default function CodeEditor({
  files,
  activeFile,
  onActiveFileChange,
  onChange,
  onReset,
}: CodeEditorProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Code2 size={16} className="text-muted-foreground" aria-hidden />
          <h2 className="m-0 text-sm font-semibold">Tu solución</h2>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={onReset}
              aria-label="Restaurar inicio"
            >
              <RotateCcw size={14} aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Restaurar inicio</TooltipContent>
        </Tooltip>
      </div>

      <div
        role="tablist"
        aria-label="Archivos editables"
        className="flex border-b bg-secondary/60"
      >
        {fileTabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeFile === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onActiveFileChange(key)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={14} aria-hidden />
              <span className="hidden sm:inline">{label}</span>
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-foreground"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <textarea
        spellCheck="false"
        value={files[activeFile]}
        onChange={(event) => onChange(activeFile, event.target.value)}
        aria-label={`Editor ${activeFile}`}
        className="block min-h-[460px] flex-1 resize-y border-0 bg-code p-4 font-mono text-[0.84rem] leading-relaxed text-code-foreground outline-none [tab-size:2] focus-visible:outline-none"
      />
    </Card>
  );
}
