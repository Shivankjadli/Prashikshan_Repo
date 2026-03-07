import mongoose from 'mongoose';

const quizSubmissionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz ID is required'],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    answers: [{
      questionIndex: {
        type: Number,
        required: true,
        min: [0, 'Question index cannot be negative'],
      },
      selectedAnswer: {
        type: String,
        required: [true, 'Selected answer is required'],
        trim: true,
      },
    }],
    score: {
      type: Number,
      required: true,
      min: [0, 'Score cannot be negative'],
    },
    passed: {
      type: Boolean,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate submissions (one student per quiz)
quizSubmissionSchema.index({ quizId: 1, studentId: 1 }, { unique: true });

// Virtual for populating quiz and student details
quizSubmissionSchema.virtual('quiz', {
  ref: 'Quiz',
  localField: 'quizId',
  foreignField: '_id',
  justOne: true,
});

quizSubmissionSchema.virtual('student', {
  ref: 'User',
  localField: 'studentId',
  foreignField: '_id',
  justOne: true,
});

// Enable virtuals in JSON output
quizSubmissionSchema.set('toJSON', { virtuals: true });
quizSubmissionSchema.set('toObject', { virtuals: true });

const QuizSubmission = mongoose.model('QuizSubmission', quizSubmissionSchema);

export default QuizSubmission;