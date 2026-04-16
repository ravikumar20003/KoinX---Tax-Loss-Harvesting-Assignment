import type { CapitalGains } from "../types";
import { formatCurrency } from "../utils/format";
import { getNetGain, getRealisedGains } from "../utils/calculations";

type GainsCardProps = {
  title: string;
  subtitle: string;
  gains: CapitalGains;
  theme: "dark" | "blue";
  savings?: number;
};

export const GainsCard = ({ title, subtitle, gains, theme, savings }: GainsCardProps) => {
  const netShortTerm = getNetGain(gains.stcg);
  const netLongTerm = getNetGain(gains.ltcg);
  const realised = getRealisedGains(gains);

  return (
    <section className={`gains-card gains-card--${theme}`}>
      <div className="gains-card__head">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="gains-grid">
        <article className="gains-block">
          <h3>Short-term</h3>
          <div className="gains-line">
            <span>Profits</span>
            <strong>{formatCurrency(gains.stcg.profits)}</strong>
          </div>
          <div className="gains-line">
            <span>Losses</span>
            <strong>{formatCurrency(gains.stcg.losses)}</strong>
          </div>
          <div className="gains-line gains-line--net">
            <span>Net Capital Gains</span>
            <strong>{formatCurrency(netShortTerm)}</strong>
          </div>
        </article>

        <article className="gains-block">
          <h3>Long-term</h3>
          <div className="gains-line">
            <span>Profits</span>
            <strong>{formatCurrency(gains.ltcg.profits)}</strong>
          </div>
          <div className="gains-line">
            <span>Losses</span>
            <strong>{formatCurrency(gains.ltcg.losses)}</strong>
          </div>
          <div className="gains-line gains-line--net">
            <span>Net Capital Gains</span>
            <strong>{formatCurrency(netLongTerm)}</strong>
          </div>
        </article>
      </div>

      <div className="realised-row">
        <span>Realised Capital Gains</span>
        <strong>{formatCurrency(realised)}</strong>
      </div>

      {typeof savings === "number" && savings > 0 && (
        <p className="savings-text">You&apos;re going to save {formatCurrency(savings)}</p>
      )}
    </section>
  );
};