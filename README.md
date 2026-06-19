# 🎟️ EzyTicket Server

A full-featured, modular **RESTful API** backend for the **EzyTicket** platform — a unified ticket booking system supporting **Events** and **Bus Travel**. Built with **Node.js**, **Express.js v5**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Database Schema](#-database-schema)
- [API Modules & Endpoints](#-api-modules--endpoints)
- [Authentication & Role System](#-authentication--role-system)
- [Third-Party Integrations](#-third-party-integrations)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Scripts](#-scripts)
- [Related Repository](#-related-repository)

---

## 🌐 Overview

**EzyTicket Server** is the backend API for the EzyTicket platform. It handles:

- 🎉 **Event Ticketing** — Create, manage, and purchase event tickets
- 🚌 **Bus Travel Booking** — Bus services, scheduling, and seat reservations
- 💳 **Payment Processing** — SSLCommerz (BDT) and Stripe (USD) integrations
- 🔐 **Authentication** — JWT-based auth with OTP email verification via Brevo
- 👤 **Role-Based Access Control** — 5 distinct user roles with protected routes

The API is versioned and accessible at:

```
http://localhost:5000/api/v1
```

---

## 🛠️ Tech Stack

### Core
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | LTS | Runtime |
| Express.js | ^5.1.0 | HTTP Framework |
| TypeScript | ^5.9.3 | Type Safety |
| Prisma | ^7.0.0 | ORM |
| PostgreSQL | — | Primary Database |

### Authentication & Security
| Package | Purpose |
|---------|---------|
| `jsonwebtoken` | JWT access & refresh tokens |
| `bcrypt` | Password hashing |
| `cookie-parser` | HTTP cookie handling |
| `firebase-admin` | Google/Social Auth |

### File Uploads
| Package | Purpose |
|---------|---------|
| `multer` | Multipart file handling |
| `cloudinary` | Cloud image storage |
| `multer-storage-cloudinary` | Direct Cloudinary uploads |
| `@aws-sdk/client-s3` | AWS S3 storage (alternative) |

### Payments
| Package | Purpose |
|---------|---------|
| `sslcommerz-lts` | SSLCommerz payment gateway (BDT) |
| `stripe` | Stripe payment gateway (USD) |

### Communication
| Package | Purpose |
|---------|---------|
| Brevo API | Transactional email (OTP, notifications) |
| SMTP | Fallback email service |
| Twilio | SMS notifications |

### Utilities
| Package | Purpose |
|---------|---------|
| `zod` | Request schema validation |
| `compression` | Response compression |
| `cors` | Cross-Origin Resource Sharing |
| `axios` | Internal HTTP requests |
| `http-status` | Standardized HTTP status codes |

---

## 📁 Project Architecture

The project follows a **modular MVC** pattern where each domain feature is self-contained.

```
ezy-ticket-server/
├── prisma/
│   ├── schema.prisma          # Prisma data models & enums
│   └── migrations/            # Auto-generated DB migrations
│
├── src/
│   ├── server.ts              # HTTP server bootstrap & graceful shutdown
│   ├── app.ts                 # Express app setup, middleware registration
│   │
│   ├── config/
│   │   └── index.ts           # Centralized environment config
│   │
│   ├── app/
│   │   ├── routes/
│   │   │   └── index.ts       # Central route registration
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.ts             # JWT auth guard
│   │   │   ├── checkBlock.ts       # Blocked user interceptor
│   │   │   ├── globalErrorHandler.ts  # Global error handler
│   │   │   ├── optionalAuth.ts     # Optional JWT (public routes)
│   │   │   └── validateRequest.ts  # Zod request validator
│   │   │
│   │   └── modules/
│   │       ├── Auth/              # Registration, login, OTP, password reset
│   │       ├── User/              # Profile, role management, admin tools
│   │       ├── Event/             # Event CRUD, wishlists, reviews
│   │       ├── Travel/            # Bus services, schedules, locations
│   │       └── Order/             # Payment, order lifecycle management
│   │
│   ├── helpars/
│   │   ├── fileUploader.ts        # Cloudinary uploader (Multer)
│   │   ├── fileUploadHelper.ts    # S3/alternative uploader
│   │   ├── fileDelete.ts          # Cloud file deletion
│   │   ├── jwtHelpers.ts          # JWT sign/verify utilities
│   │   ├── generateOtp.ts         # OTP generator
│   │   ├── paginationHelper.ts    # Pagination utilities
│   │   └── template/              # Email HTML templates
│   │
│   ├── shared/
│   │   ├── catchAsync.ts          # Async error wrapper
│   │   ├── sendResponse.ts        # Standardized API response
│   │   ├── pick.ts                # Object key picker utility
│   │   ├── brevoMailSender.ts     # Brevo transactional email
│   │   ├── firebase.ts            # Firebase admin init
│   │   ├── stripe.ts              # Stripe client init
│   │   └── html.ts                # Email HTML builder
│   │
│   ├── interfaces/                # Shared TypeScript interfaces
│   ├── enums/                     # Shared enums (user roles, etc.)
│   ├── errors/                    # Custom error classes
│   ├── constants/                 # App-wide constants
│   └── lib/                       # External library wrappers
│
├── prisma.config.ts               # Prisma config
├── tsconfig.json
└── package.json
```

Each module follows the structure:
```
ModuleName/
├── module.controller.ts   # Request handlers
├── module.service.ts      # Business logic
├── module.routes.ts       # Route definitions + auth guards
└── module.interface.ts    # TypeScript types (if applicable)
```

---

## 🗄️ Database Schema

The database is **PostgreSQL** managed via **Prisma ORM**.

### Models

| Model | Description |
|-------|-------------|
| `User` | Platform users with roles and status |
| `Event` | Event listings with ticketing details |
| `EventReview` | Customer reviews for events |
| `Wishlist` | User event wishlists |
| `BusService` | Bus operator services with routes |
| `BusSchedule` | Scheduled trips with booked seats |
| `TravelLocation` | Departure/destination locations |
| `Order` | Unified order record for all product types |

### Enums

```prisma
enum Role {
  SUPER_ADMIN
  ADMIN
  EVENT_MANAGER
  TRAVEL_MANAGER
  USER
}

enum UserStatus    { ACTIVE | INACTIVE | BLOCKED | SUSPENDED }
enum BusType       { AC | NON_AC }
enum ProductType   { EVENT | BUS }
enum OrderStatus   { PENDING | SUCCESSED | CANCELLED | FAILED }
enum PaymentMethod { SSLCOMMERZ | STRIPE }
enum Currency      { BDT | USD }
```

---

## 📡 API Modules & Endpoints

**Base URL:** `http://localhost:5000/api/v1`

---

### 🔐 Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register a new user (with profile image upload) |
| `POST` | `/login` | ❌ | Login and receive JWT tokens |
| `POST` | `/logout` | ❌ | Invalidate session |
| `POST` | `/email-verification-otp` | ❌ | Send OTP for email verification |
| `POST` | `/verify-otp` | ❌ | Verify OTP for password reset |
| `POST` | `/forgot-password` | ❌ | Send password reset link |
| `POST` | `/reset-password` | ❌ | Reset password using token |
| `PUT`  | `/change-password` | ✅ | Change password for logged-in user |
| `POST` | `/resend-otp` | ❌ | Resend OTP |
| `DELETE` | `/delete-user` | ✅ | Delete own account |

---

### 👤 User — `/api/v1/user`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/profile` | ✅ | Any | Get own profile |
| `PUT` | `/update-profile` | ✅ | Any | Update profile with image |
| `PUT` | `/role-change` | ✅ | Any | Request role change |
| `GET` | `/:email` | ✅ | Any | Get user by email |
| `GET` | `/admin/users` | ✅ | ADMIN | Get all users |
| `GET` | `/admin/user/:id` | ✅ | ADMIN | Get single user by ID |
| `PATCH` | `/admin/user/suspend/:id` | ✅ | ADMIN | Suspend a user |
| `PATCH` | `/admin/change-role/:id` | ✅ | ADMIN | Change user role |
| `DELETE` | `/admin/user/:id` | ✅ | ADMIN | Remove a user |

---

### 🎉 Events — `/api/v1/events`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/` | ❌ | — | Get all events |
| `GET` | `/:id` | ❌ | — | Get single event |
| `GET` | `/my-added-events/:email` | ✅ | Any | Get events added by manager |
| `POST` | `/` | ✅ | ADMIN, EVENT_MANAGER | Create an event |
| `PATCH` | `/:id` | ✅ | ADMIN, EVENT_MANAGER | Update an event |
| `DELETE` | `/:id` | ✅ | ADMIN, EVENT_MANAGER | Delete an event |
| `PATCH` | `/verifyEvent/:id` | ✅ | ADMIN | Verify/approve an event |

---


### 🚌 Travel — `/api/v1/travel`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/bus` | ✅ | ADMIN, TRAVEL_MANAGER, USER | Get all bus services |
| `GET` | `/bus/:id` | ✅ | ADMIN, TRAVEL_MANAGER, USER | Get single bus service |
| `POST` | `/bus-create` | ✅ | ADMIN, TRAVEL_MANAGER | Create a bus service |
| `PUT` | `/bus/:id` | ✅ | ADMIN, TRAVEL_MANAGER | Update bus service |
| `DELETE` | `/bus/:id` | ✅ | ADMIN, TRAVEL_MANAGER | Delete bus service |
| `GET` | `/bus-ticket` | ❌ | — | Get all bus tickets/schedules |
| `POST` | `/bus-ticket` | ✅ | ADMIN, TRAVEL_MANAGER | Create a bus schedule |
| `GET` | `/schedule/:id` | ❌ | — | Get schedule by ID |
| `GET` | `/stand` | ❌ | — | Get all bus stands |
| `GET` | `/` | ❌ | — | Get all travel locations |
| `POST` | `/` | ❌ | — | Create travel location |

---

### 💳 Orders — `/api/v1/orders`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/` | ✅ | ADMIN | Get all orders |
| `GET` | `/my-orders` | ✅ | TRAVEL_MANAGER | Get own bus orders |
| `POST` | `/create-payment` | ✅ | Any | Create bus ticket order (SSLCommerz) |
| `POST` | `/event-payment` | ✅ | Any | Create event ticket order |
| `GET` | `/:tranId` | ❌ | — | Get order by transaction ID |
| `POST` | `/payment/success/:tranId` | ❌ | — | SSLCommerz payment success callback |
| `POST` | `/payment/fail/:tranId` | ❌ | — | SSLCommerz payment failure callback |
| `POST` | `/payment/cancel/:tranId` | ❌ | — | SSLCommerz payment cancel callback |
| `POST` | `/payment/ipn` | ❌ | — | SSLCommerz IPN notification handler |

---

## 🔐 Authentication & Role System

The API uses **JWT-based stateless authentication** with two tokens:

- **Access Token** — Short-lived, stored in cookie/header
- **Refresh Token** — Long-lived, used to renew access tokens

### Role Hierarchy

```
SUPER_ADMIN
    └── ADMIN
            ├── EVENT_MANAGER       → Manage events
            ├── TRAVEL_MANAGER      → Manage bus services & schedules
            └── USER                → Book tickets
```

### User Status Flow

```
ACTIVE → INACTIVE → SUSPENDED → BLOCKED
```

Blocked/Suspended users are intercepted by the `checkBlockedStatus` middleware.

---

## 🔗 Third-Party Integrations

| Service | Purpose | Config Key Prefix |
|---------|---------|-------------------|
| **Cloudinary** | Profile & event image uploads | `CLOUDINARY_*` |
| **Firebase Admin** | Social/Google authentication | `FIREBASE_*` |
| **SSLCommerz** | Bangladesh payment gateway (BDT) | `STORE_ID`, `STORE_PASS` |
| **Stripe** | International payment gateway (USD) | `STRIPE_*` |
| **Brevo (Sendinblue)** | Transactional emails (OTP, notifications) | `BREVO_*` |
| **SMTP** | Fallback email delivery | `smtp_*` |
| **Twilio** | SMS notifications | `TWILIO_*` |
| **AWS S3** | Alternative file storage | `AWS_*` |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Server
NODE_ENV=development
PORT=5000
SERVER_URL=http://localhost:5000

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Frontend URLs
FRONTEND_BASE_URL=http://localhost:3000
APP_DASHBOARD_URL=http://localhost:3000/dashboard

# JWT
JWT_SECRET=your_jwt_secret
EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d
RESET_PASS_TOKEN=your_reset_pass_token
RESET_PASS_TOKEN_EXPIRES_IN=10m
RESET_PASS_LINK=http://localhost:3000/reset-password

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# Platform
PLATFORM_CHARGE_PERCENTAGE=10

# Email (SMTP)
EMAIL=your_email@gmail.com
APP_PASS=your_app_password
smtp_server=smtp.gmail.com
smtp_port=587
smtp_user=your_email@gmail.com
smtp_pass=your_smtp_password

# Brevo Email
BREVO_API_KEY=your_brevo_api_key
BREVO_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=EzyTicket

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/...

# SSLCommerz (Bangladesh Payment)
STORE_ID=your_store_id
STORE_PASS=your_store_password
IS_LIVE=false

# Stripe (International Payment)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_ADMIN_ACCOUNT_ID=acct_...

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** database (local or cloud e.g., Neon, Supabase)
- **Bun** (optional, used for lock file) or **npm**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ezy-ticket-server.git
cd ezy-ticket-server
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Fill in all required variables in .env
```

### 4. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start the Development Server

```bash
npm run dev
```

The server will start at:
```
http://localhost:5000/api/v1
```

---

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start server with hot-reload via `ts-node-dev` |
| Build | `npm run build` | Compile TypeScript to `dist/` |
| Production | `npm start` | Run compiled JS from `dist/server.js` |

---

## 🌐 Related Repository

| Repository | Tech Stack | Description |
|------------|-----------|-------------|
| **[ezy-ticket-client](https://github.com/your-username/ezy-ticket-client)** | React 19, Vite, TypeScript, Redux Toolkit, TailwindCSS v4, DaisyUI, Framer Motion | Frontend SPA for EzyTicket |

### Client Tech Stack Summary

- ⚛️ **React 19** + **TypeScript**
- ⚡ **Vite** build tool
- 🗂️ **Redux Toolkit** + **TanStack React Query** for state & server state
- 🎨 **TailwindCSS v4** + **DaisyUI**
- 🎞️ **Framer Motion** + **AOS** for animations
- 🔀 **React Router v7**
- 💳 **Stripe React** integration
- 🔔 **React Hot Toast** + **SweetAlert2** for notifications
- 📋 **React Hook Form** for form management

---

## 📄 License

This project is **private** and not open for public distribution.

---

<div align="center">
  <strong>Built with ❤️ for the EzyTicket Platform</strong>
</div>