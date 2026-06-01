const colorMap = {
  "Below Gate": "bg-slate-200 text-slate-700",
  Standard: "bg-blue-100 text-blue-700",
  Good: "bg-emerald-100 text-emerald-700",
  Excellent: "bg-amber-100 text-amber-700",
};

export default function TierBadge({ tier }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        colorMap[tier] || "bg-slate-200 text-slate-700"
      }`}
    >
      {tier}
    </span>
  );
}
