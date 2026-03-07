import Application from '../models/Application.js';
import Job from '../models/Job.js';
import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import QuizSubmission from '../models/QuizSubmission.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Student only)
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;

    // Check if job exists and is approved
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (!job.approvedByCollege) {
      return res.status(400).json({
        success: false,
        message: 'Cannot apply for unapproved job',
      });
    }

    // Check if student profile exists and is approved for placement
    const studentProfile = await StudentProfile.findOne({ userId: studentId });
    if (!studentProfile) {
      return res.status(400).json({
        success: false,
        message: 'Student profile not found. Please complete your profile first.',
      });
    }

    if (!studentProfile.approvedForPlacement) {
      return res.status(400).json({
        success: false,
        message: 'You are not approved for placement yet. Please contact your college.',
      });
    }

    // Check if application already exists
    const existingApplication = await Application.findOne({
      jobId,
      studentId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      studentId,
      status: 'applied',
    });

    // Populate job and student details
    await application.populate([
      { path: 'job', select: 'title description salary recruiter' },
      { path: 'student', select: 'name email' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get student's applications
// @route   GET /api/applications/my-applications
// @access  Private (Student only)
export const getMyApplications = async (req, res) => {
  try {
    const studentId = req.user.id;

    const applications = await Application.find({ studentId })
      .populate({
        path: 'job',
        select: 'title description salary recruiter approvedByCollege',
        populate: {
          path: 'recruiter',
          select: 'name email',
        },
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.id;

    // Check if job exists and belongs to recruiter
    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId }).select(
      'title description salary requiresQuiz requiresAssignment'
    );
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you do not have permission to view applications',
      });
    }

    const applications = await Application.find({ jobId })
      .populate({
        path: 'student',
        select: 'name email',
      })
      .populate({
        path: 'job',
        select: 'title description salary requiresQuiz requiresAssignment',
      })
      .sort({ appliedAt: -1 });

    const studentIds = applications.map(a => a.studentId);

    // ── Quiz completion map ────────────────────────────────────────────────
    let quizByStudent = new Map(); // studentId -> { attempted, passed, score, submittedAt, totalMarks, passingMarks }
    const quiz = await Quiz.findOne({ jobId, approvedByCollege: true }).select('_id totalMarks passingMarks');
    if (quiz) {
      const subs = await QuizSubmission.find({
        quizId: quiz._id,
        studentId: { $in: studentIds },
      }).select('studentId passed score submittedAt');

      quizByStudent = new Map(
        subs.map(s => [
          String(s.studentId),
          {
            attempted: true,
            passed: s.passed,
            score: s.score,
            submittedAt: s.submittedAt,
            totalMarks: quiz.totalMarks,
            passingMarks: quiz.passingMarks,
          },
        ])
      );
    }

    // ── Assignment completion map ──────────────────────────────────────────
    const assignments = await Assignment.find({ jobId, approvedByCollege: true }).select('_id maxMarks');
    const assignmentIds = assignments.map(a => a._id);
    const assignmentMaxMarksById = new Map(assignments.map(a => [String(a._id), a.maxMarks]));
    const totalAssignmentMaxMarks = assignments.reduce((sum, a) => sum + (a.maxMarks || 0), 0);

    const totalAssignments = assignmentIds.length;
    let submittedByStudent = new Map(); // studentId -> Set(assignmentId)
    let assignmentPerfByStudent = new Map(); // studentId -> { reviewedCount, pendingReviewCount, awardedMarks, maxMarks }

    if (totalAssignments > 0) {
      const subs = await AssignmentSubmission.find({
        assignmentId: { $in: assignmentIds },
        studentId: { $in: studentIds },
      }).select('studentId assignmentId reviewed marksAwarded submittedAt');

      submittedByStudent = new Map();
      assignmentPerfByStudent = new Map();
      for (const s of subs) {
        const sid = String(s.studentId);
        if (!submittedByStudent.has(sid)) submittedByStudent.set(sid, new Set());
        submittedByStudent.get(sid).add(String(s.assignmentId));

        if (!assignmentPerfByStudent.has(sid)) {
          assignmentPerfByStudent.set(sid, {
            reviewedCount: 0,
            pendingReviewCount: 0,
            awardedMarks: 0,
            maxMarks: totalAssignmentMaxMarks,
          });
        }
        const perf = assignmentPerfByStudent.get(sid);
        if (s.reviewed && typeof s.marksAwarded === 'number') {
          perf.reviewedCount += 1;
          perf.awardedMarks += s.marksAwarded;
        } else {
          perf.pendingReviewCount += 1;
        }
      }
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      jobRequirements: {
        requiresQuiz: job.requiresQuiz,
        requiresAssignment: job.requiresAssignment,
        totalAssignments,
      },
      applications: applications.map((app) => {
        const sid = String(app.studentId);
        const quiz = quizByStudent.get(sid) || { attempted: false, passed: false, score: null, submittedAt: null, totalMarks: null, passingMarks: null };
        const submittedSet = submittedByStudent.get(sid) || new Set();
        const assignmentSubmittedCount = submittedSet.size;
        const perf = assignmentPerfByStudent.get(sid) || {
          reviewedCount: 0,
          pendingReviewCount: assignmentSubmittedCount,
          awardedMarks: 0,
          maxMarks: totalAssignmentMaxMarks,
        };

        return {
          ...app.toObject(),
          assessmentStatus: {
            quiz,
            assignments: {
              total: totalAssignments,
              submitted: assignmentSubmittedCount,
              completed: totalAssignments > 0 ? assignmentSubmittedCount === totalAssignments : false,
              marks: {
                awarded: perf.awardedMarks,
                max: perf.maxMarks,
                reviewedCount: perf.reviewedCount,
                pendingReviewCount: perf.pendingReviewCount,
              },
            },
            eligibleToShortlistOrSelect:
              (!job.requiresQuiz || quiz.attempted) &&
              (!job.requiresAssignment || (totalAssignments > 0 && assignmentSubmittedCount === totalAssignments)),
          },
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/update-status/:applicationId
// @access  Private (Recruiter only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const recruiterId = req.user.id;

    // Validate status
    const validStatuses = ['applied', 'shortlisted', 'rejected', 'selected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: applied, shortlisted, rejected, or selected',
      });
    }

    // Find application and check if recruiter owns the job
    const application = await Application.findById(applicationId)
      .populate({
        path: 'job',
        select: 'recruiter requiresQuiz requiresAssignment',
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if recruiter owns this job
    if (application.job.recruiter.toString() !== recruiterId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this application',
      });
    }

    // Enforce mandatory quiz/assignment completion before moving forward
    if (['shortlisted', 'selected'].includes(status)) {
      const jobId = application.jobId;
      const studentId = application.studentId;

      // ── Quiz requirement ────────────────────────────────────────────────
      if (application.job.requiresQuiz) {
        const quiz = await Quiz.findOne({ jobId, approvedByCollege: true }).select('_id');
        if (!quiz) {
          return res.status(400).json({
            success: false,
            message: 'This job requires a quiz, but no approved quiz exists yet. Please create and get it approved first.',
          });
        }

        const quizSub = await QuizSubmission.findOne({ quizId: quiz._id, studentId }).select('_id');
        if (!quizSub) {
          return res.status(400).json({
            success: false,
            message: 'Student must complete the required quiz before you can shortlist/select.',
          });
        }
      }

      // ── Assignment requirement ──────────────────────────────────────────
      if (application.job.requiresAssignment) {
        const assignments = await Assignment.find({ jobId, approvedByCollege: true }).select('_id');
        if (assignments.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'This job requires an assignment, but no approved assignment exists yet. Please create and get it approved first.',
          });
        }

        const assignmentIds = assignments.map(a => a._id);
        const subs = await AssignmentSubmission.find({
          assignmentId: { $in: assignmentIds },
          studentId,
        }).select('assignmentId');

        const submitted = new Set(subs.map(s => String(s.assignmentId)));
        const missing = assignmentIds.filter(id => !submitted.has(String(id)));
        if (missing.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Student must submit all required assignments before you can shortlist/select.',
          });
        }
      }
    }

    // Update status
    application.status = status;
    await application.save();

    // Populate updated application
    await application.populate([
      { path: 'student', select: 'name email' },
      { path: 'job', select: 'title description salary' },
    ]);

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};