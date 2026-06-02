import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { Sparkles, ChevronDown, ChevronUp, AlertTriangle, ExternalLink } from "lucide-react";

const SENT_LABEL = { pos: "Positive", neut: "Neutral", neg: "Negative" };

function fmtArticleDate(raw) {
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(raw);
  }
}

function ArticleCard({ article, expanded, onToggleExpand, sectionColor }) {
  const { id, title, content, domain, date, sentiment, priority } = article;
  const showMore = content?.length > 220;
  const displayedContent = expanded || !showMore ? content : `${content.slice(0, 217)}...`;

  return (
    <div
      className="mm-article"
      style={{ "--card-tint": sectionColor }}
      data-testid={`article-${id}`}
    >
      {priority && (
        <div className="mm-crisis-bar">
          <AlertTriangle size={11} />
          <span>Priority Watch</span>
        </div>
      )}

      <div className="mm-art-head">
        <span className="mm-art-src">{domain}</span>
        <span className="mm-art-sep">·</span>
        <span className="mm-art-date">{fmtArticleDate(date)}</span>
        <span className={`mm-sent-pill ${sentiment}`}>
          {SENT_LABEL[sentiment]}
        </span>
      </div>

      <div className="mm-art-title">{title}</div>
      <p className="mm-art-sum">
        {displayedContent}
        {showMore && (
          <button
            type="button"
            className="mm-art-more"
            onClick={onToggleExpand}
            data-testid={`expand-${id}`}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </p>

      <div className="mm-art-actions">
        <span className="mm-art-action-link">
          <ExternalLink size={11} />
          <span>View source</span>
        </span>
      </div>
    </div>
  );
}

function SectionBlock({ section, sectionRef, expandedArticles, onToggleExpand }) {
  return (
    <div ref={sectionRef} className="mm-section" data-testid={`section-${section.id}`}>
      <div className="mm-section-head">
        <span className="mm-section-dot" style={{ background: section.color }} />
        <h3 className="mm-section-title" style={{ "--card-tint": section.color }}>
          {section.title}
        </h3>
        <span className="mm-section-count">
          {section.articles.length} {section.articles.length === 1 ? "article" : "articles"}
        </span>
      </div>

      {section.articles.length === 0 ? (
        <div className="mm-empty-state">No articles today</div>
      ) : (
        <div className="mm-articles">
          {section.articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              sectionColor={section.color}
              expanded={!!expandedArticles[article.id]}
              onToggleExpand={() => onToggleExpand(article.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DaySummary({ totalArticles, sentimentTotals, label }) {
  return (
    <div className="mm-day-summary">
      <div className="mm-day-meta">
        <span className="mm-day-label">{label}</span>
      </div>
      <div className="mm-day-kpis">
        <div className="mm-kpi">
          <div className="mm-kpi-num">{totalArticles}</div>
          <div className="mm-kpi-label">Articles</div>
        </div>
        <div className="mm-kpi-div" />
        <div className="mm-kpi">
          <div className="mm-kpi-num" style={{ color: "#16A34A" }}>
            {sentimentTotals.pos}
          </div>
          <div className="mm-kpi-label">Positive</div>
        </div>
        <div className="mm-kpi-div" />
        <div className="mm-kpi">
          <div className="mm-kpi-num" style={{ color: "#6B7280" }}>
            {sentimentTotals.neut}
          </div>
          <div className="mm-kpi-label">Neutral</div>
        </div>
        <div className="mm-kpi-div" />
        <div className="mm-kpi">
          <div className="mm-kpi-num" style={{ color: "#DC2626" }}>
            {sentimentTotals.neg}
          </div>
          <div className="mm-kpi-label">Negative</div>
        </div>
      </div>
      <p className="mm-day-sum">
        <Sparkles
          size={13}
          style={{ marginRight: 6, verticalAlign: "-2px", color: "#5B6CF9" }}
        />
        Q1 earnings dominated the coverage cycle. Mainstream pickup was strong;
        sentiment skewed positive with a single regulatory outlier in specialist
        press.
      </p>
    </div>
  );
}

const MMDailyContent = forwardRef(function MMDailyContent(
  { sections = [], onActiveSection },
  ref,
) {
  const sectionRefs = useRef({});
  const containerRef = useRef(null);
  const [expandedArticles, setExpandedArticles] = useState({});

  const toggleExpand = (id) => {
    setExpandedArticles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useImperativeHandle(ref, () => ({
    jumpTo(sectionId) {
      const el = sectionRefs.current[sectionId];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  }), []);

  // Track active section based on scroll position
  useEffect(() => {
    const canvas = containerRef.current?.closest(".canvas");
    if (!canvas || !onActiveSection) return;

    const observers = [];
    sections.forEach((sec) => {
      const el = sectionRefs.current[sec.id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) onActiveSection(sec.id);
        },
        { root: canvas, threshold: 0.25 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sections, onActiveSection]);

  const sentimentTotals = sections.reduce(
    (totals, section) => {
      section.articles.forEach((article) => {
        totals[article.sentiment] = (totals[article.sentiment] ?? 0) + 1;
      });
      return totals;
    },
    { pos: 0, neut: 0, neg: 0 },
  );

  const totalArticles = sections.reduce(
    (sum, section) => sum + section.articles.length,
    0,
  );

  return (
    <div ref={containerRef} className="mm-day-content">
      <DaySummary
        totalArticles={totalArticles}
        sentimentTotals={sentimentTotals}
        label="DAILY DIGEST · May 1, 2026"
      />

      {sections.map((sec) => (
        <SectionBlock
          key={sec.id}
          section={sec}
          sectionRef={(el) => {
            sectionRefs.current[sec.id] = el;
          }}
          expandedArticles={expandedArticles}
          onToggleExpand={toggleExpand}
        />
      ))}
    </div>
  );
});

export default MMDailyContent;
