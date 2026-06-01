"use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import CurrencyText from "@/components/ui/CurrencyText";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAppData } from "@/components/layout/AppProvider";
import { formatDateTime } from "@/utils/formatDate";

const nextStatusMap = {
  Calculated: "Submitted",
  Submitted: "Finance Reviewed",
  "Finance Reviewed": "Pending Management Approval",
  "Pending Management Approval": "Approved",
};

export default function ApprovalPage() {
  const { state, updateIncentiveStatus } = useAppData();
  const [confirm, setConfirm] = useState({ open: false, projectId: "", status: "", notes: "" });
  const [noteInput, setNoteInput] = useState("");

  const waitingRows = useMemo(() => {
    const allowed = ["Calculated", "Submitted", "Finance Reviewed", "Pending Management Approval"];
    return state.projects
      .map((project) => ({
        project,
        incentive: state.incentives.find((item) => item.projectId === project.id),
      }))
      .filter((row) => allowed.includes(row.incentive?.status || "Draft"))
      .map((row) => ({
        id: row.project.id,
        ...row,
      }));
  }, [state.projects, state.incentives]);

  const selectedHistory = state.approvalHistory
    .filter((item) => item.projectId === confirm.projectId)
    .slice(0, 8);

  const openConfirm = (projectId, status, defaultNote) => {
    setConfirm({
      open: true,
      projectId,
      status,
      notes: defaultNote,
    });
    setNoteInput(defaultNote);
  };

  return (
    <div className="space-y-4">
      <DataTable
        data={waitingRows}
        emptyMessage="No incentive waiting approval"
        columns={[
          {
            key: "project",
            header: "Project",
            render: (row) => (
              <div className="max-w-xs">
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
            key: "status",
            header: "Status",
            render: (row) => <StatusBadge status={row.incentive?.status || "Draft"} />,
          },
          {
            key: "actions",
            header: "Actions",
            render: (row) => {
              const currentStatus = row.incentive?.status || "Draft";
              const nextStatus = nextStatusMap[currentStatus];

              return (
                <div className="flex flex-wrap gap-2">
                  {nextStatus ? (
                    <button
                      type="button"
                      className="rounded-lg bg-slate-900 px-2 py-1 text-xs text-white"
                      onClick={() =>
                        openConfirm(row.project.id, nextStatus, `Status moved to ${nextStatus}`)
                      }
                    >
                      Next Step
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700"
                    onClick={() => openConfirm(row.project.id, "Approved", "Approved by management")}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-700"
                    onClick={() => openConfirm(row.project.id, "Rejected", "Rejected by management")}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700"
                    onClick={() => openConfirm(row.project.id, "Revision Needed", "Need revision")}
                  >
                    Revision Needed
                  </button>
                </div>
              );
            },
          },
        ]}
      />

      {confirm.projectId ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Approval History ({confirm.projectId})</h3>
          <ul className="mt-2 space-y-2 text-xs text-slate-600">
            {selectedHistory.map((item) => (
              <li key={item.id}>
                {formatDateTime(item.timestamp)} - {item.action} by {item.actor} ({item.notes || "-"})
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirm.open}
        title="Confirm Approval Action"
        message={`Update ${confirm.projectId} status to ${confirm.status}?`}
        onCancel={() => {
          setConfirm({ open: false, projectId: "", status: "", notes: "" });
          setNoteInput("");
        }}
        onConfirm={() => {
          updateIncentiveStatus(confirm.projectId, confirm.status, noteInput);
          setConfirm({ open: false, projectId: "", status: "", notes: "" });
          setNoteInput("");
        }}
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Approval Notes</span>
          <textarea
            value={noteInput}
            onChange={(event) => setNoteInput(event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Tambahkan catatan approval"
          />
        </label>
      </ConfirmDialog>
    </div>
  );
}
