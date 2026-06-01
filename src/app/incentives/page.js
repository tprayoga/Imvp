"use client";

import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import CurrencyText from "@/components/ui/CurrencyText";
import { useAppData } from "@/components/layout/AppProvider";
import { distributeRolePool } from "@/utils/incentiveCalculator";

export default function IncentivesPage() {
  const { state, recalculateProject, updateIncentiveStatus } = useAppData();

  const rows = state.projects.map((project) => {
    const incentive = state.incentives.find((item) => item.projectId === project.id);
    const roleShares = distributeRolePool(project.paidIncentiveAmount, project.tier, state.masterData.roleShare);

    return {
      id: project.id,
      project,
      status: incentive?.status || "Draft",
      notes: incentive?.notes || "",
      roleShares,
    };
  });

  return (
    <div className="space-y-4">
      <DataTable
        data={rows}
        columns={[
          {
            key: "project",
            header: "Project",
            render: (row) => (
              <div>
                <p className="font-medium">{row.project.projectCode}</p>
                <p className="text-xs text-slate-500">{row.project.projectName}</p>
              </div>
            ),
          },
          {
            key: "paid",
            header: "Paid Incentive",
            render: (row) => <CurrencyText value={row.project.paidIncentiveAmount} />,
          },
          {
            key: "locked",
            header: "Locked Incentive",
            render: (row) => <CurrencyText value={row.project.lockedIncentiveAmount} />,
          },
          {
            key: "share",
            header: "Role Share",
            render: (row) => (
              <div className="space-y-1 text-xs">
                {Object.entries(row.roleShares).map(([role, amount]) => (
                  <p key={role}>
                    {role}: <CurrencyText value={amount} />
                  </p>
                ))}
              </div>
            ),
          },
          {
            key: "employees",
            header: "Incentive per Employee",
            render: (row) => {
              const byProject = state.kpis.filter((item) => item.projectId === row.project.id);
              return (
                <div className="space-y-1 text-xs">
                  {byProject.map((item) => (
                    <p key={item.id}>
                      {item.employeeName}: <CurrencyText value={item.finalIncentive} />
                    </p>
                  ))}
                </div>
              );
            },
          },
          {
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "action",
            header: "Action",
            render: (row) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                  onClick={() => recalculateProject(row.project.id)}
                >
                  Recalculate
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-slate-900 px-2 py-1 text-xs text-white"
                  onClick={() => updateIncentiveStatus(row.project.id, "Calculated", "Recalculated from page")}
                >
                  Set Calculated
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
