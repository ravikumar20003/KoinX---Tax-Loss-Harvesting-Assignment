import type { Holding } from "../types";
import { formatAssetAmount, formatCurrencyCompact, formatCurrencyFull } from "../utils/format";

type HoldingWithId = Holding & { id: string };

type HoldingsTableProps = {
  holdings: HoldingWithId[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  visibleCount: number;
  onToggleViewAll: () => void;
  shortTermSort: "asc" | "desc";
  onToggleShortTermSort: () => void;
};

const displayCompact = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return formatCurrencyCompact(value);
  if (abs >= 1000) return formatCurrencyCompact(value);
  return formatCurrencyFull(value);
};

export const HoldingsTable = ({
  holdings,
  selectedIds,
  onToggle,
  onToggleAll,
  visibleCount,
  onToggleViewAll,
  shortTermSort,
  onToggleShortTermSort
}: HoldingsTableProps) => {
  const visibleRows = holdings.slice(0, visibleCount);
  const allVisibleSelected =
    visibleRows.length > 0 && visibleRows.every((holding) => selectedIds.has(holding.id));
  const isIndeterminate =
    visibleRows.some((holding) => selectedIds.has(holding.id)) && !allVisibleSelected;

  return (
    <section className="holdings-card">
      <h2 className="holdings-title">Holdings</h2>
      <div className="holdings-table-wrap">
        <table className="holdings-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input
                  aria-label="Select all assets"
                  type="checkbox"
                  ref={(el) => {
                    if (!el) return;
                    el.indeterminate = isIndeterminate;
                  }}
                  checked={allVisibleSelected}
                  onChange={(event) => onToggleAll(event.target.checked)}
                />
              </th>
              <th>Asset</th>
              <th>
                <span>Holdings</span>
                <small>Avg Buy Price</small>
              </th>
              <th>Current Price</th>
              <th>
                <button type="button" className="sort-btn" onClick={onToggleShortTermSort}>
                  <span className={`sort-arrow ${shortTermSort === "asc" ? "is-asc" : "is-desc"}`}>?</span>
                  <span>Short-Term</span>
                </button>
              </th>
              <th>Long-Term</th>
              <th>Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((holding) => {
              const checked = selectedIds.has(holding.id);

              return (
                <tr key={holding.id} className={checked ? "is-selected" : undefined}>
                  <td className="checkbox-cell">
                    <input
                      aria-label={`Select ${holding.coin}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(holding.id)}
                    />
                  </td>
                  <td>
                    <div className="asset-box">
                      <img src={holding.logo} alt={holding.coinName} />
                      <div className="asset-copy">
                        <strong>{holding.coinName}</strong>
                        <span>{holding.coin}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-dual">
                      <strong>
                        {formatAssetAmount(holding.totalHolding)} {holding.coin}
                      </strong>
                      <span>
                        {formatCurrencyFull(holding.averageBuyPrice)}/{holding.coin}
                      </span>
                    </div>
                  </td>
                  <td>{displayCompact(holding.currentPrice)}</td>
                  <td>
                    <div className="cell-dual">
                      <strong className={holding.stcg.gain < 0 ? "is-loss" : "is-gain"}>
                        {displayCompact(holding.stcg.gain)}
                      </strong>
                      <span>
                        {formatAssetAmount(holding.stcg.balance)} {holding.coin}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="cell-dual">
                      <strong>{displayCompact(holding.ltcg.gain)}</strong>
                      <span>
                        {formatAssetAmount(holding.ltcg.balance)} {holding.coin}
                      </span>
                    </div>
                  </td>
                  <td>
                    {checked ? `${formatAssetAmount(holding.totalHolding)} ${holding.coin}` : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button type="button" className="view-all-btn" onClick={onToggleViewAll}>
        {visibleCount < holdings.length ? "View All" : "View Less"}
      </button>
    </section>
  );
};