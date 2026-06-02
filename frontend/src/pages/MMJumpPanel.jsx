import { ListChecks } from "lucide-react";

export default function MMJumpPanel({ sections = [], activeSection, onJump }) {
  return (
    <div className="side-panel mm-jump-panel" data-testid="jump-panel">
      <div className="side-panel-header">
        <ListChecks size={12} style={{ marginRight: 6, verticalAlign: "-2px" }} />
        Jump to Section
      </div>
      <nav className="mm-jump-nav">
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            className={`mm-jump-item ${activeSection === sec.id ? "active" : ""}`}
            onClick={() => onJump?.(sec.id)}
            style={{ "--dot-color": sec.color }}
            data-testid={`jump-item-${sec.id}`}
          >
            <span className="mm-jump-dot" style={{ background: sec.color, color: sec.color }} />
            <span className="mm-jump-label">{sec.title}</span>
            {sec.count != null && (
              <span className="mm-jump-badge">{sec.count}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
