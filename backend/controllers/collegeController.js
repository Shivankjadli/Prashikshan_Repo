import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';

// @desc    Get all student profiles for approval
// @route   GET /api/college/students
// @access  Private (College only)
export const getAllStudents = async (req, res) => {
  try {
    const collegeId = req.user.id;

    // First get ALL students for this college
    const users = await User.find({ role: 'Student', collegeId }).select('name email collegeId');
    const userIds = users.map(u => u._id);

    // Get profiles for these students (if they exist)
    const profiles = await StudentProfile.find({ userId: { $in: userIds } });
    const profileMap = new Map(profiles.map(p => [p.userId.toString(), p]));

    // Combine
    const students = users.map(user => {
      const profile = profileMap.get(user._id.toString());
      return {
        _id: profile ? profile._id : `virtual_${user._id}`,
        userId: user,
        branch: profile?.branch || '—',
        cgpa: profile?.cgpa || '—',
        completionPercentage: profile?.completionPercentage || 0,
        approvedForPlacement: profile?.approvedForPlacement || false,
        resumeUrl: profile?.resumeUrl || null,
        profileCreated: !!profile
      };
    });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get student profile by ID
// @route   GET /api/college/students/:id
// @access  Private (College only)
export const getStudentById = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.params.id })
      .populate('userId', 'name email collegeId');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    if (profile.userId.collegeId?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'This student does not belong to your college',
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve student for placement
// @route   PUT /api/college/approve-student/:id
// @access  Private (College only)
export const approveStudentForPlacement = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.params.id })
      .populate('userId', 'name email collegeId');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    if (profile.userId.collegeId?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'This student does not belong to your college',
      });
    }

    if (profile.approvedForPlacement) {
      return res.status(400).json({
        success: false,
        message: 'Student is already approved for placement',
      });
    }

    // Check if profile is complete (at least 80% completion)
    if (profile.completionPercentage < 80) {
      return res.status(400).json({
        success: false,
        message: `Student profile is only ${profile.completionPercentage}% complete. Minimum 80% completion required for placement approval.`,
      });
    }

    profile.approvedForPlacement = true;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Student approved for placement successfully',
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Revoke student placement approval
// @route   PUT /api/college/revoke-approval/:id
// @access  Private (College only)
export const revokeStudentApproval = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.params.id })
      .populate('userId', 'name email collegeId');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    if (profile.userId.collegeId?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'This student does not belong to your college',
      });
    }

    if (!profile.approvedForPlacement) {
      return res.status(400).json({
        success: false,
        message: 'Student is not approved for placement',
      });
    }

    profile.approvedForPlacement = false;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Student placement approval revoked successfully',
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get approved students for placement
// @route   GET /api/college/approved-students
// @access  Private (College only)
export const getApprovedStudents = async (req, res) => {
  try {
    const students = await StudentProfile.find({ collegeId: req.user.id, approvedForPlacement: true })
      .populate('userId', 'name email collegeId')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get students pending approval
// @route   GET /api/college/pending-approval
// @access  Private (College only)
export const getPendingApprovalStudents = async (req, res) => {
  try {
    const students = await StudentProfile.find({
      collegeId: req.user.id,
      approvedForPlacement: false
    })
      .populate('userId', 'name email collegeId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
