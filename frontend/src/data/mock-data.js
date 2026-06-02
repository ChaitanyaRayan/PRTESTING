// Mock data for the dashboard
export const MM_SPARK_TOTAL = [3, 5, 4, 7, 6, 9, 8, 11, 10, 14, 12, 15, 13, 17];

export const DAILY_REPORTS = {
  may1: {
    day: "Friday",
    date: "May 1, 2026",
    total: 14,
    pos: 6,
    neut: 5,
    neg: 3,
    summary:
      "Q1 earnings dominated coverage with 14 articles across 9 outlets. Mainstream pickup was strong; sentiment skewed positive.",
    sections: [
      { id: "earnings", title: "Earnings & Financials", color: "#5B6CF9" },
      { id: "trials", title: "Clinical Trials", color: "#00C9A7" },
      { id: "regulatory", title: "Regulatory & Compliance", color: "#FF6B6B" },
      { id: "pipeline", title: "Pipeline & Products", color: "#FFB800" },
      { id: "competitive", title: "Competitive Landscape", color: "#A855F7" },
    ],
  },
};

export const MOCK_ARTICLES = [
  {
    id: "a1",
    section: "Earnings & Financials",
    sectionColor: "#5B6CF9",
    title: "Q1 Earnings Beat Expectations on Strong Pipeline Momentum",
    content:
      "The company reported Q1 revenue of $4.2B, beating consensus estimates by 8%. Pipeline assets contributed strongly across oncology and immunology segments. Management raised full-year guidance.",
    domain: "Reuters",
    date: "2026-05-01",
    sentiment: "pos",
    priority: true,
  },
  {
    id: "a2",
    section: "Earnings & Financials",
    sectionColor: "#5B6CF9",
    title: "Analysts Raise Price Targets Following Strong Q1 Performance",
    content:
      "Three major analysts raised their 12-month price targets following the earnings release. Consensus rating moves to Buy with average target up 12%.",
    domain: "Bloomberg",
    date: "2026-05-01",
    sentiment: "pos",
    priority: false,
  },
  {
    id: "a3",
    section: "Clinical Trials",
    sectionColor: "#00C9A7",
    title: "Phase III Trial Shows 42% Efficacy Improvement Over Standard Care",
    content:
      "Top-line results from the pivotal Phase III study demonstrated statistically significant improvement in primary endpoint. Submission to regulators planned for Q3 2026.",
    domain: "Medscape",
    date: "2026-05-01",
    sentiment: "pos",
    priority: true,
  },
  {
    id: "a4",
    section: "Regulatory & Compliance",
    sectionColor: "#FF6B6B",
    title: "CDA Raises Reimbursement Questions on Lead Asset",
    content:
      "The Canadian Drug Agency requested additional cost-effectiveness data before recommending reimbursement. Timeline impact estimated at 3-6 months. No mainstream pickup detected.",
    domain: "Scrip Intelligence",
    date: "2026-05-01",
    sentiment: "neg",
    priority: false,
  },
  {
    id: "a5",
    section: "Pipeline & Products",
    sectionColor: "#FFB800",
    title: "New Pipeline Asset Enters Pre-Clinical Development",
    content:
      "The company announced advancement of a novel small molecule into IND-enabling studies. Mechanism targets a validated pathway with strong rationale.",
    domain: "FierceBiotech",
    date: "2026-05-01",
    sentiment: "neut",
    priority: false,
  },
  {
    id: "a6",
    section: "Competitive Landscape",
    sectionColor: "#A855F7",
    title: "Competitor Announces Delay in FcRn Program",
    content:
      "A key competitor disclosed a 9-month delay in their lead FcRn program due to manufacturing issues. This creates a competitive opening in the addressable market.",
    domain: "Endpoints News",
    date: "2026-05-01",
    sentiment: "pos",
    priority: false,
  },
];

export const AVAILABLE_DATES = new Set([
  "2026-04-27",
  "2026-04-28",
  "2026-04-29",
  "2026-04-30",
  "2026-05-01",
]);

export const KPI_DATA = [
  {
    id: "total",
    label: "Total Articles",
    value: "35",
    delta: "+12.3%",
    deltaPos: true,
    spark: [3, 5, 4, 7, 6, 9, 8, 11, 10, 14],
  },
  {
    id: "positive",
    label: "Positive Coverage",
    value: "9",
    delta: "+4.1%",
    deltaPos: true,
    spark: [1, 2, 2, 3, 3, 4, 4, 6, 6, 9],
  },
  {
    id: "negative",
    label: "Negative Coverage",
    value: "4",
    delta: "-20.0%",
    deltaPos: true,
    spark: [2, 3, 3, 2, 2, 1, 1, 2, 2, 4],
  },
  {
    id: "nss",
    label: "Net Sentiment Score",
    value: "+14.3",
    delta: "+6.2 pts",
    deltaPos: true,
    spark: [2, 4, 5, 7, 8, 9, 10, 12, 13, 14],
  },
];

export const VOLUME_SERIES = [
  { name: "Apr 27", value: 6 },
  { name: "Apr 28", value: 5 },
  { name: "Apr 29", value: 4 },
  { name: "Apr 30", value: 6 },
  { name: "May 01", value: 14 },
];

export const SENTIMENT_DATA = [
  { name: "Positive", value: 9, color: "#00C9A7" },
  { name: "Neutral", value: 22, color: "#9CA3AF" },
  { name: "Negative", value: 4, color: "#FF6B6B" },
];

export const THEME_DATA = [
  { name: "Clinical Trials", value: 12, color: "#5B6CF9" },
  { name: "Financial/Earnings", value: 9, color: "#00C9A7" },
  { name: "Treatment Efficacy", value: 6, color: "#FFB800" },
  { name: "Pipeline", value: 4, color: "#A855F7" },
  { name: "Regulatory", value: 2, color: "#FF6B6B" },
  { name: "Competitive", value: 2, color: "#F97316" },
];
