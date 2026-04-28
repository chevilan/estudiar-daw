import type { Exercise, ExerciseManifest } from "./types";

const EXERCISE_BASE_PATH = "/exercises";

export async function loadExercises(): Promise<Exercise[]> {
  const manifestResponse = await fetch(`${EXERCISE_BASE_PATH}/manifest.json`);

  if (!manifestResponse.ok) {
    throw new Error("No se pudo cargar public/exercises/manifest.json");
  }

  const manifest = (await manifestResponse.json()) as ExerciseManifest;
  const exercises = await Promise.all(
    manifest.files.map(async (file) => {
      const response = await fetch(`${EXERCISE_BASE_PATH}/${file}`);

      if (!response.ok) {
        throw new Error(`No se pudo cargar el ejercicio ${file}`);
      }

      return (await response.json()) as Exercise;
    }),
  );

  return exercises.sort((a, b) => {
    if (a.topic !== b.topic) {
      return a.topic.localeCompare(b.topic);
    }

    return a.title.localeCompare(b.title);
  });
}
