import "@/app/globals.css";
import { AppProvider } from "@/components/layout/AppProvider";
import AppLayout from "@/components/layout/AppLayout";

export const metadata = {
  title: "IBK Incentive Management System",
  description: "Frontend MVP for internal incentive management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}
