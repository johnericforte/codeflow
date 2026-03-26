"use client";

// ConvertButton.tsx — Primary CTA that triggers the conversion

interface ConvertButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function ConvertButton({
  onClick,
  isLoading = false,
  disabled = false,
}: ConvertButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={[
        "group relative inline-flex items-center justify-center gap-2.5",
        "px-8 py-3.5 rounded-lg font-semibold text-white text-sm",
        "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        disabled || isLoading
          ? "opacity-50 cursor-not-allowed"
          : "hover:-translate-y-0.5 active:translate-y-0",
      ].join(" ")}
      style={{
        background:
          disabled || isLoading
            ? "var(--color-primary-dark)"
            : "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
        boxShadow: disabled || isLoading ? "none" : "0 4px 20px rgba(36, 99, 235, 0.4)",
      }}
    >
      {/* Hover glow overlay */}
      {!disabled && !isLoading && (
        <span
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Icon + label */}
      <span className="relative flex items-center gap-2.5">
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>Converting…</span>
          </>
        ) : (
          <>
            <LightningIcon />
            <span>Convert to Webflow</span>
          </>
        )}
      </span>
    </button>
  );
}

function LightningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9 1L2.5 9H7.5L7 15L13.5 7H8.5L9 1Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="25 13"
      />
    </svg>
  );
}
