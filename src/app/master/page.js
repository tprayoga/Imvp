"use client";

import { useState } from "react";
import SelectInput from "@/components/ui/SelectInput";
import { useAppData } from "@/components/layout/AppProvider";

const options = [
  { value: "projectType", label: "Project Type" },
  { value: "marginGate", label: "Margin Gate" },
  { value: "bonusPool", label: "Bonus Pool" },
  { value: "roleShare", label: "Role Share" },
  { value: "kpiMultiplier", label: "KPI Multiplier" },
  { value: "collectionGate", label: "Collection Gate" },
  { value: "employee", label: "Employee" },
];

export default function MasterPage() {
  const { state, updateMasterData } = useAppData();
  const [key, setKey] = useState("projectType");
  const [text, setText] = useState(() => JSON.stringify(state.masterData.projectType, null, 2));
  const [error, setError] = useState("");

  const handleSave = () => {
    try {
      const parsed = JSON.parse(text);
      updateMasterData(key, parsed);
      setError("");
    } catch (err) {
      setError("JSON tidak valid. Periksa format sebelum menyimpan.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[300px_1fr]">
          <SelectInput
            label="Master Module"
            value={key}
            onChange={(event) => {
              const nextKey = event.target.value;
              setKey(nextKey);
              setText(JSON.stringify(state.masterData[nextKey], null, 2));
            }}
            options={options}
          />
          <div className="flex items-end justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Save Master Data
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm text-slate-600">
          Edit JSON untuk module terpilih (frontend-only dummy editable master data).
        </p>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={20}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs"
        />
        {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
      </div>
    </div>
  );
}
