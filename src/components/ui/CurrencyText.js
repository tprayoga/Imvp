import { formatCurrency } from "@/utils/formatCurrency";

export default function CurrencyText({ value, className = "" }) {
  return <span className={className}>{formatCurrency(value)}</span>;
}
