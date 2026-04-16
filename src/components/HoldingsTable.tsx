import type { Holding } from "../types";
import { formatAmount, formatCurrency, formatSignedCurrency } from "../utils/format";

type HoldingWithId = Holding & { id: string };

type HoldingsTableProps = {
  holdings: HoldingWithId[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  visibleCount: number;
  onToggleViewAll: () => void;
};

export const HoldingsTable = ({
  holdings,
  selectedIds,
  onToggle,
  onToggleAll,
  visibleCount,
  onToggleViewAll
}: HoldingsTableProps) => {
  const visibleRows = holdings.slice(0, visibleCount);
  const allVisibleSelected =
    visibleRows.length > 0 && visibleRows.every((holding) => selectedIds.has(holding.id));
  const isIndeterminate =
    visibleRows.some((holding) => selectedIds.has(holding.id)) && !allVisibleSelected;

  return (
    <section className="table-shell">
      <div className="table-head">
        <h2>Holdings</h2>
        <button type="button" className="link-btn" onClick={onToggleViewAll}>
          {visibleCount < holdings.length ? "View All" : "View Less"}
        </button>
      </div>

      <div className="table-scroll">
        <table className="holdings-table">
          <thead>
            <tr>
              <th>
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
              <th>Holdings / Avg Buy Price</th>
              <th>Current Price</th>
              <th>Short-Term Gain</th>
              <th>Long-Term Gain</th>
              <th>Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((holding) => {
              const checked = selectedIds.has(holding.id);

              return (
                <tr key={holding.id} className={checked ? "is-selected" : undefined}>
                  <td>
                    <input
                      aria-label={`Select ${holding.coin}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(holding.id)}
                    />
                  </td>
                  <td>
                    <div className="asset-cell">
                      <img src={holding.logo} alt={holding.coin} loading="lazy" />
                      <div>
                        <strong>{holding.coin}</strong>
                        <span>{holding.coinName}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="stack-text">
                      <strong>{formatAmount(holding.totalHolding)}</strong>
                      <span>{formatCurrency(holding.averageBuyPrice)}</span>
                    </div>
                  </td>
                  <td>{formatCurrency(holding.currentPrice)}</td>
                  <td>
                    <div className="stack-text">
                      <strong className={holding.stcg.gain >= 0 ? "gain" : "loss"}>
                        {formatSignedCurrency(holding.stcg.gain)}
                      </strong>
                      <span>Qty: {formatAmount(holding.stcg.balance)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stack-text">
                      <strong className={holding.ltcg.gain >= 0 ? "gain" : "loss"}>
                        {formatSignedCurrency(holding.ltcg.gain)}
                      </strong>
                      <span>Qty: {formatAmount(holding.ltcg.balance)}</span>
                    </div>
                  </td>
                  <td>{checked ? formatAmount(holding.totalHolding) : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};