"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Project Management" },
  { href: "/kpi", label: "KPI Input" },
  { href: "/incentives", label: "Incentive Calculation" },
  { href: "/approval", label: "Approval" },
  { href: "/payout", label: "Payout" },
  { href: "/simulation", label: "Simulation" },
  { href: "/reports", label: "Reports" },
  { href: "/master", label: "Master Data" },
  { href: "/audit-logs", label: "Audit Logs" },
];

export default function Sidebar({ mobileOpen = false, onNavigate }) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onNavigate}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 border-r border-slate-200 bg-slate-900 text-slate-100 transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-700 px-6 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">IBK Internal</p>
          <h1 className="mt-2 text-lg font-semibold leading-tight">Incentive Management System</h1>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {menus.map((menu) => {
            const normalizedPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
            const active =
              normalizedPath === menu.href || normalizedPath.startsWith(`${menu.href}/`);

            return (
              <Link
                key={menu.href}
                href={menu.href}
                onClick={onNavigate}
                className={`block rounded-lg px-4 py-2.5 text-sm transition ${
                  active
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {menu.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
