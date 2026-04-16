import type { CapitalGains } from "../types";
import { getNetGain, getRealisedGains } from "../utils/calculations";
import { formatCurrencyCompact, formatCurrencyFull } from "../utils/format";

type GainsCardProps = {
  title: string;
  gains: CapitalGains;
  variant: "pre" | "after";
  savings?: number;
};

const displayValue = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return formatCurrencyCompact(value);
  return formatCurrencyFull(value);
};

export const GainsCard = ({ title, gains, variant, savings = 0 }: GainsCardProps) => {
  const shortNet = getNetGain(gains.stcg);
  const longNet = getNetGain(gains.ltcg);
  const realised = getRealisedGains(gains);

  return (
    <section className={`gain-card gain-card--${variant}`}>
      <div className="gain-card__title-row">
        <h2>{title}</h2>
        <div className="gain-card__columns">
          <span>Short-term</span>
          <span>Long-term</span>
        </div>
      </div>

      <div className="gain-card__rows">
        <div className="gain-row">
          <span>Profits</span>
          <span>{displayValue(gains.stcg.profits)}</span>
          <span>{displayValue(gains.ltcg.profits)}</span>
        </div>
        <div className="gain-row">
          <span>Losses</span>
          <span>{displayValue(gains.stcg.losses)}</span>
          <span>{displayValue(gains.ltcg.losses)}</span>
        </div>
        <div className="gain-row">
          <span>Net Capital Gains</span>
          <span>{displayValue(shortNet)}</span>
          <span>{displayValue(longNet)}</span>
        </div>
      </div>

      <div className="gain-card__footer-value">
        <strong>{variant === "pre" ? "Realised Capital Gains:" : "Effective Capital Gains:"}</strong>
        <strong>{displayValue(realised)}</strong>
      </div>

      {variant === "after" && savings > 0 && (
        <p className="gain-card__savings">?? Your taxable capital gains are reduced by: {displayValue(savings)}</p>
      )}
    </section>
  );
};