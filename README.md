# Social Media API

Production-oriented REST API for a social media platform with authentication, posts, comments, follows, personalized feeds, video reels, Cloudinary media storage, Redis caching, BullMQ jobs, AI-assisted moderation, Docker, Terraform, and GitHub Actions.

## Live API

| Resource | URL |
| --- | --- |
| API base URL | <https://social-media-api-8p9u.onrender.com> |
| Health check | <https://social-media-api-8p9u.onrender.com/health> |
| Swagger UI | <https://social-media-api-8p9u.onrender.com/api-docs> |
| Prometheus metrics | <https://social-media-api-8p9u.onrender.com/metrics> |

The deployed service currently runs on Render's free plan from the Docker image `princeofsaiyans/sm-api:latest`. Free instances may sleep when idle.

## What It Provides

- JWT authentication with bcrypt password hashing
- User profiles, search, follow and unfollow operations
- Posts with ownership checks, editing, deletion, likes, and comments
- Personalized post and reel feeds with pagination
- Video reel uploads through Multer and Cloudinary
- Reel likes, views, comments, and moderation status
- Redis-backed login rate limiting, caching, feed invalidation, and view deduplication
- BullMQ background jobs for post processing and content moderation
- AI moderation for posts, comments, reel captions, and reel comments
- Structured logging with Winston and request metrics with Prometheus
- Swagger/OpenAPI documentation at `/api-docs`
- Jest and Supertest integration tests
- Docker image publishing through GitHub Actions
- Render deployment managed with Terraform

## Technology

| Layer | Technology |
| --- | --- |
| Runtime | Node.js 22 |
| HTTP API | Express 5 |
| Database | MongoDB with Mongoose |
| Cache and queues | Redis and BullMQ |
| Authentication | JWT and bcrypt |
| Media | Multer and Cloudinary |
| Moderation | Google Gemini/OpenAI integrations |
| Documentation | Swagger UI and OpenAPI |
| Observability | Winston and prom-client |
| Testing | Jest and Supertest |
| Delivery | Docker, GitHub Actions, Render, Terraform |

## Architecture

```text
Client
  |
  v
Express API
  |
  +--> JWT middleware --> Controllers --> MongoDB
  |
  +--> Redis cache, rate limiting, and view tracking
  |
  +--> Cloudinary video storage
  |
  +--> BullMQ moderation/post queues --> Background workers --> AI moderation
```

The API process handles request/response work. Expensive or asynchronous work is sent to Redis-backed BullMQ queues so moderation and post processing do not block the main request path.

## API Reference

Protected endpoints require:

```http
Authorization: Bearer <jwt-token>
```

### System

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/` | No | Basic service response |
| GET | `/health` | No | Health check |
| GET | `/api-docs` | No | Swagger UI |
| GET | `/metrics` | No | Prometheus metrics |

### Authentication and users

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/users/register` | No | Register with `fullName`, `username`, `email`, and `password` |
| POST | `/users/login` | No | Login with `email` and `password`; returns a one-day JWT |
| GET | `/users/profile` | Yes | Get the authenticated user's profile |
| GET | `/users/:userId/profile` | No | Get a user's profile |
| GET | `/users/search?username=<value>` | No | Search users by username |
| GET | `/users/feed?page=1&limit=10` | Yes | Get the authenticated user's post feed |
| POST | `/users/:userId/follow` | Yes | Follow a user |
| DELETE | `/users/:userId/follow` | Yes | Unfollow a user |

### Posts and comments

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/posts/create` | Yes | Create a post with `content` |
| GET | `/posts` | No | List posts |
| GET | `/posts/:postId` | No | Get one post |
| PUT | `/posts/:postId` | Yes | Update an owned post with `content` |
| DELETE | `/posts/:postId` | Yes | Delete an owned post |
| POST | `/posts/:postId/like` | Yes | Like a post |
| DELETE | `/posts/:postId/like` | Yes | Unlike a post |
| POST | `/posts/:postId/comments` | Yes | Add a comment with `content` |
| GET | `/posts/:postId/comments` | No | List post comments |
| DELETE | `/posts/comments/:commentId` | Yes | Delete an owned comment |

### Reels

Reel uploads use `multipart/form-data` with a file field named `video`. MP4, WebM, and MOV files are accepted up to 100 MB.

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/reels` | Yes | Upload a reel with `video` and optional `caption` |
| GET | `/api/reels` | No | List reels with optional `page` and `limit` |
| GET | `/api/reels/feed` | Yes | Get the personalized reel feed |
| POST | `/api/reels/:reelId/like` | Yes | Like a reel |
| POST | `/api/reels/:reelId/unlike` | Yes | Unlike a reel |
| POST | `/api/reels/:reelId/view` | Yes | Count a reel view once per user per day |
| POST | `/api/reels/:reelId/comment` | Yes | Add a reel comment with `content` |
| GET | `/api/reels/:reelId/comments` | Yes | List reel comments |
| DELETE | `/api/reels/comments/:commentId` | Yes | Delete an owned reel comment |

## Quick Start

### Requirements

- Node.js 22 or later
- MongoDB database
- Redis instance with a connection URL
- Cloudinary account for reel uploads
- AI provider credentials when running moderation workers

### Install

```bash
git clone https://github.com/adityayadav000/Social-Media-API.git
cd Social-Media-API
npm ci
```

### Configure environment

Create a local `.env` file. Never commit it.

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
REDIS_URL=redis://:<password>@<host>:<port>
JWT_SECRET=replace-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
```

The API requires both `MONGODB_URI` and `REDIS_URL` during startup. Cloudinary variables are required for reel uploads. AI moderation configuration is read by the moderation service and should be supplied through the provider-specific environment variables used there.

### Run locally

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The server listens on `http://localhost:3000` by default. Open <http://localhost:3000/api-docs> for interactive API documentation.

## Example Flow

Register:

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Ada Lovelace","username":"ada","email":"ada@example.com","password":"strong-password"}'
```

Login and copy the returned `token`:

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"strong-password"}'
```

Create an authenticated post:

```bash
curl -X POST http://localhost:3000/posts/create \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello from the Social Media API"}'
```

Upload a reel:

```bash
curl -X POST http://localhost:3000/api/reels \
  -H "Authorization: Bearer <jwt-token>" \
  -F "video=@./sample.mp4" \
  -F "caption=My first reel"
```

## Background Processing and Moderation

Posts, comments, reel captions, and reel comments are submitted to the moderation queue. The moderation worker retrieves the content, calls the configured AI moderation service, stores the category, confidence, and reason, and updates the moderation decision.

Run workers in separate processes when deploying them independently:

```bash
node src/workers/post.worker.js
node src/workers/moderation.worker.js
```

Workers require access to the same MongoDB and Redis services as the API. The exact AI provider configuration should remain in deployment secrets, never in source control.

## Docker

Build and run the API container:

```bash
docker build -t sm-api .
docker run --env-file .env -p 3000:3000 sm-api
```

The image is based on Node.js 22 Alpine, exposes port `3000`, and starts with `npm start`.

## Deployment

### Render

The live service is deployed on Render from `docker.io/princeofsaiyans/sm-api:latest`:

<https://social-media-api-8p9u.onrender.com>

Configure these Render environment variables as secrets:

```text
MONGODB_URI
REDIS_URL
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Keep the application port compatible with Render's `PORT` environment variable. The server binds to `0.0.0.0` and defaults to port `3000` locally.

### Terraform

Terraform configuration is in the `Terraform/` directory and uses the Render provider.

```bash
cd Terraform
terraform init
terraform plan \
  -var="mongodb_uri=$MONGODB_URI" \
  -var="jwt_secret=$JWT_SECRET" \
  -var="cloudinary_cloud_name=$CLOUDINARY_CLOUD_NAME" \
  -var="cloudinary_api_key=$CLOUDINARY_API_KEY" \
  -var="cloudinary_api_secret=$CLOUDINARY_API_SECRET"
terraform apply
```

Do not commit `terraform.tfstate` or pass real credentials in shell history. Use a remote encrypted state backend and CI-managed secret variables for production Terraform runs.

## Testing and CI

Run the test suite:

```bash
npm test
```

The GitHub Actions workflow runs on pushes and pull requests targeting `main`. It installs dependencies with `npm ci`, runs Jest with the test MongoDB secret, builds the Docker image, logs in to Docker Hub, and pushes `princeofsaiyans/sm-api:latest`.

Required GitHub Actions secrets include:

```text
MONGODB_TEST_URI
JWT_SECRET
DOCKERHUB_USERNAME
DOCKER_TOKEN
```

## Project Structure

```text
src/
├── config/         Database, Redis, Cloudinary, logging, metrics, Swagger
├── controllers/    HTTP request handlers
├── middleware/     JWT auth, rate limiting, uploads
├── models/         Mongoose schemas
├── queues/         BullMQ queue definitions
├── routes/         Express route modules
├── services/       Moderation and AI services
├── validators/     Request validation utilities
├── workers/        Background job processors
├── app.js          Express application and route registration
└── server.js       Startup, database/Redis connections, and listener

tests/              Jest and Supertest integration tests
Terraform/          Render infrastructure configuration
Dockerfile          Production container definition
prometheus.yml      Prometheus scrape configuration
```

## Security Notes

- Use a unique, high-entropy `JWT_SECRET` in every environment.
- Keep MongoDB, Redis, Cloudinary, and AI credentials in a secret manager or deployment secret store.
- Restrict MongoDB network access and Redis authentication in production.
- Do not commit `.env`, Terraform state, credentials, or uploaded media.
- Rotate any credential that has been exposed through logs, state files, screenshots, or source control.

## Roadmap

- Harden production secret and Terraform state management
- Add explicit worker deployment and process supervision
- Add richer moderation review workflows and audit history
- Add broader API contract and end-to-end coverage
- Add production dashboards, alerting, and service-level health checks

## License

This project currently uses the `ISC` license declared in `package.json`.

## Repository

<https://github.com/adityayadav000/Social-Media-API>
