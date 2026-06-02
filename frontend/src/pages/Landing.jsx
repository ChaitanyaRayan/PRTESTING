import { useState } from "react";
import {
  Activity,
  BarChart3,
  Eye,
  Layers,
  Zap,
  Star,
  ArrowUpRight,
} from "lucide-react";
import ThemePill from "../components/ui/ThemePill.jsx";
import { Sparkline, PrImpactGauge } from "../components/charts/index.jsx";
import { MM_SPARK_TOTAL } from "../data/mock-data.js";

const DASHBOARDS = [
  {
    id: "monitoring",
    num: "02",
    name: "Media Monitoring",
    desc: "Track every mention across earned, owned and social media in real time.",
    tint: "#FF6B6B",
    Icon: Activity,
    statV: "92.7",
    statL: "Impact index",
    delta: "+4.1 pts",
    deltaPos: true,
    dateViz: [
      { id: "apr27", label: "27", month: "APR", count: 6 },
      { id: "apr28", label: "28", month: "APR", count: 5 },
      { id: "apr29", label: "29", month: "APR", count: 4 },
      { id: "apr30", label: "30", month: "APR", count: 6 },
      { id: "may01", label: "1", month: "MAY", count: 14 },
    ],
  },
  {
    id: "intelligence",
    num: "01",
    name: "Media Measurement",
    desc: "Quantify reach, sentiment-weighted impact and message pull-through.",
    tint: "#5B6CF9",
    Icon: Eye,
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
    desc: "Map dominant story arcs, emerging themes and competitive counter-narratives.",
    tint: "#00C9A7",
    Icon: Layers,
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
    desc: "Measure earned media value, tier-weighted reach and campaign effectiveness.",
    tint: "#FFB800",
    Icon: Zap,
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
    desc: "Composite reputation score across trust, value, advocacy and brand pillars.",
    tint: "#A855F7",
    Icon: Star,
    statV: "78.4",
    statL: "Reputation score",
    delta: "+1.2",
    deltaPos: true,
    previewChart: { type: "prGauge", value: 78 },
  },
];

// ── Extracted sub-components ──────────────────────────────────────────
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
    <div className="landing-footer">
      <span className="landing-footer-strong">LAST SYNC · 2 MIN AGO</span>
      <span className="landing-footer-sep">|</span>
      <span>Sources: 38,420 outlets · 14 social platforms · 6 podcast networks</span>
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
              : `${tint}55`,
          }}
        />
      </div>
      <div className="card-date-day" style={{ color: isLatest ? tint : undefined }}>
        {day.label}
      </div>
      <div className="card-date-month">{day.month}</div>
    </div>
  );
}

function CardPreview({ dashboard }) {
  const { dateViz, previewChart, tint } = dashboard;
  if (!dateViz && !previewChart) return null;

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
      {previewChart && previewChart.type === "prGauge" && (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <PrImpactGauge value={previewChart.value} size={108} color={tint} />
        </div>
      )}
    </div>
  );
}

function CardFooter({ statV, statL, delta, deltaPos }) {
  return (
    <div className="footer">
      <div>
        <div className="stat-v">{statV}</div>
        {delta && (
          <div className={`delta-pill ${deltaPos ? "pos" : "neg"}`}>
            {deltaPos ? "↑" : "↓"} {delta}
          </div>
        )}
        <div className="stat-l">{statL}</div>
      </div>
      <div className="arrow" aria-hidden>
        <ArrowUpRight size={18} />
      </div>
    </div>
  );
}

function DashboardCard({ dashboard, onOpen }) {
  const { id, num, name, desc, tint, Icon, spark, sparkColor } = dashboard;

  return (
    <button
      type="button"
      className="dash-card"
      onClick={() => onOpen(id)}
      style={{ "--card-tint": tint }}
      data-num={num}
      data-testid={`dashboard-card-${id}`}
    >
      <div className="dash-card-top">
        <div className="glyph">
          <Icon size={16} />
        </div>
        <div className="num">{num}</div>
      </div>

      <h3>{name}</h3>
      <p>{desc}</p>

      <CardPreview dashboard={dashboard} />

      {spark && (
        <div className="card-spark">
          <Sparkline data={spark} color={sparkColor} height={56} strokeWidth={2.5} />
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
        Media Intelligence
        <br />
        for your <span className="grad">Brand</span>.
      </h1>

      <p className="hero-sub">
        A unified workspace for media, narrative and reputation intelligence.
        Pick a dashboard to dive in — every signal stays in sync across all five.
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

export default function Landing({ onOpen, dark, setDark }) {
  return (
    <div className="landing">
      <LandingHeader dark={dark} setDark={setDark} />
      <LandingHero onOpen={onOpen} />
    </div>
  );
}
