import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { jobAPI, analyticsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { BarChart3, Users, FileText, CheckCircle, CheckSquare } from 'lucide-react';

export default function RecruiterAnalytics() {
  const [jobs, setJobs]             = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    jobAPI.getMyJobs().then(r => setJobs(r.data.jobs?.filter(j => j.approvedByCollege) || [])).catch(() => {});
  }, []);

  const loadData = async (jobId) => {
    setSelectedJob(jobId);
    if (!jobId) { setData(null); return; }
    setLoading(true);
    try {
      const r = await analyticsAPI.jobAnalytics(jobId);
      setData(r.data);
    } catch {
      toast.error('Failed to load analytics');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const pct = (val, max) => max === 0 ? 0 : Math.round((val / max) * 100);

  return (
    <DashboardLayout title="Analytics">
      <div className="page-header">
        <h1>Funnel Analytics</h1>
        <p>Conversion funnel for your job postings</p>
      </div>

      <div className="card mb-6">
        <label className="form-label">Select Job to View Analytics</label>
        <select className="form-select" value={selectedJob} onChange={e => loadData(e.target.value)}>
          <option value="">-- Choose approved job --</option>
          {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>
      </div>

      {loading && <div className="loading-page"><div className="spinner" style={{ width: 32, height: 32 }} /></div>}

      {data && !loading && (
        <>
          <div className="grid-4 mb-8">
            <StatCard label="Total Applications" value={data.totalApplications || data.analytics?.applications?.total || 0} icon={Users} color="#7c5cfc" />
            <StatCard label="Shortlisted" value={data.shortlisted || data.analytics?.applications?.shortlisted || 0} icon={CheckSquare} color="#fbbf24" />
            <StatCard label="Selected" value={data.selected || data.analytics?.applications?.selected || 0} icon={CheckCircle} color="#22d3a5" />
            <StatCard label="Offers Accepted" value={data.offerStats?.accepted || data.analytics?.offers?.accepted || 0} icon={FileText} color="#60a5fa" />
          </div>

          <div className="grid-2">
            <div className="card">
              <h3 className="font-semibold mb-6">Application Funnel</h3>
              <div className="chart-bar-container">
                <BarRow label="Applied"  val={data.totalApplications || data.analytics?.applications?.total || 0} max={data.totalApplications || data.analytics?.applications?.total || 0} color="var(--accent)" />
                <BarRow label="Shortlisted" val={data.shortlisted || data.analytics?.applications?.shortlisted || 0} max={data.totalApplications || data.analytics?.applications?.total || 0} color="var(--warning)" />
                <BarRow label="Selected" val={data.selected || data.analytics?.applications?.selected || 0} max={data.totalApplications || data.analytics?.applications?.total || 0} color="var(--success)" />
                <BarRow label="Accepted" val={data.offerStats?.accepted || data.analytics?.offers?.accepted || 0} max={data.totalApplications || data.analytics?.applications?.total || 0} color="var(--info)" />
              </div>
            </div>
            
            <div className="card">
              <h3 className="font-semibold mb-6">Offer Conversion</h3>
              <div className="flex justify-between items-center bg-gray-900 rounded p-4 mb-4" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{data.offerStats?.totalOffers || data.analytics?.offers?.total || 0}</div>
                  <div className="text-xs text-muted uppercase tracking-wider mt-1">Total Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{data.offerStats?.accepted || data.analytics?.offers?.accepted || 0}</div>
                  <div className="text-xs text-muted uppercase tracking-wider mt-1">Accepted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-danger">{data.offerStats?.rejected || data.analytics?.offers?.rejected || 0}</div>
                  <div className="text-xs text-muted uppercase tracking-wider mt-1">Rejected</div>
                </div>
              </div>
              
              <div className="form-group mt-6">
                <label className="form-label mb-2">Quiz Pass Rate</label>
                <div className="flex items-center gap-4">
                  <div className="progress-bar flex-1" style={{ height: 12 }}>
                    <div className="progress-fill" style={{ width: `${pct(data.quizStats?.passed || 0, data.quizStats?.totalSubmissions || 0)}%`, background: 'var(--success)' }} />
                  </div>
                  <span className="font-bold text-sm">{pct(data.quizStats?.passed || 0, data.quizStats?.totalSubmissions || 0)}%</span>
                </div>
                <p className="text-xs text-muted mt-2 text-right">{data.quizStats?.passed || 0} passed / {data.quizStats?.totalSubmissions || 0} attempted</p>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="stat-card">
      <div className="icon" style={{ background: `${color}22` }}>
        <Icon size={22} color={color} />
      </div>
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
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
