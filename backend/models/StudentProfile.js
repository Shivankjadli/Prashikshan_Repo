import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
      maxlength: [100, 'Branch cannot be more than 100 characters'],
    },
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot be more than 10'],
    },
    skills: [{
      type: String,
      trim: true,
      maxlength: [50, 'Each skill cannot be more than 50 characters'],
    }],
    projects: [{
      type: String,
      trim: true,
      maxlength: [200, 'Each project description cannot be more than 200 characters'],
    }],
    certifications: [{
      type: String,
      trim: true,
      maxlength: [100, 'Each certification cannot be more than 100 characters'],
    }],
    resumeUrl: {
      type: String,
      default: null,
    },
    approvedForPlacement: {
      type: Boolean,
      default: false,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'College reference is required'],
    },
  },
  { timestamps: true }
);

// Virtual for profile completion percentage
studentProfileSchema.virtual('completionPercentage').get(function() {
  let completed = 0;
  const totalFields = 5; // branch, cgpa, skills, projects, resume

  if (this.branch) completed++;
  if (this.cgpa !== undefined && this.cgpa !== null) completed++;
  if (this.skills && this.skills.length > 0) completed++;
  if (this.projects && this.projects.length > 0) completed++;
  if (this.resumeUrl) completed++;

  return Math.round((completed / totalFields) * 100);
});

// Ensure virtual fields are serialized
studentProfileSchema.set('toJSON', { virtuals: true });
studentProfileSchema.set('toObject', { virtuals: true });

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);

export default StudentProfile;
