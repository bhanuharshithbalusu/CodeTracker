# CodeTracker 🚀

A production-ready full-stack web application that aggregates coding statistics from multiple competitive programming platforms into a unified dashboard.

## 🌟 Features

- **Multi-Platform Integration**: Connect accounts from LeetCode, Codeforces, CodeChef, and W3Schools
- **Unified Dashboard**: View all your coding statistics in one beautiful interface
- **Real-time Updates**: Automatically sync your latest achievements and progress
- **Secure Authentication**: JWT-based authentication with secure password hashing
- **Progress Tracking**: Historical data visualization with charts and graphs
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern Tech Stack**: Built with React, Node.js, Express, and MongoDB

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **React Router** for client-side routing
- **React Hook Form** for form management
- **Recharts** for data visualization
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **Rate limiting** for API protection
- **CORS** configuration for cross-origin requests

### Deployment Ready
- **Frontend**: Vercel/Netlify deployment ready
- **Backend**: Render/Railway deployment ready
- **Database**: MongoDB Atlas integration
- **Environment Configuration**: Production-ready env setup

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/codetracker.git
   cd codetracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your configurations
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your backend URL
   
   # Start frontend server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/docs

## 🔧 Environment Variables

### Backend (.env)
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=CodeTracker
VITE_APP_VERSION=1.0.0
```

## 📱 Application Flow

1. **Registration/Login**: Users create an account or sign in
2. **Profile Setup**: Add usernames for different coding platforms
3. **Data Sync**: Application automatically fetches statistics from platforms
4. **Dashboard**: View aggregated statistics, progress charts, and achievements
5. **Progress Tracking**: Monitor improvement over time with historical data

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user profile
- `PUT /api/auth/updatepassword` - Update password
- `POST /api/auth/logout` - Logout user

### User Data
- `GET /api/user/profile` - Get user profile with stats
- `PUT /api/user/platforms` - Update platform usernames
- `GET /api/user/stats` - Get detailed statistics
- `POST /api/user/refresh-stats` - Refresh platform data
- `GET /api/user/progress` - Get progress history
- `DELETE /api/user/account` - Delete user account

## 🏗️ Project Structure

```
codetracker/
├── backend/
│   ├── config/          # Database and configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Authentication and error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Platform integrations
│   ├── utils/           # Helper functions
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── contexts/    # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service layer
│   │   └── utils/       # Utility functions
│   ├── public/          # Static assets
│   └── index.html       # Entry HTML file
└── README.md
```

## 🔐 Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** using bcryptjs with salt rounds
- **Rate Limiting** to prevent API abuse
- **CORS Configuration** for cross-origin security
- **Helmet.js** for security headers
- **Input Validation** on all endpoints
- **SQL Injection Protection** through Mongoose
- **XSS Protection** via proper data sanitization

## 📊 Platform Integrations

### LeetCode
- Problems solved by difficulty
- Contest participation
- User rating and ranking
- Submission streak

### Codeforces
- Problems solved by rating range
- Contest ratings and rankings
- Submission statistics
- Maximum rating achieved

### CodeChef
- Long challenge participation
- Problem difficulty distribution
- Rating progression
- Contest performance

### W3Schools
- Course completion tracking
- Learning progress monitoring
- Certificate achievements
- Skill progression

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Backend (Render)
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Set up database user and network access
3. Get connection string
4. Add to backend environment variables

## 📈 Performance Optimizations

- **Lazy Loading** for React components
- **Image Optimization** with modern formats
- **API Caching** strategies
- **Database Indexing** for faster queries
- **Code Splitting** for smaller bundle sizes
- **Compression** for API responses
- **Rate Limiting** to manage server load

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run end-to-end tests
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all the coding platform APIs for making this integration possible
- Inspired by the need for unified progress tracking
- Built with ❤️ for the coding community

## 📞 Support

For support, email support@codetracker.dev or join our Discord server.

## 🎯 Roadmap

- [ ] Add more coding platforms (HackerRank, AtCoder)
- [ ] Implement goal setting and achievements
- [ ] Add social features and friend comparisons
- [ ] Create mobile application
- [ ] Implement AI-powered insights and recommendations
- [ ] Add team/organization features
- [ ] Integrate with GitHub for additional insights

---

**Built with 💻 by developers, for developers.**
