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

export default function SalesTargetChart({ data }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Grafik Target Sales vs Aktual</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="employeeName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="targetValue" fill="#1e3a8a" name="Target" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actualValue" fill="#0f766e" name="Aktual" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
