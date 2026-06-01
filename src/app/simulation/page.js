"use client";

import { useMemo, useState } from "react";
import FormInput from "@/components/ui/FormInput";
import SelectInput from "@/components/ui/SelectInput";
import CurrencyText from "@/components/ui/CurrencyText";
import TierBadge from "@/components/ui/TierBadge";
import { useAppData } from "@/components/layout/AppProvider";
import { calculateProjectFinancials } from "@/utils/incentiveCalculator";

export default function SimulationPage() {
  const { state } = useAppData();
  const [form, setForm] = useState({
    projectType: "Infrastructure IT",
    revenue: 1000000000,
    cost: 700000000,
    collectedAmount: 650000000,
  });

  const result = useMemo(() => {
    const simulation = calculateProjectFinancials(
      {
        id: "SIM",
        projectCode: "SIM",
        projectName: "Simulation",
        ...form,
        revenue: Number(form.revenue),
        cost: Number(form.cost),
        collectedAmount: Number(form.collectedAmount),
      },
      {
        projectTypeConfig: state.masterData.projectType,
        collectionGates: state.masterData.collectionGate,
      }
    );

    return {
      ...simulation,
      cashflowNet: simulation.collectedAmount - simulation.cost - simulation.paidIncentiveAmount,
    };
  }, [form, state.masterData.collectionGate, state.masterData.projectType]);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800">Simulation Form</h3>
        <div className="mt-4 space-y-4">
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
            onChange={(event) => setForm((prev) => ({ ...prev, revenue: event.target.value }))}
          />
          <FormInput
            label="Cost"
            type="number"
            value={form.cost}
            onChange={(event) => setForm((prev) => ({ ...prev, cost: event.target.value }))}
          />
          <FormInput
            label="Collection Amount"
            type="number"
            value={form.collectedAmount}
            onChange={(event) => setForm((prev) => ({ ...prev, collectedAmount: event.target.value }))}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800">Simulation Result</h3>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <p>
            Gross Profit: <span className="font-semibold"><CurrencyText value={result.grossProfit} /></span>
          </p>
          <p>Margin: <span className="font-semibold">{result.marginPercentage.toFixed(1)}%</span></p>
          <p>
            Tier: <TierBadge tier={result.tier} />
          </p>
          <p>
            Bonus Pool: <span className="font-semibold"><CurrencyText value={result.bonusPoolAmount} /></span>
          </p>
          <p>
            Paid Incentive: <span className="font-semibold"><CurrencyText value={result.paidIncentiveAmount} /></span>
          </p>
          <p>
            Locked Incentive: <span className="font-semibold"><CurrencyText value={result.lockedIncentiveAmount} /></span>
          </p>
          <p>
            Cashflow Net: <span className="font-semibold"><CurrencyText value={result.cashflowNet} /></span>
          </p>
        </div>

        {result.cashflowNet < 0 ? (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            Cashflow belum aman, incentive sebaiknya ditahan.
          </div>
        ) : null}
      </div>
    </div>
  );
}
