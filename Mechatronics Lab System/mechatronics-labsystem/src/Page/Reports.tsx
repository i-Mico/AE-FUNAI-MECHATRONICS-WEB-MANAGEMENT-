import { useMemo, useState } from 'react';
import { Sidebar } from '../Components/Dashboardc/Sidebar';
import {
  FiActivity,
  FiBox,
  FiCpu,
  FiDownload,
  FiPrinter,
  FiTool,
  FiTrendingUp,
} from 'react-icons/fi';
import '../Styles/Pagecss/Reports.css';

// Report data remains local to the front end for now, matching the existing project structure.
// A future backend can replace these arrays without changing the reporting UI.
const monthlyData = [
  { month: 'Oct', bookings: 142, utilization: 65 },
  { month: 'Nov', bookings: 168, utilization: 72 },
  { month: 'Dec', bookings: 95, utilization: 58 },
  { month: 'Jan', bookings: 185, utilization: 78 },
  { month: 'Feb', bookings: 210, utilization: 85 },
  { month: 'Mar', bookings: 198, utilization: 82 },
];

const topEquipment = [
  { name: '3D Printer', utilization: 94, bookings: 47, icon: FiPrinter },
  { name: 'CNC Machine', utilization: 78, bookings: 39, icon: FiTool },
  { name: 'Robotic Arm', utilization: 85, bookings: 43, icon: FiCpu },
  { name: 'Laser Cutter', utilization: 72, bookings: 36, icon: FiActivity },
  { name: 'Oscilloscope', utilization: 60, bookings: 30, icon: FiBox },
  { name: 'Arduino Kit', utilization: 55, bookings: 28, icon: FiBox },
];

type ReportPeriod = 3 | 6;
type ChartView = 'bookings' | 'utilization';

// Escapes a CSV field so commas, quotes, or line breaks do not break the exported file.
function escapeCsvCell(value: string | number): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function Reports() {
  const [chartView, setChartView] = useState<ChartView>('bookings');
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>(6);
  const [exportMessage, setExportMessage] = useState('');

  // The selected period drives both the KPI values and the chart so the page stays consistent.
  const visibleData = useMemo(
    () => monthlyData.slice(-reportPeriod),
    [reportPeriod],
  );

  const totalBookings = visibleData.reduce((sum, data) => sum + data.bookings, 0);
  const averageUtilization = visibleData.length
    ? Math.round(
        visibleData.reduce((sum, data) => sum + data.utilization, 0) / visibleData.length,
      )
    : 0;
  const maxBookings = Math.max(...visibleData.map((data) => data.bookings), 1);

  // Exporting is intentionally client-side: it gives the current frontend something useful
  // before a real reporting API is connected.
  const handleExport = () => {
    const csvRows = [
      ['Report', 'Engineering Lab Analytics'],
      ['Period', `Last ${reportPeriod} months`],
      [],
      ['Month', 'Bookings', 'Utilization (%)'],
      ...visibleData.map((data) => [data.month, data.bookings, data.utilization]),
      [],
      ['Equipment', 'Utilization (%)', 'Bookings'],
      ...topEquipment.map((equipment) => [
        equipment.name,
        equipment.utilization,
        equipment.bookings,
      ]),
    ];

    const csvContent = csvRows
      .map((row) => row.map((cell) => escapeCsvCell(cell ?? '')).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `lab-report-${reportPeriod}mo.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setExportMessage(`Report exported for the last ${reportPeriod} months.`);
    window.setTimeout(() => setExportMessage(''), 3000);
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        <div className="reports-header">
          <div>
            <h1>Reports & Analytics</h1>
            <p>Track equipment usage and booking trends</p>
          </div>

          <div className="reports-actions">
            <div className="period-toggle" aria-label="Report period">
              <button
                type="button"
                className={reportPeriod === 3 ? 'active' : ''}
                aria-pressed={reportPeriod === 3}
                onClick={() => setReportPeriod(3)}
              >
                3 Months
              </button>
              <button
                type="button"
                className={reportPeriod === 6 ? 'active' : ''}
                aria-pressed={reportPeriod === 6}
                onClick={() => setReportPeriod(6)}
              >
                6 Months
              </button>
            </div>

            <button type="button" className="export-report-btn" onClick={handleExport}>
              <FiDownload />
              Export CSV
            </button>
          </div>
        </div>

        {exportMessage && (
          <div className="export-message" role="status">
            {exportMessage}
          </div>
        )}

        <div className="stats-overview">
          <div className="overview-card">
            <div className="overview-value">{totalBookings.toLocaleString()}</div>
            <div className="overview-label">Total Bookings ({reportPeriod}mo)</div>
            <div className="overview-trend positive">
              <FiTrendingUp />
              {reportPeriod === 6 ? '+12% vs last period' : 'Latest 3-month window'}
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-value">{averageUtilization}%</div>
            <div className="overview-label">Avg Utilization</div>
            <div className="overview-trend positive">
              <FiTrendingUp />
              Based on selected period
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-value">61</div>
            <div className="overview-label">Maintenance Resolved</div>
            <div className="overview-trend positive">
              <FiTrendingUp />
              +8% vs last period
            </div>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-header">
            <div>
              <h3>Monthly Bookings & Utilization</h3>
              <p className="chart-subtitle">Showing the last {reportPeriod} months</p>
            </div>

            <div className="chart-toggle" aria-label="Chart metric">
              <button
                type="button"
                className={chartView === 'bookings' ? 'active' : ''}
                aria-pressed={chartView === 'bookings'}
                onClick={() => setChartView('bookings')}
              >
                Bookings
              </button>
              <button
                type="button"
                className={chartView === 'utilization' ? 'active' : ''}
                aria-pressed={chartView === 'utilization'}
                onClick={() => setChartView('utilization')}
              >
                Utilization
              </button>
            </div>
          </div>

          <div className="bar-chart" role="img" aria-label={`${chartView} by month`}>
            {visibleData.map((data) => {
              const height =
                chartView === 'bookings'
                  ? `${(data.bookings / maxBookings) * 100}%`
                  : `${data.utilization}%`;

              return (
                <div key={data.month} className="bar-group">
                  <div className="bar-value-top">
                    {chartView === 'bookings' ? data.bookings : `${data.utilization}%`}
                  </div>
                  <div className="bar-container">
                    <div
                      className={`bar ${
                        chartView === 'bookings' ? 'bookings-bar' : 'utilization-bar'
                      }`}
                      style={{ height }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="bar-label">{data.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="equipment-section">
          <div className="equipment-section-header">
            <div>
              <h3>Equipment Utilization</h3>
              <p className="section-subtitle">Top equipment by usage rate</p>
            </div>
            <span className="equipment-count">{topEquipment.length} tracked</span>
          </div>

          <div className="equipment-list">
            {topEquipment.map((equip) => {
              const Icon = equip.icon;
              return (
                <div key={equip.name} className="equipment-row">
                  <div className="equipment-info">
                    <Icon className="equipment-icon" aria-hidden="true" />
                    <span className="equipment-name">{equip.name}</span>
                  </div>
                  <div className="equipment-stats">
                    <div
                      className="utilization-bar-small"
                      role="progressbar"
                      aria-valuenow={equip.utilization}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${equip.name} utilization`}
                    >
                      <div
                        className="utilization-fill"
                        style={{ width: `${equip.utilization}%` }}
                      />
                    </div>
                    <span className="utilization-percent">{equip.utilization}%</span>
                    <span className="booking-count">{equip.bookings} bookings</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
