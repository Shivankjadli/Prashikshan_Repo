# Prashikshan - Academia Industry Interface Backend

A Node.js + Express.js + MongoDB backend system for managing job postings and student profiles with role-based access control for Students, Recruiters, and Colleges.

## Features

### Phase 1 Implementation ✅

✅ **Authentication System**
- User registration with name, email, password, and role
- Login functionality with JWT token generation
- Password hashing using bcryptjs
- Secure password comparison

✅ **Role-Based Access Control (RBAC)**
- Three roles: Student, Recruiter, College
- JWT middleware for authentication
- Role-based authorization middleware
- Protected routes based on user roles

✅ **Job Management**
- Recruiters can create, view, and update jobs
- Colleges can view all jobs and approve/reject them
- Students can view only approved jobs
- Job approval workflow (approvedByCollege field)
- Proper schema design with Mongoose

### Phase 2 Implementation ✅

✅ **Student Profile System**
- Student profile creation and management
- Profile fields: branch, CGPA, skills, projects, certifications
- One-to-one relationship with User model
- Profile completion percentage calculation

✅ **Resume Upload System**
- File upload using multer middleware
- PDF file validation and size limits (5MB)
- Secure file storage in uploads/ directory
- Resume URL storage in profile

✅ **Placement Eligibility**
- College approval for student placement
- Minimum 80% profile completion requirement
- Approval status tracking
- Bulk student management for colleges

✅ **Enhanced Security**
- File upload validation and error handling
- Static file serving for uploaded resumes
- Protected profile management routes
- Role-based access to student data

✅ **Production-Level Practices**
- ES Module syntax (import/export)
- Async/await for asynchronous operations
- Proper HTTP status codes
- Comprehensive error handling
- Clean MVC architecture
- Environment variables via dotenv
- CORS support
- File upload middleware

### Phase 3 Implementation ✅

✅ **Job Application System**
- Complete job application lifecycle management
- Application status tracking (applied, shortlisted, rejected, selected)
- Duplicate application prevention
- Eligibility validation before application

✅ **Student Application Features**
- Apply for college-approved jobs only
- Placement eligibility verification
- View personal application history with status
- Real-time application status updates

✅ **Recruiter Application Management**
- View all applicants for owned jobs
- Update application status (shortlist, reject, select)
- Application filtering and sorting
- Secure access to own job applications only

✅ **Business Logic Validation**
- Job approval requirement before application
- Student placement approval requirement
- Unique application constraint (one per student per job)
- Proper error messages and status codes

✅ **Enhanced Data Relationships**
- Application model with job and student references
- Virtual population for efficient data loading
- Optimized database queries with proper indexing
- Comprehensive data validation

### Phase 4 Implementation ✅

✅ **MCQ Quiz Assessment System**
- Complete quiz lifecycle management with college approval
- Auto evaluation and scoring system
- One-time attempt per student per quiz
- Comprehensive question validation

✅ **Recruiter Quiz Management**
- Create detailed MCQ quizzes for job positions
- Submit quizzes for college approval workflow
- View comprehensive quiz results and statistics
- Track student performance and pass rates

✅ **College Quiz Oversight**
- Approve or reject quiz assessments
- Ensure quiz quality and relevance
- Control quiz availability to students
- Maintain assessment standards

✅ **Student Quiz Experience**
- Access approved quizzes for applied jobs only
- Single attempt with time constraints
- Immediate scoring and pass/fail feedback
- Detailed answer review after submission

✅ **Auto Evaluation Engine**
- Real-time answer validation against correct answers
- Automatic score calculation and percentage computation
- Pass/fail determination based on passing marks
- Secure result storage and retrieval

✅ **Business Logic & Security**
- Application prerequisite for quiz access
- College approval requirement for quiz visibility
- Duplicate submission prevention
- Role-based access control for all operations

### Phase 5 Implementation ✅

✅ **Assignment Assessment System**
- Complete assignment lifecycle with college approval
- File upload support for document submissions
- Manual evaluation and marking system
- One-time submission per student per assignment

✅ **Recruiter Assignment Management**
- Create detailed assignments for job positions
- Submit assignments for college approval workflow
- View all submissions with student details
- Review and assign marks to submissions
- Track student performance and marks

✅ **College Assignment Oversight**
- Approve or reject assignment assessments
- Ensure assignment quality and relevance
- Control assignment availability to students
- Maintain assessment standards

✅ **Student Assignment Experience**
- Access approved assignments for applied jobs only
- Submit text answers with optional file attachments
- Single submission with deadline enforcement
- View marks after recruiter review

✅ **File Upload System**
- Support for PDF, DOC, DOCX, and TXT files
- Secure file storage with 10MB size limit
- File URL storage and serving
- Upload validation and error handling

✅ **Business Logic & Security**
- Application prerequisite for assignment access
- College approval requirement for assignment visibility
- Deadline enforcement and validation
- Duplicate submission prevention
- Role-based access control for all operations

### Phase 6 Implementation ✅

✅ **Offer Letter System**
- Complete offer lifecycle management with PDF upload
- Student offer acceptance/rejection workflow
- One offer per job per student constraint
- Recruiter offer issuance for selected candidates

✅ **Placement Analytics System**
- Comprehensive placement statistics and metrics
- Branch-wise placement analysis
- Job-specific analytics for recruiters
- College overview dashboard with KPIs

✅ **Recruiter Offer Management**
- Issue offers to selected candidates only
- Upload official offer letters (PDF)
- Track offer status and responses
- View all issued offers with details

✅ **Student Offer Experience**
- View all received offers with details
- Accept or reject offers with confirmation
- Download offer letters securely
- Track offer response history

✅ **College Analytics Dashboard**
- Overall placement statistics and percentages
- Branch-wise performance metrics
- Average and highest package tracking
- Comprehensive placement insights

✅ **Business Logic & Security**
- Offer issuance restricted to selected applications
- Single offer per job-student combination
- Role-based analytics access control
- Secure offer letter file management

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User schema (Student, Recruiter, College)
│   ├── Job.js               # Job schema with approval workflow
│   ├── StudentProfile.js    # Student profile schema with completion tracking
│   ├── Application.js       # Job application schema with status tracking
│   ├── Quiz.js              # MCQ quiz schema with questions and approval
│   ├── QuizSubmission.js    # Quiz submission schema with auto evaluation
│   ├── Assignment.js        # Assignment schema with approval workflow
│   ├── AssignmentSubmission.js # Assignment submission schema with manual evaluation
│   └── Offer.js             # Offer letter schema with status tracking
├── controllers/
│   ├── authController.js    # Auth logic (register, login, getMe)
│   ├── jobController.js     # Job management logic
│   ├── studentController.js # Student profile & resume management
│   ├── collegeController.js # College student approval management
│   ├── applicationController.js # Job application management logic
│   ├── quizController.js    # MCQ quiz assessment management logic
│   ├── assignmentController.js # Assignment assessment management logic
│   ├── offerController.js   # Offer letter management logic
│   └── analyticsController.js # Placement analytics logic
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   ├── jobRoutes.js         # Job management endpoints
│   ├── studentRoutes.js     # Student profile endpoints
│   ├── collegeRoutes.js     # College management endpoints
│   ├── applicationRoutes.js # Job application endpoints
│   ├── quizRoutes.js        # MCQ quiz assessment endpoints
│   ├── assignmentRoutes.js  # Assignment assessment endpoints
│   ├── offerRoutes.js       # Offer letter endpoints
│   └── analyticsRoutes.js   # Analytics endpoints
├── middleware/
│   ├── auth.js              # JWT & role-based auth middleware
│   └── uploadMiddleware.js  # Multer file upload middleware
├── uploads/                 # Resume, assignment, and offer letter storage
├── server.js                # Express app setup & startup
├── package.json             # Dependencies & scripts
├── .env                      # Environment variables
└── .gitignore               # Git ignore rules
```

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User schema (Student, Recruiter, College)
│   ├── Job.js               # Job schema with approval workflow
│   ├── StudentProfile.js    # Student profile schema with completion tracking
│   ├── Application.js       # Job application schema with status tracking
│   ├── Quiz.js              # MCQ quiz schema with questions and approval
│   └── QuizSubmission.js    # Quiz submission schema with auto evaluation
├── controllers/
│   ├── authController.js    # Auth logic (register, login, getMe)
│   ├── jobController.js     # Job management logic
│   ├── studentController.js # Student profile & resume management
│   ├── collegeController.js # College student approval management
│   ├── applicationController.js # Job application management logic
│   └── quizController.js    # MCQ quiz assessment management logic
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   ├── jobRoutes.js         # Job management endpoints
│   ├── studentRoutes.js     # Student profile endpoints
│   ├── collegeRoutes.js     # College management endpoints
│   ├── applicationRoutes.js # Job application endpoints
│   └── quizRoutes.js        # MCQ quiz assessment endpoints
├── middleware/
│   ├── auth.js              # JWT & role-based auth middleware
│   └── uploadMiddleware.js  # Multer file upload middleware
├── uploads/                 # Resume file storage directory
├── server.js                # Express app setup & startup
├── package.json             # Dependencies & scripts
├── .env                      # Environment variables
└── .gitignore               # Git ignore rules
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Update `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prashikshan
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prashikshan?retryWrites=true&w=majority
```

### Step 3: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Student"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

**Valid Roles:** `Student`, `Recruiter`, `College`

---

### 2. Login User

**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

---

### 3. Get Current User Profile

**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Job Management Endpoints

### 1. Get All Approved Jobs (Public - No Auth Required)

**GET** `/jobs/approved`

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Software Engineer",
      "description": "We are looking for...",
      "salary": 80000,
      "recruiter": {
        "_id": "507f1f77bcf86cd799439001",
        "name": "Acme Corp",
        "email": "recruiter@acme.com"
      },
      "approvedByCollege": true,
      "approvedBy": {
        "_id": "507f1f77bcf86cd799439002",
        "name": "College Admin",
        "email": "admin@college.edu"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "approvalDate": "2024-01-16T14:20:00Z"
    }
  ]
}
```

---

### 2. Create Job (Recruiter Only)

**POST** `/jobs`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "title": "Senior Developer",
  "description": "Looking for experienced developer with 5+ years experience",
  "salary": 120000
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "job": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Senior Developer",
    "description": "Looking for experienced developer with 5+ years experience",
    "salary": 120000,
    "recruiter": "507f1f77bcf86cd799439001",
    "approvedByCollege": false,
    "approvedBy": null,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Required Roles:** `Recruiter`

---

### 3. Get Recruiter's Jobs

**GET** `/jobs/recruiter/my-jobs`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "jobs": [...]
}
```

**Required Roles:** `Recruiter`

---

### 4. Update Job (Recruiter Only)

**PUT** `/jobs/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "title": "Senior Developer (Updated)",
  "description": "Updated description",
  "salary": 130000
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "job": {...}
}
```

**Notes:**
- Only the recruiter who created the job can update it
- Cannot update an already approved job

---

### 5. Get Job Details

**GET** `/jobs/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "job": {...}
}
```

---

### 6. Get All Jobs for Approval (College Only)

**GET** `/jobs/approval/all-jobs`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "jobs": [...]
}
```

**Required Roles:** `College`

---

### 7. Approve Job (College Only)

**PUT** `/jobs/approval/approve/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Job approved successfully",
  "job": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Senior Developer",
    "description": "Looking for experienced developer",
    "salary": 120000,
    "recruiter": {...},
    "approvedByCollege": true,
    "approvedBy": "507f1f77bcf86cd799439002",
    "approvalDate": "2024-01-16T14:20:00Z",
    ...
  }
}
```

**Required Roles:** `College`

---

### 8. Reject Job (College Only)

**DELETE** `/jobs/approval/reject/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Job rejected and deleted successfully"
}
```

**Required Roles:** `College`

---

## Student Profile Endpoints

### 1. Create/Update Student Profile

**POST** `/student/profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "branch": "Computer Science",
  "cgpa": 8.5,
  "skills": ["JavaScript", "React", "Node.js"],
  "projects": ["E-commerce Website", "Task Management App"],
  "certifications": ["AWS Certified Developer", "MongoDB Certified"]
}
```

**Response (201 - Create / 200 - Update):**
```json
{
  "success": true,
  "message": "Profile created/updated successfully",
  "profile": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "branch": "Computer Science",
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js"],
    "projects": ["E-commerce Website", "Task Management App"],
    "certifications": ["AWS Certified Developer", "MongoDB Certified"],
    "resumeUrl": null,
    "approvedForPlacement": false,
    "completionPercentage": 80,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Required Roles:** `Student`

---

### 2. Get Student Profile

**GET** `/student/profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "profile": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "branch": "Computer Science",
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js"],
    "projects": ["E-commerce Website", "Task Management App"],
    "certifications": ["AWS Certified Developer", "MongoDB Certified"],
    "resumeUrl": "/uploads/507f1f77bcf86cd799439011_1234567890_resume.pdf",
    "approvedForPlacement": false,
    "completionPercentage": 100,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Required Roles:** `Student`

---

### 3. Upload Resume

**POST** `/student/upload-resume`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
resume: [PDF file]
```

**Response (200):**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "resumeUrl": "/uploads/507f1f77bcf86cd799439011_1234567890_resume.pdf",
  "profile": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "branch": "Computer Science",
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js"],
    "projects": ["E-commerce Website", "Task Management App"],
    "certifications": ["AWS Certified Developer", "MongoDB Certified"],
    "resumeUrl": "/uploads/507f1f77bcf86cd799439011_1234567890_resume.pdf",
    "approvedForPlacement": false,
    "completionPercentage": 100,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Required Roles:** `Student`
**File Requirements:** PDF only, max 5MB

---

### 4. Get Profile Completion Progress

**GET** `/student/profile-completion`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "completionPercentage": 80,
  "completedFields": {
    "branch": true,
    "cgpa": true,
    "skills": true,
    "projects": true,
    "resume": false
  },
  "profile": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "branch": "Computer Science",
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js"],
    "projects": ["E-commerce Website", "Task Management App"],
    "certifications": ["AWS Certified Developer", "MongoDB Certified"],
    "resumeUrl": null,
    "approvedForPlacement": false,
    "completionPercentage": 80,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Required Roles:** `Student`

---

### 5. Delete Resume

**DELETE** `/student/delete-resume`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

**Required Roles:** `Student`

---

## College Management Endpoints

### 1. Get All Students

**GET** `/college/students`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "students": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Student",
        "email": "john@example.com"
      },
      "branch": "Computer Science",
      "cgpa": 8.5,
      "skills": ["JavaScript", "React", "Node.js"],
      "projects": ["E-commerce Website"],
      "certifications": ["AWS Certified"],
      "resumeUrl": "/uploads/507f1f77bcf86cd799439011_1234567890_resume.pdf",
      "approvedForPlacement": false,
      "completionPercentage": 100,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Required Roles:** `College`

---

### 2. Get Student by ID

**GET** `/college/students/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "profile": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Student",
      "email": "john@example.com"
    },
    "branch": "Computer Science",
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js"],
    "projects": ["E-commerce Website"],
    "certifications": ["AWS Certified"],
    "resumeUrl": "/uploads/507f1f77bcf86cd799439011_1234567890_resume.pdf",
    "approvedForPlacement": false,
    "completionPercentage": 100,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Required Roles:** `College`

---

### 3. Approve Student for Placement

**PUT** `/college/approve-student/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Student approved for placement successfully",
  "profile": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Student",
      "email": "john@example.com"
    },
    "branch": "Computer Science",
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js"],
    "projects": ["E-commerce Website"],
    "certifications": ["AWS Certified"],
    "resumeUrl": "/uploads/507f1f77bcf86cd799439011_1234567890_resume.pdf",
    "approvedForPlacement": true,
    "completionPercentage": 100,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-16T14:20:00Z"
  }
}
```

**Required Roles:** `College`
**Requirements:** Profile must be at least 80% complete

---

### 4. Revoke Student Approval

**PUT** `/college/revoke-approval/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Student placement approval revoked successfully",
  "profile": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Student",
      "email": "john@example.com"
    },
    "branch": "Computer Science",
    "cgpa": 8.5,
    "skills": ["JavaScript", "React", "Node.js"],
    "projects": ["E-commerce Website"],
    "certifications": ["AWS Certified"],
    "resumeUrl": "/uploads/507f1f77bcf86cd799439011_1234567890_resume.pdf",
    "approvedForPlacement": false,
    "completionPercentage": 100,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-16T14:25:00Z"
  }
}
```

**Required Roles:** `College`

---

### 5. Get Approved Students

**GET** `/college/approved-students`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "students": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Student",
        "email": "john@example.com"
      },
      "branch": "Computer Science",
      "cgpa": 8.5,
      "approvedForPlacement": true,
      "completionPercentage": 100,
      "updatedAt": "2024-01-16T14:20:00Z"
    }
  ]
}
```

**Required Roles:** `College`

---

### 6. Get Students Pending Approval

**GET** `/college/pending-approval`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "students": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Student",
        "email": "jane@example.com"
      },
      "branch": "Information Technology",
      "cgpa": 9.0,
      "approvedForPlacement": false,
      "completionPercentage": 100,
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

**Required Roles:** `College`
**Filter:** Students with ≥80% completion, not yet approved

---

## Job Application Endpoints

### 1. Apply for Job

**POST** `/applications/apply/:jobId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (201):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "application": {
    "_id": "507f1f77bcf86cd799439015",
    "jobId": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Full Stack Developer",
      "description": "We need a skilled developer",
      "salary": 100000,
      "recruiter": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Tech Corp",
        "email": "hr@techcorp.com"
      }
    },
    "studentId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Student",
      "email": "john@student.edu"
    },
    "status": "applied",
    "appliedAt": "2024-01-16T10:30:00Z",
    "createdAt": "2024-01-16T10:30:00Z",
    "updatedAt": "2024-01-16T10:30:00Z"
  }
}
```

**Required Roles:** `Student`
**Requirements:** Job must be approved, student must be approved for placement

---

### 2. Get My Applications

**GET** `/applications/my-applications`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "applications": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "jobId": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Full Stack Developer",
        "description": "We need a skilled developer",
        "salary": 100000,
        "recruiter": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Tech Corp",
          "email": "hr@techcorp.com"
        },
        "approvedByCollege": true
      },
      "status": "shortlisted",
      "appliedAt": "2024-01-16T10:30:00Z",
      "createdAt": "2024-01-16T10:30:00Z",
      "updatedAt": "2024-01-16T10:35:00Z"
    }
  ]
}
```

**Required Roles:** `Student`

---

### 3. Get Job Applications (Recruiter)

**GET** `/applications/job/:jobId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "applications": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "jobId": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Full Stack Developer",
        "description": "We need a skilled developer",
        "salary": 100000
      },
      "studentId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Student",
        "email": "john@student.edu"
      },
      "status": "applied",
      "appliedAt": "2024-01-16T10:30:00Z",
      "createdAt": "2024-01-16T10:30:00Z",
      "updatedAt": "2024-01-16T10:30:00Z"
    }
  ]
}
```

**Required Roles:** `Recruiter`
**Permission:** Only applications for jobs owned by the recruiter

---

### 4. Update Application Status

**PUT** `/applications/update-status/:applicationId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "shortlisted"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Application status updated to shortlisted",
  "application": {
    "_id": "507f1f77bcf86cd799439015",
    "jobId": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Full Stack Developer",
      "description": "We need a skilled developer",
      "salary": 100000
    },
    "studentId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Student",
      "email": "john@student.edu"
    },
    "status": "shortlisted",
    "appliedAt": "2024-01-16T10:30:00Z",
    "createdAt": "2024-01-16T10:30:00Z",
    "updatedAt": "2024-01-16T10:35:00Z"
  }
}
```

**Required Roles:** `Recruiter`
**Valid Status Values:** `applied`, `shortlisted`, `rejected`, `selected`
**Permission:** Only applications for jobs owned by the recruiter

---

## MCQ Quiz Assessment Endpoints

### 1. Create Quiz

**POST** `/quizzes/create/:jobId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Technical Assessment Quiz",
  "duration": 60,
  "passingMarks": 35,
  "totalMarks": 50,
  "questions": [
    {
      "question": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "correctAnswer": "Paris",
      "marks": 5
    },
    {
      "question": "Which programming language is used for web development?",
      "options": ["Python", "JavaScript", "C++", "Java"],
      "correctAnswer": "JavaScript",
      "marks": 10
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Quiz created successfully and submitted for college approval",
  "quiz": {
    "_id": "507f1f77bcf86cd799439016",
    "jobId": "507f1f77bcf86cd799439013",
    "recruiterId": "507f1f77bcf86cd799439011",
    "title": "Technical Assessment Quiz",
    "duration": 60,
    "passingMarks": 35,
    "totalMarks": 50,
    "approvedByCollege": false,
    "questions": [
      {
        "question": "What is the capital of France?",
        "options": ["London", "Berlin", "Paris", "Madrid"],
        "correctAnswer": "Paris",
        "marks": 5,
        "_id": "507f1f77bcf86cd799439017"
      }
    ],
    "createdAt": "2024-01-17T10:00:00Z",
    "updatedAt": "2024-01-17T10:00:00Z"
  }
}
```

**Required Roles:** `Recruiter`
**Requirements:** Job must exist and belong to recruiter, no existing quiz for job

---

### 2. Get Quiz Results

**GET** `/quizzes/results/:quizId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "quiz": {
    "_id": "507f1f77bcf86cd799439016",
    "title": "Technical Assessment Quiz",
    "totalMarks": 50,
    "passingMarks": 35,
    "job": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Full Stack Developer",
      "description": "We need a skilled developer",
      "salary": 100000
    }
  },
  "statistics": {
    "totalSubmissions": 3,
    "passedCount": 2,
    "failedCount": 1,
    "averageScore": 38.33
  },
  "submissions": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "studentId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Student",
        "email": "john@student.edu"
      },
      "score": 45,
      "passed": true,
      "submittedAt": "2024-01-17T11:30:00Z"
    }
  ]
}
```

**Required Roles:** `Recruiter`
**Permission:** Only quiz results for recruiter's own quizzes

---

### 3. Approve/Reject Quiz

**PUT** `/quizzes/approve/:quizId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "approved": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Quiz approved successfully",
  "quiz": {
    "_id": "507f1f77bcf86cd799439016",
    "jobId": "507f1f77bcf86cd799439013",
    "recruiterId": "507f1f77bcf86cd799439011",
    "title": "Technical Assessment Quiz",
    "duration": 60,
    "passingMarks": 35,
    "totalMarks": 50,
    "approvedByCollege": true,
    "approvedBy": "507f1f77bcf86cd799439010",
    "questions": [...],
    "createdAt": "2024-01-17T10:00:00Z",
    "updatedAt": "2024-01-17T12:00:00Z"
  }
}
```

**Required Roles:** `College`

---

### 4. Get Job Quizzes

**GET** `/quizzes/job/:jobId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "quizzes": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "title": "Technical Assessment Quiz",
      "duration": 60,
      "totalMarks": 50,
      "passingMarks": 35,
      "questions": [
        {
          "question": "What is the capital of France?",
          "options": ["London", "Berlin", "Paris", "Madrid"],
          "correctAnswer": "Paris",
          "marks": 5
        }
      ],
      "attempted": false
    }
  ]
}
```

**Required Roles:** `Student`
**Requirements:** Student must have applied for the job

---

### 5. Submit Quiz

**POST** `/quizzes/submit/:quizId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "answers": [
    {
      "questionIndex": 0,
      "selectedAnswer": "Paris"
    },
    {
      "questionIndex": 1,
      "selectedAnswer": "JavaScript"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "result": {
    "quiz": {
      "_id": "507f1f77bcf86cd799439016",
      "title": "Technical Assessment Quiz",
      "totalMarks": 50,
      "passingMarks": 35
    },
    "score": 45,
    "passed": true,
    "submittedAt": "2024-01-17T11:30:00Z",
    "answers": [
      {
        "questionIndex": 0,
        "selectedAnswer": "Paris",
        "correctAnswer": "Paris",
        "isCorrect": true,
        "marks": 5
      },
      {
        "questionIndex": 1,
        "selectedAnswer": "JavaScript",
        "correctAnswer": "JavaScript",
        "isCorrect": true,
        "marks": 10
      }
    ]
  }
}
```

**Required Roles:** `Student`
**Requirements:** Must have applied for job, quiz must be approved, first attempt only

---

## Assignment Assessment Endpoints

### 1. Create Assignment (Recruiter)

**POST** `/assignments/create/:jobId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "subject": "System Design Assignment",
  "description": "Design a scalable e-commerce system architecture",
  "deadline": "2024-02-15T23:59:59Z",
  "maxMarks": 100
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Assignment created successfully. Pending college approval.",
  "assignment": {
    "_id": "507f1f77bcf86cd799439020",
    "jobId": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Senior Software Engineer"
    },
    "recruiterId": "507f1f77bcf86cd799439011",
    "subject": "System Design Assignment",
    "description": "Design a scalable e-commerce system architecture",
    "deadline": "2024-02-15T23:59:59.000Z",
    "maxMarks": 100,
    "approvedByCollege": false,
    "createdAt": "2024-01-18T10:00:00Z",
    "updatedAt": "2024-01-18T10:00:00Z"
  }
}
```

**Required Roles:** `Recruiter`
**Requirements:** Job must exist and belong to recruiter

---

### 2. Approve Assignment (College)

**PUT** `/assignments/approve/:assignmentId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "approved": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Assignment approved successfully",
  "assignment": {
    "_id": "507f1f77bcf86cd799439020",
    "jobId": "507f1f77bcf86cd799439013",
    "recruiterId": "507f1f77bcf86cd799439011",
    "subject": "System Design Assignment",
    "description": "Design a scalable e-commerce system architecture",
    "deadline": "2024-02-15T23:59:59.000Z",
    "maxMarks": 100,
    "approvedByCollege": true,
    "createdAt": "2024-01-18T10:00:00Z",
    "updatedAt": "2024-01-18T10:05:00Z"
  }
}
```

**Required Roles:** `College`

---

### 3. Get Job Assignments (Student)

**GET** `/assignments/job/:jobId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "assignments": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "jobId": "507f1f77bcf86cd799439013",
      "recruiterId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Tech Corp HR",
        "email": "hr@techcorp.com"
      },
      "subject": "System Design Assignment",
      "description": "Design a scalable e-commerce system architecture",
      "deadline": "2024-02-15T23:59:59.000Z",
      "maxMarks": 100,
      "approvedByCollege": true,
      "createdAt": "2024-01-18T10:00:00Z",
      "updatedAt": "2024-01-18T10:05:00Z"
    }
  ]
}
```

**Required Roles:** `Student`
**Requirements:** Student must have applied for the job

---

### 4. Submit Assignment (Student)

**POST** `/assignments/submit/:assignmentId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
answerText: "Detailed system design document..."
file: [assignment_document.pdf] (optional)
```

**Response (201):**
```json
{
  "success": true,
  "message": "Assignment submitted successfully",
  "submission": {
    "_id": "507f1f77bcf86cd799439021",
    "assignmentId": {
      "_id": "507f1f77bcf86cd799439020",
      "subject": "System Design Assignment",
      "deadline": "2024-02-15T23:59:59.000Z",
      "maxMarks": 100
    },
    "studentId": "507f1f77bcf86cd799439012",
    "answerText": "Detailed system design document...",
    "fileUrl": "/uploads/507f1f77bcf86cd799439012_1234567890_assignment.pdf",
    "marksAwarded": null,
    "reviewed": false,
    "submittedAt": "2024-01-18T14:30:00Z",
    "createdAt": "2024-01-18T14:30:00Z",
    "updatedAt": "2024-01-18T14:30:00Z"
  }
}
```

**Required Roles:** `Student`
**Requirements:** Must have applied for job, assignment must be approved, before deadline, first submission only
**File Types:** PDF, DOC, DOCX, TXT (max 10MB)

---

### 5. Get Assignment Submissions (Recruiter)

**GET** `/assignments/submissions/:assignmentId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "submissions": [
    {
      "_id": "507f1f77bcf86cd799439021",
      "assignmentId": "507f1f77bcf86cd799439020",
      "studentId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Student",
        "email": "john@student.edu"
      },
      "answerText": "Detailed system design document...",
      "fileUrl": "/uploads/507f1f77bcf86cd799439012_1234567890_assignment.pdf",
      "marksAwarded": null,
      "reviewed": false,
      "submittedAt": "2024-01-18T14:30:00Z",
      "createdAt": "2024-01-18T14:30:00Z",
      "updatedAt": "2024-01-18T14:30:00Z"
    }
  ],
  "totalSubmissions": 1
}
```

**Required Roles:** `Recruiter`
**Requirements:** Assignment must belong to recruiter

---

### 6. Review Submission (Recruiter)

**PUT** `/assignments/review/:submissionId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "marksAwarded": 85
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Submission reviewed successfully",
  "submission": {
    "_id": "507f1f77bcf86cd799439021",
    "assignmentId": "507f1f77bcf86cd799439020",
    "studentId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Student",
      "email": "john@student.edu"
    },
    "answerText": "Detailed system design document...",
    "fileUrl": "/uploads/507f1f77bcf86cd799439012_1234567890_assignment.pdf",
    "marksAwarded": 85,
    "reviewed": true,
    "submittedAt": "2024-01-18T14:30:00Z",
    "createdAt": "2024-01-18T14:30:00Z",
    "updatedAt": "2024-01-18T15:00:00Z"
  }
}
```

**Required Roles:** `Recruiter`
**Requirements:** Submission must belong to recruiter's assignment, marks ≤ max marks

---

## Offer Letter Endpoints

### 1. Create Offer (Recruiter)

**POST** `/offers/create/:applicationId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
package: 75000
joiningDate: "2024-07-01T00:00:00Z"
offerLetter: [official_offer.pdf]
```

**Response (201):**
```json
{
  "success": true,
  "message": "Offer created successfully",
  "offer": {
    "_id": "507f1f77bcf86cd799439022",
    "jobId": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Software Engineer"
    },
    "recruiterId": "507f1f77bcf86cd799439011",
    "studentId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Student",
      "email": "john@student.edu"
    },
    "package": 75000,
    "joiningDate": "2024-07-01T00:00:00.000Z",
    "offerLetterUrl": "/uploads/507f1f77bcf86cd799439011_1234567890_offer.pdf",
    "status": "pending",
    "issuedAt": "2024-01-20T10:00:00Z",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

**Required Roles:** `Recruiter`
**Requirements:** Application must be 'selected', PDF offer letter required

---

### 2. Get Recruiter Offers

**GET** `/offers/recruiter`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "offers": [
    {
      "_id": "507f1f77bcf86cd799439022",
      "jobId": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Software Engineer",
        "company": "Tech Corp"
      },
      "studentId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Student",
        "email": "john@student.edu"
      },
      "package": 75000,
      "joiningDate": "2024-07-01T00:00:00.000Z",
      "status": "pending",
      "issuedAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

**Required Roles:** `Recruiter`

---

### 3. Get My Offers (Student)

**GET** `/offers/my-offers`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 1,
  "offers": [
    {
      "_id": "507f1f77bcf86cd799439022",
      "jobId": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Software Engineer",
        "company": "Tech Corp",
        "salary": 70000
      },
      "recruiterId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "HR Manager",
        "email": "hr@techcorp.com"
      },
      "package": 75000,
      "joiningDate": "2024-07-01T00:00:00.000Z",
      "offerLetterUrl": "/uploads/507f1f77bcf86cd799439011_1234567890_offer.pdf",
      "status": "pending",
      "issuedAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

**Required Roles:** `Student`

---

### 4. Respond to Offer (Student)

**PUT** `/offers/respond/:offerId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "response": "accepted"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Offer accepted successfully",
  "offer": {
    "_id": "507f1f77bcf86cd799439022",
    "jobId": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Software Engineer"
    },
    "recruiterId": "507f1f77bcf86cd799439011",
    "studentId": "507f1f77bcf86cd799439012",
    "package": 75000,
    "joiningDate": "2024-07-01T00:00:00.000Z",
    "status": "accepted",
    "issuedAt": "2024-01-20T10:00:00Z",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:05:00Z"
  }
}
```

**Required Roles:** `Student`
**Valid Responses:** `accepted`, `rejected`

---

## Analytics Endpoints

### 1. Get Overview Analytics (College)

**GET** `/analytics/overview`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "totalStudents": 150,
    "eligibleStudents": 120,
    "totalJobs": 25,
    "approvedJobs": 20,
    "totalApplications": 300,
    "selectedStudents": 45,
    "totalOffers": 42,
    "acceptedOffers": 38,
    "placementPercentage": 37.5,
    "averagePackage": 65000,
    "highestPackage": 120000
  }
}
```

**Required Roles:** `College`

---

### 2. Get Branch-wise Analytics (College)

**GET** `/analytics/branch-wise`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "branchStats": [
    {
      "branch": "Computer Science",
      "totalStudents": 60,
      "eligibleStudents": 50,
      "placedStudents": 25,
      "offersReceived": 28,
      "offersAccepted": 24,
      "placementPercentage": 50.0,
      "averagePackage": 70000,
      "highestPackage": 120000
    },
    {
      "branch": "Information Technology",
      "totalStudents": 45,
      "eligibleStudents": 38,
      "placedStudents": 15,
      "offersReceived": 16,
      "offersAccepted": 14,
      "placementPercentage": 39.47,
      "averagePackage": 60000,
      "highestPackage": 95000
    }
  ]
}
```

**Required Roles:** `College`

---

### 3. Get Job Analytics (Recruiter)

**GET** `/analytics/job/:jobId`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "job": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Software Engineer",
    "company": "Tech Corp"
  },
  "analytics": {
    "totalApplications": 45,
    "shortlisted": 15,
    "selected": 8,
    "rejected": 22,
    "totalOffers": 7,
    "pendingOffers": 2,
    "acceptedOffers": 5,
    "rejectedOffers": 0,
    "averagePackage": 72000,
    "highestPackage": 85000
  },
  "applications": [
    {
      "id": "507f1f77bcf86cd799439015",
      "student": {
        "id": "507f1f77bcf86cd799439012",
        "name": "John Student",
        "email": "john@student.edu"
      },
      "status": "selected",
      "appliedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "offers": [
    {
      "id": "507f1f77bcf86cd799439022",
      "student": {
        "id": "507f1f77bcf86cd799439012",
        "name": "John Student",
        "email": "john@student.edu"
      },
      "package": 75000,
      "joiningDate": "2024-07-01T00:00:00.000Z",
      "status": "accepted",
      "issuedAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

**Required Roles:** `Recruiter`
**Requirements:** Job must belong to recruiter

---

## Database Schema

### User Schema

```javascript
{
  name: String (required, max 100 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['Student', 'Recruiter', 'College'], required),
  createdAt: Date,
  updatedAt: Date
}
```

### Job Schema

```javascript
{
  title: String (required, max 200 chars),
  description: String (required, max 5000 chars),
  salary: Number (required, min 0),
  recruiter: ObjectId (reference to User, required),
  approvedByCollege: Boolean (default: false),
  approvedBy: ObjectId (reference to User, default: null),
  createdAt: Date,
  approvalDate: Date,
  updatedAt: Date
}
```

### StudentProfile Schema

```javascript
{
  userId: ObjectId (reference to User, required, unique),
  branch: String (required, max 100 chars),
  cgpa: Number (required, 0-10),
  skills: [String] (max 50 chars each),
  projects: [String] (max 200 chars each),
  certifications: [String] (max 100 chars each),
  resumeUrl: String (optional),
  approvedForPlacement: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date,
  completionPercentage: Number (virtual, 0-100)
}
```

### Application Schema

```javascript
{
  jobId: ObjectId (reference to Job, required),
  studentId: ObjectId (reference to User, required),
  status: String (enum: ['applied', 'shortlisted', 'rejected', 'selected'], default: 'applied'),
  appliedAt: Date (default: Date.now),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Unique compound index on { jobId, studentId } (prevents duplicate applications)

### Quiz Schema

```javascript
{
  jobId: ObjectId (reference to Job, required),
  recruiterId: ObjectId (reference to User, required),
  title: String (required, max 200 chars),
  duration: Number (required, 1-180 minutes),
  passingMarks: Number (required, min 0),
  totalMarks: Number (required, min 1),
  approvedByCollege: Boolean (default: false),
  approvedBy: ObjectId (reference to User, default: null),
  questions: [{
    question: String (required),
    options: [String] (required, min 2 options),
    correctAnswer: String (required, must be in options),
    marks: Number (required, min 0)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**Validation:**
- passingMarks ≤ totalMarks
- Each question must have correctAnswer in options array

### QuizSubmission Schema

```javascript
{
  quizId: ObjectId (reference to Quiz, required),
  studentId: ObjectId (reference to User, required),
  answers: [{
    questionIndex: Number (required, min 0),
    selectedAnswer: String (required)
  }],
  score: Number (required, min 0),
  passed: Boolean (required),
  submittedAt: Date (default: Date.now),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Unique compound index on { quizId, studentId } (prevents multiple submissions)

---

## Error Responses

## Error Responses

All error responses follow this format:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Error description"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "User role 'Student' is not authorized to access this route"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Job not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Testing with cURL

### Register as Recruiter
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Company",
    "email": "recruiter@tech.com",
    "password": "password123",
    "role": "Recruiter"
  }'
```

### Register as College
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "University Admin",
    "email": "admin@university.edu",
    "password": "password123",
    "role": "College"
  }'
```

### Register as Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Student",
    "email": "student@example.com",
    "password": "password123",
    "role": "Student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@tech.com",
    "password": "password123"
  }'
```

### Create Job (as Recruiter)
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Full Stack Developer",
    "description": "We are looking for a talented full stack developer",
    "salary": 100000
  }'
```

### View Approved Jobs (Public)
```bash
curl http://localhost:5000/api/jobs/approved
```

---

## Security Notes

1. **JWT Secret:** Change `JWT_SECRET` in `.env` to a strong, random string in production
2. **CORS:** Adjust CORS origin in `server.js` based on your frontend URL
3. **Password Hashing:** Passwords are hashed using bcryptjs with salt rounds = 10
4. **Token Expiry:** Tokens expire after 7 days (configurable via `JWT_EXPIRE`)
5. **Validation:** All inputs are validated before processing

---

## Development Workflow

1. Modify files in `controllers/`, `models/`, `routes/`
2. Server automatically reloads with `npm run dev`
3. Check console for MongoDB connection logs
4. Test endpoints using cURL or Postman

---

## Future Enhancements (Phase 7+)

- Email notifications
- Rate limiting & security headers
- API documentation with Swagger
- Unit testing with Jest
- Database indexing for optimization
- Advanced reporting features
- Integration with external job portals

---

## License

ISC

---

## Author

Prashikshan Team

---

## Support

For issues or questions, please refer to the API documentation above or check the error messages in the console logs.

**Happy coding! 🚀**
