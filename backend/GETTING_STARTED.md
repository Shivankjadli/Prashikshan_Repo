# Getting Started Checklist ✅

## Prashikshan Backend - Step-by-Step Setup

Complete these steps in order to get the backend running:

---

## Phase 1: Initial Setup (5 minutes)

- [ ] Navigate to backend directory
  ```bash
  cd backend
  ```

- [ ] Install dependencies
  ```bash
  npm install
  ```

- [ ] Verify .env file exists with these settings:
  ```env
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/prashikshan
  JWT_SECRET=your_jwt_secret_key_change_in_production
  JWT_EXPIRE=7d
  NODE_ENV=development
  ```

- [ ] Ensure MongoDB is running
  ```bash
  # If using local MongoDB:
  mongod
  
  # If using MongoDB Atlas: skip this (cloud-based)
  ```

---

## Phase 2: Start Server (2 minutes)

- [ ] Start development server
  ```bash
  npm run dev
  ```

- [ ] Verify server started
  ```
  ✓ Should see: "🚀 Server running on http://localhost:5000"
  ✓ Should see: "✓ MongoDB connected: localhost"
  ```

- [ ] Test health check endpoint
  ```bash
  curl http://localhost:5000/api/health
  ```

- [ ] Should get response:
  ```json
  {
    "success": true,
    "message": "Server is running"
  }
  ```

---

## Phase 3: Prepare Testing (3 minutes)

Choose ONE testing method:

### Option A: Postman (Recommended)

- [ ] Install [Postman](https://www.postman.com/downloads/)

- [ ] Open Postman

- [ ] Click Import → Upload Files

- [ ] Select `Prashikshan-API.postman_collection.json`

- [ ] Click **Variables** tab

- [ ] Add two variables:
  - `{{jwt_token}}` - Will fill after login
  - `{{job_id}}` - Will fill after job creation

### Option B: cURL (Command Line)

- [ ] Open terminal/PowerShell

- [ ] Ready to run cURL commands

---

## Phase 4: Run First Test (5 minutes)

### Register Student User

**Postman:**
1. Click Collection → Authentication → Register as Student
2. Click **Send**
3. Copy the `token` value

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "student@test.com",
    "password": "password123",
    "role": "Student"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

- [ ] Successfully registered? ✓ Move to Phase 5

---

## Phase 5: Registration Testing (5 minutes)

Register remaining users:

### Register Recruiter
- [ ] Email: `recruiter@test.com`
- [ ] Password: `password123`
- [ ] Role: `Recruiter`
- [ ] **Save token** for job creation

### Register College
- [ ] Email: `college@test.edu`
- [ ] Password: `password123`
- [ ] Role: `College`
- [ ] **Save token** for job approval

### Register another Student
- [ ] Email: `student2@test.com`
- [ ] Password: `password123`
- [ ] Role: `Student`

---

## Phase 6: Test Complete Workflow (10 minutes)

### Step 1: Recruiter Creates Job
- [ ] Use recruiter token from registration
- [ ] POST to `/api/jobs`
- [ ] Provide: title, description, salary
- [ ] **Save job ID** from response

### Step 2: View Unapproved Jobs
- [ ] GET `/api/jobs/approved`
- [ ] Should be **empty** (job not approved yet)

### Step 3: College Login & Approves Job
- [ ] Login as college user
- [ ] **Save new token**
- [ ] PUT `/api/jobs/approval/approve/{job_id}`

### Step 4: Student Views Approved Jobs
- [ ] Login as student (or use new token)
- [ ] GET `/api/jobs/approved`
- [ ] Should see **1 job** now

---

## Phase 7: Validate Architecture (5 minutes)

Check that all files exist:

```
backend/
├── config/db.js ✓
├── models/
│   ├── User.js ✓
│   └── Job.js ✓
├── controllers/
│   ├── authController.js ✓
│   └── jobController.js ✓
├── routes/
│   ├── authRoutes.js ✓
│   └── jobRoutes.js ✓
├── middleware/
│   └── auth.js ✓
├── server.js ✓
├── package.json ✓
├── .env ✓
├── README.md ✓
├── QUICK_REFERENCE.md ✓
├── TESTING_GUIDE.md ✓
├── DEPLOYMENT.md ✓
└── Prashikshan-API.postman_collection.json ✓
```

- [ ] All files present

---

## Phase 8: Read Documentation (15 minutes)

Complete in this order:

1. [ ] Read **IMPLEMENTATION_SUMMARY.md**
   - Overview of entire system
   - File structure explanation
   - API endpoints list

2. [ ] Read **QUICK_REFERENCE.md**
   - Architecture overview
   - Role permissions
   - API routes map

3. [ ] Keep **README.md** handy
   - Detailed endpoint documentation
   - Request/response examples
   - Security notes

4. [ ] Save **TESTING_GUIDE.md** for reference
   - Comprehensive testing procedures
   - Error scenarios
   - Troubleshooting

5. [ ] Bookmark **DEPLOYMENT.md**
   - Production setup steps
   - Deployment options
   - Security checklist

---

## Phase 9: Advanced Testing (Optional - 10 minutes)

Test error scenarios:

- [ ] Try register with invalid role
  - Should get 400 error

- [ ] Try login with wrong password
  - Should get 401 error

- [ ] Student tries to create job
  - Should get 403 error

- [ ] Use invalid JWT token
  - Should get 401 error

---

## Phase 10: Ready for Development

You're ready when:

- ✅ Server runs without errors
- ✅ All 3 users registered successfully
- ✅ Can create jobs as recruiter
- ✅ Can approve jobs as college
- ✅ Can view approved jobs as student
- ✅ Role-based access working
- ✅ All files in place
- ✅ Documentation reviewed

---

## Common First-Time Issues

| Issue | Solution |
|-------|----------|
| "Cannot find module 'express'" | Run `npm install` |
| "MongoDB connection failed" | Start MongoDB or check MONGODB_URI |
| "EADDRINUSE: address already in use" | Change PORT in .env or kill process |
| "Invalid role" | Use: Student, Recruiter, or College |
| "Invalid token" | Token expired, register/login again |

---

## Next Steps After Getting Started

1. **Understand Architecture**
   - Study models/ for data structure
   - Study middleware/auth.js for security
   - Study controllers/ for business logic

2. **Practice Testing**
   - Run through all API endpoints
   - Test role-based access
   - Verify error handling

3. **Explore Code**
   - Read comments in each file
   - Trace request flow
   - Understand validation logic

4. **Prepare for Frontend**
   - Note all API endpoints
   - Understand token usage
   - Review error responses

5. **Plan Deployment**
   - Read DEPLOYMENT.md
   - Choose platform (Heroku, AWS, etc.)
   - Set up environment variables

---

## Quick Command Reference

```bash
# Install
npm install

# Development (auto-reload)
npm run dev

# Production
npm start

# Check server health
curl http://localhost:5000/api/health

# View logs in dev mode
# (Already shown in terminal)
```

---

## Useful Resources

- **API Testing:** Postman (included collection)
- **Database:** MongoDB Compass (visual MongoDB client)
- **Code Editor:** VS Code
- **Terminal:** PowerShell, Git Bash, or WSL

---

## Success Criteria ✅

After completing all phases, you should be able to:

- ✅ Start server without errors
- ✅ Register users with different roles
- ✅ Login and receive JWT tokens
- ✅ Create jobs as recruiter
- ✅ Approve/reject jobs as college
- ✅ View only approved jobs as student
- ✅ Understand role-based access
- ✅ Handle errors gracefully
- ✅ Explain API architecture
- ✅ Deploy to production

---

## Estimated Total Time

- **Setup & Installation:** 5 min
- **Start Server:** 2 min
- **First Test:** 5 min
- **User Registration:** 5 min
- **Workflow Testing:** 10 min
- **Architecture Check:** 5 min
- **Documentation Review:** 15 min
- **Advanced Testing:** 10 min

**Total:** ~60 minutes

---

## Getting Help

1. Check **QUICK_REFERENCE.md** for commands
2. See **TESTING_GUIDE.md** for debugging
3. Review **README.md** for API details
4. Check console logs in server output
5. Verify .env configuration

---

## Ready to Start? 🚀

```bash
cd backend
npm install
npm run dev
```

Then follow Phases 1-8 above.

**Happy coding!** 🎉
