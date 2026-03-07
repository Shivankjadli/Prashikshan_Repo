import express from 'express';
import {
  getOverviewAnalytics,
  getBranchWiseAnalytics,
  getJobAnalytics,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// College routes
router.get('/overview', protect, authorize('College'), getOverviewAnalytics);
router.get('/branch-wise', protect, authorize('College'), getBranchWiseAnalytics);

// Recruiter routes
router.get('/job/:jobId', protect, authorize('Recruiter'), getJobAnalytics);

export default router;