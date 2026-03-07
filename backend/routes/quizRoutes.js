import express from 'express';
import {
  createQuiz,
  getQuizResults,
  approveQuiz,
  getJobQuizzes,
  getJobQuizzesForCollege,
  submitQuiz,
  getJobQuizzesForRecruiter,
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Recruiter routes - require Recruiter role
router.post('/create/:jobId', protect, authorize('Recruiter'), createQuiz);
router.get('/results/:quizId', protect, authorize('Recruiter'), getQuizResults);
router.get('/job/:jobId/recruiter', protect, authorize('Recruiter'), getJobQuizzesForRecruiter);

// College routes - require College role
router.put('/approve/:quizId', protect, authorize('College'), approveQuiz);
router.get('/job/:jobId/college', protect, authorize('College'), getJobQuizzesForCollege);

// Student routes - require Student role
router.get('/job/:jobId', protect, authorize('Student'), getJobQuizzes);
router.post('/submit/:quizId', protect, authorize('Student'), submitQuiz);

export default router;