# AGENTS.md

## Project Overview

This project is a local DAW practice lab for studying web application development topics. It runs with Vite + React on localhost and loads exercises from JSON files in `public/exercises`.

The app lets the user practice HTML, CSS, and JavaScript with:

- Topic filtering for HTML, CSS, and JavaScript.
- Editable HTML/CSS/JS code panes.
- A sandboxed iframe preview of the user's solution.
- Optional target preview for visual matching exercises.
- Declarative validation rules stored in each exercise JSON.
- Local progress and code persistence through `localStorage`.

The user's notes live as PDFs in `apuntes/`. Exercises may be written manually or generated from those notes by an AI, then saved as JSON.

## Main Commands

```bash
npm install
npm run dev
npm run build
```

- `npm run dev` starts Vite on `http://127.0.0.1:5173`.
- `npm run build` runs TypeScript checks and a production build.

## Important Paths

- `src/App.tsx`: main app state and layout.
- `src/components/`: UI components for editor, exercise list, preview, and validation.
- `src/lib/types.ts`: shared exercise, validation, and progress types.
- `src/lib/exerciseLoader.ts`: loads `public/exercises/manifest.json` and each exercise file.
- `src/lib/preview.ts`: builds the iframe document and captures console output.
- `src/lib/validation.ts`: evaluates declarative validation rules.
- `src/lib/storage.ts`: saves code and progress to `localStorage`.
- `src/styles.css`: all app styling.
- `public/exercises/manifest.json`: list of exercise JSON files to load.
- `public/exercises/*.json`: exercise definitions.
- `docs/formato-ejercicios.md`: exercise schema examples.
- `README.md`: user-facing setup and exercise creation instructions.

## Exercise Format

Every exercise must be listed in `public/exercises/manifest.json`.

Core fields:

```json
{
  "id": "css-card-example",
  "topic": "css",
  "type": "visual-match",
  "title": "Clona una tarjeta",
  "difficulty": "base",
  "estimatedMinutes": 15,
  "prompt": "Enunciado del ejercicio",
  "notes": ["Pista opcional"],
  "starterCode": {
    "html": "",
    "css": "",
    "javascript": ""
  },
  "targetCode": {
    "html": "",
    "css": "",
    "javascript": ""
  },
  "validation": {
    "mode": "all",
    "successMessage": "Ejercicio completado.",
    "rules": []
  }
}
```

`targetCode` is optional and mainly used by `visual-match` exercises. Keep all three code fields in `starterCode` and `targetCode`, even when one is empty.

Supported `topic` values:

- `html`
- `css`
- `javascript`

Supported `type` values:

- `build`
- `visual-match`

Supported `difficulty` values:

- `base`
- `media`
- `reto`

## Validation Rules

Validation is intentionally declarative so new exercises can be added without changing React code.

Supported rule types:

- `contains`: checks whether `html`, `css`, or `javascript` includes text.
- `notContains`: checks whether a field does not include text.
- `regex`: tests a regular expression against a code field.
- `domSelector`: parses the HTML and checks for a CSS selector.
- `consoleIncludes`: checks captured `console.log` output from the preview iframe.

Example:

```json
{
  "type": "regex",
  "field": "javascript",
  "pattern": "addEventListener\\(",
  "message": "Usa addEventListener."
}
```

When adding a new validation type, update:

- `src/lib/types.ts`
- `src/lib/validation.ts`
- `docs/formato-ejercicios.md`

## Implementation Notes

- The preview iframe is sandboxed with `allow-scripts`.
- The app captures `console.log`, `console.error`, and runtime errors from the user's preview.
- Validation checks are mostly structural, not full pixel-perfect comparison.
- Saved code is keyed by exercise id. Changing an exercise `id` will make old saved progress invisible.
- The app is currently client-only. Do not add a backend unless the user explicitly asks for one.
- Keep exercise JSON valid and ASCII-safe unless the Spanish text needs accents. Existing exercise text uses a mix of plain ASCII and Spanish accents.

## Development Guidelines

- Prefer small, focused changes.
- Run `npm run build` after code changes.
- If changing UI, keep the app as the first screen. Do not add a marketing landing page.
- Keep controls compact and practical; this is a study/work tool.
- Do not remove the PDF notes in `apuntes/`.
- Do not edit generated `dist/` files directly.
- Do not commit `node_modules/`, `dist/`, or TypeScript build info files.

## Common Tasks

### Add a New Exercise

1. Create `public/exercises/<exercise-id>.json`.
2. Add the file name to `public/exercises/manifest.json`.
3. Run `npm run build`.
4. Start or refresh `npm run dev`.

### Add a New Topic

Update these files together:

- `src/lib/types.ts`
- `src/App.tsx`
- `src/components/ExerciseList.tsx`
- `src/styles.css`
- Existing or new exercise JSON files.

### Improve Exercise Generation From Notes

Start with the prompt in `README.md`. If adding automation that reads PDFs directly, keep it separate from the client app unless the user asks for in-app generation.
