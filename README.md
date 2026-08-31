# Social Media API

A production-oriented RESTful backend for a social media platform built with **Node.js, Express, MongoDB, Redis, BullMQ, Docker, and GitHub Actions**.

The project focuses on backend engineering concepts such as authentication, authorization, media handling, caching, asynchronous job processing, rate limiting, pagination, validation, testing, and CI automation.

> **Project status:** Backend core + Reels implementation completed.
> **In progress:** Agentic AI content moderation and production deployment.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login
* Password hashing with `bcrypt`
* JWT-based authentication
* Protected routes
* Authorization based on resource ownership
* Secure authentication middleware
* Environment-based secret management

### 👤 User Management

* User profile management
* Follow / unfollow functionality
* Follower and following relationships
* User-specific authorization

### 📝 Posts

* Create posts
* Retrieve posts
* Update posts
* Delete posts
* Owner-based authorization
* Feed generation based on followed users
* Pagination for feed retrieval
* MongoDB population for related user data

### 🎬 Reels

* Create reels
* Upload video media
* Cloudinary-based media storage
* Retrieve reels
* Reel interactions
* Reel comments
* Protected reel operations
* Media upload middleware

### ⚡ Redis

Redis is used as an infrastructure component for:

* Feed caching
* Cache invalidation
* Login rate limiting
* Temporary data with TTL
* Reducing repeated database queries

The feed cache is invalidated when relevant social graph/content changes occur.

### 🔄 Background Job Processing

The application uses **BullMQ + Redis** for asynchronous processing.

Current architecture includes:

* Post processing queue
* Background worker
* Job-based processing
* Redis-backed queue infrastructure

This allows expensive or asynchronous operations to be separated from the main HTTP request lifecycle.

### 🛡️ Rate Limiting

Redis-backed rate limiting is implemented to protect sensitive endpoints such as login from excessive requests.

Example behavior:

```text
Request
   ↓
Rate Limiter
   ↓
Redis counter
   ↓
Allowed → Controller
Blocked → 429 Too Many Requests
```

### ✅ Validation & Error Handling

* Request validation using `express-validator`
* Schema validation using `Zod`
* Centralized application error handling
* HTTP status code based responses
* Validation of incoming request data

### 🧪 Testing

The project includes automated backend tests using:

* Jest
* Supertest

Testing is used to verify API behavior without relying only on manual Postman testing.

### 🐳 Docker

The application is containerized using Docker.

Docker is used to provide a consistent runtime environment and make the backend easier to deploy.

### 🔁 CI with GitHub Actions

A GitHub Actions workflow is included for continuous integration.

Current CI setup is used to automatically validate changes pushed to the repository.

---

# 🏗️ Architecture

The backend follows a modular layered architecture:

```text
                    Client
                      │
                      ▼
               Express REST API
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
   Authentication            Validation
      Middleware             Middleware
          │                       │
          └───────────┬───────────┘
                      ▼
                 Controllers
                      │
                      ▼
                  MongoDB
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
       Redis                 Cloudinary
   Cache / Rate Limit       Media Storage
          │
          ▼
       BullMQ
          │
          ▼
      Background
       Workers
```

The project separates application concerns into:

```text
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── queues/
├── routes/
├── workers/
├── app.js
└── server.js
```

This structure keeps routing, business logic, database models, middleware, queues, and workers separated instead of putting the entire application into a few large files.

---

# 🧰 Tech Stack

| Technology        | Purpose                   |
| ----------------- | ------------------------- |
| Node.js           | Runtime                   |
| Express.js        | REST API framework        |
| MongoDB           | Primary database          |
| Mongoose          | MongoDB ODM               |
| JWT               | Authentication            |
| bcrypt            | Password hashing          |
| Redis             | Caching & rate limiting   |
| BullMQ            | Background job processing |
| Cloudinary        | Media storage             |
| Multer            | File upload handling      |
| Zod               | Schema validation         |
| express-validator | Request validation        |
| Jest              | Testing                   |
| Supertest         | API integration testing   |
| Docker            | Containerization          |
| GitHub Actions    | CI automation             |

The current `package.json` confirms the core dependencies including Express, Mongoose, Redis, BullMQ, Cloudinary, JWT, bcrypt, Multer, Jest, and Supertest.

---

# 🔑 Authentication Flow

```text
User
 │
 ├── Register
 │      │
 │      ▼
 │   Validate input
 │      │
 │      ▼
 │   Hash password
 │      │
 │      ▼
 │   Store user
 │
 └── Login
        │
        ▼
   Validate credentials
        │
        ▼
    Generate JWT
        │
        ▼
      Client
        │
        ▼
 Authorization: Bearer <token>
        │
        ▼
    JWT Middleware
        │
        ▼
    Protected Route
```

Passwords are hashed before being stored, and authenticated requests are authorized through JWT middleware.

---

# ⚡ Redis Caching

The feed system uses Redis caching to reduce repeated database queries.

```text
GET /feed
     │
     ▼
Check Redis
     │
 ┌───┴────┐
 │        │
Hit      Miss
 │        │
 ▼        ▼
Return   MongoDB
cache    query
          │
          ▼
       Store in
        Redis
          │
          ▼
       Response
```

Cache invalidation is performed when changes to posts or social relationships can make an existing cached feed stale.

---

# 🔄 Background Processing with BullMQ

The application uses a Redis-backed BullMQ queue to process background jobs.

```text
API Request
     │
     ▼
Create Post
     │
     ▼
MongoDB
     │
     ▼
Add Job to BullMQ
     │
     ▼
Return API Response
     
          │
          ▼
     BullMQ Worker
          │
          ▼
   Background Processing
```

This architecture provides a foundation for adding additional asynchronous processing without blocking the API request.

---

# 🎬 Media Upload Architecture

Reel videos are handled separately from the application server's permanent storage.

```text
Client
  │
  ▼
Express API
  │
  ▼
Multer
  │
  ▼
Cloudinary
  │
  ▼
Media URL
  │
  ▼
MongoDB
```

The database stores the relevant media information while Cloudinary handles the actual media storage.

---

# 🛡️ Rate Limiting Architecture

Redis is used to track request attempts.

```text
Login Request
     │
     ▼
Rate Limiter
     │
     ▼
Redis
     │
     ├── Within limit → Continue
     │
     └── Limit exceeded → 429
```

This protects authentication endpoints from excessive repeated requests.

---

# 🧪 Testing

The project uses:

```text
Jest
   +
Supertest
```

This allows API endpoints to be tested programmatically and helps verify backend behavior without depending exclusively on manual API testing.

Run tests with:

```bash
npm test
```

---

# 🐳 Running with Docker

Build the image:

```bash
docker build -t sm-api .
```

Run the container:

```bash
docker run -p 3000:3000 sm-api
```

Production environment variables should be supplied securely rather than hard-coded into the image.

---

# 💻 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/adityayadav000/Social-Media-API.git
cd Social-Media-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file containing the required configuration for:

```text
PORT
MONGODB_URI
JWT_SECRET
REDIS_URL
CLOUDINARY credentials
```

Do **not** commit `.env` to Git.

### 4. Start the development server

```bash
npm run dev
```

The production start command is:

```bash
npm start
```

---

# 📁 Project Structure

```text
Social-Media-API/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── src/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── redis.js
│   │
│   ├── controllers/
│   │   ├── post.controller.js
│   │   ├── reel.controller.js
│   │   ├── ReelComment.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware/
│   │   ├── rateLimiter.js
│   │   └── upload.middleware.js
│   │
│   ├── models/
│   │   ├── reel.model.js
│   │   └── ReelComment.model.js
│   │
│   ├── queues/
│   │   └── post.queue.js
│   │
│   ├── routes/
│   │   ├── reels.routes.js
│   │   ├── Reelcomment.routes.js
│   │   └── user.routes.js
│   │
│   ├── workers/
│   │   └── post.worker.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│
├── .dockerignore
├── .gitignore
├── Dockerfile
├── package.json
└── package-lock.json
```

The current repository reflects this modular `src` structure and also contains separate test, Docker, and GitHub Actions configuration.

---

# 🚧 Upcoming Improvements

The project is still under active development.

### 🤖 Agentic AI Content Moderation

Planned architecture:

```text
New Post / Reel
      │
      ▼
BullMQ Queue
      │
      ▼
AI Moderation Agent
      │
      ├── Safe
      │
      ├── Flagged
      │
      └── Requires Further Analysis
      │
      ▼
Update Content Status
```

The goal is to integrate AI moderation into the existing asynchronous architecture instead of making AI inference block the main API request.

### ☁️ Production Deployment

Planned deployment work includes:

* Production cloud deployment
* Production MongoDB configuration
* Production Redis configuration
* Docker-based deployment
* Secure environment/secrets management
* CI/CD deployment pipeline
* Production monitoring and logging

---

# 🗺️ Development Roadmap

```text
[x] REST API foundation
[x] Authentication & Authorization
[x] User management
[x] Posts
[x] Follow / Unfollow
[x] Feed + Pagination
[x] Redis caching
[x] Redis rate limiting
[x] BullMQ background jobs
[x] Reel functionality
[x] Reel comments
[x] Cloudinary media storage
[x] Docker
[x] GitHub Actions CI
[x] Automated API testing
[ ] Agentic AI content moderation
[ ] Production deployment
[ ] Production monitoring
```

---

# 🎯 Project Goals

This project is being developed beyond a basic CRUD application.

The main engineering goals are:

* Build a modular REST API
* Implement secure authentication and authorization
* Handle media uploads
* Improve API performance using caching
* Introduce asynchronous processing
* Protect APIs using rate limiting
* Automate testing and CI
* Containerize the application
* Integrate AI into a real backend workflow
* Deploy the system to a production cloud environment

---

# 📌 Current Status

**Backend:** 🟢 Core functionality implemented

**Reels:** 🟢 Implemented

**Redis:** 🟢 Implemented

**BullMQ:** 🟢 Implemented

**Docker:** 🟢 Implemented

**CI:** 🟢 Implemented

**Testing:** 🟢 Implemented

**Agentic AI moderation:** 🟡 Planned

**Production deployment:** 🟡 Planned

---

## Repository

[GitHub Repository — Social Media API](https://github.com/adityayadav000/Social-Media-API?utm_source=chatgpt.com)
