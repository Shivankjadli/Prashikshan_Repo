import Offer from '../models/Offer.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Create / send offer to a selected student
// @route   POST /api/offers/create/:applicationId
// @access  Private (Recruiter only)
export const createOffer = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { package: offerPackage, joiningDate } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!offerPackage || !joiningDate) {
      return res.status(400).json({
        success: false,
        message: 'Package and joining date are required',
      });
    }

    if (Number(offerPackage) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Package cannot be negative',
      });
    }

    const joiningDateObj = new Date(joiningDate);
    if (isNaN(joiningDateObj.getTime()) || joiningDateObj <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Joining date must be a valid future date',
      });
    }

    // Offer letter PDF is required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Offer letter PDF is required (field name: offerLetter)',
      });
    }

    // ── Fetch & Validate Application ─────────────────────────────────────────
    const application = await Application.findById(applicationId)
      // Job model fields: title, description, salary, recruiter
      .populate({ path: 'jobId', select: 'title recruiter' })
      .populate({ path: 'studentId', select: 'name email' });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Recruiter must own the job
    const jobRecruiterId = application.jobId?.recruiter;
    if (!jobRecruiterId) {
      return res.status(400).json({
        success: false,
        message: 'Application is missing job recruiter information',
      });
    }

    if (jobRecruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create offers for this application',
      });
    }

    // Student must be in "selected" state
    if (application.status !== 'selected') {
      return res.status(400).json({
        success: false,
        message: `Cannot send an offer — application status is "${application.status}". Student must be selected first.`,
      });
    }

    // ── Duplicate-offer guard ─────────────────────────────────────────────────
    const existingOffer = await Offer.findOne({
      jobId: application.jobId._id,
      studentId: application.studentId._id,
    });

    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: 'An offer already exists for this student and job',
      });
    }

    // ── Create Offer ──────────────────────────────────────────────────────────
    const offer = await Offer.create({
      jobId: application.jobId._id,
      recruiterId: req.user.id,
      studentId: application.studentId._id,
      package: Number(offerPackage),
      joiningDate: joiningDateObj,
      offerLetterUrl: `/uploads/${req.file.filename}`,
    });

    await offer.populate([
      { path: 'jobId', select: 'title company' },
      { path: 'studentId', select: 'name email' },
      { path: 'recruiterId', select: 'name email' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Offer created and sent to student successfully',
      offer,
    });
  } catch (error) {
    console.error('Create offer error:', error);

    // Handle duplicate-key error from the unique compound index
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An offer already exists for this student and job',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all offers issued by the logged-in recruiter
// @route   GET /api/offers/recruiter
// @access  Private (Recruiter only)
export const getRecruiterOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ recruiterId: req.user.id })
      .populate('jobId', 'title company')
      .populate('studentId', 'name email')
      .sort({ issuedAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    console.error('Get recruiter offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all offers received by the logged-in student
// @route   GET /api/offers/my-offers
// @access  Private (Student only)
export const getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ studentId: req.user.id })
      .populate('jobId', 'title company salary')
      .populate('recruiterId', 'name email')
      .sort({ issuedAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    console.error('Get my offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Accept or reject an offer (student)
// @route   PUT /api/offers/respond/:offerId
// @access  Private (Student only)
//
// Single-placement policy:
//   When a student accepts an offer, all other *pending* offers they have
//   received are automatically rejected, enforcing the one-final-placement rule.
export const respondToOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { response } = req.body; // 'accepted' | 'rejected'

    if (!['accepted', 'rejected'].includes(response)) {
      return res.status(400).json({
        success: false,
        message: 'Response must be either "accepted" or "rejected"',
      });
    }

    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found',
      });
    }

    // Only the intended student may respond
    if (offer.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this offer',
      });
    }

    // Cannot respond to an already-decided offer
    if (offer.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Offer has already been ${offer.status}`,
      });
    }

    // Check expiry (30-day window)
    if (offer.isExpired) {
      return res.status(400).json({
        success: false,
        message: 'This offer has expired (30-day response window)',
      });
    }

    // ── Single-placement policy: if accepting, block if already placed ────────
    if (response === 'accepted') {
      const alreadyAccepted = await Offer.findOne({
        studentId: req.user.id,
        status: 'accepted',
        _id: { $ne: offerId },
      });

      if (alreadyAccepted) {
        return res.status(400).json({
          success: false,
          message:
            'You have already accepted an offer. Only one final placement is allowed.',
        });
      }
    }

    // Update the target offer
    offer.status = response;
    await offer.save();

    // Auto-reject all other pending offers for this student (single-placement)
    if (response === 'accepted') {
      await Offer.updateMany(
        {
          studentId: req.user.id,
          status: 'pending',
          _id: { $ne: offer._id },
        },
        { $set: { status: 'rejected' } }
      );
    }

    await offer.populate([
      { path: 'jobId', select: 'title company' },
      { path: 'recruiterId', select: 'name email' },
    ]);

    res.status(200).json({
      success: true,
      message: `Offer ${response} successfully`,
      offer,
    });
  } catch (error) {
    console.error('Respond to offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};