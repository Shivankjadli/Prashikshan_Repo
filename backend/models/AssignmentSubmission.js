import mongoose from 'mongoose';

const assignmentSubmissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answerText: {
    type: String,
    required: true,
    trim: true,
  },
  fileUrl: {
    type: String,
    trim: true,
  },
  marksAwarded: {
    type: Number,
    default: null,
  },
  reviewed: {
    type: Boolean,
    default: false,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound unique index to prevent multiple submissions per assignment per student
assignmentSubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

// Virtual for checking if reviewed
assignmentSubmissionSchema.virtual('isReviewed').get(function() {
  return this.reviewed;
});

// Ensure virtual fields are serialized
assignmentSubmissionSchema.set('toJSON', { virtuals: true });
assignmentSubmissionSchema.set('toObject', { virtuals: true });

export default mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);