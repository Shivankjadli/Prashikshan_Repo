import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Student routes - require Student role
router.use('/apply', protect);
router.use('/my-applications', protect);

router.post('/apply/:jobId', authorize('Student'), applyForJob);
router.get('/my-applications', authorize('Student'), getMyApplications);

// Recruiter routes - require Recruiter role
router.use('/job', protect);
router.use('/update-status', protect);

router.get('/job/:jobId', authorize('Recruiter'), getJobApplications);
router.put('/update-status/:applicationId', authorize('Recruiter'), updateApplicationStatus);

export default router;