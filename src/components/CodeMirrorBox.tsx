import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState, type Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { Vim, getCM, vim } from "@replit/codemirror-vim";
import CodeMirror from "@uiw/react-codemirror";
import { forwardRef, type CSSProperties, useCallback, useMemo } from "react";

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
  vimMode: boolean;
  autocompleteDisabled: boolean;
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

function vimEscapeHandler(): Extension {
  return EditorView.domEventHandlers({
    keydown(event, view) {
      if (event.key !== "Escape") return false;
      event.preventDefault();
      event.stopPropagation();
      const cm = getCM(view);
      if (cm) {
        Vim.handleKey(cm, "<Esc>", "user");
      }
      requestAnimationFrame(() => view.focus());
      return true;
    },
  });
}

const CodeMirrorBox = forwardRef<EditorView, CodeMirrorBoxProps>(function CodeMirrorBox(
  {
    value,
    language,
    ariaLabel,
    className,
    minHeight = "460px",
    maxHeight,
    readOnly = false,
    themeId,
    vimMode,
    autocompleteDisabled,
    onChange,
  },
  ref,
) {
  const codeTheme = codeThemes[themeId];
  const extensions = useMemo(
    () => [
      ...(vimMode ? [vim(), vimEscapeHandler()] : []),
      EditorState.tabSize.of(2),
      EditorView.lineWrapping,
      editorChrome(codeTheme),
      ...languageExtension(language),
    ],
    [codeTheme, language, vimMode],
  );

  const mergedRef = useCallback(
    (view: EditorView | null) => {
      if (typeof ref === "function") {
        ref(view);
      } else if (ref) {
        (ref as React.MutableRefObject<EditorView | null>).current = view;
      }
    },
    [ref],
  );

  const style = {
    "--code-editor-bg": codeTheme.background,
    "--code-editor-scrollbar": codeTheme.scrollbar,
  } as CSSProperties;

  return (
    <CodeMirror
      ref={mergedRef}
      key={vimMode ? "vim" : "normal"}
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
        autocompletion: !readOnly && !autocompleteDisabled,
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
});

export default CodeMirrorBox;
