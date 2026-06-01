const colorMap = {
  Active: "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Draft: "bg-slate-200 text-slate-700",
  Calculated: "bg-indigo-100 text-indigo-700",
  Submitted: "bg-cyan-100 text-cyan-700",
  "Finance Reviewed": "bg-amber-100 text-amber-700",
  "Pending Management Approval": "bg-yellow-100 text-yellow-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Paid: "bg-green-100 text-green-700",
  Rejected: "bg-rose-100 text-rose-700",
  "Revision Needed": "bg-orange-100 text-orange-700",
  Unpaid: "bg-slate-200 text-slate-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        colorMap[status] || "bg-slate-200 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}
