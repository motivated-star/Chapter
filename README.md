# 📘 Chapter Performance Dashboard – Backend API

A RESTful backend API for managing and analyzing chapter performance data. Built to simulate real-world backend challenges like filtering, caching, pagination, and rate limiting.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **Redis** (for caching & rate limiting)
- **Multer** (for JSON file uploads)
- **Express Rate Limit + Redis Store**

---
---

## 🌐 API Endpoints

### ✅ Public Endpoints

| Method | Endpoint                       | Description                              |
|--------|--------------------------------|------------------------------------------|
| GET    | `/api/v1/chapters`            | Get all chapters (with filters, cache, pagination) |
| GET    | `/api/v1/chapters/:id`        | Get a specific chapter by ID             |

#### 📌 Query Filters (on `GET /api/v1/chapters`)
- `class`
- `unit`
- `subject`
- `status`
- `weakChapters`
- `page` (default: 1)
- `limit` (default: 10)

### 🔐 Admin Endpoint

| Method | Endpoint           | Description                              |
|--------|--------------------|------------------------------------------|
| POST   | `/api/v1/chapters` | Upload a JSON file of chapters (Admin only) |

> The uploaded JSON is parsed. Valid chapters are saved; invalid ones are returned in the response with error details.

---

## 🛡 Features

### 📦 Caching (Redis)
- The `GET /api/v1/chapters` response is cached in Redis for **1 hour**.
- Cache is **automatically invalidated** when a new chapter is added via the POST endpoint.

### ⛔ Rate Limiting
- All endpoints are rate-limited to **30 requests per minute per IP** using Redis-backed store.

---

## 🔑 .env Structure

```env
# Server Port
PORT=5001

# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.qxqpbeo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Redis Cloud URL
REDIS_URL=redis://default:<password>@redis-12420.c265.us-east-1-2.ec2.redns.redis-cloud.com:12420

# Admin API Key for uploading chapters
ADMIN_API_KEY=your_admin_api_key_here


---

## 🔑 Setup Instruction

# Clone the repo
git clone https://github.com/your-username/chapter-dashboard-api.git
cd chapter-dashboard-api

# Install dependencies
npm install

# Start local MongoDB and Redis

# Start the server
npm start
