import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { jobAPI, quizAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Users } from 'lucide-react';

const emptyQ = () => ({ question: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 });

export default function RecruiterQuizzes() {
  const [jobs, setJobs]     = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]     = useState({ title: '', duration: 30, passingMarks: '', totalMarks: '', questions: [emptyQ()] });
  const [saving, setSaving] = useState(false);

  const [quizzes, setQuizzes] = useState([]);
  const [resultsMap, setResultsMap] = useState({}); // { quizId: { statistics, submissions } }
  const [viewingResults, setViewingResults] = useState(null);

  useEffect(() => {
    jobAPI.getMyJobs().then(r => setJobs(r.data.jobs || [])).catch(() => {});
  }, []);

  const loadQuizzes = async (jobId) => {
    setSelectedJob(jobId);
    setQuizzes([]);
    if (!jobId) return;
    try {
      const r = await quizAPI.getForJobRecruiter(jobId);
      setQuizzes(r.data.quizzes || []);
    } catch {}
  };

  const loadResults = async (quizId) => {
    if (resultsMap[quizId]) {
      setViewingResults(resultsMap[quizId]);
      return;
    }
    try {
      const r = await quizAPI.getResults(quizId);
      const data = { statistics: r.data.statistics, submissions: r.data.submissions };
      setResultsMap(p => ({ ...p, [quizId]: data }));
      setViewingResults({ quizId, ...data });
    } catch (err) {
      toast.error('Could not load quiz results');
    }
  };

  const addQuestion = () => setForm(p => ({ ...p, questions: [...p.questions, emptyQ()] }));
  const removeQuestion = (i) => setForm(p => ({ ...p, questions: p.questions.filter((_, idx) => idx !== i) }));
  const updateQ = (i, field, val) => setForm(p => {
    const qs = [...p.questions];
    qs[i] = { ...qs[i], [field]: val };
    return { ...p, questions: qs };
  });
  const updateOpt = (qi, oi, val) => setForm(p => {
    const qs = [...p.questions];
    const opts = [...qs[qi].options];
    opts[oi] = val;
    qs[qi] = { ...qs[qi], options: opts };
    return { ...p, questions: qs };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return toast.error('Please select a job');
    setSaving(true);
    try {
      await quizAPI.create(selectedJob, { ...form, passingMarks: Number(form.passingMarks), totalMarks: Number(form.totalMarks), duration: Number(form.duration) });
      toast.success('Quiz created! Awaiting college approval.');
      setForm({ title: '', duration: 30, passingMarks: '', totalMarks: '', questions: [emptyQ()] });
      setShowForm(false);
      loadQuizzes(selectedJob);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Quizzes">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>Quizzes</h1>
          <p>Create and evaluate MCQ quizzes for your job applicants</p>
        </div>
        {selectedJob && (
          <button className="btn btn-primary" onClick={() => setShowForm(f => !f)}>
            {showForm ? 'Cancel' : <><Plus size={16} /> Create Quiz</>}
          </button>
        )}
      </div>

      <div className="card mb-6">
        <label className="form-label">Select Job</label>
        <select className="form-select" value={selectedJob} onChange={e => loadQuizzes(e.target.value)}>
          <option value="">-- Select approved job --</option>
          {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="card mb-4">
            <h3 className="font-semibold mb-4">Quiz Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quiz Title</label>
                <input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Technical Round 1" />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (minutes)</label>
                <input className="form-input" type="number" min={1} max={180} value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total Marks</label>
                <input className="form-input" type="number" min={1} value={form.totalMarks} onChange={e => setForm(p => ({ ...p, totalMarks: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Passing Marks</label>
                <input className="form-input" type="number" min={0} value={form.passingMarks} onChange={e => setForm(p => ({ ...p, passingMarks: e.target.value }))} required />
              </div>
            </div>
          </div>

          {form.questions.map((q, qi) => (
            <div className="card mb-4" key={qi}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm">Question {qi + 1}</span>
                {form.questions.length > 1 && (
                  <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => removeQuestion(qi)}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Question Text</label>
                <input className="form-input" value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)} required placeholder="Enter question…" />
              </div>
              <div className="form-row mb-3">
                {q.options.map((opt, oi) => (
                  <div className="form-group" key={oi}>
                    <label className="form-label">Option {oi + 1}</label>
                    <input className="form-input" value={opt} onChange={e => updateOpt(qi, oi, e.target.value)} required placeholder={`Option ${oi + 1}`} />
                  </div>
                ))}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Correct Answer (must match an option exactly)</label>
                  <select className="form-select" value={q.correctAnswer} onChange={e => updateQ(qi, 'correctAnswer', e.target.value)} required>
                    <option value="">-- Select --</option>
                    {q.options.filter(Boolean).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Marks</label>
                  <input className="form-input" type="number" min={1} value={q.marks} onChange={e => updateQ(qi, 'marks', Number(e.target.value))} required />
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-3 mt-2">
            <button type="button" className="btn btn-secondary" onClick={addQuestion}><Plus size={15} /> Add Question</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" /> Creating…</> : 'Create Quiz'}
            </button>
          </div>
        </form>
      )}

      {selectedJob && !showForm && (
        quizzes.length === 0 ? <div className="empty-state"><h3>No quizzes created yet</h3></div> :
        quizzes.map(quiz => (
          <div className="card mb-4" key={quiz._id}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">{quiz.title}</h3>
                <div className="text-sm text-muted mt-1">
                  Duration: {quiz.duration}m | Marks: {quiz.totalMarks} | Pass: {quiz.passingMarks}
                </div>
                <span className={`badge ${quiz.approvedByCollege ? 'badge-success' : 'badge-warning'} mt-2`}>
                  {quiz.approvedByCollege ? 'Approved' : 'Pending'}
                </span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => loadResults(quiz._id)}>
                <Users size={16} className="mr-2" /> View Results
              </button>
            </div>
          </div>
        ))
      )}

      {/* Results Modal */}
      {viewingResults && (
        <div className="modal-overlay" onClick={() => setViewingResults(null)}>
          <div className="modal max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Quiz Results Analytics</h3>
              <button className="btn btn-icon btn-secondary" onClick={() => setViewingResults(null)}>×</button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="stat-card" style={{ background: 'var(--bg-glass)', padding: '1rem', borderRadius: '8px' }}>
                <div className="text-sm text-muted">Total</div>
                <div className="text-xl font-bold">{viewingResults.statistics.totalSubmissions}</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--bg-glass)', padding: '1rem', borderRadius: '8px' }}>
                <div className="text-sm text-muted">Passed</div>
                <div className="text-xl font-bold text-green-400">{viewingResults.statistics.passedCount}</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--bg-glass)', padding: '1rem', borderRadius: '8px' }}>
                <div className="text-sm text-muted">Failed</div>
                <div className="text-xl font-bold text-red-400">{viewingResults.statistics.failedCount}</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--bg-glass)', padding: '1rem', borderRadius: '8px' }}>
                <div className="text-sm text-muted">Avg Score</div>
                <div className="text-xl font-bold text-blue-400">{viewingResults.statistics.averageScore}</div>
              </div>
            </div>

            <h4 className="font-semibold mb-3">Student Submissions</h4>
            <div style={{ maxHeight: 300, overflowY: 'auto', background: 'var(--bg-glass)', borderRadius: 8 }}>
              {viewingResults.submissions.length === 0 ? (
                <div className="p-4 text-center text-muted text-sm">No submissions yet.</div>
              ) : (
                <table className="table w-full text-left">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="p-3 text-sm font-semibold">Student Name</th>
                      <th className="p-3 text-sm font-semibold">Score</th>
                      <th className="p-3 text-sm font-semibold">Status</th>
                      <th className="p-3 text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingResults.submissions.map(sub => (
                      <tr key={sub._id} className="border-t border-gray-800">
                        <td className="p-3 text-sm">{sub.student?.name}</td>
                        <td className="p-3 text-sm">{sub.score}</td>
                        <td className="p-3 text-sm">
                          <span className={`badge ${sub.passed ? 'badge-success' : 'badge-danger'}`}>
                            {sub.passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-muted">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
