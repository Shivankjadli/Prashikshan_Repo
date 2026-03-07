import Quiz from '../models/Quiz.js';
import QuizSubmission from '../models/QuizSubmission.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

// @desc    Create a quiz for a job
// @route   POST /api/quizzes/create/:jobId
// @access  Private (Recruiter only)
export const createQuiz = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.id;
    const { title, duration, passingMarks, totalMarks, questions } = req.body;

    // Validation
    if (!title || !duration || !passingMarks || !totalMarks || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one question is required',
      });
    }

    // Check if job exists and belongs to recruiter
    const job = await Job.findOne({ _id: jobId, recruiter: recruiterId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or you do not have permission to create quiz for this job',
      });
    }

    // Check if quiz already exists for this job
    const existingQuiz = await Quiz.findOne({ jobId });
    if (existingQuiz) {
      return res.status(400).json({
        success: false,
        message: 'A quiz already exists for this job',
      });
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length < 2 || !q.correctAnswer || !q.marks) {
        return res.status(400).json({
          success: false,
          message: `Invalid question ${i + 1}: All fields are required`,
        });
      }

      if (!q.options.includes(q.correctAnswer)) {
        return res.status(400).json({
          success: false,
          message: `Invalid question ${i + 1}: Correct answer must be one of the options`,
        });
      }
    }

    // Create quiz
    const quiz = await Quiz.create({
      jobId,
      recruiterId,
      title,
      duration,
      passingMarks,
      totalMarks,
      questions,
      approvedByCollege: false,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully and submitted for college approval',
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get quiz results for a specific quiz
// @route   GET /api/quizzes/results/:quizId
// @access  Private (Recruiter only)
export const getQuizResults = async (req, res) => {
  try {
    const { quizId } = req.params;
    const recruiterId = req.user.id;

    // Check if quiz exists and belongs to recruiter
    const quiz = await Quiz.findOne({ _id: quizId, recruiterId })
      .populate('job', 'title description salary');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found or you do not have permission to view results',
      });
    }

    // Get all submissions for this quiz
    const submissions = await QuizSubmission.find({ quizId })
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });

    // Calculate statistics
    const totalSubmissions = submissions.length;
    const passedCount = submissions.filter(sub => sub.passed).length;
    const failedCount = totalSubmissions - passedCount;
    const averageScore = totalSubmissions > 0
      ? submissions.reduce((sum, sub) => sum + sub.score, 0) / totalSubmissions
      : 0;

    res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        totalMarks: quiz.totalMarks,
        passingMarks: quiz.passingMarks,
        job: quiz.job,
      },
      statistics: {
        totalSubmissions,
        passedCount,
        failedCount,
        averageScore: Math.round(averageScore * 100) / 100,
      },
      submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve or reject quiz
// @route   PUT /api/quizzes/approve/:quizId
// @access  Private (College only)
export const approveQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { approved } = req.body;
    const collegeId = req.user.id;

    if (typeof approved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Approval status must be true or false',
      });
    }

    const quiz = await Quiz.findById(quizId).populate('jobId');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    // Ensure the college is targeted by the parent job
    if (!quiz.jobId.targetColleges.some(cid => cid.toString() === collegeId)) {
      return res.status(403).json({
        success: false,
        message: 'This quiz belongs to a job not targeted to your college',
      });
    }

    const alreadyApproved = quiz.approvedByColleges.some(cid => cid.toString() === collegeId);

    if (approved && !alreadyApproved) {
      quiz.approvedByColleges.push(collegeId);
      quiz.approvedByCollege = true; // legacy support
    } else if (!approved && alreadyApproved) {
      quiz.approvedByColleges = quiz.approvedByColleges.filter(cid => cid.toString() !== collegeId);
      if (quiz.approvedByColleges.length === 0) quiz.approvedByCollege = false;
    }

    await quiz.save();

    res.status(200).json({
      success: true,
      message: `Quiz ${approved ? 'approved' : 'rejected'} successfully`,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get quizzes for a job (College - for approval)
// @route   GET /api/quizzes/job/:jobId/college
// @access  Private (College only)
export const getJobQuizzesForCollege = async (req, res) => {
  try {
    const { jobId } = req.params;
    const collegeId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job || !job.targetColleges.some(cid => cid.toString() === collegeId)) {
      return res.status(403).json({ success: false, message: 'Not authorized or job not targeted to you' });
    }

    const quizzes = await Quiz.find({ jobId })
      .populate('recruiterId', 'name email')
      .sort({ createdAt: -1 });

    const processed = quizzes.map(q => ({
      ...q.toObject(),
      approvedByCollege: q.approvedByColleges.some(cid => cid.toString() === collegeId),
    }));

    res.status(200).json({
      success: true,
      quizzes: processed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get approved quizzes for a job
// @route   GET /api/quizzes/job/:jobId
// @access  Private (Student only)
export const getJobQuizzes = async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;

    // Check if student has applied for this job
    const application = await Application.findOne({
      jobId,
      studentId,
      status: { $in: ['applied', 'shortlisted', 'selected'] }
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message: 'You must apply for this job before accessing quizzes',
      });
    }

    // Get approved quizzes for this job (approved by THIS student's college)
    const quizzes = await Quiz.find({
      jobId,
      approvedByColleges: req.user.collegeId,
    }).select('title duration totalMarks passingMarks questions approvedByColleges');

    // Check which quizzes the student has already attempted
    const attemptedQuizIds = await QuizSubmission.find({
      studentId,
      quizId: { $in: quizzes.map(q => q._id) }
    }).distinct('quizId');

    // Add attempt status to quizzes
    const quizzesWithStatus = quizzes.map(quiz => ({
      ...quiz.toObject(),
      attempted: attemptedQuizIds.map(String).includes(String(quiz._id)),
      approvedByCollege: true, // We filtered for it
    }));

    res.status(200).json({
      success: true,
      count: quizzesWithStatus.length,
      quizzes: quizzesWithStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/submit/:quizId
// @access  Private (Student only)
export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.id;
    const { answers } = req.body;

    // Validation
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Answers array is required',
      });
    }

    // Check if quiz exists and is approved
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
      });
    }

    if (!quiz.approvedByCollege) {
      return res.status(400).json({
        success: false,
        message: 'This quiz is not approved yet',
      });
    }

    // Check if student has applied for the job
    const application = await Application.findOne({
      jobId: quiz.jobId,
      studentId,
      status: { $in: ['applied', 'shortlisted', 'selected'] }
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message: 'You must apply for this job before attempting the quiz',
      });
    }

    // Check if student has already submitted this quiz
    const existingSubmission = await QuizSubmission.findOne({ quizId, studentId });
    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this quiz',
      });
    }

    // Validate answers format
    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: `You must answer all ${quiz.questions.length} questions`,
      });
    }

    // Auto evaluate answers
    let totalScore = 0;
    const evaluatedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        totalScore += question.marks;
      }

      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        marks: isCorrect ? question.marks : 0,
      };
    });

    const passed = totalScore >= quiz.passingMarks;

    // Create submission
    const submission = await QuizSubmission.create({
      quizId,
      studentId,
      answers: evaluatedAnswers.map(ans => ({
        questionIndex: ans.questionIndex,
        selectedAnswer: ans.selectedAnswer,
      })),
      score: totalScore,
      passed,
    });

    // Populate quiz details for response
    await submission.populate([
      { path: 'quiz', select: 'title totalMarks passingMarks jobId' },
      { path: 'student', select: 'name email' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      result: {
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          totalMarks: quiz.totalMarks,
          passingMarks: quiz.passingMarks,
        },
        score: totalScore,
        passed,
        submittedAt: submission.submittedAt,
        answers: evaluatedAnswers,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this quiz',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get quizzes for a job (Recruiter)
// @route   GET /api/quizzes/job/:jobId/recruiter
// @access  Private (Recruiter only)
export const getJobQuizzesForRecruiter = async (req, res) => {
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
        message: 'Not authorized to view quizzes for this job',
      });
    }

    const quizzes = await Quiz.find({ jobId })
      .populate('jobId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};