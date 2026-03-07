import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

// @desc    Create assignment for a job
// @route   POST /api/assignments/create/:jobId
// @access  Private (Recruiter only)
export const createAssignment = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { subject, description, deadline, maxMarks } = req.body;

    // Validation
    if (!subject || !description || !deadline || !maxMarks) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: subject, description, deadline, maxMarks',
      });
    }

    if (maxMarks < 1) {
      return res.status(400).json({
        success: false,
        message: 'Max marks must be at least 1',
      });
    }

    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be in the future',
      });
    }

    // Check if job exists and belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create assignments for this job',
      });
    }

    // Create assignment
    const assignment = await Assignment.create({
      jobId,
      recruiterId: req.user.id,
      subject,
      description,
      deadline: deadlineDate,
      maxMarks,
    });

    // Populate job details
    await assignment.populate('jobId', 'title company');

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully. Pending college approval.',
      assignment,
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Approve assignment
// @route   PUT /api/assignments/approve/:assignmentId
// @access  Private (College only)
export const approveAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { approved } = req.body;
    const collegeId = req.user.id;

    if (typeof approved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Approved status must be true or false',
      });
    }

    const assignment = await Assignment.findById(assignmentId).populate('jobId');
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Ensure college is targeted
    if (!assignment.jobId.targetColleges.some(cid => cid.toString() === collegeId)) {
      return res.status(403).json({ success: false, message: 'Job not targeted to your college' });
    }

    const alreadyApproved = assignment.approvedByColleges.some(cid => cid.toString() === collegeId);

    if (approved && !alreadyApproved) {
      assignment.approvedByColleges.push(collegeId);
      assignment.approvedByCollege = true; // legacy support
    } else if (!approved && alreadyApproved) {
      assignment.approvedByColleges = assignment.approvedByColleges.filter(cid => cid.toString() !== collegeId);
      if (assignment.approvedByColleges.length === 0) assignment.approvedByCollege = false;
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      message: `Assignment ${approved ? 'approved' : 'rejected'} successfully`,
      assignment,
    });
  } catch (error) {
    console.error('Approve assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get assignments for a job (College - for approval)
// @route   GET /api/assignments/job/:jobId/college
// @access  Private (College only)
export const getJobAssignmentsForCollege = async (req, res) => {
  try {
    const { jobId } = req.params;
    const collegeId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job || !job.targetColleges.some(cid => cid.toString() === collegeId)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const assignments = await Assignment.find({ jobId })
      .populate('recruiterId', 'name email')
      .sort({ createdAt: -1 });

    const processed = assignments.map(a => ({
      ...a.toObject(),
      approvedByCollege: a.approvedByColleges.some(cid => cid.toString() === collegeId),
    }));

    res.status(200).json({
      success: true,
      assignments: processed,
    });
  } catch (error) {
    console.error('Get job assignments for college error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get assignments for a job (Student)
// @route   GET /api/assignments/job/:jobId
// @access  Private (Student only)
export const getJobAssignments = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if student has applied to this job
    const application = await Application.findOne({
      jobId,
      studentId: req.user.id,
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message: 'You must apply to this job before viewing assignments',
      });
    }

    // Get approved assignments for this job (from THIS student's college)
    const assignments = await Assignment.find({
      jobId,
      approvedByColleges: req.user.collegeId,
    }).populate('recruiterId', 'name email');

    // For frontend reliability, set approvedByCollege to true since we filtered for it
    const processed = assignments.map(a => ({
      ...a.toObject(),
      approvedByCollege: true,
    }));

    res.status(200).json({
      success: true,
      assignments: processed,
    });
  } catch (error) {
    console.error('Get job assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/submit/:assignmentId
// @access  Private (Student only)
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { answerText } = req.body;

    if (!answerText || answerText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answer text is required',
      });
    }

    // Check if assignment exists and is approved
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    if (!assignment.approvedByCollege) {
      return res.status(403).json({
        success: false,
        message: 'Assignment is not approved yet',
      });
    }

    // Check if deadline has passed
    if (assignment.isExpired) {
      return res.status(400).json({
        success: false,
        message: 'Assignment deadline has passed',
      });
    }

    // Check if student has applied to the job
    const application = await Application.findOne({
      jobId: assignment.jobId,
      studentId: req.user.id,
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message: 'You must apply to this job before submitting assignments',
      });
    }

    // Check if student already submitted
    const existingSubmission = await AssignmentSubmission.findOne({
      assignmentId,
      studentId: req.user.id,
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this assignment',
      });
    }

    // Prepare submission data
    const submissionData = {
      assignmentId,
      studentId: req.user.id,
      answerText: answerText.trim(),
    };

    // Add file URL if uploaded
    if (req.file) {
      submissionData.fileUrl = `/uploads/${req.file.filename}`;
    }

    // Create submission
    const submission = await AssignmentSubmission.create(submissionData);

    // Populate assignment details
    await submission.populate('assignmentId', 'subject deadline maxMarks');

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      submission,
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get assignment submissions (Recruiter)
// @route   GET /api/assignments/submissions/:assignmentId
// @access  Private (Recruiter only)
export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Check if assignment exists and belongs to recruiter
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    if (assignment.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view submissions for this assignment',
      });
    }

    // Get all submissions for this assignment
    const submissions = await AssignmentSubmission.find({ assignmentId })
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      submissions,
      totalSubmissions: submissions.length,
    });
  } catch (error) {
    console.error('Get assignment submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Review and assign marks to submission
// @route   PUT /api/assignments/review/:submissionId
// @access  Private (Recruiter only)
export const reviewSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marksAwarded } = req.body;

    if (marksAwarded === undefined || marksAwarded === null) {
      return res.status(400).json({
        success: false,
        message: 'Marks awarded is required',
      });
    }

    if (marksAwarded < 0) {
      return res.status(400).json({
        success: false,
        message: 'Marks cannot be negative',
      });
    }

    // Find submission
    const submission = await AssignmentSubmission.findById(submissionId)
      .populate('assignmentId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Check if recruiter owns the assignment
    if (submission.assignmentId.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this submission',
      });
    }

    // Check if marks exceed max marks
    if (marksAwarded > submission.assignmentId.maxMarks) {
      return res.status(400).json({
        success: false,
        message: `Marks cannot exceed maximum marks (${submission.assignmentId.maxMarks})`,
      });
    }

    // Update submission
    submission.marksAwarded = marksAwarded;
    submission.reviewed = true;
    await submission.save();

    // Populate student details
    await submission.populate('studentId', 'name email');

    res.status(200).json({
      success: true,
      message: 'Submission reviewed successfully',
      submission,
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get assignments for a job (Recruiter)
// @route   GET /api/assignments/job/:jobId/recruiter
// @access  Private (Recruiter only)
export const getJobAssignmentsForRecruiter = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view assignments for this job',
      });
    }

    const assignments = await Assignment.find({ jobId })
      .populate('recruiterId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error('Get job assignments for recruiter error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};