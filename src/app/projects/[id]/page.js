"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useAppData } from "@/components/layout/AppProvider";
import CurrencyText from "@/components/ui/CurrencyText";
import TierBadge from "@/components/ui/TierBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import { distributeRolePool } from "@/utils/incentiveCalculator";

export default function ProjectDetailPage() {
  const params = useParams();
  const { state } = useAppData();
  const project = state.projects.find((item) => item.id === params.id);

  const projectKpis = state.kpis.filter((item) => item.projectId === params.id);
  const rolePool = useMemo(() => {
    if (!project) return {};
    return distributeRolePool(project.paidIncentiveAmount, project.tier, state.masterData.roleShare);
  }, [project, state.masterData.roleShare]);

  if (!project) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12">
        <EmptyState title="Project Not Found" description="The requested project does not exist." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{project.projectCode}</p>
            <h1 className="text-2xl font-semibold text-slate-900">{project.projectName}</h1>
            <p className="text-sm text-slate-600">Client: {project.clientName}</p>
          </div>
          <TierBadge tier={project.tier} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Revenue</p>
            <p className="font-semibold"><CurrencyText value={project.revenue} /></p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Cost / HPP</p>
            <p className="font-semibold"><CurrencyText value={project.cost} /></p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Gross Profit</p>
            <p className="font-semibold"><CurrencyText value={project.grossProfit} /></p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Margin</p>
            <p className="font-semibold">{project.marginPercentage.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Bonus Pool</p>
            <p className="font-semibold"><CurrencyText value={project.bonusPoolAmount} /></p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Paid Incentive</p>
            <p className="font-semibold"><CurrencyText value={project.paidIncentiveAmount} /></p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Locked Incentive</p>
            <p className="font-semibold"><CurrencyText value={project.lockedIncentiveAmount} /></p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Collection</p>
            <ProgressBar value={project.collectionRatio} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Project PIC</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Sales: {project.salesPic || "-"}</li>
            <li>Purchasing: {project.purchasingPic || "-"}</li>
            <li>Tech / Implementation: {project.techPic || "-"}</li>
            <li>PM / Ops: {project.pmOpsPic || "-"}</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Incentive Calculation Breakdown</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {Object.entries(rolePool).map(([role, amount]) => (
              <li key={role} className="flex items-center justify-between">
                <span>{role}</span>
                <span className="font-medium"><CurrencyText value={amount} /></span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">KPI List</h3>
        <DataTable
          data={projectKpis}
          emptyMessage="No KPI data for this project"
          columns={[
            { key: "employeeName", header: "Employee" },
            { key: "role", header: "Role" },
            {
              key: "targetActual",
              header: "Target / Aktual",
              render: (row) => `${row.targetValue || 0} / ${row.actualValue || 0}`,
            },
            {
              key: "targetAchievement",
              header: "Achv%",
              render: (row) => `${(row.targetAchievement || 0).toFixed(1)}%`,
            },
            { key: "finalScore", header: "Final Score", render: (row) => row.finalScore.toFixed(1) },
            { key: "multiplier", header: "Multiplier" },
            {
              key: "eligibility",
              header: "Eligibility",
              render: (row) => (row.eligibleForIncentive ? "Eligible" : "Not Eligible"),
            },
            { key: "baseIncentive", header: "Base Incentive", render: (row) => <CurrencyText value={row.baseIncentive} /> },
            {
              key: "finalIncentive",
              header: "Final Incentive",
              render: (row) => <CurrencyText value={row.finalIncentive} />,
            },
          ]}
        />
      </div>
    </div>
  );
}
