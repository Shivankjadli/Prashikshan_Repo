import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
  },
  options: [{
    type: String,
    required: true,
    trim: true,
  }],
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    trim: true,
  },
  marks: {
    type: Number,
    required: [true, 'Marks for question is required'],
    min: [0, 'Marks cannot be negative'],
  },
});

const quizSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: [200, 'Quiz title cannot be more than 200 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'Quiz duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [180, 'Duration cannot exceed 180 minutes'],
    },
    passingMarks: {
      type: Number,
      required: [true, 'Passing marks is required'],
      min: [0, 'Passing marks cannot be negative'],
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: [1, 'Total marks must be at least 1'],
    },
    // Colleges that have approved this quiz
    approvedByColleges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    // Legacy support flags
    approvedByCollege: {
      type: Boolean,
      default: false,
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

// Validation: Ensure passing marks doesn't exceed total marks
quizSchema.pre('save', function(next) {
  if (this.passingMarks > this.totalMarks) {
    return next(new Error('Passing marks cannot exceed total marks'));
  }
  next();
});

// Virtual for populating job and recruiter details
quizSchema.virtual('job', {
  ref: 'Job',
  localField: 'jobId',
  foreignField: '_id',
  justOne: true,
});

quizSchema.virtual('recruiter', {
  ref: 'User',
  localField: 'recruiterId',
  foreignField: '_id',
  justOne: true,
});

// Enable virtuals in JSON output
quizSchema.set('toJSON', { virtuals: true });
quizSchema.set('toObject', { virtuals: true });

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;