"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAppData } from "@/components/layout/AppProvider";

const titleMap = {
  "/dashboard": "Dashboard",
  "/projects": "Project Management",
  "/kpi": "KPI Input",
  "/incentives": "Incentive Calculation",
  "/approval": "Approval",
  "/payout": "Payout",
  "/simulation": "Simulation",
  "/reports": "Reports",
  "/master": "Master Data",
  "/audit-logs": "Audit Logs",
};

export default function Topbar({ onToggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, logout } = useAppData();

  const basePath = `/${pathname.split("/")[1]}`;
  const title = pathname.startsWith("/projects/")
    ? "Project Detail"
    : titleMap[basePath] || "IBK Incentive Management";

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onToggleSidebar}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
        >
          ☰
        </button>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 md:text-xl">{title}</h2>
          <p className="text-xs text-slate-500">Internal incentive dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden text-right text-sm sm:block">
          <p className="font-medium text-slate-900">{session?.email || "Guest"}</p>
          <p className="text-xs text-slate-500">Internal User</p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
