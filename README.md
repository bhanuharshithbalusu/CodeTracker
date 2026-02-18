# CodeTracker

A production-ready full-stack coding progress tracker that aggregates and visualizes statistics from Codeforces, LeetCode, and CodeChef.

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Frontend       | React 18, Tailwind CSS 3, Recharts      |
| Backend        | Node.js, Express 4, Mongoose            |
| Database       | MongoDB                                 |
| Authentication | JWT (7-day tokens), bcrypt              |
| Icons          | Lucide React                            |

## Prerequisites

- **Node.js** v16+
- **MongoDB** running locally (or MongoDB Atlas URI)

## Quick Start

### 1. Clone and setup backend

```bash
cd server
npm install
```

Create a `.env` file (or edit the default one):

```env
MONGO_URI=mongodb://localhost:27017/codetracker
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
```

Start the server:

```bash
npm run dev
```

### 2. Setup frontend

```bash
cd client
npm install
npm run dev
```

### 3. Open the app

Visit [http://localhost:5173](http://localhost:5173)

## Project Structure

```
CodeTracker/
├── server/
│   ├── index.js              # Express entry point
│   ├── models/User.js        # Mongoose user schema
│   ├── routes/
│   │   ├── auth.js           # Register / Login
│   │   ├── platform.js       # Connect / Disconnect / Refresh
│   │   └── user.js           # Profile / Password
│   ├── middleware/auth.js     # JWT verification
│   └── utils/platformUtils.js # Stats fetcher (mock)
│
├── client/
│   ├── src/
│   │   ├── context/AuthContext.jsx    # Global auth state
│   │   ├── lib/api.js                 # Axios instance
│   │   ├── components/
│   │   │   ├── AppLayout.jsx          # Sidebar layout
│   │   │   ├── ProtectedRoute.jsx     # Auth guard
│   │   │   ├── StatCard.jsx           # Stat display card
│   │   │   ├── PlatformCard.jsx       # Platform info card
│   │   │   └── ActivityHeatmap.jsx    # GitHub-style heatmap
│   │   └── pages/
│   │       ├── Landing.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Dashboard.jsx
│   │       └── Settings.jsx
│   └── tailwind.config.js
└── README.md
```

## Features

- **Authentication**: Secure JWT-based login/register with bcrypt password hashing
- **Platform Integration**: Connect Codeforces, LeetCode, and CodeChef handles
- **Dashboard Analytics**: Total problems solved, ratings, difficulty breakdown, activity heatmap
- **Streak Tracking**: Current and longest coding streaks
- **Recent Submissions**: Merged feed from all connected platforms
- **Settings**: Update profile name and change password
- **Responsive**: Works on desktop, tablet, and mobile
- **Caching**: 1-hour cache TTL to avoid API rate limits
