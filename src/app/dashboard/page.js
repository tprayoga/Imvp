"use client";

import dynamic from "next/dynamic";
import StatCard from "@/components/ui/StatCard";
import CurrencyText from "@/components/ui/CurrencyText";
import DataTable from "@/components/ui/DataTable";
import { useAppData } from "@/components/layout/AppProvider";
import { formatPercent } from "@/utils/formatCurrency";

const RevenueChart = dynamic(() => import("@/components/charts/RevenueChart"), { ssr: false });
const IncentiveChart = dynamic(() => import("@/components/charts/IncentiveChart"), { ssr: false });
const TierChart = dynamic(() => import("@/components/charts/TierChart"), { ssr: false });
const SalesTargetChart = dynamic(() => import("@/components/charts/SalesTargetChart"), {
  ssr: false,
});

export default function DashboardPage() {
  const { state } = useAppData();

  const totalRevenue = state.projects.reduce((acc, item) => acc + item.revenue, 0);
  const totalCost = state.projects.reduce((acc, item) => acc + item.cost, 0);
  const totalGrossProfit = state.projects.reduce((acc, item) => acc + item.grossProfit, 0);
  const averageMargin = state.projects.length
    ? state.projects.reduce((acc, item) => acc + item.marginPercentage, 0) / state.projects.length
    : 0;
  const collectionRate = state.projects.length
    ? state.projects.reduce((acc, item) => acc + item.collectionRatio, 0) / state.projects.length
    : 0;
  const totalBonusPool = state.projects.reduce((acc, item) => acc + item.bonusPoolAmount, 0);
  const paidIncentive = state.projects.reduce((acc, item) => acc + item.paidIncentiveAmount, 0);
  const lockedIncentive = state.projects.reduce((acc, item) => acc + item.lockedIncentiveAmount, 0);

  const tierData = ["Below Gate", "Standard", "Good", "Excellent"].map((tier) => ({
    name: tier,
    value: state.projects.filter((item) => item.tier === tier).length,
  }));

  const topRecipients = [...state.kpis]
    .sort((a, b) => b.finalIncentive - a.finalIncentive)
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      employeeName: item.employeeName,
      role: item.role,
      projectId: item.projectId,
      finalIncentive: item.finalIncentive,
    }));

  const salesRows = state.kpis.filter((item) => item.role === "Sales");
  const totalSalesTarget = salesRows.reduce((acc, item) => acc + (Number(item.targetValue) || 0), 0);
  const totalSalesActual = salesRows.reduce((acc, item) => acc + (Number(item.actualValue) || 0), 0);
  const salesAchievement = totalSalesTarget > 0 ? (totalSalesActual / totalSalesTarget) * 100 : 0;
  const safetyThreshold = state.masterData?.incentiveThreshold?.minimumTargetAchievement || 85;
  const isCompanySafe = salesAchievement >= safetyThreshold;

  const salesTargetActualTable = salesRows.map((item) => ({
    id: item.id,
    employeeName: item.employeeName,
    projectId: item.projectId,
    targetValue: item.targetValue || 0,
    actualValue: item.actualValue || 0,
    targetAchievement: item.targetAchievement || 0,
  }));

  return (
    <div className="space-y-6">
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          isCompanySafe
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          BDO Headline Guideline
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">
          Target vs Aktual Sales: {formatPercent(salesAchievement)}
        </h3>
        <p className="mt-1 text-sm text-slate-700">
          Target: {totalSalesTarget} | Aktual: {totalSalesActual} | Batas aman:{" "}
          {formatPercent(safetyThreshold)}
        </p>
        <p className={`mt-3 text-sm font-semibold ${isCompanySafe ? "text-emerald-700" : "text-amber-700"}`}>
          {isCompanySafe
            ? "Status: Perusahaan tetap aman untuk jalur insentif."
            : "Status: Belum aman, aktual sales perlu ditingkatkan sebelum ekspansi insentif."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={<CurrencyText value={totalRevenue} />} />
        <StatCard title="Total Cost / HPP" value={<CurrencyText value={totalCost} />} />
        <StatCard title="Gross Profit" value={<CurrencyText value={totalGrossProfit} />} />
        <StatCard title="Average Margin" value={formatPercent(averageMargin)} />
        <StatCard title="Collection Rate" value={formatPercent(collectionRate)} />
        <StatCard title="Total Bonus Pool" value={<CurrencyText value={totalBonusPool} />} />
        <StatCard title="Paid Incentive" value={<CurrencyText value={paidIncentive} />} />
        <StatCard title="Locked Incentive" value={<CurrencyText value={lockedIncentive} />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <RevenueChart data={state.projects} />
        <IncentiveChart data={state.projects} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <TierChart data={tierData} />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Top 5 Incentive Recipient</h3>
          <DataTable
            data={topRecipients}
            columns={[
              { key: "employeeName", header: "Employee" },
              { key: "role", header: "Role" },
              { key: "projectId", header: "Project" },
              {
                key: "finalIncentive",
                header: "Final Incentive",
                render: (row) => <CurrencyText value={row.finalIncentive} />,
              },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Sales Target (Total)" value={totalSalesTarget} />
        <StatCard title="Sales Aktual (Total)" value={totalSalesActual} />
        <StatCard title="Sales Achievement" value={formatPercent(salesAchievement)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SalesTargetChart data={salesTargetActualTable} />
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Sales Target vs Aktual</h3>
          <DataTable
            data={salesTargetActualTable}
            emptyMessage="Belum ada data KPI role Sales"
            columns={[
              { key: "employeeName", header: "Sales" },
              { key: "projectId", header: "Project" },
              { key: "targetValue", header: "Target" },
              { key: "actualValue", header: "Aktual" },
              {
                key: "targetAchievement",
                header: "Achievement",
                render: (row) => formatPercent(row.targetAchievement),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
