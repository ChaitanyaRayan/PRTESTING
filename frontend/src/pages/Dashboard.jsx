import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Download, Sparkles } from "lucide-react";
import ThemePill from "../components/ui/ThemePill.jsx";
import MMCalendarPanel from "./MMCalendarPanel.jsx";
import MMJumpPanel from "./MMJumpPanel.jsx";
import MMDailyContent from "./MMDailyContent.jsx";
import {
  AreaChart,
  BarChart,
  Donut,
  PrImpactGauge,
  Sparkline,
} from "../components/charts/index.jsx";
import {
  AVAILABLE_DATES,
  MOCK_ARTICLES,
  KPI_DATA,
  VOLUME_SERIES,
  SENTIMENT_DATA,
  THEME_DATA,
} from "../data/mock-data.js";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "sentiment", label: "Sentiment" },
  { id: "themes", label: "Themes" },
  { id: "coverage", label: "Coverage" },
  { id: "stories", label: "Key Stories" },
];

const DASH_META = {
  monitoring: { name: "Media Monitoring", date: "Apr 27 – May 1, 2026 · 5-day window" },
  intelligence: { name: "Media Measurement", date: "Apr 27 – May 1, 2026 · 5-day window" },
  narrative: { name: "Narrative Intelligence", date: "Apr 27 – May 1, 2026" },
  pr: { name: "PR Impact", date: "Apr 28 – Jun 25, 2026 · 30-day window" },
  reputation: { name: "Reputation Index", date: "Apr 28 – Jun 25, 2026 · 30-day window" },
};

function KpiCard({ kpi, color = "#5B6CF9" }) {
  return (
    <div className="card kpi" data-testid={`kpi-${kpi.id}`}>
      <div className="card-h">
        <div className="ttl">{kpi.label}</div>
      </div>
      <div className="row">
        <div className="v">{kpi.value}</div>
        <div className={`delta-pill ${kpi.deltaPos ? "pos" : "neg"}`}>
          {kpi.deltaPos ? "↑" : "↓"} {kpi.delta}
        </div>
      </div>
      {kpi.spark && (
        <div className="spark">
          <Sparkline data={kpi.spark} color={color} height={56} />
        </div>
      )}
    </div>
  );
}

function AiAnalysisModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} data-testid="ai-modal">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-text">
            <div className="modal-title">
              <Sparkles size={16} style={{ verticalAlign: "-3px", color: "#5B6CF9", marginRight: 6 }} />
              AI Strategic Analysis
            </div>
            <div className="modal-desc">
              Auto-generated insights from this period's coverage
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} data-testid="close-modal">
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="ai-insight-block">
            <div className="ai-insight-title">→ Coverage Momentum</div>
            <p>
              35 articles over 5 days — <strong>40% concentrated on May 1</strong> due
              to Q1 earnings. Off-earnings baseline is ~5.3 articles/day.
            </p>
          </div>
          <div className="ai-insight-block">
            <div className="ai-insight-title">→ Sentiment Quality</div>
            <p>
              Net sentiment of <strong>+14.3</strong> exceeds the pharma benchmark
              of +8.1. Week 5 of a consecutive uptrend.
            </p>
          </div>
          <div className="ai-insight-block">
            <div className="ai-insight-title">→ Risk Concentration</div>
            <p>
              3 of 4 negative articles originate from <strong>Scrip Intelligence</strong> (~280K reach).
              No mainstream pickup detected — monitor for escalation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewContent() {
  const palette = ["#5B6CF9", "#00C9A7", "#FF6B6B", "#FFB800"];
  return (
    <>
      <div className="kpi-row">
        {KPI_DATA.map((k, i) => (
          <KpiCard key={k.id} kpi={k} color={palette[i % palette.length]} />
        ))}
      </div>

      <div className="grid">
        <div className="card span-7">
          <div className="card-h">
            <div className="ttl">Results Over Time</div>
            <div className="meta">daily articles</div>
          </div>
          <AreaChart data={VOLUME_SERIES} color="#5B6CF9" height={260} />
        </div>

        <div className="card span-5">
          <div className="card-h">
            <div className="ttl">Sentiment Distribution</div>
            <div className="meta">35 articles</div>
          </div>
          <Donut data={SENTIMENT_DATA} size={220} centerValue="35" centerLabel="Total" />
          <div className="legend">
            {SENTIMENT_DATA.map((s) => (
              <span key={s.name} className="legend-item">
                <span className="sw" style={{ background: s.color }} />
                {s.name} · <span className="mono tnum">{s.value}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="card span-12">
          <div className="card-h">
            <div className="ttl">Coverage by Theme</div>
            <div className="meta">article count</div>
          </div>
          <BarChart data={THEME_DATA} height={260} />
        </div>
      </div>
    </>
  );
}

function SentimentContent() {
  const dailySent = [
    { name: "Apr 27", value: 4 },
    { name: "Apr 28", value: 3 },
    { name: "Apr 29", value: 2 },
    { name: "Apr 30", value: 5 },
    { name: "May 01", value: 9 },
  ];
  return (
    <div className="grid">
      <div className="card span-7">
        <div className="card-h">
          <div className="ttl">Sentiment Over Time</div>
          <div className="meta">daily net score</div>
        </div>
        <AreaChart data={dailySent} color="#00C9A7" height={260} />
      </div>
      <div className="card span-5">
        <div className="card-h">
          <div className="ttl">Sentiment Mix</div>
          <div className="meta">5-day total</div>
        </div>
        <Donut data={SENTIMENT_DATA} size={200} centerValue="+14.3" centerLabel="NSS" />
      </div>
    </div>
  );
}

function ThemesContent() {
  return (
    <div className="grid">
      <div className="card span-12">
        <div className="card-h">
          <div className="ttl">Theme Distribution</div>
          <div className="meta">share of voice</div>
        </div>
        <BarChart data={THEME_DATA} height={300} />
      </div>
    </div>
  );
}

function CoverageContent() {
  return (
    <div className="grid">
      <div className="card span-12">
        <div className="card-h">
          <div className="ttl">Top Publications</div>
          <div className="meta">by article count</div>
        </div>
        <BarChart
          data={[
            { name: "Reuters", value: 8, color: "#5B6CF9" },
            { name: "Bloomberg", value: 6, color: "#00C9A7" },
            { name: "Medscape", value: 5, color: "#FFB800" },
            { name: "FierceBiotech", value: 4, color: "#A855F7" },
            { name: "Endpoints News", value: 3, color: "#FF6B6B" },
            { name: "Scrip Intelligence", value: 3, color: "#F97316" },
          ]}
          height={300}
          horizontal
        />
      </div>
    </div>
  );
}

function PrContent() {
  return (
    <div className="grid">
      <div className="card span-6">
        <div className="card-h">
          <div className="ttl">PR Impact Score</div>
          <div className="meta">earned media value</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
          <PrImpactGauge value={42} size={240} color="#FFB800" />
        </div>
      </div>
      <div className="card span-6">
        <div className="card-h">
          <div className="ttl">Daily PR Series</div>
          <div className="meta">30-day window</div>
        </div>
        <AreaChart
          data={[
            { name: "W1", value: 32 },
            { name: "W2", value: 38 },
            { name: "W3", value: 41 },
            { name: "W4", value: 42 },
          ]}
          color="#FFB800"
          height={260}
        />
      </div>
    </div>
  );
}

function ReputationContent() {
  return (
    <div className="grid">
      <div className="card span-6">
        <div className="card-h">
          <div className="ttl">Reputation Health</div>
          <div className="meta">composite score</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
          <PrImpactGauge value={78.4} size={240} color="#A855F7" />
        </div>
      </div>
      <div className="card span-6">
        <div className="card-h">
          <div className="ttl">Pillar Scores</div>
          <div className="meta">trust, value, brand</div>
        </div>
        <BarChart
          data={[
            { name: "Trust", value: 82, color: "#5B6CF9" },
            { name: "Value", value: 76, color: "#00C9A7" },
            { name: "Advocacy", value: 71, color: "#FFB800" },
            { name: "Brand", value: 85, color: "#A855F7" },
            { name: "Social", value: 68, color: "#FF6B6B" },
          ]}
          height={260}
        />
      </div>
    </div>
  );
}

function MonitoringContent({ selectedDates }) {
  const contentRef = useRef(null);
  const [activeSection, setActiveSection] = useState(null);

  // Group articles by section
  const sections = useMemo(() => {
    const grouped = MOCK_ARTICLES.reduce((acc, art) => {
      if (selectedDates?.size > 0 && !selectedDates.has(art.date)) return acc;
      if (!acc[art.section]) {
        acc[art.section] = {
          id: art.section.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
          title: art.section,
          color: art.sectionColor,
          articles: [],
        };
      }
      acc[art.section].articles.push(art);
      return acc;
    }, {});
    return Object.values(grouped);
  }, [selectedDates]);

  const jumpSections = sections.map((s) => ({
    id: s.id,
    title: s.title,
    color: s.color,
    count: s.articles.length,
  }));

  return (
    <div className="monitoring-layout">
      <div className="monitoring-main">
        <MMDailyContent
          ref={contentRef}
          sections={sections}
          onActiveSection={setActiveSection}
        />
      </div>
      <div className="monitoring-side">
        <MMJumpPanel
          sections={jumpSections}
          activeSection={activeSection}
          onJump={(id) => contentRef.current?.jumpTo(id)}
        />
      </div>
    </div>
  );
}

function DashboardContent({ dashboardId, tab, selectedDates }) {
  if (dashboardId === "monitoring") return <MonitoringContent selectedDates={selectedDates} />;
  if (dashboardId === "pr") return <PrContent />;
  if (dashboardId === "reputation") return <ReputationContent />;
  if (tab === "sentiment") return <SentimentContent />;
  if (tab === "themes") return <ThemesContent />;
  if (tab === "coverage") return <CoverageContent />;
  if (tab === "stories") return <MonitoringContent selectedDates={selectedDates} />;
  return <OverviewContent />;
}

export default function Dashboard({ onBack, dashboardId, dark, setDark }) {
  const [tab, setTab] = useState("overview");
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [aiModal, setAiModal] = useState(false);

  const meta = DASH_META[dashboardId] ?? DASH_META.monitoring;
  const showTabs = dashboardId !== "monitoring";

  return (
    <div className="app-shell" data-testid="dashboard-shell">
      {dashboardId === "monitoring" && (
        <MMCalendarPanel
          availableDates={AVAILABLE_DATES}
          selectedDates={selectedDates}
          onSelectionChange={setSelectedDates}
        />
      )}

      <div className="main">
        <div className="topbar">
          <div className="tb-title">
            <button
              type="button"
              className="back"
              onClick={onBack}
              data-testid="back-button"
            >
              <ArrowLeft size={14} />
              <span>All dashboards</span>
            </button>
            <span className="sep">/</span>
            <span className="crumb-cur">{meta.name}</span>
          </div>
          <div className="tb-actions">
            <button type="button" className="btn" data-testid="export-btn">
              <Download size={13} />
              Export
            </button>
            <button
              type="button"
              className="btn-ai"
              onClick={() => setAiModal(true)}
              data-testid="ai-analysis-btn"
            >
              <Sparkles size={13} />
              AI Analysis
            </button>
            <ThemePill dark={dark} setDark={setDark} />
          </div>
        </div>

        {showTabs && (
          <div className="tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
                data-testid={`tab-${t.id}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="canvas">
          <div className="dash-banner">
            <div className="dash-banner-overlay" />
            <div className="dash-banner-content">
              <h1>{meta.name}</h1>
              <div className="dash-banner-daterange">{meta.date}</div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <DashboardContent dashboardId={dashboardId} tab={tab} selectedDates={selectedDates} />
          </div>
        </div>
      </div>

      {aiModal && <AiAnalysisModal onClose={() => setAiModal(false)} />}
    </div>
  );
}
