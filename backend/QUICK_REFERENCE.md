# Prashikshan Backend - Quick Reference Guide

## Project Overview

This is a **Phase 1 MERN Stack Backend** for Prashikshan - Academia Industry Interface, featuring:
- ✅ User authentication (JWT + bcrypt)
- ✅ Role-based access control (RBAC)
- ✅ Job management with college approval workflow
- ✅ ES Modules (modern JavaScript)
- ✅ Production-ready error handling

---

## Quick Start

### 1. Setup
```bash
cd backend
npm install
```

### 2. Configure `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prashikshan
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start Server
```bash
npm run dev        # Development with auto-reload
npm start          # Production
```

---

## User Roles & Permissions

| Action | Student | Recruiter | College |
|--------|---------|-----------|---------|
| Register | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| Create job | ❌ | ✅ | ❌ |
| View own jobs | ❌ | ✅ | ❌ |
| Update own job | ❌ | ✅ (unapproved only) | ❌ |
| View approved jobs | ✅ | ✅ | ✅ |
| View all jobs | ❌ | ❌ | ✅ |
| Approve job | ❌ | ❌ | ✅ |
| Reject job | ❌ | ❌ | ✅ |

---

## API Routes Map

### Authentication (`/api/auth`)
- `POST /register` - Create new account
- `POST /login` - Login & get JWT
- `GET /me` - Get current user (protected)

### Jobs (`/api/jobs`)
- `GET /approved` - View approved jobs (public)
- `POST /` - Create job (Recruiter only)
- `GET /recruiter/my-jobs` - My jobs (Recruiter only)
- `PUT /:id` - Update job (Recruiter only)
- `GET /:id` - Get job details (protected)
- `GET /approval/all-jobs` - All jobs (College only)
- `PUT /approval/approve/:id` - Approve job (College only)
- `DELETE /approval/reject/:id` - Reject job (College only)

---

## Database Models

### User
```
name (string, required)
email (string, unique, required)
password (string, hashed, required)
role (enum: Student, Recruiter, College)
timestamps (createdAt, updatedAt)
```

### Job
```
title (string, required)
description (string, required)
salary (number, required)
recruiter (reference to User)
approvedByCollege (boolean, default: false)
approvedBy (reference to User, optional)
timestamps (createdAt, updatedAt)
approvalDate (date, optional)
```

---

## Architecture Overview

```
Request → Middleware (CORS, JSON) 
       → Auth Middleware (verify JWT) 
       → Role Middleware (check permissions) 
       → Controller (business logic) 
       → MongoDB (data persistence) 
       → Response
```

### Flow Examples

**Job Creation Flow:**
1. Recruiter sends POST request with job data
2. Auth middleware validates JWT
3. Role middleware checks if user is Recruiter
4. jobController.createJob processes request
5. Job saved to MongoDB with `approvedByCollege: false`
6. Response sent to client

**Job Approval Flow:**
1. College sends PUT request to approve job
2. Auth & role middleware validate
3. jobController.approveJob:
   - Finds job by ID
   - Sets `approvedByCollege: true`
   - Records `approvedBy` (college user ID)
   - Sets `approvalDate` to current time
   - Saves to database
4. Response with updated job sent back

---

## Middleware Explained

### `protect` Middleware (auth.js)
- Extracts JWT from `Authorization: Bearer <token>` header
- Verifies token signature using `JWT_SECRET`
- Decodes token to get `user.id` and `user.role`
- Stores user info in `req.user` for controllers

### `authorize(role)` Middleware (auth.js)
- Checks if `req.user.role` matches allowed role(s)
- Allows multiple roles: `authorize('Recruiter', 'College')`
- Returns 403 Forbidden if role not allowed

---

## Sample API Calls

### 1. Register (Recruiter)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Tech Corp","email":"hr@tech.com","password":"pass123","role":"Recruiter"}'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@tech.com","password":"pass123"}'
```
**Response includes:** `token`, `user object`

### 3. Create Job (requires token from login)
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <insert_token_here>" \
  -d '{"title":"Junior Dev","description":"2+ years exp","salary":60000}'
```

### 4. View Approved Jobs (public, no token needed)
```bash
curl http://localhost:5000/api/jobs/approved
```

### 5. Approve Job (College role, requires token)
```bash
curl -X PUT http://localhost:5000/api/jobs/approval/approve/<job_id> \
  -H "Authorization: Bearer <college_token>"
```

---

## Error Handling

All endpoints return consistent JSON responses:

**Success (201, 200):**
```json
{ "success": true, "message": "...", "data": {...} }
```

**Error (400, 401, 403, 404, 500):**
```json
{ "success": false, "message": "Error description" }
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (wrong role) |
| 404 | Not found |
| 500 | Server error |

---

## Password Security

- Passwords are hashed using **bcryptjs** with 10 salt rounds
- Not stored in plain text
- `matchPassword()` method compares entered password with hash
- Never returned in API responses

---

## JWT Token Structure

Token Format: `header.payload.signature`

**Payload Contains:**
```json
{
  "id": "user_mongodb_id",
  "role": "Recruiter",
  "iat": 1234567890,
  "exp": 1234654090
}
```

**Expiry:** 7 days (configurable)

---

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | Database connection | mongodb://localhost:27017/prashikshan |
| `JWT_SECRET` | Token signing key | any_long_random_string |
| `JWT_EXPIRE` | Token validity period | 7d |
| `NODE_ENV` | Environment type | development, production |

---

## Validation Rules

### Registration
- ✅ Name: required, max 100 chars
- ✅ Email: required, valid format, unique
- ✅ Password: required, min 6 chars
- ✅ Role: required, must be Student/Recruiter/College

### Job Creation
- ✅ Title: required, max 200 chars
- ✅ Description: required, max 5000 chars
- ✅ Salary: required, must be >= 0

---

## File Structure Explained

```
backend/
├── config/db.js              # MongoDB connection logic
├── models/
│   ├── User.js              # User schema + password hashing
│   └── Job.js               # Job schema with timestamps
├── middleware/
│   └── auth.js              # JWT & role verification
├── controllers/
│   ├── authController.js    # Register, login, getMe
│   └── jobController.js     # CRUD for jobs + approval
├── routes/
│   ├── authRoutes.js        # Link routes to auth controller
│   └── jobRoutes.js         # Link routes to job controller
├── server.js                # Express app setup
├── package.json             # Dependencies
└── .env                      # Configuration
```

---

## Testing Sequence

1. **Register 3 users:**
   - 1 Student
   - 1 Recruiter
   - 1 College

2. **Login with Recruiter**, copy token

3. **Create a job** using recruiter token

4. **View approved jobs** (should be empty)

5. **Login with College**, copy token

6. **Approve the job** using college token

7. **View approved jobs** (should show job)

8. **Login as Student** and view approved jobs

---

## Next Steps (Phase 2)

- Student applications
- Offers & acceptance
- Quizzes
- Assignments
- Student profiles
- Advanced filtering

---

**For detailed API documentation, see README.md**
