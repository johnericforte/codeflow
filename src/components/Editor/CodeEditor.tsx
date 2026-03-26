"use client";

// CodeEditor.tsx — CodeMirror 6 wrapper with Codeflow custom theme

import ReactCodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import type { Extension } from "@codemirror/state";

export type EditorLanguage = "html" | "css" | "javascript";

interface CodeEditorProps {
  value: string;
  language: EditorLanguage;
  onChange: (value: string) => void;
}

const languageExtension: Record<EditorLanguage, () => Extension> = {
  html: () => html(),
  css: () => css(),
  javascript: () => javascript(),
};

// Override specific CodeMirror elements to match Codeflow design tokens
const codeflowTheme = EditorView.theme({
  "&": {
    backgroundColor: "#0D1117",
    height: "100%",
    fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', 'Fira Code', monospace",
    fontSize: "13.5px",
    lineHeight: "1.65",
  },
  ".cm-scroller": {
    fontFamily: "inherit",
    overflow: "auto",
  },
  ".cm-gutters": {
    backgroundColor: "#161B22",
    borderRight: "1px solid #1F2937",
    color: "#4B5563",
    minWidth: "3rem",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingLeft: "0.5rem",
    paddingRight: "0.75rem",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#1A2233",
    color: "#9CA3AF",
  },
  ".cm-activeLine": {
    backgroundColor: "#1A2233",
  },
  ".cm-cursor": {
    borderLeftColor: "#4A85F2",
    borderLeftWidth: "2px",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "rgba(36, 99, 235, 0.28) !important",
  },
  ".cm-focused .cm-matchingBracket": {
    backgroundColor: "rgba(6, 214, 160, 0.15)",
    color: "#34E0B5",
  },
  ".cm-tooltip": {
    backgroundColor: "#1F2937",
    border: "1px solid #374151",
    borderRadius: "6px",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: "#2463EB",
  },
});

export default function CodeEditor({ value, language, onChange }: CodeEditorProps) {
  return (
    <div className="h-full overflow-hidden">
      <ReactCodeMirror
        value={value}
        onChange={onChange}
        extensions={[languageExtension[language](), codeflowTheme]}
        theme={oneDark}
        height="100%"
        style={{ height: "100%" }}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
          indentOnInput: true,
          searchKeymap: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
