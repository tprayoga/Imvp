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

  return (
    <div className="space-y-6">
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
    </div>
  );
}
