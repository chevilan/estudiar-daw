import {
  Code2,
  FileCode2,
  Paintbrush,
  Palette,
  RotateCcw,
  TerminalSquare,
} from "lucide-react";
import { forwardRef } from "react";

import CodeMirrorBox from "@/components/CodeMirrorBox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  codeThemes,
  codeThemeOptions,
  isCodeThemeId,
  type CodeThemeId,
} from "@/lib/codeThemes";
import { cn } from "@/lib/utils";
import type { CodeFiles, EditorLanguage, ValidationField } from "../lib/types";
import type { EditorView } from "@codemirror/view";

type CodeEditorProps = {
  files: CodeFiles;
  activeFile: ValidationField;
  fileLabels?: Partial<Record<ValidationField, string>>;
  fileLanguages?: Partial<Record<ValidationField, EditorLanguage>>;
  codeThemeId: CodeThemeId;
  vimMode: boolean;
  previewLayout: "right" | "left" | "below";
  onActiveFileChange: (file: ValidationField) => void;
  onChange: (file: ValidationField, value: string) => void;
  onCodeThemeChange: (themeId: CodeThemeId) => void;
  onVimModeChange: (vim: boolean) => void;
  onReset: () => void;
  onPreviewLayoutChange: (layout: "right" | "left" | "below") => void;
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

const CodeEditor = forwardRef<EditorView, CodeEditorProps>(function CodeEditor(
  {
    files,
    activeFile,
    fileLabels,
    fileLanguages,
    codeThemeId,
    vimMode,
    previewLayout,
    onActiveFileChange,
    onChange,
    onCodeThemeChange,
    onVimModeChange,
    onReset,
    onPreviewLayoutChange,
  },
  ref,
) {
  const selectedTheme = codeThemes[codeThemeId];

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Code2 size={16} className="text-muted-foreground" aria-hidden />
          <h2 className="m-0 text-sm font-semibold">Tu solución</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative inline-flex items-center">
            <Palette
              size={14}
              className="pointer-events-none absolute left-2.5 text-muted-foreground"
              aria-hidden
            />
            <select
              value={codeThemeId}
              onChange={(event) => {
                if (isCodeThemeId(event.target.value)) {
                  onCodeThemeChange(event.target.value);
                }
              }}
              aria-label="Tema del editor"
              className="h-8 max-w-[10rem] rounded-md border bg-background py-0 pl-8 pr-7 text-xs font-medium text-foreground outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {codeThemeOptions.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.label}
                </option>
              ))}
            </select>
          </label>
          <label className="relative inline-flex items-center">
            <select
              value={previewLayout}
              onChange={(event) =>
                onPreviewLayoutChange(event.target.value as "right" | "left" | "below")
              }
              aria-label="Posición del preview"
              className="h-8 max-w-[10rem] rounded-md border bg-background px-2 pr-7 text-xs font-medium text-foreground outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="right">Preview: derecha</option>
              <option value="left">Preview: izquierda</option>
              <option value="below">Preview: abajo</option>
            </select>
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  vimMode && "text-success hover:text-success",
                )}
                onClick={() => onVimModeChange(!vimMode)}
                aria-label={vimMode ? "Desactivar Vim" : "Activar Vim"}
                aria-pressed={vimMode}
              >
                <span className="text-[11px] font-bold leading-none">Vim</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {vimMode ? "Desactivar Vim" : "Activar Vim"}
            </TooltipContent>
          </Tooltip>
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
      </div>

      <div
        role="tablist"
        aria-label="Archivos editables"
        className="flex border-b bg-secondary/60"
      >
        {fileTabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeFile === key;
          const displayLabel = fileLabels?.[key] ?? label;
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
              <span className="hidden sm:inline">{displayLabel}</span>
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

      <div
        className="min-h-[460px] flex-1 overflow-hidden"
        style={{ backgroundColor: selectedTheme.background }}
      >
        <CodeMirrorBox
          ref={ref}
          value={files[activeFile]}
          language={fileLanguages?.[activeFile] ?? activeFile}
          ariaLabel={`Editor ${activeFile}`}
          themeId={codeThemeId}
          vimMode={vimMode}
          minHeight="460px"
          onChange={(value) => onChange(activeFile, value)}
        />
      </div>
    </Card>
  );
});

export default CodeEditor;
