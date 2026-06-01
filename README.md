# IBK Incentive Management System (Frontend MVP)

Frontend-only MVP untuk sistem internal pengelolaan KPI dan incentive berbasis proyek.

## Tech Stack
- Next.js App Router
- JavaScript (ES6)
- Tailwind CSS
- React Hooks
- Recharts
- localStorage untuk penyimpanan perubahan dummy

## Cara Install
```bash
npm install
```

## Cara Run
```bash
npm run dev
```
Akses: `http://localhost:3000`

## Build Check
```bash
npm run lint
npm run build
```

## Fitur Utama
- Login dummy dengan session di `localStorage`
- Dashboard summary KPI + incentive + chart
- Project Management (list, search, filter, create, edit, detail)
- Project Detail dengan breakdown financial & KPI
- KPI Input (create/edit/filter + kalkulasi score/multiplier)
- Incentive Calculation (paid/locked, role share, recalculate)
- Approval workflow action (approve/reject/revision)
- Payout module (filter, mark as paid, payment notes/date)
- Simulation cashflow & incentive
- Reports (project & employee report + dummy export)
- Master Data editable (frontend JSON editor)
- Audit Logs dummy

## Struktur Folder
```text
src/
  app/
    login/page.js
    dashboard/page.js
    projects/page.js
    projects/[id]/page.js
    kpi/page.js
    incentives/page.js
    approval/page.js
    payout/page.js
    simulation/page.js
    reports/page.js
    master/page.js
    audit-logs/page.js
    layout.js
    page.js
    globals.css

  components/
    layout/
      AppProvider.js
      AppLayout.js
      Sidebar.js
      Topbar.js
    ui/
      StatCard.js
      DataTable.js
      StatusBadge.js
      TierBadge.js
      CurrencyText.js
      ProgressBar.js
      Modal.js
      FormInput.js
      SelectInput.js
      EmptyState.js
      ConfirmDialog.js
    charts/
      RevenueChart.js
      IncentiveChart.js
      TierChart.js

  data/
    dummyData.js
    configData.js

  utils/
    formatCurrency.js
    incentiveCalculator.js
    kpiCalculator.js
    localStorage.js
```

## Catatan
- Ini masih **frontend dummy MVP** (tanpa backend/API/database).
- Seluruh data awal berasal dari `src/data/dummyData.js`.
- Perubahan user disimpan sementara ke `localStorage` browser.
