"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/utils/formatCurrency";

export default function IncentiveChart({ data }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Paid vs Locked Incentive</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="projectCode" />
            <YAxis tickFormatter={(val) => `${Math.round(val / 1000000)}M`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar
              dataKey="paidIncentiveAmount"
              fill="#0f766e"
              name="Paid Incentive"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="lockedIncentiveAmount"
              fill="#f59e0b"
              name="Locked Incentive"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
