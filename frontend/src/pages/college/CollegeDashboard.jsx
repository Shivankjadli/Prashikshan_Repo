import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { analyticsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { GraduationCap, Briefcase, FileText, CheckCircle } from 'lucide-react';

export default function CollegeDashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.overview()
      .then(r => setData(r.data.analytics))
      .catch(() => toast.error('Failed to load dashboard overview'))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Students', value: data?.students?.total || 0, icon: GraduationCap, color: '#7c5cfc' },
    { label: 'Approved Students', value: data?.students?.eligible || 0, icon: CheckCircle, color: '#22d3a5' },
    { label: 'Total Jobs', value: data?.jobs?.total || 0, icon: Briefcase, color: '#60a5fa' },
    { label: 'Total Offers', value: data?.offers?.total || 0, icon: FileText, color: '#fbbf24' },
  ];

  return (
    <DashboardLayout title="College Dashboard">
      <div className="page-header">
        <h1>Overview</h1>
        <p>College campus placement statistics</p>
      </div>

      <div className="grid-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div className="stat-card" key={label}>
            <div className="icon" style={{ background: `${color}22` }}>
              <Icon size={22} color={color} />
            </div>
            <div className="value">{loading ? '—' : value}</div>
            <div className="label">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="font-semibold mb-6">Student Funnel</h3>
          <div className="chart-bar-container">
            <BarRow label="Total Registered"  val={data?.students?.total || 0} max={data?.students?.total || 0} color="var(--accent)" />
            <BarRow label="Eligible (Approved)" val={data?.students?.eligible || 0} max={data?.students?.total || 0} color="var(--success)" />
            <BarRow label="Placed (Selected)" val={data?.students?.selected || 0} max={data?.students?.total || 0} color="var(--warning)" />
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-6">Key Metrics</h3>
          <div className="grid-2 gap-4">
            <div style={{ background: 'var(--bg-glass)', padding: 16, borderRadius: 12, border: '1px solid var(--border)', textAlign: 'center' }}>
              <div className="text-3xl font-bold text-success mb-1">
                {data?.students?.placementPercentage || 0}%
              </div>
              <div className="text-xs uppercase tracking-wider text-muted">Placement Rate</div>
            </div>
            <div style={{ background: 'var(--bg-glass)', padding: 16, borderRadius: 12, border: '1px solid var(--border)', textAlign: 'center' }}>
              <div className="text-3xl font-bold text-accent mb-1">
                {data?.packages?.average ? parseFloat(data.packages.average.toFixed(2)) : 0}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted">Avg. Package (LPA)</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function BarRow({ label, val, max, color }) {
  const p = max === 0 ? 0 : (val / max) * 100;
  return (
    <div className="chart-bar-row">
      <div className="chart-bar-label font-medium">{label}</div>
      <div className="chart-bar-track">
        <div className="chart-bar-fill" style={{ width: `${p}%`, background: color }} />
      </div>
      <div className="chart-bar-value">{val}</div>
    </div>
  );
}
