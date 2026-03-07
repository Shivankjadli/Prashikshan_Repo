import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  maxMarks: {
    type: Number,
    required: true,
    min: 1,
  },
  // Colleges that have approved this assignment
  approvedByColleges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // Legacy support for frontend compatibility
  approvedByCollege: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Virtual for checking if deadline has passed
assignmentSchema.virtual('isExpired').get(function() {
  return new Date() > this.deadline;
});

// Ensure virtual fields are serialized
assignmentSchema.set('toJSON', { virtuals: true });
assignmentSchema.set('toObject', { virtuals: true });

export default mongoose.model('Assignment', assignmentSchema);