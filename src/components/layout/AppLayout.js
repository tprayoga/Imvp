"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useAppData } from "@/components/layout/AppProvider";

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isReady } = useAppData();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    const protectedPage = pathname !== "/login";
    if (protectedPage && !session) router.push("/login");
    if (pathname === "/login" && session) router.push("/dashboard");
  }, [pathname, router, session, isReady]);

  if (pathname === "/login") {
    return <main className="min-h-screen bg-slate-100">{children}</main>;
  }

  if (!isReady) {
    return <main className="min-h-screen bg-slate-100" />;
  }

  if (!session) {
    return <main className="min-h-screen bg-slate-100" />;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar mobileOpen={mobileSidebarOpen} onNavigate={() => setMobileSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-0">
        <Topbar onToggleSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
