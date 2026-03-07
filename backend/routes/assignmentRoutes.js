import express from 'express';
import {
  createAssignment,
  approveAssignment,
  getJobAssignments,
  getJobAssignmentsForCollege,
  submitAssignment,
  getAssignmentSubmissions,
  reviewSubmission,
  getJobAssignmentsForRecruiter,
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadDocumentFile, handleDocumentUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Recruiter routes
router.post('/create/:jobId', protect, authorize('Recruiter'), createAssignment);
router.get('/submissions/:assignmentId', protect, authorize('Recruiter'), getAssignmentSubmissions);
router.put('/review/:submissionId', protect, authorize('Recruiter'), reviewSubmission);
router.get('/job/:jobId/recruiter', protect, authorize('Recruiter'), getJobAssignmentsForRecruiter);

// College routes
router.put('/approve/:assignmentId', protect, authorize('College'), approveAssignment);
router.get('/job/:jobId/college', protect, authorize('College'), getJobAssignmentsForCollege);

// Student routes
router.get('/job/:jobId', protect, authorize('Student'), getJobAssignments);
router.post(
  '/submit/:assignmentId',
  protect,
  authorize('Student'),
  uploadDocumentFile,
  handleDocumentUploadError,
  submitAssignment
);

export default router;