import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'selected'],
      default: 'applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications (one student per job)
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

// Virtual for populating job and student details
applicationSchema.virtual('job', {
  ref: 'Job',
  localField: 'jobId',
  foreignField: '_id',
  justOne: true,
});

applicationSchema.virtual('student', {
  ref: 'User',
  localField: 'studentId',
  foreignField: '_id',
  justOne: true,
});

// Enable virtuals in JSON output
applicationSchema.set('toJSON', { virtuals: true });
applicationSchema.set('toObject', { virtuals: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;