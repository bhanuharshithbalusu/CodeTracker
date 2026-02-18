# CodeTracker — Deployment Guide

A complete step-by-step guide to deploy CodeTracker to production using **MongoDB Atlas** (database), **Render** (backend), and **Vercel** (frontend).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: MongoDB Atlas (Database)](#step-1-mongodb-atlas-database)
3. [Step 2: Deploy Backend on Render](#step-2-deploy-backend-on-render)
4. [Step 3: Deploy Frontend on Vercel](#step-3-deploy-frontend-on-vercel)
5. [Step 4: Connect Everything](#step-4-connect-everything)
6. [Step 5: Update Google OAuth](#step-5-update-google-oauth)
7. [Step 6: Test the Live App](#step-6-test-the-live-app)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, make sure you have:

- [x] Code pushed to GitHub: https://github.com/bhanuharshithbalusu/CodeTracker
- [x] A Google account (for MongoDB Atlas and Google OAuth)
- [x] Google OAuth Client ID: `1070588975670-f879rini4p7qjcjm1e20ltotq07g8h65.apps.googleusercontent.com`

You will create free accounts on:
- MongoDB Atlas (free M0 tier) — https://cloud.mongodb.com
- Render (free tier) — https://render.com
- Vercel (free tier) — https://vercel.com

---

## Step 1: MongoDB Atlas (Database)

MongoDB Atlas provides a free cloud database. Your local MongoDB won't be accessible in production, so we need this.

### 1.1 Create an Account

1. Go to **https://cloud.mongodb.com**
2. Click **"Try Free"** or **"Sign In"** (you can use Google Sign-In)
3. If new, it will ask you a few questions — select the **Free/M0** tier

### 1.2 Create a Cluster

1. After signing in, you'll land on the **Dashboard**
2. If you don't have a cluster yet:
   - Click **"Build a Database"** or **"Create"**
   - Select **M0 FREE** tier
   - Choose a cloud provider: **AWS** is fine
   - Choose a region closest to you (e.g., `ap-south-1` for India)
   - Cluster name: leave as default (e.g., `Cluster0`)
   - Click **"Create Deployment"**
3. Wait 1-3 minutes for the cluster to be created

### 1.3 Create a Database User

1. In the left sidebar, click **"Database Access"** (under Security)
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Enter a username (e.g., `codetracker_admin`)
5. Enter a strong password (or click "Autogenerate Secure Password")
   - ⚠️ **COPY THIS PASSWORD** — you'll need it later
   - Avoid special characters like `@`, `#`, `%` in the password (they cause URL encoding issues)
6. Database User Privileges: Select **"Read and write to any database"**
7. Click **"Add User"**

### 1.4 Allow Network Access

1. In the left sidebar, click **"Network Access"** (under Security)
2. Click **"Add IP Address"**
3. Click **"ALLOW ACCESS FROM ANYWHERE"** (this sets it to `0.0.0.0/0`)
   - This is required so Render and Vercel can connect to your database
4. Click **"Confirm"**

### 1.5 Get the Connection String

1. In the left sidebar, click **"Database"** (under Deployment)
2. Find your cluster and click **"Connect"**
3. Select **"Drivers"** (Node.js)
4. You'll see a connection string like:
   ```
   mongodb+srv://codetracker_admin:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>`** with the actual password you set in step 1.3
6. **Add the database name** `codetracker` before the `?`:
   ```
   mongodb+srv://codetracker_admin:YOUR_PASSWORD@cluster0.abc123.mongodb.net/codetracker?retryWrites=true&w=majority
   ```
7. **Copy this entire string** — this is your `MONGO_URI`

### Example Final Connection String:
```
mongodb+srv://codetracker_admin:MyStr0ngPwd@cluster0.abc123.mongodb.net/codetracker?retryWrites=true&w=majority
```

---

## Step 2: Deploy Backend on Render

Render will host your Node.js/Express backend API.

### 2.1 Create a Render Account

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account** (recommended — makes repo connection easier)

### 2.2 Create a New Web Service

1. From the Render dashboard, click **"New +"** → **"Web Service"**
2. Select **"Build and deploy from a Git repository"** → click **"Next"**
3. Connect your GitHub account if not already connected
4. Find and select the repo: **`bhanuharshithbalusu/CodeTracker`**
5. Click **"Connect"**

### 2.3 Configure the Service

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `codetracker-api` |
| **Region** | Choose closest to you (e.g., Singapore for India) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

### 2.4 Add Environment Variables

Scroll down to **"Environment Variables"** and add these one by one:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string from Step 1.5 |
| `JWT_SECRET` | `codetracker_prod_jwt_secret_2024` (or any strong random string) |
| `PORT` | `5000` |
| `GOOGLE_CLIENT_ID` | `1070588975670-f879rini4p7qjcjm1e20ltotq07g8h65.apps.googleusercontent.com` |
| `CLIENT_URL` | Leave empty for now (we'll set this after deploying the frontend) |

### 2.5 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your backend
3. Wait for the build to complete (2-5 minutes)
4. Once deployed, you'll see a URL like:
   ```
   https://codetracker-api.onrender.com
   ```
5. **Copy this URL** — this is your backend URL

### 2.6 Verify Backend

1. Open your browser and go to:
   ```
   https://codetracker-api.onrender.com/api/health
   ```
2. You should see: `{"status":"ok"}`
3. If you see this, your backend is running! ✅

> **Note:** Render free tier spins down after 15 minutes of inactivity. The first request after idle may take 30-60 seconds.

---

## Step 3: Deploy Frontend on Vercel

Vercel will host your React frontend.

### 3.1 Create a Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Sign up with your **GitHub account** (recommended)

### 3.2 Import the Project

1. From the Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find and select the repo: **`bhanuharshithbalusu/CodeTracker`**
3. Click **"Import"**

### 3.3 Configure the Project

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | Click **"Edit"** → type `client` → click **"Continue"** |
| **Build Command** | `npm run build` (should be auto-detected) |
| **Output Directory** | `dist` (should be auto-detected) |

### 3.4 Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://codetracker-api.onrender.com/api` (your Render URL + `/api`) |
| `VITE_GOOGLE_CLIENT_ID` | `1070588975670-f879rini4p7qjcjm1e20ltotq07g8h65.apps.googleusercontent.com` |

⚠️ **Important:** Make sure `VITE_API_URL` ends with `/api` (not just the base URL).

### 3.5 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend (1-2 minutes)
3. Once done, you'll get a URL like:
   ```
   https://code-tracker-xxxx.vercel.app
   ```
4. **Copy this URL** — this is your live frontend URL

---

## Step 4: Connect Everything

Now we need to tell the backend about the frontend URL (for CORS).

### 4.1 Update Render Environment Variable

1. Go to **Render Dashboard** → Your `codetracker-api` service
2. Click **"Environment"** tab
3. Find `CLIENT_URL` (or add it if you left it empty)
4. Set the value to your Vercel URL:
   ```
   https://code-tracker-xxxx.vercel.app
   ```
   (Replace with your actual Vercel URL — **no trailing slash**)
5. Click **"Save Changes"**
6. Render will automatically redeploy with the new environment variable

---

## Step 5: Update Google OAuth

For Google Sign-In to work on the deployed site, you need to add the production URLs to your Google OAuth configuration.

### 5.1 Go to Google Cloud Console

1. Go to **https://console.cloud.google.com/apis/credentials**
2. Sign in with your Google account
3. Find your OAuth 2.0 Client ID and click on it to edit

### 5.2 Add Authorized JavaScript Origins

Add these URLs to **"Authorized JavaScript origins"**:

```
https://code-tracker-xxxx.vercel.app
```
(Replace with your actual Vercel URL)

### 5.3 Add Authorized Redirect URIs

Add these URLs to **"Authorized redirect URIs"**:

```
https://code-tracker-xxxx.vercel.app
```

### 5.4 Save

Click **"Save"** at the bottom. Changes may take a few minutes to propagate.

---

## Step 6: Test the Live App

1. Open your Vercel URL in the browser
2. You should see the **CodeTracker landing page**
3. Try these actions:
   - [x] **Register** with email/password
   - [x] **Login** with email/password
   - [x] **Google Sign-In** (if OAuth is configured)
   - [x] **Connect** a Codeforces handle (e.g., `tourist`)
   - [x] **Connect** a LeetCode handle (e.g., `neal_wu`)
   - [x] **View Dashboard** — verify charts, heatmap, and stats load
   - [x] **Settings** — update name, change password
   - [x] **Logout** and login again

---

## Troubleshooting

### Issue: "Network Error" or API calls failing
- **Cause:** CORS misconfiguration
- **Fix:** Make sure `CLIENT_URL` on Render matches your exact Vercel URL (no trailing slash)
- **Check:** Go to `https://your-render-url.onrender.com/api/health` — it should return `{"status":"ok"}`

### Issue: Google Sign-In button not showing
- **Cause:** Google Client ID not set or domain not authorized
- **Fix:** 
  1. Verify `VITE_GOOGLE_CLIENT_ID` is set in Vercel environment variables
  2. Verify your Vercel URL is in Google Cloud Console → Authorized JavaScript Origins
  3. Redeploy on Vercel after adding env vars

### Issue: "MongoDB connection error"
- **Cause:** Wrong connection string or network access not configured
- **Fix:**
  1. Double-check the `MONGO_URI` on Render — make sure password is correct
  2. Make sure MongoDB Atlas Network Access allows `0.0.0.0/0`
  3. Make sure you added `/codetracker` database name in the URI

### Issue: Render backend takes 30+ seconds to respond
- **Cause:** Render free tier spins down after 15 minutes of inactivity
- **Fix:** This is normal on free tier. The first request "wakes up" the server.
- **Upgrade:** Switch to Render paid plan ($7/month) for always-on service.

### Issue: Frontend shows blank page after deploy
- **Cause:** Build error or missing env vars
- **Fix:**
  1. Check Vercel build logs for errors
  2. Make sure Root Directory is set to `client`
  3. Make sure `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID` are set

### Issue: "This account uses Google Sign-In" error on login
- **Cause:** You registered with Google but are trying to login with email/password
- **Fix:** Use the Google Sign-In button instead of the email/password form

---

## Summary of All Environment Variables

### Render (Backend) — `server/.env`

| Variable | Example Value |
|----------|--------------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/codetracker?retryWrites=true&w=majority` |
| `JWT_SECRET` | `codetracker_prod_jwt_secret_2024` |
| `PORT` | `5000` |
| `GOOGLE_CLIENT_ID` | `1070588975670-f879rini4p7qjcjm1e20ltotq07g8h65.apps.googleusercontent.com` |
| `CLIENT_URL` | `https://code-tracker-xxxx.vercel.app` |

### Vercel (Frontend) — `client/.env`

| Variable | Example Value |
|----------|--------------|
| `VITE_API_URL` | `https://codetracker-api.onrender.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | `1070588975670-f879rini4p7qjcjm1e20ltotq07g8h65.apps.googleusercontent.com` |

---

## Useful Links

- **GitHub Repo:** https://github.com/bhanuharshithbalusu/CodeTracker
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Google Cloud Console (OAuth):** https://console.cloud.google.com/apis/credentials

---

🎉 **Congratulations!** Your CodeTracker app is now live!
