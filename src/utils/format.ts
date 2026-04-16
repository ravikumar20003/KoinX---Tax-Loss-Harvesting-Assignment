export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);
};

export const formatAmount = (value: number): string => {
  if (Math.abs(value) >= 1) {
    return value.toLocaleString("en-IN", { maximumFractionDigits: 4 });
  }

  return value.toLocaleString("en-IN", { maximumFractionDigits: 8 });
};

export const formatSignedCurrency = (value: number): string => {
  if (value === 0) return formatCurrency(0);
  return `${value > 0 ? "+" : "-"}${formatCurrency(Math.abs(value))}`;
};