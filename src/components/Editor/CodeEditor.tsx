"use client";

// CodeEditor.tsx — CodeMirror 6 wrapper
// Theme lives in src/lib/editor/theme.ts (CSS-variable-based, no hardcoded colors)

import ReactCodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { codeflowTheme } from "@/lib/editor/theme";
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
