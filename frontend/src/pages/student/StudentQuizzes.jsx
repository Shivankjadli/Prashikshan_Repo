import { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { applicationAPI, quizAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function StudentQuizzes() {
  const [jobs, setJobs]         = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [quizzes, setQuizzes]   = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers]   = useState({});
  const [result, setResult]     = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    applicationAPI.getMyApps()
      .then(r => setJobs(r.data.applications || []))
      .catch(() => {});
  }, []);

  const loadQuizzes = async (jobId) => {
    setSelectedJob(jobId);
    setQuizzes([]);
    setActiveQuiz(null);
    setResult(null);
    try {
      const r = await quizAPI.getForJob(jobId);
      setQuizzes(r.data.quizzes || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load quizzes');
    }
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setAnswers({});
    setResult(null);
    setTimeLeft(quiz.duration * 60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(quiz); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (quiz = activeQuiz) => {
    clearInterval(timerRef.current);
    setSubmitting(true);
    const payload = (quiz.questions || []).map((_, i) => ({
      selectedAnswer: answers[i] || '',
    }));
    try {
      const r = await quizAPI.submit(quiz._id, payload);
      setResult(r.data.result);
      setActiveQuiz(null);
      toast.success(`Score: ${r.data.result.score}/${r.data.result.quiz.totalMarks}`);
      loadQuizzes(selectedJob);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <DashboardLayout title="Quizzes">
      <div className="page-header">
        <h1>Quizzes</h1>
        <p>Attempt quizzes for jobs you have applied to</p>
      </div>

      {/* Job selector */}
      {!activeQuiz && !result && (
        <div className="card mb-6">
          <label className="form-label">Select Job</label>
          <select className="form-select" onChange={e => loadQuizzes(e.target.value)} defaultValue="">
            <option value="" disabled>-- Pick a job --</option>
            {jobs.map(a => (
              <option key={a._id} value={a.jobId || a.job?._id}>
                {a.job?.title || 'Job'} ({a.status})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quiz list */}
      {!activeQuiz && !result && selectedJob && (
        quizzes.length === 0
          ? <div className="empty-state"><h3>No approved quizzes for this job</h3></div>
          : quizzes.map(q => (
            <div className="card mb-4" key={q._id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{q.title}</h3>
                  <p className="text-sm text-muted">{q.questions?.length} questions · {q.duration} min · {q.totalMarks} marks</p>
                </div>
                {q.attempted
                  ? <span className="badge badge-muted">Attempted</span>
                  : <button className="btn btn-primary btn-sm" onClick={() => startQuiz(q)}>Start Quiz</button>}
              </div>
            </div>
          ))
      )}

      {/* Active Quiz */}
      {activeQuiz && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold" style={{ fontSize: '1.2rem' }}>{activeQuiz.title}</h2>
            <div className="quiz-timer">{fmt(timeLeft)}</div>
          </div>
          {activeQuiz.questions.map((q, i) => (
            <div className="card mb-4" key={i}>
              <p className="font-semibold mb-4">Q{i + 1}. {q.question} <span className="text-muted text-xs">({q.marks} marks)</span></p>
              {q.options.map(opt => (
                <div key={opt}
                  className={`quiz-option${answers[i] === opt ? ' selected' : ''}`}
                  onClick={() => setAnswers(p => ({ ...p, [i]: opt }))}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${answers[i] === opt ? 'var(--accent)' : 'var(--border)'}`, background: answers[i] === opt ? 'var(--accent)' : 'transparent' }} />
                  {opt}
                </div>
              ))}
            </div>
          ))}
          <button className="btn btn-primary btn-lg" onClick={() => handleSubmit()} disabled={submitting}>
            {submitting ? <><span className="spinner" /> Submitting…</> : 'Submit Quiz'}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="card text-center">
          <h2 className="font-bold mb-2" style={{ fontSize: '1.4rem' }}>Quiz Result</h2>
          <div className="value" style={{ fontSize: '3rem', marginBottom: 8 }}>{result.score}/{result.quiz.totalMarks}</div>
          <span className={`badge ${result.passed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.9rem', padding: '6px 18px' }}>
            {result.passed ? '🎉 Passed' : '❌ Failed'}
          </span>
          <p className="text-muted text-sm mt-4">Passing marks: {result.quiz.passingMarks}</p>
          <button className="btn btn-secondary mt-4" onClick={() => setResult(null)}>Back to Quizzes</button>
        </div>
      )}
    </DashboardLayout>
  );
}
