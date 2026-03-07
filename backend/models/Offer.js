import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
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
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  package: {
    type: Number,
    required: true,
    min: 0,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  offerLetterUrl: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound unique index to prevent multiple offers per job per student
offerSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

// Virtual for checking if offer is expired (30 days from issuance)
offerSchema.virtual('isExpired').get(function() {
  const thirtyDaysFromIssue = new Date(this.issuedAt);
  thirtyDaysFromIssue.setDate(thirtyDaysFromIssue.getDate() + 30);
  return new Date() > thirtyDaysFromIssue;
});

// Ensure virtual fields are serialized
offerSchema.set('toJSON', { virtuals: true });
offerSchema.set('toObject', { virtuals: true });

export default mongoose.model('Offer', offerSchema);