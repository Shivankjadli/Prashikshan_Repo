import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const cleanUrl = envUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401/403 handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

/* ── Auth ──────────────────────────────────────── */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getColleges: () => api.get('/auth/colleges'),
};

/* ── Jobs ──────────────────────────────────────── */
export const jobAPI = {
  getApproved: () => api.get('/jobs/approved'),
  getById: (id) => api.get(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/recruiter/my-jobs'),
  getAllForApproval: () => api.get('/jobs/approval/all-jobs'),
  create: (data) => api.post('/jobs', data),
  update: (id, d) => api.put(`/jobs/${id}`, d),
  delete: (id) => api.delete(`/jobs/${id}`),
  approve: (id) => api.put(`/jobs/approval/approve/${id}`),
  reject: (id) => api.delete(`/jobs/approval/reject/${id}`),
};

/* ── Student Profile ───────────────────────────── */
export const studentAPI = {
  getProfile: () => api.get('/student/profile'),
  saveProfile: (data) => api.post('/student/profile', data),
  getCompletion: () => api.get('/student/profile-completion'),
  uploadResume: (form) => api.post('/student/upload-resume', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteResume: () => api.delete('/student/delete-resume'),
};

/* ── Applications ──────────────────────────────── */
export const applicationAPI = {
  apply: (jobId) => api.post(`/applications/apply/${jobId}`),
  getMyApps: () => api.get('/applications/my-applications'),
  getJobApps: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (appId, status) => api.put(`/applications/update-status/${appId}`, { status }),
};

/* ── College ───────────────────────────────────── */
export const collegeAPI = {
  getAllStudents: () => api.get('/college/students'),
  getStudentById: (id) => api.get(`/college/students/${id}`),
  approveStudent: (id) => api.put(`/college/approve-student/${id}`),
  revokeApproval: (id) => api.put(`/college/revoke-approval/${id}`),
  getApproved: () => api.get('/college/approved-students'),
  getPending: () => api.get('/college/pending-approval'),
};

/* ── Quizzes ───────────────────────────────────── */
export const quizAPI = {
  create: (jobId, data) => api.post(`/quizzes/create/${jobId}`, data),
  getResults: (quizId) => api.get(`/quizzes/results/${quizId}`),
  approve: (quizId, approved) => api.put(`/quizzes/approve/${quizId}`, { approved }),
  getForJob: (jobId) => api.get(`/quizzes/job/${jobId}`),
  getForJobCollege: (jobId) => api.get(`/quizzes/job/${jobId}/college`),
  getForJobRecruiter: (jobId) => api.get(`/quizzes/job/${jobId}/recruiter`),
  submit: (quizId, answers) => api.post(`/quizzes/submit/${quizId}`, { answers }),
};

/* ── Assignments ───────────────────────────────── */
export const assignmentAPI = {
  create: (jobId, data) => api.post(`/assignments/create/${jobId}`, data),
  approve: (id, approved) => api.put(`/assignments/approve/${id}`, { approved }),
  getForJob: (jobId) => api.get(`/assignments/job/${jobId}`),
  getForJobCollege: (jobId) => api.get(`/assignments/job/${jobId}/college`),
  getForJobRecruiter: (jobId) => api.get(`/assignments/job/${jobId}/recruiter`),
  submit: (id, form) => api.post(`/assignments/submit/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getSubmissions: (id) => api.get(`/assignments/submissions/${id}`),
  review: (subId, marks) => api.put(`/assignments/review/${subId}`, { marksAwarded: marks }),
};

/* ── Offers ────────────────────────────────────── */
export const offerAPI = {
  create: (appId, form) => api.post(`/offers/create/${appId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getRecruiterOffers: () => api.get('/offers/recruiter'),
  getMyOffers: () => api.get('/offers/my-offers'),
  respond: (offerId, response) => api.put(`/offers/respond/${offerId}`, { response }),
};

/* ── Analytics ─────────────────────────────────── */
export const analyticsAPI = {
  overview: () => api.get('/analytics/overview'),
  branchWise: () => api.get('/analytics/branch-wise'),
  jobAnalytics: (jobId) => api.get(`/analytics/job/${jobId}`),
};
