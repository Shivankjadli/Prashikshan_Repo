# Prashikshan - Academia Industry Interface Platform

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-black.svg)](https://expressjs.com/)

A comprehensive MERN stack platform that bridges the gap between academia and industry by providing a streamlined job placement system with role-based access control for Students, Recruiters, and Colleges.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Role-Based Access Control**: Three distinct roles (Student, Recruiter, College)
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: bcrypt hashing for secure password storage

### 👨‍🎓 Student Management
- **Profile Management**: Complete student profiles with CGPA, skills, projects, certifications
- **Resume Upload**: PDF resume upload with validation (5MB limit)
- **Placement Eligibility**: College approval system for placements
- **Job Applications**: Apply to approved jobs with status tracking

### 🏢 Recruiter Dashboard
- **Job Posting**: Create and manage job opportunities
- **Application Management**: Review and manage job applications
- **Assessment Tools**: Create quizzes and assignments for candidates
- **Offer Management**: Issue and track offer letters

### 🎓 College Administration
- **Job Approval**: Review and approve job postings
- **Student Approval**: Manage student placement eligibility
- **Assessment Oversight**: Approve quizzes and assignments
- **Analytics Dashboard**: Comprehensive placement analytics

### 📊 Assessment System
- **MCQ Quizzes**: Auto-evaluated multiple-choice assessments
- **Assignments**: Manual evaluation with file upload support
- **Time Constraints**: Deadline enforcement and single-attempt rules
- **Performance Tracking**: Detailed analytics and scoring

### 📈 Analytics & Reporting
- **Placement Statistics**: Branch-wise and overall placement metrics
- **Performance Analytics**: Student and job-specific insights
- **Dashboard Views**: Role-specific analytics dashboards

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **Framework**: Express.js with ES6 modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with role-based middleware
- **File Upload**: Multer for secure file handling
- **Security**: CORS, input validation, error handling

### Frontend (React + Vite)
- **Framework**: React 19 with modern hooks
- **Build Tool**: Vite for fast development
- **Routing**: React Router for SPA navigation
- **HTTP Client**: Axios for API communication
- **UI Components**: Custom components with responsive design

## 📁 Project Structure

```
Prashikshan/
├── backend/                    # Node.js/Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Business logic controllers
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API route definitions
│   ├── middleware/            # Auth & upload middleware
│   ├── uploads/               # File storage directory
│   └── server.js              # Main application entry
├── frontend/                   # React/Vite frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components by role
│   │   ├── context/           # React context providers
│   │   ├── services/          # API service functions
│   │   └── App.jsx            # Main app component
│   └── package.json
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shivankjadli/Prashikshan_Repo.git
   cd Prashikshan
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file in backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/prashikshan
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start MongoDB**
   Make sure MongoDB is running locally or update MONGODB_URI for Atlas.

5. **Run the Application**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Development

### Available Scripts

**Backend:**
- `npm start` - Production server
- `npm run dev` - Development server with nodemon

**Frontend:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prashikshan
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

## 📚 API Documentation

The backend provides comprehensive REST APIs for all features. Key endpoints include:

- **Authentication**: `/api/auth/register`, `/api/auth/login`
- **Jobs**: `/api/jobs` (CRUD operations with role-based access)
- **Applications**: `/api/applications` (Application lifecycle)
- **Quizzes**: `/api/quizzes` (Assessment management)
- **Assignments**: `/api/assignments` (Assignment management)
- **Analytics**: `/api/analytics` (Placement statistics)

For detailed API documentation, see [backend/README.md](backend/README.md)

## 🧪 Testing

The project includes comprehensive testing guides:

- [Testing Guide](backend/TESTING_GUIDE.md) - Complete testing procedures
- [Quick Reference](backend/QUICK_REFERENCE.md) - Common tasks and commands
- Postman Collection: [Prashikshan-API.postman_collection.json](backend/Prashikshan-API.postman_collection.json)

## 🚢 Deployment

For production deployment instructions, see:
- [Deployment Guide](backend/DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Shivank Jadli** - *Initial work* - [GitHub](https://github.com/Shivankjadli)

## 🙏 Acknowledgments

- Built with MERN stack technologies
- Inspired by the need for better academia-industry collaboration
- Designed for educational institutions and corporate recruiters

---

**Prashikshan** - Bridging Academia and Industry for Better Placements 🚀</content>
<parameter name="filePath">G:\Parikshan\README.md