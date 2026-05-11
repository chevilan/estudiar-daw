import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState, type Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { type CSSProperties, useMemo } from "react";

import { cn } from "@/lib/utils";
import {
  codeEditorFont,
  codeThemes,
  type CodeThemeId,
} from "@/lib/codeThemes";
import type { EditorLanguage } from "@/lib/types";

type CodeMirrorBoxProps = {
  value: string;
  language: EditorLanguage;
  ariaLabel: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  readOnly?: boolean;
  themeId: CodeThemeId;
  onChange?: (value: string) => void;
};

function languageExtension(language: EditorLanguage): Extension[] {
  switch (language) {
    case "html":
      return [html({ autoCloseTags: true, matchClosingTags: true })];
    case "css":
      return [css()];
    case "javascript":
      return [javascript({ jsx: false, typescript: false })];
    case "plain":
      return [];
  }
}

function editorChrome(theme: (typeof codeThemes)[CodeThemeId]): Extension {
  return EditorView.theme(
    {
      "&": {
        width: "100%",
        backgroundColor: theme.background,
        fontSize: "13px",
      },
      "&.cm-focused": {
        outline: "none",
      },
      ".cm-scroller": {
        fontFamily: codeEditorFont,
        lineHeight: "1.55",
      },
      ".cm-content": {
        padding: "14px 0",
      },
      ".cm-line": {
        padding: "0 14px",
      },
      ".cm-gutters": {
        borderRight: `1px solid ${theme.border}`,
      },
      ".cm-foldGutter": {
        width: "14px",
      },
    },
    { dark: theme.isDark },
  );
}

export default function CodeMirrorBox({
  value,
  language,
  ariaLabel,
  className,
  minHeight = "460px",
  maxHeight,
  readOnly = false,
  themeId,
  onChange,
}: CodeMirrorBoxProps) {
  const codeTheme = codeThemes[themeId];
  const extensions = useMemo(
    () => [
      EditorState.tabSize.of(2),
      EditorView.lineWrapping,
      editorChrome(codeTheme),
      ...languageExtension(language),
    ],
    [codeTheme, language],
  );
  const style = {
    "--code-editor-bg": codeTheme.background,
    "--code-editor-scrollbar": codeTheme.scrollbar,
  } as CSSProperties;

  return (
    <CodeMirror
      value={value}
      aria-label={ariaLabel}
      theme={codeTheme.extension}
      extensions={extensions}
      editable={!readOnly}
      readOnly={readOnly}
      indentWithTab
      minHeight={minHeight}
      maxHeight={maxHeight}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: !readOnly,
        foldGutter: true,
        dropCursor: !readOnly,
        allowMultipleSelections: true,
        indentOnInput: true,
        bracketMatching: true,
        closeBrackets: !readOnly,
        autocompletion: !readOnly,
        rectangularSelection: true,
        crosshairCursor: true,
        highlightActiveLine: !readOnly,
        highlightSelectionMatches: true,
        tabSize: 2,
      }}
      onChange={(nextValue) => onChange?.(nextValue)}
      className={cn("code-mirror-box", className)}
      style={style}
    />
  );
}
