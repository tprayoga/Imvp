"use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import FormInput from "@/components/ui/FormInput";
import SelectInput from "@/components/ui/SelectInput";
import CurrencyText from "@/components/ui/CurrencyText";
import { useAppData } from "@/components/layout/AppProvider";
import { calculateKpiFields } from "@/utils/kpiCalculator";

const defaultForm = {
  id: "",
  projectId: "",
  employeeName: "",
  role: "Sales",
  achievementScore: 80,
  collectionScore: 80,
  costMarginScore: 80,
  qualityScore: 80,
  timelineScore: 80,
  baseIncentive: 0,
};

export default function KpiPage() {
  const { state, saveKpi } = useAppData();
  const [projectFilter, setProjectFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const filtered = useMemo(
    () =>
      state.kpis.filter((row) => {
        const byProject = projectFilter === "all" || row.projectId === projectFilter;
        const byRole = roleFilter === "all" || row.role === roleFilter;
        const byEmployee = employeeFilter === "all" || row.employeeName === employeeFilter;
        return byProject && byRole && byEmployee;
      }),
    [state.kpis, projectFilter, roleFilter, employeeFilter]
  );

  const preview = calculateKpiFields(form, {
    weightsByRole: state.masterData.kpiWeights,
    multiplierRule: state.masterData.kpiMultiplier,
  });

  const handleSave = (event) => {
    event.preventDefault();
    saveKpi({
      ...form,
      achievementScore: Number(form.achievementScore),
      collectionScore: Number(form.collectionScore),
      costMarginScore: Number(form.costMarginScore),
      qualityScore: Number(form.qualityScore),
      timelineScore: Number(form.timelineScore),
      baseIncentive: Number(form.baseIncentive),
    });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SelectInput
            label="Project"
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            options={[
              { value: "all", label: "All Project" },
              ...state.projects.map((item) => ({ value: item.id, label: `${item.projectCode} - ${item.projectName}` })),
            ]}
          />
          <SelectInput
            label="Role"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            options={[
              { value: "all", label: "All Role" },
              { value: "Sales", label: "Sales" },
              { value: "Purchasing", label: "Purchasing" },
              { value: "Tech / Implementation", label: "Tech / Implementation" },
              { value: "PM / Ops", label: "PM / Ops" },
            ]}
          />
          <SelectInput
            label="Employee"
            value={employeeFilter}
            onChange={(event) => setEmployeeFilter(event.target.value)}
            options={[
              { value: "all", label: "All Employee" },
              ...state.employees.map((item) => ({ value: item.name, label: item.name })),
            ]}
          />
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setForm(defaultForm);
                setOpen(true);
              }}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Create KPI Input
            </button>
          </div>
        </div>
      </div>

      <DataTable
        data={filtered}
        columns={[
          { key: "projectId", header: "Project" },
          { key: "employeeName", header: "Employee" },
          { key: "role", header: "Role" },
          {
            key: "finalScore",
            header: "Final Score",
            render: (row) => row.finalScore.toFixed(1),
          },
          { key: "multiplier", header: "Multiplier" },
          {
            key: "baseIncentive",
            header: "Base Incentive",
            render: (row) => <CurrencyText value={row.baseIncentive} />,
          },
          {
            key: "finalIncentive",
            header: "Final Incentive",
            render: (row) => <CurrencyText value={row.finalIncentive} />,
          },
          {
            key: "action",
            header: "Action",
            render: (row) => (
              <button
                type="button"
                onClick={() => {
                  setForm(row);
                  setOpen(true);
                }}
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs"
              >
                Edit
              </button>
            ),
          },
        ]}
      />

      <Modal open={open} onClose={() => setOpen(false)} title="KPI Input Form">
        <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
          <SelectInput
            label="Project"
            value={form.projectId}
            onChange={(event) => setForm((prev) => ({ ...prev, projectId: event.target.value }))}
            options={[
              { value: "", label: "Select Project" },
              ...state.projects.map((item) => ({ value: item.id, label: `${item.projectCode} - ${item.projectName}` })),
            ]}
          />
          <SelectInput
            label="Employee"
            value={form.employeeName}
            onChange={(event) => setForm((prev) => ({ ...prev, employeeName: event.target.value }))}
            options={[
              { value: "", label: "Select Employee" },
              ...state.employees.map((item) => ({ value: item.name, label: item.name })),
            ]}
          />
          <SelectInput
            label="Role"
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            options={[
              { value: "Sales", label: "Sales" },
              { value: "Purchasing", label: "Purchasing" },
              { value: "Tech / Implementation", label: "Tech / Implementation" },
              { value: "PM / Ops", label: "PM / Ops" },
            ]}
          />
          <FormInput
            label="Base Incentive"
            type="number"
            value={form.baseIncentive}
            onChange={(e) => setForm((prev) => ({ ...prev, baseIncentive: e.target.value }))}
          />
          <FormInput
            label="Achievement Score"
            type="number"
            value={form.achievementScore}
            onChange={(e) => setForm((prev) => ({ ...prev, achievementScore: e.target.value }))}
          />
          <FormInput
            label="Collection Score"
            type="number"
            value={form.collectionScore}
            onChange={(e) => setForm((prev) => ({ ...prev, collectionScore: e.target.value }))}
          />
          <FormInput
            label="Cost Margin Score"
            type="number"
            value={form.costMarginScore}
            onChange={(e) => setForm((prev) => ({ ...prev, costMarginScore: e.target.value }))}
          />
          <FormInput
            label="Quality Score"
            type="number"
            value={form.qualityScore}
            onChange={(e) => setForm((prev) => ({ ...prev, qualityScore: e.target.value }))}
          />
          <FormInput
            label="Timeline Score"
            type="number"
            value={form.timelineScore}
            onChange={(e) => setForm((prev) => ({ ...prev, timelineScore: e.target.value }))}
          />

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2">
            <p className="text-sm text-slate-700">Preview Final Score: {preview.finalScore.toFixed(2)}</p>
            <p className="text-sm text-slate-700">Preview Multiplier: {preview.multiplier}</p>
            <p className="text-sm text-slate-700">
              Preview Final Incentive: <CurrencyText value={preview.finalIncentive} />
            </p>
          </div>

          <div className="flex justify-end gap-3 md:col-span-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Save KPI
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
