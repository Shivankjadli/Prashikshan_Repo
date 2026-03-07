# Testing Guide - Prashikshan Backend API

## Overview

This guide walks you through testing all API endpoints for the Prashikshan backend, with step-by-step instructions for both Postman and cURL.

---

## Prerequisites

1. **Backend Running:**
   ```bash
   npm run dev
   ```
   Server should be on `http://localhost:5000`

2. **MongoDB Running:**
   - Local MongoDB or MongoDB Atlas connection configured in `.env`

3. **Testing Tool:**
   - Postman (recommended) - [Download](https://www.postman.com/downloads/)
   - OR curl/terminal commands

---

## Option 1: Using Postman (Recommended)

### Import Collection

1. Open Postman
2. Click **Import** → **Upload Files**
3. Select `Prashikshan-API.postman_collection.json`
4. Collection will appear in left sidebar

### Set Variables

1. In Postman, go to **Variables** tab
2. Set:
   - `{{jwt_token}}` - Will update after login
   - `{{job_id}}` - Will update after job creation

---

## Testing Workflow

### Step 1: Register Users

You need 3 users to test all features:

#### A. Register Student

**Postman:**
- Collection → Authentication → Register as Student
- Click **Send**
- Save the `token` value for later

**cURL:**
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

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Student",
    "email": "student@example.com",
    "role": "Student"
  }
}
```

#### B. Register Recruiter

**Postman:**
- Collection → Authentication → Register as Recruiter
- Click **Send**
- **Important:** Copy the `token` value

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Company Recruiter",
    "email": "recruiter@techcorp.com",
    "password": "password123",
    "role": "Recruiter"
  }'
```

#### C. Register College

**Postman:**
- Collection → Authentication → Register as College
- Click **Send**
- Copy the `token` value

**cURL:**
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

---

### Step 2: Login

We'll use Recruiter for job creation.

#### Login as Recruiter

**Postman:**
- Collection → Authentication → Login
- Edit body to use recruiter email: `recruiter@techcorp.com`
- Click **Send**
- **Critical:** Copy the `token` value
- In Postman Variables, update `{{jwt_token}}` with this token

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@techcorp.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

**Save this token!** ↑

---

### Step 3: Get Current User Profile

Verify you're authenticated.

**Postman:**
- Collection → Authentication → Get Current User
- Make sure `Authorization` header has token
- Click **Send**

**cURL:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Tech Company Recruiter",
    "email": "recruiter@techcorp.com",
    "role": "Recruiter",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Step 4: Create a Job (Recruiter)

**Postman:**
- Collection → Jobs - Recruiter → Create Job
- Make sure `Authorization` header has recruiter token
- Click **Send**

**cURL:**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Full Stack Developer",
    "description": "We are looking for a talented full stack developer with 3+ years experience",
    "salary": 100000
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Job created successfully",
  "job": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Full Stack Developer",
    "description": "We are looking for...",
    "salary": 100000,
    "recruiter": "507f1f77bcf86cd799439001",
    "approvedByCollege": false,
    "approvedBy": null,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Save Job ID!** Copy the `_id` value and update Postman variable `{{job_id}}`

---

### Step 5: View Approved Jobs (Public)

**Before approval**, this should be empty.

**Postman:**
- Collection → Jobs - Public → Get All Approved Jobs
- No authentication needed
- Click **Send**

**cURL:**
```bash
curl http://localhost:5000/api/jobs/approved
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 0,
  "jobs": []
}
```

---

### Step 6: Recruiter Views Own Jobs

**Postman:**
- Collection → Jobs - Recruiter → Get My Jobs
- Make sure token is recruiter's
- Click **Send**

**cURL:**
```bash
curl -X GET http://localhost:5000/api/jobs/recruiter/my-jobs \
  -H "Authorization: Bearer YOUR_RECRUITER_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 1,
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Full Stack Developer",
      ...
      "approvedByCollege": false
    }
  ]
}
```

---

### Step 7: College Approves Job

#### A. College Login & Get Token

**Postman:**
- Collection → Authentication → Login
- Change email to: `admin@university.edu`
- Click **Send**
- Copy the returned `token`

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "password123"
  }'
```

**Update `{{jwt_token}}` variable in Postman with college token**

#### B. College Views All Jobs for Approval

**Postman:**
- Collection → Jobs - College → Get All Jobs for Approval
- Make sure `Authorization` has college token
- Click **Send**

**cURL:**
```bash
curl -X GET http://localhost:5000/api/jobs/approval/all-jobs \
  -H "Authorization: Bearer YOUR_COLLEGE_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 1,
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Full Stack Developer",
      "approvedByCollege": false,
      "recruiter": { ... }
    }
  ]
}
```

#### C. College Approves the Job

**Postman:**
- Collection → Jobs - College → Approve Job
- Use `{{job_id}}` placeholder
- Make sure `Authorization` has college token
- Click **Send**

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/jobs/approval/approve/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_COLLEGE_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Job approved successfully",
  "job": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Full Stack Developer",
    "approvedByCollege": true,
    "approvedBy": "507f1f77bcf86cd799439002",
    "approvalDate": "2024-01-16T14:20:00Z",
    ...
  }
}
```

---

### Step 8: Student Views Approved Jobs

#### A. Student Login

**Postman:**
- Collection → Authentication → Login
- Change email to: `student@example.com`
- Click **Send**

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

#### B. View Approved Jobs

**Postman:**
- Collection → Jobs - Public → Get All Approved Jobs
- Click **Send**

**cURL:**
```bash
curl http://localhost:5000/api/jobs/approved
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 1,
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Full Stack Developer",
      "description": "We are looking for...",
      "salary": 100000,
      "recruiter": {
        "_id": "507f1f77bcf86cd799439001",
        "name": "Tech Company Recruiter",
        "email": "recruiter@techcorp.com"
      },
      "approvedByCollege": true,
      "approvedBy": {
        "_id": "507f1f77bcf86cd799439002",
        "name": "University Admin",
        "email": "admin@university.edu"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "approvalDate": "2024-01-16T14:20:00Z"
    }
  ]
}
```

---

## Error Testing

Test various error scenarios:

### 1. Missing Required Fields

**Postman:**
- Collection → Authentication → Register as Student
- Remove the `role` field
- Click **Send**

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 2. Invalid Role

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "InvalidRole"
  }'
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Invalid role. Must be Student, Recruiter, or College"
}
```

### 3. Student Tries to Create Job

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -d '{
    "title": "Job",
    "description": "Description",
    "salary": 50000
  }'
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "User role 'Student' is not authorized to access this route"
}
```

### 4. No Authentication Token

```bash
curl -X POST http://localhost:5000/api/jobs/recruiter/my-jobs
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 5. Invalid Token

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

---

## Advanced Testing

### 1. Update Unapproved Job

```bash
curl -X PUT http://localhost:5000/api/jobs/JOB_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -d '{
    "title": "Senior Full Stack Developer",
    "salary": 130000
  }'
```

**Expected Response (200):** Job updated

### 2. Try to Update Approved Job

After approval, try the same update:

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Cannot update an approved job"
}
```

### 3. College Rejects Job

Create another job and test rejection:

```bash
curl -X DELETE http://localhost:5000/api/jobs/approval/reject/JOB_ID \
  -H "Authorization: Bearer COLLEGE_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Job rejected and deleted successfully"
}
```

---

## Postman Variables Cheat Sheet

| Variable | Value | Where to Get |
|----------|-------|-------------|
| `{{jwt_token}}` | JWT token | Login endpoint response |
| `{{job_id}}` | MongoDB Job ID | Create Job endpoint response |

### How to Update Variables in Postman

1. Click **Variables** tab at the bottom
2. In Current Value column, paste token/ID
3. Close tab
4. Use `{{variable_name}}` in requests

---

## Testing Checklist

- [ ] Register 3 users (Student, Recruiter, College)
- [ ] Login with each user
- [ ] Recruiter creates a job
- [ ] View jobs before approval (empty)
- [ ] College approves job
- [ ] View approved jobs (shows job)
- [ ] Student views approved jobs
- [ ] Recruiter updates unapproved job
- [ ] Try to update approved job (should fail)
- [ ] Test error scenarios
- [ ] Verify all status codes

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "MongoDB connection failed" | Check MONGODB_URI in .env and ensure MongoDB is running |
| "Invalid token" | Token may be expired or corrupted, log in again |
| "Role not authorized" | Using wrong user role, use correct role's token |
| "Job not found" | Job ID may be wrong or job was already deleted |
| "Email already registered" | Use different email address for new user |
| "Password must be at least 6 characters" | Use longer password |

---

## Performance Testing Tips

1. **View many jobs:** Create 10+ jobs and test pagination
2. **Concurrent requests:** Use Postman collections runner
3. **Monitor response times:** Check "Response time" in Postman
4. **Database indexing:** Good for future optimization

---

## Security Testing

- ❌ Never share real tokens in code
- ✅ Always use environment variables
- ✅ Change JWT_SECRET in production
- ✅ Use HTTPS in production
- ✅ Validate all inputs

---

**Happy Testing! 🚀**

For API details, see `README.md`
For quick reference, see `QUICK_REFERENCE.md`
