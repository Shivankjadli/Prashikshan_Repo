import Job from '../models/Job.js';
import User from '../models/User.js';

export const createJob = async (req, res) => {
  try {
    const { title, company, description, salary, requiresQuiz, requiresAssignment, targetColleges } = req.body;

    // Validation
    if (!title || !company || !description || !salary) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields including company',
      });
    }

    if (salary < 0) {
      return res.status(400).json({
        success: false,
        message: 'Salary cannot be negative',
      });
    }

    const job = await Job.create({
      title,
      company,
      description,
      salary,
      recruiter: req.user.id,
      requiresQuiz: Boolean(requiresQuiz),
      requiresAssignment: Boolean(requiresAssignment),
      targetColleges: (targetColleges && targetColleges.length > 0) ? targetColleges : (req.user.collegeIds || []),
      approvedByColleges: [], 
      // legacy
      approvedByCollege: false,
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name email')
      .populate('approvedBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getApprovedJobs = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'Student') {
      if (!req.user.collegeId) {
        return res.status(400).json({
          success: false,
          message: 'Student profile is missing college information',
        });
      }
      query = { approvedByColleges: req.user.collegeId };
    } else if (req.user.role === 'College') {
      query = { approvedByColleges: req.user.id };
    } else {
      // Recruiters can see all jobs that have at least one approval
      query = { approvedByColleges: { $not: { $size: 0 } } };
    }

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email')
      .populate('approvedByColleges', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id })
      .populate('recruiter', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllJobsForApproval = async (req, res) => {
  try {
    const jobs = await Job.find({ targetColleges: req.user.id })
      .populate('recruiter', 'name email')
      .populate('approvedByColleges', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (!job.targetColleges.some(cid => cid.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'This job is not targeted to your college',
      });
    }

    const alreadyApproved = job.approvedByColleges.some(cid => cid.toString() === req.user.id);

    if (alreadyApproved) {
      return res.status(400).json({
        success: false,
        message: 'Your college has already approved this job',
      });
    }

    job.approvedByColleges.push(req.user.id);
    job.approvedByCollege = true; // legacy support
    job.approvalDate = new Date();

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job approved successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job rejected and deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if user is the recruiter who created the job
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    // Cannot update if already approved
    if (job.approvedByCollege) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update an approved job',
      });
    }

    const { title, company, description, salary, requiresQuiz, requiresAssignment, targetColleges } = req.body;

    if (title) job.title = title;
    if (company) job.company = company;
    if (description) job.description = description;
    if (salary !== undefined) {
      if (salary < 0) {
        return res.status(400).json({
          success: false,
          message: 'Salary cannot be negative',
        });
      }
      job.salary = salary;
    }

    if (requiresQuiz !== undefined) job.requiresQuiz = Boolean(requiresQuiz);
    if (requiresAssignment !== undefined) job.requiresAssignment = Boolean(requiresAssignment);
    if (targetColleges && Array.isArray(targetColleges)) job.targetColleges = targetColleges;

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
