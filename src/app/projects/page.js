"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import FormInput from "@/components/ui/FormInput";
import SelectInput from "@/components/ui/SelectInput";
import CurrencyText from "@/components/ui/CurrencyText";
import StatusBadge from "@/components/ui/StatusBadge";
import TierBadge from "@/components/ui/TierBadge";
import { useAppData } from "@/components/layout/AppProvider";
import { formatPercent } from "@/utils/formatCurrency";

const initialForm = {
  id: "",
  projectCode: "",
  projectName: "",
  clientName: "",
  projectType: "Infrastructure IT",
  revenue: 0,
  cost: 0,
  collectedAmount: 0,
  status: "Active",
  salesPic: "",
  purchasingPic: "",
  techPic: "",
  pmOpsPic: "",
};

export default function ProjectsPage() {
  const { state, saveProject } = useAppData();
  const [search, setSearch] = useState("");
  const [projectType, setProjectType] = useState("all");
  const [tier, setTier] = useState("all");
  const [status, setStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const filtered = useMemo(() => {
    return state.projects.filter((project) => {
      const matchSearch =
        !search ||
        project.projectCode.toLowerCase().includes(search.toLowerCase()) ||
        project.projectName.toLowerCase().includes(search.toLowerCase()) ||
        project.clientName.toLowerCase().includes(search.toLowerCase());

      const matchType = projectType === "all" || project.projectType === projectType;
      const matchTier = tier === "all" || project.tier === tier;
      const matchStatus = status === "all" || project.status === status;

      return matchSearch && matchType && matchTier && matchStatus;
    });
  }, [state.projects, search, projectType, tier, status]);

  const openCreate = () => {
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setForm(project);
    setModalOpen(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    saveProject({
      ...form,
      revenue: Number(form.revenue),
      cost: Number(form.cost),
      collectedAmount: Number(form.collectedAmount),
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <FormInput label="Search Project" value={search} onChange={(e) => setSearch(e.target.value)} />
          <SelectInput
            label="Project Type"
            value={projectType}
            onChange={(event) => setProjectType(event.target.value)}
            options={[
              { value: "all", label: "All Type" },
              ...state.masterData.projectType.map((item) => ({ value: item.type, label: item.type })),
            ]}
          />
          <SelectInput
            label="Tier"
            value={tier}
            onChange={(event) => setTier(event.target.value)}
            options={[
              { value: "all", label: "All Tier" },
              { value: "Below Gate", label: "Below Gate" },
              { value: "Standard", label: "Standard" },
              { value: "Good", label: "Good" },
              { value: "Excellent", label: "Excellent" },
            ]}
          />
          <SelectInput
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { value: "all", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Completed", label: "Completed" },
            ]}
          />
          <div className="flex items-end">
            <button
              type="button"
              onClick={openCreate}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>

      <DataTable
        data={filtered}
        emptyMessage="No project found"
        columns={[
          { key: "projectCode", header: "Code" },
          { key: "projectName", header: "Project" },
          { key: "clientName", header: "Client" },
          { key: "projectType", header: "Type" },
          { key: "revenue", header: "Revenue", render: (row) => <CurrencyText value={row.revenue} /> },
          { key: "cost", header: "Cost", render: (row) => <CurrencyText value={row.cost} /> },
          {
            key: "grossProfit",
            header: "Gross Profit",
            render: (row) => <CurrencyText value={row.grossProfit} />,
          },
          { key: "margin", header: "Margin", render: (row) => formatPercent(row.marginPercentage) },
          { key: "tier", header: "Tier", render: (row) => <TierBadge tier={row.tier} /> },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          {
            key: "action",
            header: "Action",
            render: (row) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                  onClick={() => openEdit(row)}
                >
                  Edit
                </button>
                <Link
                  href={`/projects/${row.id}`}
                  className="rounded-lg bg-slate-900 px-2 py-1 text-xs text-white"
                >
                  Detail
                </Link>
              </div>
            ),
          },
        ]}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Project Form">
        <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
          <FormInput
            label="Project Code"
            value={form.projectCode}
            onChange={(e) => setForm((prev) => ({ ...prev, projectCode: e.target.value }))}
            required
          />
          <FormInput
            label="Project Name"
            value={form.projectName}
            onChange={(e) => setForm((prev) => ({ ...prev, projectName: e.target.value }))}
            required
          />
          <FormInput
            label="Client Name"
            value={form.clientName}
            onChange={(e) => setForm((prev) => ({ ...prev, clientName: e.target.value }))}
            required
          />
          <SelectInput
            label="Project Type"
            value={form.projectType}
            onChange={(event) => setForm((prev) => ({ ...prev, projectType: event.target.value }))}
            options={state.masterData.projectType.map((item) => ({ value: item.type, label: item.type }))}
          />
          <FormInput
            label="Revenue"
            type="number"
            value={form.revenue}
            onChange={(e) => setForm((prev) => ({ ...prev, revenue: e.target.value }))}
            required
          />
          <FormInput
            label="Cost"
            type="number"
            value={form.cost}
            onChange={(e) => setForm((prev) => ({ ...prev, cost: e.target.value }))}
            required
          />
          <FormInput
            label="Collected Amount"
            type="number"
            value={form.collectedAmount}
            onChange={(e) => setForm((prev) => ({ ...prev, collectedAmount: e.target.value }))}
            required
          />
          <SelectInput
            label="Status"
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            options={[
              { value: "Active", label: "Active" },
              { value: "Completed", label: "Completed" },
            ]}
          />
          <FormInput
            label="Sales PIC"
            value={form.salesPic}
            onChange={(e) => setForm((prev) => ({ ...prev, salesPic: e.target.value }))}
          />
          <FormInput
            label="Purchasing PIC"
            value={form.purchasingPic}
            onChange={(e) => setForm((prev) => ({ ...prev, purchasingPic: e.target.value }))}
          />
          <FormInput
            label="Tech PIC"
            value={form.techPic}
            onChange={(e) => setForm((prev) => ({ ...prev, techPic: e.target.value }))}
          />
          <FormInput
            label="PM/Ops PIC"
            value={form.pmOpsPic}
            onChange={(e) => setForm((prev) => ({ ...prev, pmOpsPic: e.target.value }))}
          />

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Save Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
