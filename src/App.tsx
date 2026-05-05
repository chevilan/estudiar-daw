import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Eye,
  ListChecks,
  Play,
  Save,
  ShieldQuestion,
  Sparkles,
  Target,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import CodeEditor from "@/components/CodeEditor";
import CodeMirrorBox from "@/components/CodeMirrorBox";
import ExerciseList from "@/components/ExerciseList";
import PreviewFrame from "@/components/PreviewFrame";
import ValidationPanel from "@/components/ValidationPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  defaultCodeThemeId,
  isCodeThemeId,
  type CodeThemeId,
} from "@/lib/codeThemes";
import { loadExercises } from "@/lib/exerciseLoader";
import {
  loadProgress,
  loadSavedCode,
  saveCode,
  saveProgress,
} from "@/lib/storage";
import { validateExercise } from "@/lib/validation";
import type {
  CodeFiles,
  Exercise,
  ExerciseProgress,
  Topic,
  ValidationField,
  ValidationResult,
} from "@/lib/types";

const emptyFiles: CodeFiles = {
  html: "",
  css: "",
  javascript: "",
};

const codeThemeStorageKey = "daw-lab:code-theme";
const hardModeStorageKey = "daw-lab:hard-mode";

const topicLabels: Record<Topic, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
};

const fileLabels: Record<ValidationField, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JS",
};

function createPendingResults(exercise: Exercise): ValidationResult[] {
  return exercise.validation.rules.map((rule) => ({
    passed: false,
    message: rule.message,
    rule,
  }));
}

function loadCodeTheme(): CodeThemeId {
  const savedTheme = localStorage.getItem(codeThemeStorageKey);
  return savedTheme && isCodeThemeId(savedTheme)
    ? savedTheme
    : defaultCodeThemeId;
}

function loadHardMode(): boolean {
  return localStorage.getItem(hardModeStorageKey) !== "off";
}

export default function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [topic, setTopic] = useState<Topic | "todos">("todos");
  const [files, setFiles] = useState<CodeFiles>(emptyFiles);
  const [activeFile, setActiveFile] = useState<ValidationField>("html");
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [hasRunValidation, setHasRunValidation] = useState(false);
  const [progressById, setProgressById] = useState<Record<string, ExerciseProgress>>({});
  const [previewNonce, setPreviewNonce] = useState(0);
  const [showTargetCode, setShowTargetCode] = useState(false);
  const [codeThemeId, setCodeThemeId] = useState<CodeThemeId>(loadCodeTheme);
  const [hardMode, setHardMode] = useState(loadHardMode);

  useEffect(() => {
    let isMounted = true;

    loadExercises()
      .then((loadedExercises) => {
        if (!isMounted) {
          return;
        }

        setExercises(loadedExercises);
        setSelectedId(loadedExercises[0]?.id ?? null);
        setProgressById(
          Object.fromEntries(
            loadedExercises
              .map((exercise) => [exercise.id, loadProgress(exercise.id)] as const)
              .filter((entry): entry is readonly [string, ExerciseProgress] => Boolean(entry[1])),
          ),
        );
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Error cargando ejercicios");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedExercise = useMemo(
    () => exercises.find((exercise) => exercise.id === selectedId) ?? null,
    [exercises, selectedId],
  );

  useEffect(() => {
    if (!selectedExercise) {
      setFiles(emptyFiles);
      return;
    }

    setFiles(loadSavedCode(selectedExercise.id) ?? selectedExercise.starterCode);
    setActiveFile("html");
    setConsoleLines([]);
    setValidationResults(createPendingResults(selectedExercise));
    setHasRunValidation(false);
    setShowTargetCode(false);
    setPreviewNonce((current) => current + 1);
  }, [selectedExercise]);

  useEffect(() => {
    if (!selectedExercise) {
      return;
    }

    saveCode(selectedExercise.id, files);
  }, [files, selectedExercise]);

  const solutionChannelId = selectedExercise
    ? `solution:${selectedExercise.id}:${previewNonce}`
    : "solution:empty";

  useEffect(() => {
    function handlePreviewMessage(event: MessageEvent) {
      if (
        typeof event.data !== "object" ||
        event.data === null ||
        event.data.source !== "daw-preview" ||
        event.data.channelId !== solutionChannelId ||
        event.data.type !== "console"
      ) {
        return;
      }

      setConsoleLines((current) => [...current.slice(-20), String(event.data.payload)]);
    }

    window.addEventListener("message", handlePreviewMessage);
    return () => window.removeEventListener("message", handlePreviewMessage);
  }, [solutionChannelId]);

  const completedCount = useMemo(
    () => Object.values(progressById).filter((progress) => progress.completed).length,
    [progressById],
  );

  const handleSelectExercise = useCallback((exercise: Exercise) => {
    setSelectedId(exercise.id);
  }, []);

  const handleChangeFile = useCallback((file: ValidationField, value: string) => {
    setFiles((current) => ({
      ...current,
      [file]: value,
    }));
    setHasRunValidation(false);
  }, []);

  const handleCodeThemeChange = useCallback((themeId: CodeThemeId) => {
    setCodeThemeId(themeId);
    localStorage.setItem(codeThemeStorageKey, themeId);
  }, []);

  const handleHardModeChange = useCallback(() => {
    setHardMode((current) => {
      const next = !current;
      localStorage.setItem(hardModeStorageKey, next ? "on" : "off");

      if (next) {
        setShowTargetCode(false);
      }

      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    if (!selectedExercise) {
      return;
    }

    setFiles(selectedExercise.starterCode);
    setConsoleLines([]);
    setValidationResults(createPendingResults(selectedExercise));
    setHasRunValidation(false);
    setPreviewNonce((current) => current + 1);
  }, [selectedExercise]);

  const handleRun = useCallback(() => {
    setConsoleLines([]);
    setPreviewNonce((current) => current + 1);
  }, []);

  const handleValidate = useCallback(() => {
    if (!selectedExercise) {
      return;
    }

    const results = validateExercise(
      selectedExercise.validation.rules,
      files,
      consoleLines,
    );
    const isCompleted = results.every((result) => result.passed);
    const currentProgress = progressById[selectedExercise.id];
    const nextProgress: ExerciseProgress = {
      completed: currentProgress?.completed || isCompleted,
      attempts: (currentProgress?.attempts ?? 0) + 1,
      lastEditedAt: new Date().toISOString(),
    };

    setValidationResults(results);
    setHasRunValidation(true);
    setProgressById((current) => ({
      ...current,
      [selectedExercise.id]: nextProgress,
    }));
    saveProgress(selectedExercise.id, nextProgress);
  }, [consoleLines, files, progressById, selectedExercise]);

  if (loadError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
        <AlertCircle size={32} className="text-destructive" aria-hidden />
        <h1 className="m-0 text-lg font-semibold">
          No se pudieron cargar los ejercicios
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">{loadError}</p>
      </main>
    );
  }

  if (!selectedExercise) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
        <Sparkles size={28} className="text-muted-foreground" aria-hidden />
        <h1 className="m-0 text-lg font-semibold">
          Cargando tu laboratorio DAW…
        </h1>
      </main>
    );
  }

  const hasTarget = Boolean(selectedExercise.targetCode);
  const currentProgress = progressById[selectedExercise.id];

  return (
    <TooltipProvider delayDuration={150}>
      <div className="grid min-h-screen bg-background lg:grid-cols-[280px_minmax(0,1fr)]">
        <ExerciseList
          exercises={exercises}
          selectedId={selectedExercise.id}
          topic={topic}
          progressById={progressById}
          onTopicChange={setTopic}
          onSelect={handleSelectExercise}
        />

        <main className="flex min-w-0 flex-col gap-5 p-4 sm:p-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                {topicLabels[selectedExercise.topic]}
              </p>
              <h1 className="m-0 mt-1 text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                {selectedExercise.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div
                className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-background px-3 text-xs font-medium tabular-nums text-muted-foreground"
                title="Ejercicios completados"
              >
                <CheckCircle2 size={14} aria-hidden />
                <span className="font-semibold text-foreground">
                  {completedCount}
                </span>
                <span className="opacity-60">/</span>
                <span>{exercises.length}</span>
              </div>
              <Button variant="outline" onClick={handleRun}>
                <Play size={14} aria-hidden />
                Ejecutar
              </Button>
              <Button
                variant={hardMode ? "default" : "outline"}
                onClick={handleHardModeChange}
                aria-pressed={hardMode}
                title="Modo difícil"
              >
                <ShieldQuestion size={14} aria-hidden />
                {hardMode ? "Difícil" : "Normal"}
              </Button>
              <Button onClick={handleValidate}>
                <ListChecks size={14} aria-hidden />
                Comprobar
              </Button>
            </div>
          </header>

          <Card className="p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <BookOpen size={16} className="text-muted-foreground" aria-hidden />
              <h2 className="m-0 text-sm font-semibold">Enunciado</h2>
            </div>
            <div className="space-y-2 text-[0.92rem] leading-relaxed text-foreground">
              {selectedExercise.prompt.split("\n").map((line, index) => (
                <p key={`${selectedExercise.id}-prompt-${index}`} className="m-0 max-w-[70ch]">
                  {line}
                </p>
              ))}
            </div>

            {!hardMode && selectedExercise.notes?.length ? (
              <ul className="m-0 mt-3 grid list-disc gap-1.5 pl-5 text-sm text-muted-foreground">
                {selectedExercise.notes.map((note) => (
                  <li key={note} className="leading-snug">
                    {note}
                  </li>
                ))}
              </ul>
            ) : null}

            <Separator className="my-4" />

            <div className="flex flex-wrap gap-1.5">
              <Badge variant="muted">
                {selectedExercise.type === "visual-match"
                  ? "Clonar objetivo"
                  : "Construir"}
              </Badge>
              <Badge variant="muted">{selectedExercise.estimatedMinutes} min</Badge>
              <Badge variant="muted" className="capitalize">
                {selectedExercise.difficulty}
              </Badge>
              {currentProgress ? (
                <Badge variant="muted">{currentProgress.attempts} intentos</Badge>
              ) : null}
            </div>
          </Card>

          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:[grid-template-areas:'editor_preview''checks_preview']">
            <div className="xl:[grid-area:editor]">
              <CodeEditor
                files={files}
                activeFile={activeFile}
                codeThemeId={codeThemeId}
                onActiveFileChange={setActiveFile}
                onChange={handleChangeFile}
                onCodeThemeChange={handleCodeThemeChange}
                onReset={handleReset}
              />
            </div>

            <Card
              className="flex flex-col gap-3 p-4 xl:[grid-area:preview]"
              aria-label="Previsualización"
            >
              <div className="flex items-center justify-between gap-3 border-b pb-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Eye size={16} className="text-muted-foreground" aria-hidden />
                  <h2 className="m-0 text-sm font-semibold">
                    {hasTarget ? "Preview y objetivo" : "Preview"}
                  </h2>
                </div>
                {hasTarget && !hardMode ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTargetCode((current) => !current)}
                    title="Ver código objetivo"
                  >
                    <Target size={14} aria-hidden />
                    {showTargetCode ? "Ocultar" : "Solución"}
                  </Button>
                ) : null}
              </div>

              <div
                className={
                  hasTarget
                    ? "grid grid-cols-1 gap-3 md:grid-cols-2"
                    : "grid gap-3"
                }
              >
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    Tu resultado
                  </span>
                  <PreviewFrame
                    files={files}
                    title="Tu resultado"
                    channelId={solutionChannelId}
                  />
                </div>

                {selectedExercise.targetCode ? (
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                      Objetivo
                    </span>
                    <PreviewFrame
                      files={selectedExercise.targetCode}
                      title="Objetivo"
                      channelId={`target:${selectedExercise.id}`}
                    />
                  </div>
                ) : null}
              </div>

              {!hardMode && showTargetCode && selectedExercise.targetCode ? (
                <div className="overflow-hidden rounded-md border">
                  <div className="flex items-center gap-2 border-b bg-secondary/60 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Save size={13} aria-hidden />
                    <span>Código objetivo: {fileLabels[activeFile]}</span>
                  </div>
                  <CodeMirrorBox
                    value={selectedExercise.targetCode[activeFile]}
                    language={activeFile}
                    ariaLabel="Código objetivo"
                    themeId={codeThemeId}
                    minHeight="180px"
                    maxHeight="240px"
                    readOnly
                  />
                </div>
              ) : null}

              {consoleLines.length ? (
                <div
                  className="grid max-h-40 gap-1 overflow-auto rounded-md border bg-code p-3 font-mono text-xs text-code-foreground"
                  aria-label="Consola"
                >
                  {consoleLines.map((line, index) => (
                    <code key={`${line}-${index}`} className="leading-snug">
                      {line}
                    </code>
                  ))}
                </div>
              ) : null}
            </Card>

            <div className="xl:[grid-area:checks]">
              <ValidationPanel
                results={validationResults}
                successMessage={selectedExercise.validation.successMessage}
                hasRunValidation={hasRunValidation}
                hideCriteria={hardMode}
              />
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
