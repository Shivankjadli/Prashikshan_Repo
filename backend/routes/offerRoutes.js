import express from 'express';
import {
  createOffer,
  getRecruiterOffers,
  getMyOffers,
  respondToOffer,
} from '../controllers/offerController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadOfferLetter, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Recruiter routes
router.post(
  '/create/:applicationId',
  protect,
  authorize('Recruiter'),
  uploadOfferLetter,
  handleUploadError,
  createOffer
);

router.get('/recruiter', protect, authorize('Recruiter'), getRecruiterOffers);

// Student routes
router.get('/my-offers', protect, authorize('Student'), getMyOffers);
router.put('/respond/:offerId', protect, authorize('Student'), respondToOffer);

export default router;