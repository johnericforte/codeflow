// src/lib/editor/theme.ts
// CodeMirror 6 theme extension — uses CSS variables from globals.css
// so all colors stay in sync with the Codeflow design system.

import { EditorView } from "@codemirror/view";

export const codeflowTheme = EditorView.theme({
  "&": {
    backgroundColor: "var(--color-editor-bg)",
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
    backgroundColor: "var(--color-editor-gutter)",
    borderRight: "1px solid var(--color-bg-tertiary)",
    color: "var(--color-brand-subtle)",
    minWidth: "3rem",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingLeft: "0.5rem",
    paddingRight: "0.75rem",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--color-editor-highlight)",
    color: "var(--color-brand-muted)",
  },
  ".cm-activeLine": {
    backgroundColor: "var(--color-editor-highlight)",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--color-primary-light)",
    borderLeftWidth: "2px",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "rgba(36, 99, 235, 0.28) !important",
  },
  ".cm-focused .cm-matchingBracket": {
    backgroundColor: "rgba(6, 214, 160, 0.15)",
    color: "var(--color-accent-light)",
  },
  ".cm-tooltip": {
    backgroundColor: "var(--color-bg-tertiary)",
    border: "1px solid var(--color-bg-tertiary)",
    borderRadius: "6px",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: "var(--color-primary)",
  },
});
