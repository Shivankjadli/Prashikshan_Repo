import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { jobAPI, quizAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function CollegeQuizzes() {
  const [jobs, setJobs]             = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [quizzes, setQuizzes]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [acting, setActing]         = useState(null);

  useEffect(() => {
    jobAPI.getAllForApproval()
      .then(r => setJobs(r.data.jobs?.filter(j => j.approvedByCollege) || []))
      .catch(() => toast.error('Failed to load approved jobs'));
  }, []);

  const loadQuizzes = async (jobId) => {
    setSelectedJob(jobId);
    setQuizzes([]);
    if (!jobId) return;
    setLoading(true);
    try {
      const r = await quizAPI.getForJobCollege(jobId);
      setQuizzes(r.data.quizzes || []);
    } catch {
      toast.error('Failed to view quizzes');
    } finally {
      setLoading(false);
    }
  };

  const approveQuiz = async (quizId, approved) => {
    setActing(quizId);
    try {
      await quizAPI.approve(quizId, approved);
      toast.success(approved ? 'Quiz approved' : 'Quiz rejected');
      setQuizzes(p => p.map(q => q._id === quizId ? { ...q, approvedByCollege: approved } : q));
    } catch {
      toast.error('Action failed');
    } finally {
      setActing(null);
    }
  };

  return (
    <DashboardLayout title="Quiz Approvals">
      <div className="page-header">
        <h1>Quiz Approvals</h1>
        <p>Review recruiter quizzes before students can attempt them</p>
      </div>

      <div className="card mb-6">
        <label className="form-label">Select Job to View Pending Quizzes</label>
        <select className="form-select" value={selectedJob} onChange={e => loadQuizzes(e.target.value)}>
          <option value="">-- Choose approved job --</option>
          {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>
      </div>

      {loading && <div className="loading-page"><div className="spinner" style={{ width: 32, height: 32 }} /></div>}

      {!loading && selectedJob && quizzes.length === 0 && (
        <div className="empty-state"><h3>No quizzes submitted for this job</h3></div>
      )}

      {quizzes.map(quiz => (
        <div className="card mb-4" key={quiz._id}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold">{quiz.title}</h3>
              <p className="text-sm text-muted mt-1">
                {quiz.questions?.length} Questions · {quiz.duration} mins · Pass: {quiz.passingMarks}/{quiz.totalMarks}
              </p>
            </div>
            {quiz.approvedByCollege ? (
              <button className="btn btn-sm btn-danger" onClick={() => approveQuiz(quiz._id, false)} disabled={acting === quiz._id}>
                {acting === quiz._id ? <span className="spinner" /> : 'Revoke'}
              </button>
            ) : (
              <button className="btn btn-sm btn-success" onClick={() => approveQuiz(quiz._id, true)} disabled={acting === quiz._id}>
                {acting === quiz._id ? <span className="spinner" /> : 'Approve Quiz'}
              </button>
            )}
          </div>
          <details className="mt-4" style={{ cursor: 'pointer' }}>
            <summary className="text-sm font-semibold text-accent sel-none outline-none">Preview Questions</summary>
            <div className="mt-3 grid gap-3">
              {quiz.questions?.map((q, i) => (
                <div key={i} className="p-3 bg-gray-900 rounded" style={{ background: 'var(--bg-primary)' }}>
                  <p className="text-sm font-medium mb-2">Q{i + 1}. {q.question} <span className="text-xs text-muted">({q.marks} marks)</span></p>
                  <p className="text-xs text-muted">Ans: <span className="text-success">{q.correctAnswer}</span></p>
                </div>
              ))}
            </div>
          </details>
        </div>
      ))}
    </DashboardLayout>
  );
}
