import { useMemo, useState } from "react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function daysInMonth(y, m) {
  return new Date(y, m, 0).getDate();
}

function firstDow(y, m) {
  return new Date(y, m - 1, 1).getDay();
}

function toIso(y, m, d) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function fmtShort(isoDate) {
  const [, m, d] = isoDate.split("-");
  return `${MONTH_NAMES[+m - 1].slice(0, 3)} ${+d}`;
}

function CalendarMonth({ year, month, name, availableDates, selectedDates, onCellClick }) {
  const totalDays = daysInMonth(year, month);
  const offset = firstDow(year, month);

  return (
    <div className="mm-cal-month">
      <div className="mm-cal-month-name">
        {name} {year}
      </div>
      <div className="mm-cal-grid">
        {DOW.map((d) => (
          <div key={d} className="mm-cal-dow">{d}</div>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`blank-${year}-${month}-${i}`} className="mm-cal-cell mm-cal-blank" />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const d = i + 1;
          const iso = toIso(year, month, d);
          const avail = availableDates.has(iso);
          const isSelected = selectedDates?.has(iso) ?? false;

          const classes = ["mm-cal-cell"];
          if (avail) classes.push("mm-cal-avail");
          else classes.push("mm-cal-na");
          if (isSelected) classes.push("mm-cal-sel");

          return (
            <button
              key={iso}
              type="button"
              className={classes.join(" ")}
              onClick={() => avail && onCellClick(iso)}
              disabled={!avail}
              data-testid={`cal-cell-${iso}`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MMCalendarPanel({
  availableDates,
  selectedDates,
  onSelectionChange,
}) {
  const months = useMemo(() => {
    const seen = new Map();
    for (const iso of availableDates) {
      const [y, m] = iso.split("-").map(Number);
      const key = `${y}-${m}`;
      if (!seen.has(key)) {
        seen.set(key, { year: y, month: m, name: MONTH_NAMES[m - 1] });
      }
    }
    return [...seen.values()].sort(
      (a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month)
    );
  }, [availableDates]);

  const handleCellClick = (iso) => {
    const next = new Set(selectedDates ?? []);
    if (next.has(iso)) next.delete(iso);
    else next.add(iso);
    onSelectionChange?.(next);
  };

  const selectedCount = selectedDates?.size ?? 0;

  const selectionLabel = useMemo(() => {
    if (!selectedDates?.size) return null;
    const sorted = [...selectedDates].sort();
    if (sorted.length === 1) return fmtShort(sorted[0]);
    if (sorted.length === 2) return `${fmtShort(sorted[0])} & ${fmtShort(sorted[1])}`;
    return `${fmtShort(sorted[0])} + ${sorted.length - 1} more`;
  }, [selectedDates]);

  return (
    <div className="side-panel mm-cal-panel" data-testid="calendar-panel">
      <div className="side-panel-header">
        <span>Calendar</span>
        {selectedCount > 0 && (
          <span className="mm-cal-count-badge">{selectedCount}</span>
        )}
      </div>

      <div className="mm-cal-hint">
        Tap dates to filter · {availableDates.size} date{availableDates.size !== 1 ? "s" : ""} available
      </div>

      <div className="mm-cal-months">
        {months.map((m) => (
          <CalendarMonth
            key={`${m.year}-${m.month}`}
            year={m.year}
            month={m.month}
            name={m.name}
            availableDates={availableDates}
            selectedDates={selectedDates}
            onCellClick={handleCellClick}
          />
        ))}
      </div>

      <div className="mm-cal-range-bar">
        {selectedCount > 0 ? (
          <>
            <span className="mm-cal-range-label">{selectionLabel}</span>
            <button
              type="button"
              className="mm-cal-range-clear"
              onClick={() => onSelectionChange?.(new Set())}
              data-testid="clear-selection"
            >
              ✕ Clear
            </button>
          </>
        ) : (
          <span className="mm-cal-range-label">No filter — showing all</span>
        )}
      </div>
    </div>
  );
}
