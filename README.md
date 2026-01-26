# Gym Progress Tracker (Dirty Bulk Edition)

A clean, intuitive MERN stack web application for tracking daily gym progress, body weight, nutrition, and supplementation with automated analytics and progress visualization.

## Project Overview

**Target User:** Young Bodybuilder / Fitness Enthusiast (21+ years old)  
**Purpose:** Track daily metrics and visualize long-term progress with minimal friction  
**Platform:** Responsive Web Application (MERN Stack)

### Key Features
- ✅ Daily logging (weight, eggs, energy, strength)
- ✅ Gym attendance tracking
- ✅ Creatine supplementation tracking
- ✅ Automated analytics and calculations
- ✅ Visual progress charts (weight progression, weekly gains, etc.)
- ✅ Pre/post creatine comparison analysis
- ✅ Weekly and monthly summaries
- ✅ Settings and user preferences

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI components and pages |
| **Routing** | React Router 6 | Client-side navigation |
| **Styling** | TailwindCSS | Utility-first CSS framework |
| **Charts** | Recharts | Data visualizations |
| **HTTP Client** | Axios | API requests |
| **State** | React Context | Global state (auth) |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB + Mongoose | NoSQL database and ODM |
| **Authentication** | JWT | Secure token-based auth |
| **Validation** | express-validator | Input validation |
| **Deployment** | Vercel (FE) + Railway (BE) | Cloud hosting |
| **Version Control** | Git + GitHub | Code management |

## Project Structure

```
Gym Weight Tracker/
├── frontend/                    # React client application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Common components (Navbar, Button, etc.)
│   │   │   ├── forms/          # Form components
│   │   │   └── charts/         # Chart components
│   │   ├── services/           # API service calls
│   │   ├── context/            # React Context (Auth)
│   │   ├── hooks/              # Custom hooks
│   │   ├── App.jsx             # Root component
│   │   └── index.jsx           # Entry point
│   ├── public/                 # Static assets
│   ├── package.json            # Frontend dependencies
│   └── .env.local              # Environment variables (not tracked)
│
├── backend/                     # Node.js + Express API
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   ├── DailyLog.js
│   │   ├── WorkoutLog.js
│   │   └── Settings.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── dailyLogs.js
│   │   ├── workoutLogs.js
│   │   ├── analytics.js
│   │   └── settings.js
│   ├── controllers/            # Route handlers
│   │   ├── authController.js
│   │   ├── dailyLogController.js
│   │   ├── workoutLogController.js
│   │   ├── analyticsController.js
│   │   └── settingsController.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.js             # JWT authentication
│   ├── utils/                  # Utility functions
│   │   └── calculations.js     # Calculation helpers
│   ├── config/                 # Configuration files
│   │   └── db.js               # Database connection
│   ├── server.js               # Express server setup
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables (not tracked)
│
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── prd.md                      # Product Requirements Document
├── drd.md                      # Design Requirements Document
└── IMPLEMENTATION_CHECKLIST.md # Implementation tasks

```

## Architecture Decisions

### Frontend Architecture
- **React Hooks + Context API:** Simplified state management for authentication and user data
- **TailwindCSS:** Utility-first CSS for rapid UI development and consistency
- **React Router v6:** Modern routing with nested routes and loaders
- **Axios Interceptors:** Centralized API error handling and JWT token management

### Backend Architecture
- **Express.js Middleware:** Clean separation of concerns (auth, validation, error handling)
- **MongoDB + Mongoose:** Flexible schema with validation, indexing for performance
- **JWT Tokens:** Stateless authentication, suitable for scalability
- **MVC Pattern:** Controllers handle business logic, Models manage data, Routes define endpoints

### Key Design Decisions
1. **No Error States on Empty Fields:** UX optimization - users focus on data entry, not validation messages
2. **Auto-calculated Metrics:** Daily change and 7-day average calculated server-side for consistency
3. **Green (#2E7D32) as Primary Color:** Psychology - green conveys growth and positive progress
4. **Status Badges:** Quick visual feedback (Going Up, Too Slow, Dropping, Too Fast)
5. **Creatine Comparison:** Isolated analysis to quantify supplement impact
6. **UTC Timestamps:** All dates stored in UTC, converted to user's timezone on frontend

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier available)
- Git

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gym-tracker
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

Start development server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start development server:
```bash
npm start
```

## Development Timeline

### Phase 1: MVP (Weeks 1-3) - ESSENTIAL
- Project infrastructure setup
- Backend: User authentication, Daily/Workout logs
- Frontend: Auth pages, Daily log form, Dashboard

### Phase 2: Analytics (Weeks 4-5) - HIGH PRIORITY
- Dashboard with visualizations
- Weekly and monthly summaries
- Creatine analysis

### Phase 3: Polish & Deployment (Weeks 6-7) - FINAL
- UI/UX refinement
- Comprehensive testing
- Production deployment

## Code Style & Formatting

### ESLint
- Configured for React and Node.js
- Rules follow Airbnb JavaScript style guide

### Prettier
- Automatic code formatting on save
- 2-space indentation
- Single quotes for strings

Run formatting:
```bash
npm run format
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Daily Logs
- `POST /api/daily-logs` - Create daily entry
- `GET /api/daily-logs` - Get user's daily logs
- `GET /api/daily-logs/:id` - Get specific entry
- `PUT /api/daily-logs/:id` - Update entry
- `DELETE /api/daily-logs/:id` - Delete entry

### Workout Logs
- `POST /api/workout-logs` - Create workout entry
- `GET /api/workout-logs` - Get user's workouts
- `DELETE /api/workout-logs/:id` - Delete workout

### Analytics
- `GET /api/analytics/weekly` - Weekly summary
- `GET /api/analytics/monthly` - Monthly summary
- `GET /api/analytics/creatine` - Creatine comparison

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

## Deployment

### Backend (Railway / Render)
1. Connect GitHub repository
2. Set environment variables in platform dashboard
3. Deploy automatically on push to main branch

### Frontend (Vercel / Netlify)
1. Connect GitHub repository
2. Set `REACT_APP_API_URL` to production backend URL
3. Deploy automatically on push to main branch

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## Design System

See [drd.md](drd.md) for comprehensive design specifications including:
- Color palette and brand identity
- Typography system
- Component library
- UI patterns and animations

## Product Requirements

See [prd.md](prd.md) for detailed product specifications.

## License

MIT

## Contact

For questions or support, please create an issue on GitHub.

---

**Project Status:** Ready for Phase 1 Development  
**Start Date:** January 26, 2026  
**Target Launch:** March 16, 2026 (Phase 1 MVP)
