# 🚀 **DEPLOY CODETRACKER TO PRODUCTION** 

## **Step-by-Step Deployment Guide**

### **🎯 OVERVIEW**
We'll deploy your CodeTracker application using:
- **Backend**: Render (free tier)
- **Frontend**: Vercel (free tier)  
- **Database**: MongoDB Atlas (already configured)

---

## **📝 PRE-DEPLOYMENT CHECKLIST**

### **1. Create GitHub Repository**
```bash
cd /Users/navya/iCloud\ Drive\ \(Archive\)/Desktop/Documents/codetracker

# Initialize git repository
git init

# Add all files
git add .

# Commit 
git commit -m "Initial CodeTracker application commit"

# Create repository on GitHub and add remote
git remote add origin https://github.com/YOUR_USERNAME/codetracker.git
git branch -M main
git push -u origin main
```

### **2. Generate Production JWT Secret**
```bash
# Generate a secure 32+ character secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```
**Copy this secret - you'll need it for production environment variables!**

---

## **🖥️ BACKEND DEPLOYMENT (RENDER)**

### **Step 1: Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up using your GitHub account
3. Connect your GitHub account

### **Step 2: Deploy Backend Service**
1. **Click "New +" → "Web Service"**
2. **Connect Repository**: Select your `codetracker` repository
3. **Configure Service**:
   ```
   Name: codetracker-api
   Environment: Node
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

### **Step 3: Set Environment Variables**
In Render dashboard, go to **Environment** tab and add:
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://bhanuharshith2004_db_user:IUxGsrG3sLyFmjl2@cluster0.fwkkvee.mongodb.net/codetracker?retryWrites=true&w=majority
JWT_SECRET=YOUR_GENERATED_32_CHAR_SECRET_HERE
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
GOOGLE_CLIENT_ID=1070588975670-ib4o2jfsl4kds8pvj915lkpqtn0n3l2q.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://YOUR_RENDER_APP.onrender.com/api/auth/google/callback
FRONTEND_URL=https://YOUR_VERCEL_APP.vercel.app
```

### **Step 4: Deploy**
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your backend will be available at: `https://YOUR_APP_NAME.onrender.com`
4. Test health endpoint: `https://YOUR_APP_NAME.onrender.com/health`

---

## **🌐 FRONTEND DEPLOYMENT (VERCEL)**

### **Step 1: Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Sign up using your GitHub account

### **Step 2: Deploy Frontend**
1. **Click "New Project"**
2. **Import Repository**: Select your `codetracker` repository
3. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

### **Step 3: Set Environment Variables**
In Vercel dashboard, go to **Settings** → **Environment Variables**:
```bash
VITE_API_URL=https://YOUR_RENDER_APP.onrender.com
VITE_NODE_ENV=production
VITE_APP_NAME=CodeTracker
VITE_APP_VERSION=1.0.0
```

### **Step 4: Deploy**
1. Click **"Deploy"**
2. Wait 2-3 minutes for build and deployment
3. Your app will be available at: `https://YOUR_APP_NAME.vercel.app`

---

## **🔧 UPDATE GOOGLE OAUTH URLS**

### **Step 1: Update Google OAuth Configuration**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. **Add Production URLs**:
   ```
   Authorized JavaScript origins:
   - https://YOUR_VERCEL_APP.vercel.app
   
   Authorized redirect URIs:
   - https://YOUR_RENDER_APP.onrender.com/api/auth/google/callback
   ```

### **Step 2: Update Environment Variables**
Update these in **both** Render and Vercel:
```bash
# In Render (Backend)
GOOGLE_CALLBACK_URL=https://YOUR_RENDER_APP.onrender.com/api/auth/google/callback
FRONTEND_URL=https://YOUR_VERCEL_APP.vercel.app

# In Vercel (Frontend) 
VITE_API_URL=https://YOUR_RENDER_APP.onrender.com
```

---

## **🧪 POST-DEPLOYMENT TESTING**

### **Step 1: Test Backend Health**
```bash
curl https://YOUR_RENDER_APP.onrender.com/health
# Should return: {"status": "OK", "timestamp": "..."}
```

### **Step 2: Test Frontend**
1. Visit: `https://YOUR_VERCEL_APP.vercel.app`
2. Try user registration
3. Test Google OAuth login
4. Test platform integration
5. Verify dashboard data loading

### **Step 3: Test Full Flow**
1. **Register** new account
2. **Login** with credentials
3. **Add platform usernames** (Profile page)
4. **Refresh statistics** on Dashboard
5. **Verify real data** appears

---

## **⚡ QUICK DEPLOYMENT COMMANDS**

```bash
# 1. Generate JWT Secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# 2. Create GitHub repo and push code
git init
git add .
git commit -m "Deploy CodeTracker"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/codetracker.git
git push -u origin main

# 3. Deploy Backend on Render
# - Go to render.com → New Web Service → Connect repo
# - Root: backend, Build: npm install, Start: npm start
# - Add environment variables from list above

# 4. Deploy Frontend on Vercel  
# - Go to vercel.com → New Project → Import repo
# - Root: frontend, Framework: Vite
# - Add environment variables: VITE_API_URL=https://your-backend.onrender.com

# 5. Update Google OAuth URLs with production domains
```

---

## **📋 DEPLOYMENT CHECKLIST**

- [ ] ✅ **GitHub repository created and code pushed**
- [ ] ✅ **Secure JWT secret generated**
- [ ] ✅ **Backend deployed to Render**
- [ ] ✅ **Frontend deployed to Vercel**  
- [ ] ✅ **Environment variables configured**
- [ ] ✅ **Google OAuth URLs updated**
- [ ] ✅ **Health endpoint tested**
- [ ] ✅ **User registration tested**
- [ ] ✅ **Google login tested**
- [ ] ✅ **Platform integration tested**
- [ ] ✅ **Dashboard data loading verified**

---

## **🎉 CONGRATULATIONS!**

Your **CodeTracker** application is now **LIVE** and accessible to everyone at:

🌍 **Frontend**: `https://YOUR_APP_NAME.vercel.app`  
🔧 **Backend API**: `https://YOUR_APP_NAME.onrender.com`

### **Share Your App:**
- Send the Vercel URL to friends and users
- Post on social media
- Add to your portfolio/resume
- Submit to coding communities

### **Monitor Your App:**
- **Render Dashboard**: Check backend logs and performance
- **Vercel Dashboard**: Monitor frontend analytics and builds
- **MongoDB Atlas**: Track database usage and performance

---

**🚀 Your full-stack CodeTracker application is now deployed and ready for users worldwide!**
