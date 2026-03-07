import express from 'express';
import {
  createJob,
  getJobById,
  getApprovedJobs,
  getRecruiterJobs,
  getAllJobsForApproval,
  approveJob,
  rejectJob,
  updateJob,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected route - view approved jobs for the current student's college
router.get('/approved', protect, getApprovedJobs);

// Protected routes - require authentication
router.get('/:id', protect, getJobById);

// Recruiter routes
router.post('/', protect, authorize('Recruiter'), createJob);
router.get('/recruiter/my-jobs', protect, authorize('Recruiter'), getRecruiterJobs);
router.put('/:id', protect, authorize('Recruiter'), updateJob);

// College routes
router.get('/approval/all-jobs', protect, authorize('College'), getAllJobsForApproval);
router.put('/approval/approve/:id', protect, authorize('College'), approveJob);
router.delete('/approval/reject/:id', protect, authorize('College'), rejectJob);

export default router;
