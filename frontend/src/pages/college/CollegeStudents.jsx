import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { collegeAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';

export default function CollegeStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter]     = useState('all');

  const loadStudents = () => {
    setLoading(true);
    const fetcher = filter === 'pending' ? collegeAPI.getPending() :
                    filter === 'approved' ? collegeAPI.getApproved() : collegeAPI.getAllStudents();

    fetcher.then(r => setStudents(r.data.students || []))
           .catch(() => toast.error('Failed to load students'))
           .finally(() => setLoading(false));
  };

  useEffect(() => { loadStudents(); }, [filter]);

  const handleApprove = async (id, approve) => {
    setUpdating(id);
    try {
      if (approve) await collegeAPI.approveStudent(id);
      else         await collegeAPI.revokeApproval(id);
      toast.success(approve ? 'Student approved' : 'Approval revoked');
      setStudents(p => p.map(s => {
        const userId = s.userId?._id || s.userId;
        return (userId === id) ? { ...s, approvedForPlacement: approve } : s;
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <DashboardLayout title="Students">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>Student Directory</h1>
          <p>Review and approve students for placements</p>
        </div>
        <select className="form-select" style={{ width: 180 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Students</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-page"><div className="spinner" style={{ width: 32, height: 32 }} /></div>
      ) : students.length === 0 ? (
        <div className="empty-state"><h3>No students found</h3></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name & Email</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Profile Complete</th>
                <th>Resume</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => {
                const complete = s.completionPercentage || 0;
                const approved = s.approvedForPlacement;
                const userName = s.userId?.name || 'Unknown';
                const userEmail = s.userId?.email || '';

                return (
                  <tr key={s._id}>
                    <td>
                      <div className="font-semibold">{userName}</div>
                      <div className="text-muted text-xs">{userEmail}</div>
                    </td>
                    <td>{s.branch || '—'}</td>
                    <td>{s.cgpa || '—'}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-bar" style={{ width: 60, height: 6 }}>
                          <div className="progress-fill" style={{ width: `${complete}%`, background: complete >= 80 ? 'var(--success)' : 'var(--warning)' }} />
                        </div>
                        <span className="text-xs font-bold font-tabular-nums">{complete}%</span>
                      </div>
                    </td>
                    <td>
                      {s.resumeUrl ? (
                        <a href={s.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-icon" title="Download Resume">
                          <Download size={14} />
                        </a>
                      ) : <span className="text-muted text-xs">No resume</span>}
                    </td>
                    <td>
                      {(() => {
                        const userId = s.userId?._id || s.userId;
                        const isUpdating = updating === userId;
                        return approved ? (
                          <button className="btn btn-sm btn-danger" disabled={isUpdating} onClick={() => handleApprove(userId, false)}>
                            {isUpdating ? <span className="spinner" /> : 'Revoke'}
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-success" disabled={complete < 80 || isUpdating} onClick={() => handleApprove(userId, true)} title={complete < 80 ? 'Requires 80% completion' : ''}>
                            {isUpdating ? <span className="spinner" /> : 'Approve'}
                          </button>
                        );
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
