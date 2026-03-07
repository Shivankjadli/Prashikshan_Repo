# Deployment & Production Setup Guide

## for Prashikshan Backend

---

## Pre-Production Checklist

Before deploying to production, ensure:

- [ ] All environment variables are set
- [ ] JWT_SECRET is a strong, random string
- [ ] MongoDB connection is secured
- [ ] CORS origins are restricted to frontend domain
- [ ] Error logging is configured
- [ ] Database backups are automated
- [ ] SSL/TLS certificates are obtained

---

## Environment Configuration

### Development (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prashikshan
JWT_SECRET=dev_secret_change_me
JWT_EXPIRE=7d
NODE_ENV=development
```

### Production (.env.production)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prashikshan
JWT_SECRET=generate_with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_EXPIRE=7d
NODE_ENV=production
```

### Generate Strong JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste into `JWT_SECRET` in production .env

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account and new cluster
3. Create database user:
   - Username: `prashikshan_user`
   - Password: (strong, auto-generated)
4. Get connection string: `mongodb+srv://...`
5. Add to .env: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prashikshan`

### Option 2: Local MongoDB

```bash
# Install MongoDB Community
# Start service:
mongod

# Connection string:
MONGODB_URI=mongodb://localhost:27017/prashikshan
```

---

## Deployment Platforms

### Option 1: Heroku (Simple)

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Deploy Steps

```bash
# Login to Heroku
heroku login

# Create new app
heroku create prashikshan-backend

# Set environment variables
heroku config:set -a prashikshan-backend NODE_ENV=production
heroku config:set -a prashikshan-backend JWT_SECRET=<your_strong_secret>
heroku config:set -a prashikshan-backend MONGODB_URI=<your_mongodb_atlas_uri>

# Deploy
git push heroku main

# View logs
heroku logs -a prashikshan-backend --tail
```

#### Procfile (create in root)
```
web: node server.js
```

---

### Option 2: AWS EC2 (Scalable)

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04 preferred)
- SSH access to instance

#### Setup Steps

```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Clone repository
git clone <your-repo-url>
cd backend

# Install dependencies
npm install

# Create .env with production values
sudo nano .env

# Install PM2 (process manager)
sudo npm install -g pm2

# Start application
pm2 start server.js --name "prashikshan-backend"
pm2 startup
pm2 save

# Setup reverse proxy with Nginx
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default

# Add to Nginx config:
# upstream app {
#   server localhost:5000;
# }
# server {
#   listen 80;
#   server_name your-domain.com;
#   location / {
#     proxy_pass http://app;
#     proxy_http_version 1.1;
#     proxy_set_header Upgrade $http_upgrade;
#     proxy_set_header Connection 'upgrade';
#     proxy_set_header Host $host;
#     proxy_cache_bypass $http_upgrade;
#   }
# }

# Enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure SSL with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option 3: DigitalOcean App Platform (Easiest)

1. Push code to GitHub
2. Login to DigitalOcean
3. Create New → App
4. Connect GitHub repo
5. Set environment variables
6. Deploy with one click

---

### Option 4: Railway or Render (Beginner Friendly)

#### Railway

1. Login to [Railway](https://railway.app)
2. Create new project
3. Connect GitHub
4. Add MongoDB plugin
5. Set environment variables
6. Deploy

#### Render

1. Login to [Render](https://render.com)
2. Create New → Web Service
3. Connect GitHub
4. Set environment variables
5. Deploy

---

## Production Security Checklist

### 1. CORS Configuration

```javascript
// In server.js, update CORS:
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### 2. Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
// Add to server.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Helmet for Security Headers

```bash
npm install helmet
```

```javascript
// Add to server.js
import helmet from 'helmet';

app.use(helmet());
```

### 4. Request Validation

```bash
npm install joi
```

### 5. Database Encryption

Use MongoDB Enterprise or ensure SSL/TLS for connection

### 6. API Key Rotation

Regular JWT secret rotation policy

---

## Monitoring & Logging

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/node
```

```javascript
// Add to server.js
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use(Sentry.Handlers.errorHandler());
```

### 2. Application Monitoring (New Relic)

```bash
npm install newrelic
```

### 3. Database Monitoring

Use MongoDB Atlas monitoring dashboard

### 4. Log Aggregation (Winston)

```bash
npm install winston
```

---

## Database Optimization

### Create Indexes

```javascript
// Add to User.js
userSchema.index({ email: 1 }, { unique: true });

// Add to Job.js
jobSchema.index({ recruiter: 1 });
jobSchema.index({ approvedByCollege: 1 });
jobSchema.index({ createdAt: -1 });
```

### Database Backups

**MongoDB Atlas:**
- Automatic daily backups enabled by default
- Configure retention policy
- Test restore procedures

**Self-Hosted:**
```bash
# Daily backup script
0 2 * * * /usr/bin/mongodump --db prashikshan --out /backups/$(date +\%Y\%m\%d)
```

---

## Performance Optimization

### 1. Enable Caching
```javascript
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  next();
});
```

### 2. Pagination
```javascript
// Add to jobController.js
const page = req.query.page || 1;
const limit = req.query.limit || 10;
const skip = (page - 1) * limit;

const jobs = await Job.find()
  .skip(skip)
  .limit(limit);
```

### 3. Compression
```bash
npm install compression
```

```javascript
// Add to server.js
import compression from 'compression';
app.use(compression());
```

---

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main, production]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "prashikshan-backend"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

---

## Scaling Strategy

### Load Balancing
- Use AWS ELB or Nginx
- Deploy multiple instances
- MongoDB sharding for large datasets

### Caching Layer
- Redis for session management
- Cache frequently accessed jobs
- Cache user profiles

### CDN
- Cloudflare for static assets
- AWS CloudFront for API responses

---

## Monitoring Commands

```bash
# Check running processes
pm2 list
pm2 monit

# View logs
pm2 logs prashikshan-backend
pm2 logs prashikshan-backend --lines 100

# Restart app
pm2 restart prashikshan-backend

# Stop/Start
pm2 stop prashikshan-backend
pm2 start prashikshan-backend
```

---

## Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` on server |
| "MongoDB connection failed" | Check MONGODB_URI, whitelist IP in Atlas |
| "Port already in use" | Change PORT or kill process |
| "Memory limit exceeded" | Increase Node.js heap: `NODE_OPTIONS="--max-old-space-size=4096"` |
| "CORS error" | Update CORS origin in server.js |
| "Timeout errors" | Increase timeout, check database queries |

---

## Scaling Timeline

### Month 1: MVP
- Single server deployment
- Local caching
- Basic monitoring

### Month 3-6: Growth
- Load balancing
- Redis caching
- Advanced monitoring

### Month 6+: Scale
- Database sharding
- Microservices
- Global CDN

---

## Cost Estimation (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| MongoDB Atlas | $57+ | Shared cluster/dedicated |
| Heroku | $50-250+ | Dynos + add-ons |
| AWS EC2 | $30-100+ | t3.medium instance |
| DigitalOcean | $25-40 | VPS |
| Domain | $10-15 | DNS |

---

## Compliance & Security

- [ ] GDPR compliance (data privacy)
- [ ] Regular security audits
- [ ] Penetration testing
- [ ] Data encryption at rest
- [ ] SSL/TLS for transit
- [ ] Regular dependency updates
- [ ] Incident response plan

---

## Documentation

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Architecture diagrams
- [ ] Deployment runbook
- [ ] Troubleshooting guide
- [ ] Team onboarding docs

---

## Next Steps

1. Choose deployment platform
2. Set up production database
3. Configure environment variables
4. Set up monitoring
5. Configure backups
6. Test deployment
7. Monitor performance
8. Plan scaling strategy

---

**For questions, refer to main README.md**
