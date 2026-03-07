import express from 'express';
import {
  getAllStudents,
  getStudentById,
  approveStudentForPlacement,
  revokeStudentApproval,
  getApprovedStudents,
  getPendingApprovalStudents,
} from '../controllers/collegeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and College role
router.use(protect);
router.use(authorize('College'));

// Student management routes
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentById);
router.put('/approve-student/:id', approveStudentForPlacement);
router.put('/revoke-approval/:id', revokeStudentApproval);

// Filtered student lists
router.get('/approved-students', getApprovedStudents);
router.get('/pending-approval', getPendingApprovalStudents);

export default router;
