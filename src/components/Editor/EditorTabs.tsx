"use client";

// EditorTabs.tsx — HTML / CSS / JS tab switcher

import type { EditorLanguage } from "./CodeEditor";

interface Tab {
  id: EditorLanguage;
  label: string;
  color: string; // accent color for the active indicator
}

const TABS: Tab[] = [
  { id: "html", label: "HTML", color: "#E44D26" },
  { id: "css", label: "CSS", color: "#264DE4" },
  { id: "javascript", label: "JS", color: "#F0DB4F" },
];

interface EditorTabsProps {
  activeTab: EditorLanguage;
  onTabChange: (tab: EditorLanguage) => void;
}

export default function EditorTabs({ activeTab, onTabChange }: EditorTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Code language tabs"
      className="flex items-center gap-1 px-3 pt-3 pb-0 bg-editor-bg border-b border-bg-tertiary"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={[
              "relative px-4 py-2 text-sm font-medium rounded-t-md transition-all duration-150 focus-visible:outline-none",
              isActive
                ? "text-brand-text bg-bg-secondary"
                : "text-brand-subtle hover:text-brand-muted hover:bg-bg-tertiary",
            ].join(" ")}
            aria-selected={isActive}
            role="tab"
          >
            {/* Language color dot */}
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: tab.color }}
                aria-hidden="true"
              />
              {tab.label}
            </span>
            {/* Active underline indicator */}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: tab.color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
