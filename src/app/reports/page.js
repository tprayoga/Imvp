"use client";

import DataTable from "@/components/ui/DataTable";
import CurrencyText from "@/components/ui/CurrencyText";
import { useAppData } from "@/components/layout/AppProvider";

export default function ReportsPage() {
  const { state } = useAppData();

  const projectReport = state.projects.map((project) => ({
    id: project.id,
    projectCode: project.projectCode,
    projectName: project.projectName,
    revenue: project.revenue,
    paid: project.paidIncentiveAmount,
    locked: project.lockedIncentiveAmount,
    collection: `${project.collectionRatio.toFixed(1)}%`,
  }));

  const employeeReport = state.kpis.map((item) => ({
    id: item.id,
    employeeName: item.employeeName,
    role: item.role,
    projectId: item.projectId,
    targetActual: `${item.targetValue || 0} / ${item.actualValue || 0}`,
    targetAchievement: `${(item.targetAchievement || 0).toFixed(1)}%`,
    eligibility: item.eligibleForIncentive ? "Eligible" : "Not Eligible",
    finalIncentive: item.finalIncentive,
  }));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
            onClick={() => alert("Export Excel dummy")}
          >
            Export Excel (Dummy)
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
            onClick={() => alert("Export PDF dummy")}
          >
            Export PDF (Dummy)
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Project Incentive Report</h3>
        <DataTable
          data={projectReport}
          columns={[
            { key: "projectCode", header: "Project" },
            { key: "projectName", header: "Name" },
            { key: "revenue", header: "Revenue", render: (row) => <CurrencyText value={row.revenue} /> },
            { key: "paid", header: "Paid", render: (row) => <CurrencyText value={row.paid} /> },
            { key: "locked", header: "Locked", render: (row) => <CurrencyText value={row.locked} /> },
            { key: "collection", header: "Collection" },
          ]}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Employee Incentive Report</h3>
        <DataTable
          data={employeeReport}
          columns={[
            { key: "employeeName", header: "Employee" },
            { key: "role", header: "Role" },
            { key: "projectId", header: "Project" },
            { key: "targetActual", header: "Target / Aktual" },
            { key: "targetAchievement", header: "Achv%" },
            { key: "eligibility", header: "Eligibility" },
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
