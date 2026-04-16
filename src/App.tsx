import { useEffect, useMemo, useState } from "react";
import { fetchCapitalGains, fetchHoldings } from "./api/mockApi";
import { GainsCard } from "./components/GainsCard";
import { HoldingsTable } from "./components/HoldingsTable";
import type { CapitalGains, Holding } from "./types";
import { calculateHarvestedGains, getRealisedGains } from "./utils/calculations";

type HoldingWithId = Holding & { id: string };

const defaultVisibleRows = 4;

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capitalGains, setCapitalGains] = useState<CapitalGains | null>(null);
  const [holdings, setHoldings] = useState<HoldingWithId[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(defaultVisibleRows);
  const [shortTermSort, setShortTermSort] = useState<"asc" | "desc">("desc");
  const [showHow, setShowHow] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const [capitalGainsData, holdingsData] = await Promise.all([
          fetchCapitalGains(),
          fetchHoldings()
        ]);

        const keyedHoldings = holdingsData.map((holding, index) => ({
          ...holding,
          id: `${holding.coin}-${index}`
        }));

        setCapitalGains(capitalGainsData);
        setHoldings(keyedHoldings);
      } catch {
        setError("Could not load tax optimisation data.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const sortedHoldings = useMemo(() => {
    const copy = [...holdings];
    copy.sort((a, b) =>
      shortTermSort === "desc" ? b.stcg.gain - a.stcg.gain : a.stcg.gain - b.stcg.gain
    );
    return copy;
  }, [holdings, shortTermSort]);

  const selectedHoldings = useMemo(
    () => sortedHoldings.filter((holding) => selectedIds.has(holding.id)),
    [sortedHoldings, selectedIds]
  );

  const postHarvestingGains = useMemo(() => {
    if (!capitalGains) return null;
    return calculateHarvestedGains(capitalGains, selectedHoldings);
  }, [capitalGains, selectedHoldings]);

  const savings = useMemo(() => {
    if (!capitalGains || !postHarvestingGains) return 0;
    return Math.max(0, getRealisedGains(postHarvestingGains) - getRealisedGains(capitalGains));
  }, [capitalGains, postHarvestingGains]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleAllVisible = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const visibleIds = sortedHoldings.slice(0, visibleCount).map((holding) => holding.id);
      visibleIds.forEach((id) => {
        if (checked) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  if (loading) {
    return <main className="app-shell"><div className="status-card">Loading Tax Optimisation...</div></main>;
  }

  if (error || !capitalGains || !postHarvestingGains) {
    return <main className="app-shell"><div className="status-card error">{error ?? "Something went wrong."}</div></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <h1>Tax Optimisation</h1>
        <button
          type="button"
          className="how-link"
          onMouseEnter={() => setShowHow(true)}
          onMouseLeave={() => setShowHow(false)}
          onFocus={() => setShowHow(true)}
          onBlur={() => setShowHow(false)}
        >
          How it works?
        </button>

        {showHow && (
          <div className="how-popover">
            <p>• See your capital gains for FY 2024-25 in the left card</p>
            <p>• Check boxes for assets you plan on selling to reduce your tax liability</p>
            <p>• Instantly see your updated tax liability in the right card</p>
            <p>
              <strong>Pro tip:</strong> Experiment with different combinations of your holdings to optimize your tax
              liability
            </p>
          </div>
        )}
      </header>

      <section className="notes-strip">
        <button type="button" className="notes-button" onClick={() => setShowNotes((v) => !v)}>
          <span className="notes-icon">i</span>
          <span>Important Notes And Disclaimers</span>
          <span className={`notes-caret ${showNotes ? "open" : ""}`}>?</span>
        </button>
        {showNotes && (
          <div className="notes-panel">
            This is a simulation to demonstrate tax-loss harvesting and does not constitute financial advice.
          </div>
        )}
      </section>

      <section className="cards-grid">
        <GainsCard title="Pre Harvesting" gains={capitalGains} variant="pre" />
        <GainsCard title="After Harvesting" gains={postHarvestingGains} variant="after" savings={savings} />
      </section>

      <HoldingsTable
        holdings={sortedHoldings}
        selectedIds={selectedIds}
        onToggle={handleToggle}
        onToggleAll={handleToggleAllVisible}
        visibleCount={visibleCount}
        onToggleViewAll={() =>
          setVisibleCount((current) => (current < sortedHoldings.length ? sortedHoldings.length : defaultVisibleRows))
        }
        shortTermSort={shortTermSort}
        onToggleShortTermSort={() =>
          setShortTermSort((current) => (current === "desc" ? "asc" : "desc"))
        }
      />
    </main>
  );
}

export default App;