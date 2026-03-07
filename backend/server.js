import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Prashikshan - Academia Industry Interface Backend API',
    version: '6.0.0',
    phase: 'Phase 6: Offer Letter & Placement Analytics System',
    features: [
      'Authentication & Role-based Access Control (JWT)',
      'Job Posting & College Approval',
      'Student Profile Management & Resume Upload',
      'Placement Eligibility Approval',
      'Job Application System & Recruiter Shortlisting',
      'MCQ Quiz Assessment System with Auto Evaluation',
      'Assignment System with Recruiter Review',
      'Offer Letter System (Issue / Accept / Reject)',
      'Single-Placement Policy Enforcement',
      'Placement Analytics – Overview, Branch-wise & Job-wise',
    ],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
