import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';

// @desc    Create or update student profile
// @route   POST /api/student/profile
// @access  Private (Student only)
export const createOrUpdateProfile = async (req, res) => {
  try {
    const { branch, cgpa, skills, projects, certifications, collegeId } = req.body;

    // Use either the ID from the profile update or the one in the user's current token
    const effectiveCollegeId = collegeId || req.user.collegeId;

    // Validation
    if (!branch || cgpa === undefined || cgpa === null || !effectiveCollegeId) {
      return res.status(400).json({
        success: false,
        message: 'Branch, CGPA, and College selection are required fields',
      });
    }

    if (cgpa < 0 || cgpa > 10) {
      return res.status(400).json({
        success: false,
        message: 'CGPA must be between 0 and 10',
      });
    }

    // Check if profile already exists
    let profile = await StudentProfile.findOne({ userId: req.user.id });

    // Update User's collegeId for future requests/JWT generation
    await User.findByIdAndUpdate(req.user.id, { collegeId: effectiveCollegeId });

    if (profile) {
      // Update existing profile
      profile.branch = branch;
      profile.cgpa = cgpa;
      profile.skills = skills || [];
      profile.projects = projects || [];
      profile.certifications = certifications || [];
      profile.collegeId = effectiveCollegeId; // Ensure college mapping is correct

      await profile.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        profile,
      });
    } else {
      // Create new profile
      profile = await StudentProfile.create({
        userId: req.user.id,
        collegeId: effectiveCollegeId,
        branch,
        cgpa,
        skills: skills || [],
        projects: projects || [],
        certifications: certifications || [],
      });

      res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        profile,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student only)
export const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create your profile first.',
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

// @desc    Upload resume
// @route   POST /api/student/upload-resume
// @access  Private (Student only)
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Find or create profile
    let profile = await StudentProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create your profile first.',
      });
    }

    // Update resume URL
    profile.resumeUrl = `/uploads/${req.file.filename}`;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: profile.resumeUrl,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get profile completion progress
// @route   GET /api/student/profile-completion
// @access  Private (Student only)
export const getProfileCompletion = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(200).json({
        success: true,
        completionPercentage: 0,
        message: 'Profile not created yet',
        completedFields: {
          branch: false,
          cgpa: false,
          skills: false,
          projects: false,
          resume: false,
        },
      });
    }

    const completedFields = {
      branch: !!profile.branch,
      cgpa: profile.cgpa !== undefined && profile.cgpa !== null,
      skills: profile.skills && profile.skills.length > 0,
      projects: profile.projects && profile.projects.length > 0,
      resume: !!profile.resumeUrl,
    };

    res.status(200).json({
      success: true,
      completionPercentage: profile.completionPercentage,
      completedFields,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/student/delete-resume
// @access  Private (Student only)
export const deleteResume = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (!profile.resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'No resume to delete',
      });
    }

    // TODO: Optionally delete file from filesystem
    // const fs = await import('fs');
    // const path = await import('path');
    // const filePath = path.join(process.cwd(), profile.resumeUrl);
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }

    profile.resumeUrl = null;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
