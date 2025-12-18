# 🚀 CodeTracker Deployment Guide

This guide provides step-by-step instructions for deploying CodeTracker to production.

## 📋 Prerequisites

- MongoDB Atlas account
- Vercel account (for frontend)
- Render account (for backend)
- GitHub repository

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in
   - Create a new project

2. **Create Database Cluster**
   ```bash
   # Choose your preferred cloud provider and region
   # Select M0 (Free tier) for testing
   # Name your cluster (e.g., "codetracker-cluster")
   ```

3. **Configure Database Access**
   - Go to Database Access
   - Add Database User
   - Choose Password authentication
   - Username: `codetracker_user`
   - Generate secure password
   - Grant `readWrite` permissions

4. **Configure Network Access**
   - Go to Network Access
   - Add IP Address
   - Choose "Allow access from anywhere" (0.0.0.0/0)
   - Or add specific IP addresses for better security

5. **Get Connection String**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `codetracker`

## 🖥️ Backend Deployment (Render)

1. **Prepare Backend for Deployment**
   ```bash
   cd backend
   
   # Ensure package.json has correct start script
   npm install
   
   # Test locally
   npm start
   ```

2. **Create Render Account**
   - Visit [Render](https://render.com)
   - Sign up with GitHub

3. **Deploy Backend Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure settings:
     ```
     Name: codetracker-api
     Environment: Node
     Build Command: npm install
     Start Command: npm start
     ```

4. **Add Environment Variables**
   ```bash
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secure_jwt_secret_at_least_32_chars
   JWT_EXPIRE=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Deploy and Test**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Test health endpoint: `https://your-service.onrender.com/health`

## 🌐 Frontend Deployment (Vercel)

1. **Prepare Frontend for Deployment**
   ```bash
   cd frontend
   
   # Update API URL for production
   # Create .env.production file
   echo "VITE_API_URL=https://your-backend-service.onrender.com" > .env.production
   
   # Test build locally
   npm run build
   npm run preview
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

   **Or via Vercel Dashboard:**
   - Visit [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     ```
     Framework Preset: Vite
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

3. **Add Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-service.onrender.com
     VITE_APP_NAME=CodeTracker
     VITE_APP_VERSION=1.0.0
     ```

4. **Configure Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## 🔧 Post-Deployment Configuration

### Backend Security Checklist
- [ ] Update CORS origins to include frontend domain
- [ ] Set secure JWT secret (minimum 32 characters)
- [ ] Configure rate limiting for production
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set up database backups
- [ ] Configure logging and monitoring

### Frontend Configuration
- [ ] Update API URL to production backend
- [ ] Configure error tracking (Sentry)
- [ ] Set up analytics (Google Analytics)
- [ ] Enable PWA features
- [ ] Configure CDN for assets

## 📊 Monitoring and Maintenance

### Health Checks
```bash
# Backend health check
curl https://your-backend-service.onrender.com/health

# API documentation
curl https://your-backend-service.onrender.com/api/docs

# Frontend check
curl https://your-frontend-app.vercel.app
```

### Database Monitoring
- Monitor MongoDB Atlas metrics
- Set up alerts for connection issues
- Regular backup verification
- Index optimization

### Application Monitoring
- Monitor API response times
- Track error rates
- Monitor user engagement
- Performance metrics

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Add Render deployment steps
        
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        # Add Vercel deployment steps
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```javascript
   // Backend: Update CORS configuration
   const corsOptions = {
     origin: ['https://your-frontend-domain.vercel.app'],
     credentials: true
   };
   ```

2. **MongoDB Connection Issues**
   - Check connection string format
   - Verify database user permissions
   - Ensure IP whitelist includes deployment server

3. **Environment Variables Not Loading**
   - Verify variable names (no typos)
   - Check deployment platform settings
   - Restart services after adding variables

4. **Build Failures**
   ```bash
   # Clear node_modules and rebuild
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

5. **API Rate Limiting**
   - Adjust rate limiting settings
   - Implement caching strategies
   - Use CDN for static assets

### Debug Commands
```bash
# Check deployment logs
# Render: View logs in dashboard
# Vercel: vercel logs [deployment-url]

# Test API endpoints
curl -X POST https://your-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Check database connection
# Use MongoDB Compass with Atlas connection string
```

## 📈 Performance Optimization

### Backend Optimizations
- Enable compression middleware
- Implement caching strategies
- Optimize database queries
- Use connection pooling
- Enable API response caching

### Frontend Optimizations
- Enable lazy loading
- Optimize bundle size
- Use CDN for assets
- Implement service workers
- Enable image optimization

## 🔐 Security Considerations

### Production Security Checklist
- [ ] Use HTTPS everywhere
- [ ] Secure JWT secrets
- [ ] Enable CORS properly
- [ ] Implement rate limiting
- [ ] Use security headers
- [ ] Regular dependency updates
- [ ] Monitor for vulnerabilities
- [ ] Set up error tracking
- [ ] Configure backup strategies

### Environment Security
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Validate environment variables
node -e "
const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
requiredVars.forEach(v => {
  if (!process.env[v]) {
    console.error(\`Missing required environment variable: \${v}\`);
    process.exit(1);
  }
});
console.log('All environment variables are set!');
"
```

## 🎯 Go Live Checklist

- [ ] Database cluster created and configured
- [ ] Backend deployed and health check passing
- [ ] Frontend deployed and loading correctly
- [ ] All environment variables set
- [ ] CORS configured for production domains
- [ ] SSL certificates active (handled by platforms)
- [ ] Error tracking configured
- [ ] Monitoring and alerts set up
- [ ] Backup strategy implemented
- [ ] Documentation updated
- [ ] Team access configured
- [ ] Domain configured (if custom domain)

## 📞 Support

If you encounter issues during deployment:
1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Check community forums
4. Contact platform support if needed

---

**Your CodeTracker application is now live! 🎉**

Share your achievement and help other developers track their coding journey!
