import { formatPercent } from "@/utils/formatCurrency";

export default function ProgressBar({ value = 0 }) {
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-slate-900 transition-all"
          style={{ width: `${normalized}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">{formatPercent(normalized, 0)}</p>
    </div>
  );
}
