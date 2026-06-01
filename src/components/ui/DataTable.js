import EmptyState from "@/components/ui/EmptyState";

export default function DataTable({ columns, data, emptyMessage = "No data available" }) {
  if (!data.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10">
        <EmptyState title="Data Empty" description={emptyMessage} />
      </div>
    );
  }

  const renderCell = (row, column) => {
    const value = column.render ? column.render(row) : row[column.key];

    if (typeof value === "string" || typeof value === "number") {
      return <span className="block max-w-[16rem] truncate">{value}</span>;
    }

    return value;
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr key={row.id || row.projectId || row.employeeName} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td
                    key={`${column.key}-${row.id || row.projectId}`}
                    className="align-top whitespace-nowrap px-4 py-3 text-slate-700"
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
