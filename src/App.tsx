import { useEffect, useMemo, useState } from "react";
import { fetchCapitalGains, fetchHoldings } from "./api/mockApi";
import { GainsCard } from "./components/GainsCard";
import { HoldingsTable } from "./components/HoldingsTable";
import type { CapitalGains, Holding } from "./types";
import { calculateHarvestedGains, getRealisedGains } from "./utils/calculations";

type HoldingWithId = Holding & { id: string };

const defaultVisibleRows = 10;

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [capitalGains, setCapitalGains] = useState<CapitalGains | null>(null);
  const [holdings, setHoldings] = useState<HoldingWithId[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(defaultVisibleRows);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const [capitalGainsData, holdingsData] = await Promise.all([
          fetchCapitalGains(),
          fetchHoldings()
        ]);

        const sortedHoldings = holdingsData
          .map((holding, index) => ({ ...holding, id: `${holding.coin}-${index}` }))
          .sort((a, b) => b.currentPrice - a.currentPrice);

        setCapitalGains(capitalGainsData);
        setHoldings(sortedHoldings);
      } catch {
        setError("Something went wrong while loading data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const selectedHoldings = useMemo(
    () => holdings.filter((holding) => selectedIds.has(holding.id)),
    [holdings, selectedIds]
  );

  const postHarvestingGains = useMemo(() => {
    if (!capitalGains) return null;
    return calculateHarvestedGains(capitalGains, selectedHoldings);
  }, [capitalGains, selectedHoldings]);

  const savings = useMemo(() => {
    if (!capitalGains || !postHarvestingGains) return 0;
    return Math.max(0, getRealisedGains(capitalGains) - getRealisedGains(postHarvestingGains));
  }, [capitalGains, postHarvestingGains]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleAllVisible = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const visibleIds = holdings.slice(0, visibleCount).map((holding) => holding.id);

      if (checked) {
        visibleIds.forEach((id) => next.add(id));
      } else {
        visibleIds.forEach((id) => next.delete(id));
      }

      return next;
    });
  };

  const handleToggleViewAll = () => {
    setVisibleCount((current) =>
      current < holdings.length ? holdings.length : defaultVisibleRows
    );
  };

  if (loading) {
    return (
      <main className="app-shell">
        <div className="status-card">Loading your tax dashboard...</div>
      </main>
    );
  }

  if (error || !capitalGains || !postHarvestingGains) {
    return (
      <main className="app-shell">
        <div className="status-card status-card--error">
          {error ?? "Unable to load the application."}
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="page-heading">
        <p className="eyebrow">KoinX Assignment</p>
        <h1>Tax Loss Harvesting</h1>
        <p>Select holdings to simulate harvesting and compare capital gains in real time.</p>
      </header>

      <section className="cards-grid">
        <GainsCard
          title="Pre-Harvesting"
          subtitle="Current realised gains snapshot"
          gains={capitalGains}
          theme="dark"
        />
        <GainsCard
          title="After Harvesting"
          subtitle="Updates as you select assets"
          gains={postHarvestingGains}
          theme="blue"
          savings={savings}
        />
      </section>

      <HoldingsTable
        holdings={holdings}
        selectedIds={selectedIds}
        onToggle={handleToggle}
        onToggleAll={handleToggleAllVisible}
        visibleCount={visibleCount}
        onToggleViewAll={handleToggleViewAll}
      />
    </main>
  );
}

export default App;