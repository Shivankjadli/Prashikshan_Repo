import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { analyticsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function CollegeAnalytics() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.branchWise()
      .then(r => setData(r.data.branchStats || []))
      .catch(() => toast.error('Failed to load branch analytics'))
      .finally(() => setLoading(false));
  }, []);

  const totalPlaced = data.reduce((a, b) => a + (b.placedStudents || 0), 0);

  return (
    <DashboardLayout title="Branch Analytics">
      <div className="page-header">
        <h1>Detailed Branch Analytics</h1>
        <p>Placement performance breakdown by department</p>
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : data.length === 0 ? (
        <div className="empty-state"><h3>No branch data available</h3></div>
      ) : (
        <div className="grid-2 gap-6">
          {data.map(b => (
            <div className="card" key={b.branch || 'Unknown'}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{b.branch || 'Unspecified Branch'}</h3>
                <span className="badge badge-accent bg-opacity-20">{b.totalStudents} Students</span>
              </div>
              
              <div className="grid-2 gap-3 mb-4">
                <div style={{ background: 'var(--bg-glass)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div className="text-xl font-bold text-success">{b.placedStudents || 0}</div>
                  <div className="text-xs uppercase tracking-wider text-muted mt-1">Placed</div>
                </div>
                <div style={{ background: 'var(--bg-glass)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div className="text-xl font-bold text-info">
                    {b.placementPercentage ? Math.round(b.placementPercentage) : 0}%
                  </div>
                  <div className="text-xs uppercase tracking-wider text-muted mt-1">Placement Rate</div>
                </div>
              </div>

              <div className="mt-4 p-4 border border-gray-800 rounded" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-sec">Average Package</span>
                  <span className="text-sm font-bold">₹{b.averagePackage ? parseFloat(b.averagePackage.toFixed(2)) : '0'} LPA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-sec">Highest Package</span>
                  <span className="text-sm font-bold text-accent">₹{b.highestPackage || 0} LPA</span>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-xs text-muted uppercase">Contribution to total placed</span>
                <div className="progress-bar mt-2" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: `${totalPlaced ? ((b.placedStudents || 0) / totalPlaced) * 100 : 0}%`, background: 'var(--warning)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
