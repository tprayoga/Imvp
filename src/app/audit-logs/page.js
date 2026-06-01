"use client";

import DataTable from "@/components/ui/DataTable";
import { useAppData } from "@/components/layout/AppProvider";
import { formatDateTime } from "@/utils/formatDate";

export default function AuditLogsPage() {
  const { state } = useAppData();

  return (
    <DataTable
      data={state.auditLogs}
      columns={[
        { key: "user", header: "User" },
        { key: "action", header: "Action" },
        { key: "module", header: "Module" },
        { key: "oldValue", header: "Old Value" },
        { key: "newValue", header: "New Value" },
        {
          key: "timestamp",
          header: "Timestamp",
          render: (row) => formatDateTime(row.timestamp),
        },
      ]}
    />
  );
}
