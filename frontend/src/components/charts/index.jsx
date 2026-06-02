import {
  AreaChart as RechartsArea,
  Area,
  BarChart as RechartsBar,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

const TOOLTIP_STYLE = {
  background: "#fff",
  border: "1px solid rgba(91,108,249,0.2)",
  borderRadius: 10,
  boxShadow: "0 8px 24px rgba(91,108,249,0.15)",
  fontSize: 12,
  padding: "10px 14px",
};

const GRID_STYLE = {
  stroke: "rgba(91,108,249,0.08)",
  strokeDasharray: "3 3",
};

const AXIS_TICK_STYLE = { fill: "#9CA3AF", fontSize: 11 };

// ── Sparkline (mini area chart with gradient + pulse on latest point) ──
export function Sparkline({ data = [], color = "#5B6CF9", height = 56, strokeWidth = 2.5 }) {
  const seriesData = data.map((v, i) => ({ idx: i, value: v }));
  const gradId = `spark-grad-${color.replace("#", "")}`;
  const latestX = seriesData.length - 1;
  const latestY = seriesData[latestX]?.value ?? 0;
  const maxY = Math.max(...data, 1);
  const minY = Math.min(...data, 0);

  return (
    <div style={{ width: "100%", height, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsArea data={seriesData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={strokeWidth}
            fill={`url(#${gradId})`}
            isAnimationActive={true}
          />
        </RechartsArea>
      </ResponsiveContainer>
      {/* Pulsing dot on the latest point */}
      <span
        style={{
          position: "absolute",
          right: 6,
          top: `${4 + (1 - (latestY - minY) / (maxY - minY || 1)) * (height - 12)}px`,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 0 4px ${color}33`,
          animation: "spark-pulse 1.5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <style>{`
        @keyframes spark-pulse {
          0%, 100% { box-shadow: 0 0 0 4px ${color}33; }
          50% { box-shadow: 0 0 0 8px ${color}11; }
        }
      `}</style>
    </div>
  );
}

// ── Area Chart ──
export function AreaChart({ data = [], color = "#5B6CF9", height = 260 }) {
  const gradId = `area-grad-${color.replace("#", "")}`;
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsArea data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_STYLE} vertical={false} />
          <XAxis dataKey="name" tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: color, strokeOpacity: 0.3 }} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill={`url(#${gradId})`} />
        </RechartsArea>
      </ResponsiveContainer>
    </div>
  );
}

// ── Bar Chart with rounded corners + gradient ──
export function BarChart({ data = [], color = "#5B6CF9", height = 260, horizontal = false }) {
  const gradId = `bar-grad-${color.replace("#", "")}`;
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ top: 10, right: 20, bottom: 0, left: horizontal ? 20 : 0 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.55} />
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_STYLE} vertical={false} />
          {horizontal ? (
            <>
              <XAxis type="number" tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} width={120} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
            </>
          )}
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(91,108,249,0.06)" }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={`url(#${gradId})`}>
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.color ? `url(#bar-grad-${entry.color.replace("#", "")})` : `url(#${gradId})`} />
            ))}
          </Bar>
          {/* Generate gradient defs for per-cell colors */}
          {data.map((entry, i) => entry.color && (
            <defs key={`def-${i}`}>
              <linearGradient id={`bar-grad-${entry.color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.55} />
              </linearGradient>
            </defs>
          ))}
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}

// ── Donut Chart with center label ──
export function Donut({ data = [], size = 200, centerLabel, centerValue }) {
  return (
    <div style={{ width: "100%", height: size, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={size / 2 - 36}
            outerRadius={size / 2 - 12}
            paddingAngle={2}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, i) => (
              <Cell key={`donut-${i}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div style={{ position: "absolute", textAlign: "center", pointerEvents: "none" }}>
          <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>
            {centerValue}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {centerLabel}
          </div>
        </div>
      )}
    </div>
  );
}

// ── PR Impact Gauge (semi-circle) ──
export function PrImpactGauge({ value = 0, size = 200, color = "#5B6CF9" }) {
  const normalized = Math.max(0, Math.min(100, value));
  const w = size;
  const h = size * 0.65;
  const cx = w / 2;
  const cy = h * 0.95;
  const r = (w / 2) * 0.78;
  const startAngle = Math.PI;
  const endAngle = 0;
  const valueAngle = startAngle - (normalized / 100) * Math.PI;
  
  const polar = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [sx, sy] = polar(startAngle);
  const [ex, ey] = polar(endAngle);
  const [vx, vy] = polar(valueAngle);
  
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="50%" stopColor="#FFB800" />
          <stop offset="100%" stopColor="#00C9A7" />
        </linearGradient>
      </defs>
      {/* Track */}
      <path
        d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
        fill="none"
        stroke="rgba(91,108,249,0.1)"
        strokeWidth={12}
        strokeLinecap="round"
      />
      {/* Value arc */}
      <path
        d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${vx} ${vy}`}
        fill="none"
        stroke="url(#gauge-grad)"
        strokeWidth={12}
        strokeLinecap="round"
      />
      {/* Center value */}
      <text x={cx} y={cy - 8} textAnchor="middle" style={{ fontSize: size * 0.16, fontWeight: 700, fill: color, fontFamily: "JetBrains Mono, monospace" }}>
        {Math.round(normalized)}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontSize: 10, fill: "#9CA3AF", letterSpacing: "0.05em" }}>
        SCORE
      </text>
    </svg>
  );
}

// ── Line Chart (Sentiment trend) ──
export function TrendLine({ data = [], color = "#5B6CF9", height = 220 }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} vertical={false} />
          <XAxis dataKey="name" tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 5, fill: color, strokeWidth: 0 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
