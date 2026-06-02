import { Sun, Moon } from "lucide-react";

export default function ThemePill({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className="theme-pill-btn"
      data-testid="theme-toggle"
      aria-label="Toggle theme"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px",
        border: "1px solid var(--border-strong)",
        borderRadius: 999,
        background: "var(--panel)",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          background: !dark
            ? "linear-gradient(135deg, #5B6CF9, #7C8FF7)"
            : "transparent",
          color: !dark ? "#fff" : "var(--text-3)",
          transition: "all 0.2s ease",
        }}
      >
        <Sun size={14} />
      </span>
      <span
        style={{
          width: 26,
          height: 26,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          background: dark ? "var(--surface-2)" : "transparent",
          color: dark ? "var(--text)" : "var(--text-3)",
          transition: "all 0.2s ease",
        }}
      >
        <Moon size={14} />
      </span>
    </button>
  );
}
