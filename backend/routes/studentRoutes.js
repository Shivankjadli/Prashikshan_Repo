import express from 'express';
import {
  createOrUpdateProfile,
  getProfile,
  uploadResume,
  getProfileCompletion,
  deleteResume,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadResume as uploadMiddleware, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All routes require authentication and Student role
router.use(protect);
router.use(authorize('Student'));

// Profile routes
router.route('/profile')
  .post(createOrUpdateProfile)
  .get(getProfile);

// Resume upload route
router.post('/upload-resume', uploadMiddleware, handleUploadError, uploadResume);

// Resume delete route
router.delete('/delete-resume', deleteResume);

// Profile completion route
router.get('/profile-completion', getProfileCompletion);

export default router;
