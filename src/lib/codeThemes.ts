import type { Extension } from "@codemirror/state";
import { draculaInit } from "@uiw/codemirror-theme-dracula";
import { githubDarkInit, githubLightInit } from "@uiw/codemirror-theme-github";
import { monokaiInit } from "@uiw/codemirror-theme-monokai";
import { tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import { vscodeDarkInit, vscodeLightInit } from "@uiw/codemirror-theme-vscode";

export const codeEditorFont =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

const themeFontSettings = {
  settings: {
    fontFamily: codeEditorFont,
  },
};

export const codeThemeOptions = [
  { id: "vscode-dark", label: "VS Code Dark" },
  { id: "vscode-light", label: "VS Code Light" },
  { id: "github-dark", label: "GitHub Dark" },
  { id: "github-light", label: "GitHub Light" },
  { id: "dracula", label: "Dracula" },
  { id: "tokyo-night", label: "Tokyo Night" },
  { id: "monokai", label: "Monokai" },
] as const;

export type CodeThemeId = (typeof codeThemeOptions)[number]["id"];

type CodeThemeDefinition = {
  extension: Extension;
  isDark: boolean;
  background: string;
  border: string;
  scrollbar: string;
};

export const defaultCodeThemeId: CodeThemeId = "vscode-dark";

export const codeThemes: Record<CodeThemeId, CodeThemeDefinition> = {
  "vscode-dark": {
    extension: vscodeDarkInit(themeFontSettings),
    isDark: true,
    background: "#1e1e1e",
    border: "#2d2d2d",
    scrollbar: "#3e3e42",
  },
  "vscode-light": {
    extension: vscodeLightInit(themeFontSettings),
    isDark: false,
    background: "#ffffff",
    border: "#d4d4d4",
    scrollbar: "#c8c8c8",
  },
  "github-dark": {
    extension: githubDarkInit(themeFontSettings),
    isDark: true,
    background: "#0d1117",
    border: "#30363d",
    scrollbar: "#30363d",
  },
  "github-light": {
    extension: githubLightInit(themeFontSettings),
    isDark: false,
    background: "#ffffff",
    border: "#d0d7de",
    scrollbar: "#d0d7de",
  },
  dracula: {
    extension: draculaInit(themeFontSettings),
    isDark: true,
    background: "#282a36",
    border: "#44475a",
    scrollbar: "#44475a",
  },
  "tokyo-night": {
    extension: tokyoNightInit(themeFontSettings),
    isDark: true,
    background: "#1a1b26",
    border: "#292e42",
    scrollbar: "#414868",
  },
  monokai: {
    extension: monokaiInit(themeFontSettings),
    isDark: true,
    background: "#272822",
    border: "#3e3d32",
    scrollbar: "#49483e",
  },
};

export function isCodeThemeId(value: string): value is CodeThemeId {
  return codeThemeOptions.some((theme) => theme.id === value);
}
