import type { CodeFiles, ExerciseProgress } from "./types";

const codeKey = (exerciseId: string) => `daw-lab:code:${exerciseId}`;
const progressKey = (exerciseId: string) => `daw-lab:progress:${exerciseId}`;

export function loadSavedCode(exerciseId: string): CodeFiles | null {
  const raw = localStorage.getItem(codeKey(exerciseId));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CodeFiles;
  } catch {
    localStorage.removeItem(codeKey(exerciseId));
    return null;
  }
}

export function saveCode(exerciseId: string, files: CodeFiles) {
  localStorage.setItem(codeKey(exerciseId), JSON.stringify(files));
}

export function loadProgress(exerciseId: string): ExerciseProgress | null {
  const raw = localStorage.getItem(progressKey(exerciseId));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ExerciseProgress;
  } catch {
    localStorage.removeItem(progressKey(exerciseId));
    return null;
  }
}

export function saveProgress(
  exerciseId: string,
  progress: ExerciseProgress,
) {
  localStorage.setItem(progressKey(exerciseId), JSON.stringify(progress));
}
