"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { INITIAL_APP_STATE } from "@/data/dummyData";
import { EMPLOYEE_INCENTIVE_THRESHOLD } from "@/data/configData";
import {
  clearStoredSession,
  getStoredSession,
  getStoredState,
  setStoredSession,
  setStoredState,
} from "@/utils/localStorage";
import {
  calculateProjectFinancials,
  normalizeIncentives,
} from "@/utils/incentiveCalculator";
import { calculateKpiFields } from "@/utils/kpiCalculator";

const AppDataContext = createContext(null);

function randomId(prefix) {
  return `${prefix}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function upsertById(items, item) {
  const idx = items.findIndex((entry) => entry.id === item.id);
  if (idx === -1) return [...items, item];
  const copy = [...items];
  copy[idx] = item;
  return copy;
}

function ensureStateSchema(rawState) {
  const base = INITIAL_APP_STATE;
  const raw = rawState || {};
  const mergedMasterData = {
    ...base.masterData,
    ...(raw.masterData || {}),
  };

  if (!mergedMasterData.incentiveThreshold) {
    mergedMasterData.incentiveThreshold = EMPLOYEE_INCENTIVE_THRESHOLD;
  }

  const rawKpis = Array.isArray(raw.kpis) ? raw.kpis : base.kpis;
  const kpis = rawKpis.map((item) => ({
    targetValue: item?.targetValue ?? 100,
    actualValue: item?.actualValue ?? item?.achievementScore ?? 0,
    ...item,
  }));

  return {
    ...base,
    ...raw,
    projects: Array.isArray(raw.projects) ? raw.projects : base.projects,
    employees: Array.isArray(raw.employees) ? raw.employees : base.employees,
    kpis,
    incentives: Array.isArray(raw.incentives) ? raw.incentives : base.incentives,
    payouts: Array.isArray(raw.payouts) ? raw.payouts : base.payouts,
    auditLogs: Array.isArray(raw.auditLogs) ? raw.auditLogs : base.auditLogs,
    approvalHistory: Array.isArray(raw.approvalHistory)
      ? raw.approvalHistory
      : base.approvalHistory,
    masterData: mergedMasterData,
  };
}

function withDerivedState(state) {
  const projectTypeConfig = state.masterData?.projectType;
  const collectionGates = state.masterData?.collectionGate;
  const kpiWeights = state.masterData?.kpiWeights;
  const multiplierRule = state.masterData?.kpiMultiplier;
  const thresholdConfig = state.masterData?.incentiveThreshold;

  const projects = state.projects.map((project) =>
    calculateProjectFinancials(project, { projectTypeConfig, collectionGates })
  );

  let kpis = state.kpis.map((kpi) =>
    calculateKpiFields(kpi, { weightsByRole: kpiWeights, multiplierRule, thresholdConfig })
  );

  projects.forEach((project) => {
    const indexes = [];
    const kpiByProject = [];

    kpis.forEach((item, index) => {
      if (item.projectId === project.id) {
        indexes.push(index);
        kpiByProject.push(item);
      }
    });

    const normalized = normalizeIncentives(kpiByProject, project.paidIncentiveAmount);
    indexes.forEach((index, idx) => {
      kpis[index] = normalized[idx];
    });
  });

  const incentives = projects.map((project) => {
    const existing = state.incentives.find((item) => item.projectId === project.id);
    return (
      existing || {
        projectId: project.id,
        status: "Draft",
        notes: "",
      }
    );
  });

  const payoutMap = new Map(state.payouts.map((item) => [item.id, item]));
  const usedIds = new Set();
  const payouts = kpis.map((kpi) => {
    const existing = state.payouts.find(
      (item) =>
        item.projectId === kpi.projectId &&
        item.employee === kpi.employeeName &&
        item.role === kpi.role
    );

    const id = existing?.id || randomId("PAY");
    usedIds.add(id);
    const next = {
      id,
      projectId: kpi.projectId,
      employee: kpi.employeeName,
      role: kpi.role,
      finalIncentive: kpi.finalIncentive,
      approvedAmount: kpi.finalIncentive,
      paidAmount: existing?.paidAmount || 0,
      paymentDate: existing?.paymentDate || "",
      paymentStatus: existing?.paymentStatus || "Unpaid",
      notes: existing?.notes || "",
    };

    payoutMap.set(id, next);
    return next;
  });

  state.payouts.forEach((old) => {
    if (!usedIds.has(old.id)) payouts.push(old);
  });

  return {
    ...state,
    projects,
    kpis,
    incentives,
    payouts,
  };
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() =>
    withDerivedState(ensureStateSchema(INITIAL_APP_STATE))
  );
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = getStoredState();
      if (stored) setState(withDerivedState(ensureStateSchema(stored)));

      const storedSession = getStoredSession();
      if (storedSession) setSession(storedSession);
      setIsReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    setStoredState(state);
  }, [state, isReady]);

  const addAuditLog = (log) => {
    setState((prev) => ({
      ...prev,
      auditLogs: [
        {
          id: randomId("LOG"),
          timestamp: new Date().toISOString(),
          ...log,
        },
        ...prev.auditLogs,
      ],
    }));
  };

  const login = (email) => {
    const nextSession = { email, loginAt: new Date().toISOString() };
    setSession(nextSession);
    setStoredSession(nextSession);
  };

  const logout = () => {
    setSession(null);
    clearStoredSession();
  };

  const saveProject = (payload) => {
    setState((prev) => {
      const id = payload.id || payload.projectCode || randomId("P");
      const project = {
        ...payload,
        id,
        projectCode: payload.projectCode || id,
      };

      return withDerivedState({
        ...prev,
        projects: upsertById(prev.projects, project),
      });
    });

    addAuditLog({
      user: session?.email || "ui@local",
      action: payload.id ? "EDIT PROJECT" : "CREATE PROJECT",
      module: "Project",
      oldValue: payload.id ? payload.id : "-",
      newValue: payload.projectCode || payload.id || "NEW",
    });
  };

  const saveKpi = (payload) => {
    setState((prev) => {
      const id = payload.id || randomId("KPI");
      const kpi = { ...payload, id };

      return withDerivedState({
        ...prev,
        kpis: upsertById(prev.kpis, kpi),
      });
    });

    addAuditLog({
      user: session?.email || "ui@local",
      action: payload.id ? "EDIT KPI" : "CREATE KPI",
      module: "KPI",
      oldValue: payload.id ? payload.id : "-",
      newValue: payload.projectId,
    });
  };

  const updateIncentiveStatus = (projectId, status, notes = "") => {
    setState((prev) => {
      const incentives = prev.incentives.map((item) =>
        item.projectId === projectId ? { ...item, status, notes } : item
      );

      const approvalHistory = [
        {
          id: randomId("APR"),
          projectId,
          action: status,
          actor: session?.email || "ui@local",
          notes,
          timestamp: new Date().toISOString(),
        },
        ...prev.approvalHistory,
      ];

      return withDerivedState({
        ...prev,
        incentives,
        approvalHistory,
      });
    });

    addAuditLog({
      user: session?.email || "ui@local",
      action: "UPDATE STATUS",
      module: "Approval",
      oldValue: "",
      newValue: `${projectId} -> ${status}`,
    });
  };

  const recalculateProject = (projectId) => {
    setState((prev) => withDerivedState({ ...prev }));

    addAuditLog({
      user: session?.email || "ui@local",
      action: "RECALCULATE",
      module: "Incentives",
      oldValue: "",
      newValue: projectId,
    });
  };

  const markPayoutPaid = (payoutId, paymentDate, notes) => {
    setState((prev) => {
      const target = prev.payouts.find((item) => item.id === payoutId);
      if (!target) return prev;

      const payouts = prev.payouts.map((item) =>
        item.id === payoutId
          ? {
              ...item,
              paidAmount: item.approvedAmount,
              paymentDate,
              notes,
              paymentStatus: "Paid",
            }
          : item
      );

      const projectRows = payouts.filter((item) => item.projectId === target.projectId);
      const projectFullyPaid =
        projectRows.length > 0 && projectRows.every((item) => item.paymentStatus === "Paid");

      const incentives = prev.incentives.map((item) =>
        item.projectId === target.projectId && projectFullyPaid
          ? { ...item, status: "Paid", notes: notes || "Payout paid" }
          : item
      );

      const approvalHistory = projectFullyPaid
        ? [
            {
              id: randomId("APR"),
              projectId: target.projectId,
              action: "Paid",
              actor: session?.email || "ui@local",
              notes: notes || "Payout paid",
              timestamp: new Date().toISOString(),
            },
            ...prev.approvalHistory,
          ]
        : prev.approvalHistory;

      return withDerivedState({
        ...prev,
        payouts,
        incentives,
        approvalHistory,
      });
    });

    addAuditLog({
      user: session?.email || "ui@local",
      action: "MARK PAID",
      module: "Payout",
      oldValue: payoutId,
      newValue: paymentDate,
    });
  };

  const updateMasterData = (key, value) => {
    setState((prev) =>
      withDerivedState({
        ...prev,
        masterData: {
          ...prev.masterData,
          [key]: value,
        },
      })
    );

    addAuditLog({
      user: session?.email || "ui@local",
      action: "UPDATE MASTER",
      module: "Master Data",
      oldValue: key,
      newValue: `${key} updated`,
    });
  };

  const value = {
    state,
    session,
    isReady,
    login,
    logout,
    saveProject,
    saveKpi,
    updateIncentiveStatus,
    recalculateProject,
    markPayoutPaid,
    updateMasterData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used inside AppProvider");
  }

  return context;
}
