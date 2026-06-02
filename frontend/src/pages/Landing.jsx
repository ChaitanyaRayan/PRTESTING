import { Icons } from "../components/Icons.jsx";
import ThemePill from "../components/ui/ThemePill.jsx";
import UploadModal from "../components/ui/UploadModal.jsx";
import { Sparkline, PrImpactGauge } from "../components/charts/index.jsx";
import { MM_SPARK_TOTAL } from "../data/media-monitoring-data.js";
import { useState } from "react";
import MediaMonitor from "../assets/images/media-monitoring.jpg";

const DASHBOARDS = [
  {
    id: "monitoring",
    num: "02",
    name: "Media Monitoring",
    tint: "#FF6B6B",
    Icon: Icons.Chart,
    imageSrc: MediaMonitor,
    statV: "92.7",
    statL: "Impact index",
    delta: "+4.1 pts",
    deltaPos: true,
  },
  {
    id: "intelligence",
    num: "01",
    name: "Media Measurement",
    tint: "#5B6CF9",
    Icon: Icons.Eye,
    statV: "35",
    statL: "Total Articles",
    delta: "+12.3%",
    deltaPos: true,
    spark: MM_SPARK_TOTAL,
    sparkColor: "#5B6CF9",
  },
  {
    id: "narrative",
    num: "03",
    name: "Narrative Intelligence",
    tint: "#00C9A7",
    Icon: Icons.Layers,
    statV: "17",
    statL: "Active narratives",
    delta: "+3 new",
    deltaPos: true,
    dateViz: [
      { id: "apr27", label: "27", month: "APR", count: 10 },
      { id: "apr28", label: "28", month: "APR", count: 5 },
      { id: "apr29", label: "29", month: "APR", count: 4 },
      { id: "apr30", label: "30", month: "APR", count: 3 },
      { id: "may01", label: "1", month: "MAY", count: 13 },
    ],
  },
  {
    id: "pr",
    num: "04",
    name: "PR Impact",
    tint: "#FFB800",
    Icon: Icons.Zap,
    statV: "$4.2M",
    statL: "EMV this month",
    delta: "−2.1%",
    deltaPos: false,
    previewChart: { type: "prGauge", value: 42 },
  },
  {
    id: "reputation",
    num: "05",
    name: "Reputation Index",
    tint: "#A855F7",
    Icon: Icons.Star,
    statV: "78.4",
    statL: "Reputation score",
    delta: "+1.2",
    deltaPos: true,
    previewChart: { type: "dummyGauge", value: 78, label: "Reputation pulse" },
  },
];

function DummyGaugePreview({ value = 0, label = "Index" }) {
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = 38;
  const circumference = Math.PI * radius;
  const dash = (normalized / 100) * circumference;

  return (
    <div className="dummy-gauge-preview">
      <svg width="120" height="80" viewBox="0 0 120 80">
        <path
          className="dummy-gauge-track"
          d={`M 20 60 A 40 40 0 0 1 100 60`}
          fill="none"
        />
        <path
          className="dummy-gauge-fill"
          d={`M 20 60 A 40 40 0 0 1 100 60`}
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
        />
        <circle className="dummy-gauge-hub" cx="60" cy="60" r="5" />
      </svg>
      <div className="dummy-gauge-label">{label}</div>
    </div>
  );
}

function DashboardPreview({ dashboard }) {
  if (!dashboard.previewChart) return null;

  if (dashboard.previewChart.type === "prGauge") {
    return (
      <div className="card-chart-preview">
        <PrImpactGauge
          value={dashboard.previewChart.value}
          size={108}
          color={dashboard.tint}
        />
      </div>
    );
  }

  return (
    <DummyGaugePreview
      value={dashboard.previewChart.value}
      label={dashboard.previewChart.label}
    />
  );
}

// ── Extracted sub-components for clarity & lower complexity ────────────────
function LandingHeader({ dark, setDark }) {
  return (
    <div className="landing-top">
      <div className="brand">
        <div className="brand-mark" />
        <span className="brand-name">AlphaMetricx</span>
        <span style={{ color: "var(--text-3)", margin: "0 4px" }}>·</span>
        <span style={{ color: "var(--text-2)" }}>InfoVision Intelligence</span>
      </div>

      <div className="top-actions">
        <ThemePill dark={dark} setDark={setDark} />
      </div>
    </div>
  );
}

function LandingFooter() {
  return (
    <div
      style={{
        marginTop: "48px",
        padding: "16px 24px",
        background: "var(--surface-2)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        fontSize: "11px",
        color: "var(--text-3)",
        fontFamily: "JetBrains Mono, monospace",
        letterSpacing: "0.05em",
      }}
    >
      <span style={{ fontWeight: 600, color: "var(--text-2)" }}>
        LAST SYNC · 2 MIN AGO
      </span>
      <span style={{ color: "var(--border-strong)" }}>|</span>
      <span>
        Sources: 38,420 outlets · 14 social platforms · 6 podcast networks
      </span>
    </div>
  );
}

function DateVizColumn({ day, max, isLatest, tint }) {
  return (
    <div className="card-date-col">
      <div className="card-date-bar-wrap">
        <div
          className="card-date-bar"
          style={{
            height: `${(day.count / max) * 100}%`,
            background: isLatest
              ? tint
              : `color-mix(in oklab, ${tint} 35%, transparent)`,
          }}
        />
      </div>
      <div
        className="card-date-day"
        style={{ color: isLatest ? tint : undefined }}
      >
        {day.label}
      </div>
      <div className="card-date-month">{day.month}</div>
    </div>
  );
}

function CardPreview({ dashboard }) {
  const { dateViz, imageSrc, previewChart, name, tint } = dashboard;

  if (!dateViz && !imageSrc && !previewChart) return null;

  const max = dateViz ? Math.max(...dateViz.map((x) => x.count)) : 0;
  const lastDateId = dateViz ? dateViz[dateViz.length - 1].id : null;

  return (
    <div className="card-spark">
      {dateViz &&
        dateViz.map((day) => (
          <DateVizColumn
            key={day.id}
            day={day}
            max={max}
            isLatest={day.id === lastDateId}
            tint={tint}
          />
        ))}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={`${name} preview`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      )}
      {previewChart && <DashboardPreview dashboard={dashboard} />}
    </div>
  );
}

function CardFooter({ statV, statL, delta, deltaPos }) {
  return (
    <div className="footer">
      <div>
        <div className="stat-v">{statV}</div>
        {delta && (
          <div
            className={`delta-pill ${deltaPos ? "pos" : "neg"}`}
            style={{ marginTop: "6px" }}
          >
            {deltaPos ? "↑" : "↓"} {delta}
          </div>
        )}
        <div className="stat-l">{statL}</div>
      </div>
    </div>
  );
}

function DashboardCard({ dashboard, onOpen }) {
  const { id, num, name, tint, Icon, spark, sparkColor } = dashboard;

  return (
    <button
      className="dash-card"
      onClick={() => onOpen(id)}
      style={{ "--card-tint": tint }}
      data-num={num}
      data-testid={`dashboard-card-${id}`}
    >
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {Icon && (
          <div className="glyph">
            <Icon size={16} />
          </div>
        )}
        <div className="num">{num}</div>
      </div>

      <h3>{name}</h3>

      <CardPreview dashboard={dashboard} />

      {spark && (
        <div className="card-spark">
          <Sparkline
            data={spark}
            color={sparkColor}
            height={56}
            strokeWidth={2.5}
          />
        </div>
      )}

      <CardFooter
        statV={dashboard.statV}
        statL={dashboard.statL}
        delta={dashboard.delta}
        deltaPos={dashboard.deltaPos}
      />
    </button>
  );
}

function LandingHero({ onOpen }) {
  return (
    <div className="landing-hero">
      <div className="eyebrow">Premium B2B SaaS Intelligence</div>

      <h1 className="hero-title">
        Media Intelligence for your <span className="grad">Brand</span>.
      </h1>

      <p className="hero-sub">
        A unified workspace for media, narrative and reputation intelligence.
        Pick a dashboard to dive in — every signal stays in sync across all
        five.
      </p>

      <div className="cards">
        {DASHBOARDS.map((d) => (
          <DashboardCard key={d.id} dashboard={d} onOpen={onOpen} />
        ))}
      </div>

      <LandingFooter />
    </div>
  );
}

export default function Landing({ onOpen, dark, setDark, layout }) {
  const [openUploadPopup, setOpenUploadPopup] = useState(false);

  return (
    <>
      <UploadModal
        open={openUploadPopup}
        onClose={() => setOpenUploadPopup(false)}
        onOpen={onOpen}
      />

      <div className="landing">
        <LandingHeader dark={dark} setDark={setDark} />
        <LandingHero onOpen={onOpen} />
      </div>
    </>
  );
}
