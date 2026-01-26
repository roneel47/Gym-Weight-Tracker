# Tech Stack & Architecture Documentation

## Overview
This document provides a comprehensive overview of the technology choices, architecture decisions, and rationale for the Gym Progress Tracker application.

**Project:** Gym Progress Tracker (Dirty Bulk Edition)  
**Start Date:** January 26, 2026  
**Tech Stack:** MERN (MongoDB, Express.js, React, Node.js)  
**Target Users:** Fitness enthusiasts, bodybuilders  

---

## 1. Technology Stack

### 1.1 Frontend Stack

#### Core Framework
- **React 18** - Latest stable version
  - Rationale: Industry standard for building component-based UIs, large ecosystem
  - Features: Hooks API, Context API for state management, excellent dev tooling
  - Performance: Virtual DOM ensures efficient re-renders

#### Routing
- **React Router v6** - Modern client-side routing
  - Rationale: Standard routing solution for React SPAs
  - Features: Nested routes, data loaders, programmatic navigation
  - Alternative considered: Next.js (rejected - over-engineered for this project)

#### Styling & UI
- **TailwindCSS** - Utility-first CSS framework
  - Rationale: Rapid development, consistency, no naming conflicts
  - Features: JIT compiler, responsive utilities, dark mode support
  - Alternative considered: Material-UI (rejected - heavy, opinionated)

#### Data Visualization
- **Recharts** - React charting library
  - Rationale: Built for React, responsive, lightweight
  - Charts: Line chart (weight progression), Bar chart (weekly gains), Pie charts (gym/creatine days)
  - Alternative considered: Chart.js (less React-friendly)

#### HTTP Client
- **Axios** - Promise-based HTTP client
  - Rationale: Better DX than fetch, built-in request/response interceptors
  - Features: Request/response transformations, timeout handling, cancel tokens
  - Use Case: API calls with automatic JWT token injection

#### State Management
- **React Context API** - Built-in global state
  - Rationale: Sufficient for authentication state, reduces dependencies
  - Alternative considered: Redux (overkill for MVP), Zustand (over-engineered)
  - Stores: AuthContext (user, token, loading state)

#### Form Handling
- **React Hook Form** (optional, deferred to Phase 2)
  - Rationale: Minimal re-renders, easy validation integration
  - Alternative: Formik (heavier, more opinionated)

#### Development Tools
- **Vite** (future consideration) or **Create React App**
  - Current: CRA for simplicity
  - Future: Consider Vite for faster dev server and builds

---

### 1.2 Backend Stack

#### Runtime & Framework
- **Node.js 16+** - JavaScript runtime
  - Rationale: Unified language across stack, large npm ecosystem
  - LTS versions: Ensures stability and security patches

- **Express.js 4.x** - Lightweight web framework
  - Rationale: Minimal, unopinionated, industry standard
  - Features: Middleware system, routing, error handling
  - Alternative considered: Fastify (marginal performance gains not worth learning curve)

#### Database & ODM
- **MongoDB** - NoSQL document database
  - Rationale: Flexible schema for evolving requirements, free tier available (Atlas)
  - Use Cases:
    - DailyLog: Documents with variable fields (gym, creatine, notes)
    - WorkoutLog: Array of exercises with different structures
    - Users: Simple, flat user documents

- **Mongoose 7.x** - MongoDB Object Data Modeling
  - Rationale: Schema validation, middleware hooks, indexing
  - Features: Virtual fields for calculated metrics, population for relationships
  - Indexes: Created on userId and date fields for query performance

#### Authentication & Security
- **JWT (JSON Web Tokens)** - Stateless authentication
  - Rationale: Scalable, doesn't require server-side session storage
  - Implementation: HS256 algorithm with 7-day expiration
  - Storage: HttpOnly cookies (future enhancement) or localStorage (current)

- **bcryptjs** - Password hashing
  - Rationale: Industry standard, no security vulnerabilities
  - Config: 10 salt rounds for balance between security and performance

#### Input Validation
- **express-validator** - Server-side validation middleware
  - Rationale: Comprehensive, chainable, integrated error handling
  - Validations: Email format, password strength, numeric ranges, date formats

#### Environment Configuration
- **dotenv** - Environment variable management
  - Rationale: Secure secrets handling, environment-specific configs
  - Files: .env (git-ignored), .env.example (tracked for documentation)

#### Development Tools
- **Nodemon** - Auto-restart on file changes
  - Rationale: Faster development iteration
  - Config: Only watches backend/ directory

- **ESLint** - JavaScript linter
  - Rationale: Code quality, consistency, bug prevention

- **Prettier** - Code formatter
  - Rationale: Automatic formatting, no debates on style

#### Deployment & Hosting
- **Railway** or **Render** - Backend hosting
  - Rationale: Easy GitHub integration, free tier available, auto-scaling
  - Alternative: Heroku (deprecated free tier)

---

### 1.3 Database Stack

#### MongoDB Atlas (Cloud)
- **Cluster Tier:** M0 (Free, 512MB storage)
- **Region:** Closest to target users (recommendation: US-East)
- **Authentication:** Network access restricted to deployment IPs

#### Database Structure
```
Database: gym-tracker
├── users
├── dailylogs
├── workoutlogs
└── settings
```

#### Collections Schema

**users:**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

**dailylogs:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  date: Date,
  weight: Number,
  eggsConsumed: Number,
  gymAttendance: Boolean,
  creatineIntake: Boolean,
  energyLevel: Number (1-5),
  strengthInGym: Number (1-5),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**workoutlogs:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  date: Date,
  exercises: [{
    name: String,
    muscleGroup: String,
    sets: Number,
    reps: Number,
    weight: Number,
    personalRecord: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

**settings:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  creatineStartDate: Date,
  metricUnit: String ("kg" or "lbs"),
  theme: String ("light" or "dark"),
  createdAt: Date,
  updatedAt: Date
}
```

#### Indexes
```javascript
// For performance optimization
users: unique index on email
dailylogs: compound index on (userId, date)
dailylogs: index on (userId, createdAt) for sorting
workoutlogs: compound index on (userId, date)
```

---

## 2. Architecture Patterns

### 2.1 Frontend Architecture

```
┌─────────────────────────────────────────────┐
│         React Application Layer             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐    ┌─────────────┐       │
│  │   Pages     │    │ Components  │       │
│  │  (Routes)   │    │  (Reusable) │       │
│  └──────┬──────┘    └──────┬──────┘       │
│         │                  │              │
│         └──────────────────┘              │
│              │                            │
│         ┌────▼─────┐                      │
│         │ Context  │ (Auth State)         │
│         └────┬─────┘                      │
│              │                            │
│         ┌────▼──────────┐                 │
│         │  Services    │                  │
│         │ (API Calls)   │                 │
│         └────┬──────────┘                 │
│              │                            │
└──────────────┼──────────────────────────┘
               │
        ┌──────▼──────┐
        │  Axios      │ (HTTP Client)
        │  Instance   │
        └──────┬──────┘
               │
        ┌──────▼──────────────────────┐
        │   Backend API               │
        │   (Express.js)              │
        └─────────────────────────────┘
```

**Data Flow:**
1. User interacts with Page/Component
2. Component calls service function
3. Service makes HTTP request via Axios
4. Request includes JWT token (from Context)
5. Backend validates and responds
6. Service updates local state or Context
7. Component re-renders with new data

**State Management:**
- **Local State:** Component-specific (form inputs, UI toggles)
- **Global State:** AuthContext (user, token, loading)
- **Server State:** Fetched on demand, not cached (simplicity)

### 2.2 Backend Architecture

```
┌──────────────────────────────────────┐
│       HTTP Request (Client)          │
└────────────────┬─────────────────────┘
                 │
        ┌────────▼────────┐
        │  Express.js     │ (Server)
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │   Middleware    │
        │ (Auth, Logging) │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │    Routes       │ (Endpoints)
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  Controllers    │ (Business Logic)
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │    Models       │ (Mongoose)
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │   MongoDB       │ (Database)
        └────────────────────┘
```

**Request Flow:**
1. Client sends HTTP request with JWT token
2. Express receives request
3. Auth middleware validates token
4. Route handler (Controller) executes
5. Controller calls Mongoose model methods
6. Model queries/modifies database
7. Response returned to client with JSON data

**Code Organization:**
- **Routes:** Define endpoints and HTTP methods
- **Controllers:** Handle request/response, call services
- **Models:** Define schema, validation, database operations
- **Middleware:** Cross-cutting concerns (auth, logging, error handling)
- **Utils:** Helper functions (calculations, formatting)

---

## 3. Key Design Decisions & Trade-offs

### 3.1 Frontend Decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **Context API over Redux** | Simpler for MVP, less boilerplate | Limited for complex state trees |
| **Axios over Fetch** | Better DX, interceptors | Extra dependency |
| **TailwindCSS over CSS-in-JS** | Faster development, smaller bundle | Learning curve |
| **Recharts over D3.js** | React-friendly, less code | Less customization |

### 3.2 Backend Decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **Express over Fastify** | Simplicity, large ecosystem | Marginally slower |
| **JWT over Sessions** | Scalable, stateless | Token refresh complexity |
| **Mongoose over Raw MongoDB** | Validation, middleware hooks | Small performance overhead |
| **express-validator** | Chainable, clear errors | Slightly verbose |

### 3.3 Database Decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **MongoDB over PostgreSQL** | Flexible schema, free tier | Not ideal for complex queries |
| **NoSQL over SQL** | Rapid development, flexible | No ACID guarantees (mitigated) |
| **Single collection queries** | Simplicity, performance | No complex joins |

---

## 4. Performance Considerations

### Frontend
- **Code Splitting:** React.lazy for routes (Phase 3)
- **Memoization:** useMemo for expensive calculations
- **Image Optimization:** Lazy load charts, defer non-critical
- **Bundle Size:** Tree-shaking, unused imports removal

### Backend
- **Database Indexes:** userId and date for fast queries
- **Query Optimization:** Select only needed fields
- **Caching:** Implement Redis for frequently accessed data (Phase 2+)
- **Rate Limiting:** Prevent abuse with express-rate-limit

### Network
- **HTTP/2 Multiplexing:** Supported by deployment platforms
- **Gzip Compression:** Express middleware
- **CDN:** Vercel and Railway provide edge caching

---

## 5. Security Considerations

### Authentication & Authorization
- **JWT Expiration:** 7 days (balance between security and UX)
- **HttpOnly Cookies:** Future enhancement for XSS protection
- **HTTPS Only:** Enforced in production

### Data Protection
- **Password Hashing:** bcryptjs with 10 salt rounds
- **Input Validation:** Server-side with express-validator
- **SQL Injection:** Not applicable (MongoDB uses object-based queries)
- **XSS Prevention:** React auto-escapes by default

### API Security
- **CORS:** Restricted to frontend domain in production
- **Rate Limiting:** Prevent brute force attacks
- **Request Size Limits:** Prevent payload bomb attacks
- **Helmet.js:** HTTP header hardening (Phase 3)

---

## 6. Scalability Path

### Phase 1-2 (Current)
- Single database instance
- No caching layer
- Manual scaling via deployment platform

### Phase 3+
- **Caching:** Redis for frequently accessed data
- **Database Replication:** MongoDB Atlas auto-replication
- **Load Balancing:** Deployment platform handles
- **Horizontal Scaling:** Stateless backend allows easy scaling

### Long-term Considerations
- **Microservices:** Separate analytics service (if needed)
- **Message Queue:** Bull/Redis for async tasks
- **Search Engine:** Elasticsearch for advanced filtering
- **CDN:** CloudFlare for global distribution

---

## 7. Development Workflow

### Version Control
- **Main Branch:** Production-ready code
- **Develop Branch:** Integration branch for features
- **Feature Branches:** One feature per branch (`feature/auth-setup`)
- **Commit Naming:** `feat:`, `fix:`, `docs:`, `refactor:` prefixes

### Code Quality
- **ESLint:** Enforced on commit (husky + lint-staged, Phase 2)
- **Prettier:** Automatic formatting on save
- **Testing:** Unit tests for utilities, integration tests for APIs (Phase 3)

### Deployment
- **Frontend:** Vercel CI/CD (auto-deploy on push to main)
- **Backend:** Railway CI/CD (auto-deploy on push to main)
- **Environment:** Separate envs for dev, staging (Phase 2), production

---

## 8. Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│              Internet / Users                   │
└────────────────┬────────────────────────────────┘
                 │
       ┌─────────┴──────────┐
       │                    │
    ┌──▼──┐              ┌──▼──┐
    │Vercel│              │Railway│
    │(FE)  │              │(BE)  │
    └──┬──┘              └──┬──┘
       │                    │
    ┌──▼──────────┐     ┌──▼──────────┐
    │React App    │     │Express API  │
    │Build: /out  │     │Node.js      │
    └────────────┘     └──┬──────────┘
                           │
                        ┌──▼──────────┐
                        │ MongoDB     │
                        │ Atlas       │
                        │ Cluster     │
                        └─────────────┘
```

---

## 9. Future Technology Considerations

### Phase 2+
- **Redis:** Caching layer for analytics
- **Bull:** Job queue for email notifications
- **Socket.io:** Real-time notifications (Phase 2+)

### Post-MVP
- **GraphQL:** If complex querying needed
- **TypeScript:** Type safety (Phase 2+)
- **Next.js:** Future rewrite for SSR/SSG
- **React Native:** Mobile app (separate project)

---

## 10. Dependencies Summary

### Frontend Key Dependencies
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "recharts": "^2.x",
  "tailwindcss": "^3.x"
}
```

### Backend Key Dependencies
```json
{
  "express": "^4.x",
  "mongoose": "^7.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x",
  "express-validator": "^7.x",
  "dotenv": "^16.x"
}
```

---

**Document Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Approved for Phase 1 Development
