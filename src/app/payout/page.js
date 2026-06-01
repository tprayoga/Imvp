"use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/ui/DataTable";
import CurrencyText from "@/components/ui/CurrencyText";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import FormInput from "@/components/ui/FormInput";
import SelectInput from "@/components/ui/SelectInput";
import { useAppData } from "@/components/layout/AppProvider";

export default function PayoutPage() {
  const { state, markPayoutPaid } = useAppData();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const approvedProjectIds = useMemo(
    () =>
      new Set(
        state.incentives
          .filter((item) => ["Approved", "Paid"].includes(item.status))
          .map((item) => item.projectId)
      ),
    [state.incentives]
  );

  const rows = useMemo(() => {
    const base = state.payouts.filter((item) => approvedProjectIds.has(item.projectId));

    return base.filter((item) => {
      if (filter === "all") return true;
      return filter === "paid" ? item.paymentStatus === "Paid" : item.paymentStatus !== "Paid";
    });
  }, [approvedProjectIds, filter, state.payouts]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="w-full sm:w-64">
          <SelectInput
            label="Filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            options={[
              { value: "all", label: "All" },
              { value: "paid", label: "Paid" },
              { value: "unpaid", label: "Unpaid" },
            ]}
          />
        </div>
        <button
          type="button"
          onClick={() => alert("Dummy export executed")}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
        >
          Export Dummy
        </button>
      </div>

      <DataTable
        data={rows}
        emptyMessage="No approved incentive payout data"
        columns={[
          { key: "projectId", header: "Project" },
          { key: "employee", header: "Employee" },
          { key: "role", header: "Role" },
          {
            key: "finalIncentive",
            header: "Final Incentive",
            render: (row) => <CurrencyText value={row.finalIncentive} />,
          },
          {
            key: "approvedAmount",
            header: "Approved",
            render: (row) => <CurrencyText value={row.approvedAmount} />,
          },
          {
            key: "paidAmount",
            header: "Paid Amount",
            render: (row) => <CurrencyText value={row.paidAmount} />,
          },
          { key: "paymentDate", header: "Payment Date", render: (row) => row.paymentDate || "-" },
          { key: "paymentStatus", header: "Status", render: (row) => <StatusBadge status={row.paymentStatus} /> },
          {
            key: "actions",
            header: "Action",
            render: (row) => (
              <button
                type="button"
                disabled={row.paymentStatus === "Paid"}
                onClick={() => {
                  setSelected(row);
                  setPaymentDate(new Date().toISOString().slice(0, 10));
                  setNotes("");
                }}
                className="rounded-lg bg-slate-900 px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Mark as Paid
              </button>
            ),
          },
        ]}
      />

      <Modal open={Boolean(selected)} title="Mark Payout as Paid" onClose={() => setSelected(null)}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!selected) return;
            markPayoutPaid(selected.id, paymentDate, notes);
            setSelected(null);
          }}
          className="space-y-4"
        >
          <p className="text-sm text-slate-600">
            {selected?.employee} - {selected?.projectId}
          </p>
          <FormInput
            label="Payment Date"
            type="date"
            value={paymentDate}
            onChange={(event) => setPaymentDate(event.target.value)}
            required
          />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Payment Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Confirm Paid
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
