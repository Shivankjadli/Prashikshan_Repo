import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      maxlength: [200, 'Job title cannot be more than 200 characters'],
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
      maxlength: [100, 'Company name cannot be more than 100 characters'],
      default: 'Unknown Company' // For backward compatibility with existing jobs
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
      maxlength: [5000, 'Job description cannot be more than 5000 characters'],
    },
    salary: {
      type: Number,
      required: [true, 'Please provide a salary'],
      min: [0, 'Salary cannot be negative'],
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requiresQuiz: {
      type: Boolean,
      default: false,
    },
    requiresAssignment: {
      type: Boolean,
      default: false,
    },
    // Colleges this job is specifically targeted to (inherited from Recruiter's selection)
    targetColleges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    // Colleges that have approved this job
    approvedByColleges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    // Legacy support flags for frontend compatibility (optional but preserves existing code structure)
    approvedByCollege: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    approvalDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
