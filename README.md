# EzyTicket Server

A full-featured **Ticket Booking Backend API** built with **TypeScript**, **Express.js**, and **Prisma ORM** (PostgreSQL).

This server powers the **EzyTicket** platform — a multi-category ticketing system supporting Events, Entertainment (Cinema/Movies), and Travel (Bus Services) with integrated payment gateways.

---

## 🚀 Features

- ✅ **TypeScript** + **Express.js** — strongly typed, modular backend
- ✅ **Prisma ORM** with **PostgreSQL** — type-safe database access
- ✅ **JWT Authentication** — access token & refresh token with role-based access control
- ✅ **Multi-role Support** — `SUPER_ADMIN`, `ADMIN`, `EVENT_MANAGER`, `TRAVEL_MANAGER`, `ENTERTAINMENT_MANAGER`, `USER`
- ✅ **Event Management** — create, update, verify, delete events with image upload
- ✅ **Entertainment Module** — cinema halls & movie management
- ✅ **Travel Module** — bus services, schedules, locations & seat booking
- ✅ **Order & Payment** — SSLCommerz & Stripe payment gateways integrated
- ✅ **File Upload** — Cloudinary & AWS S3 support via Multer
- ✅ **Email Services** — Nodemailer (SMTP) & Brevo (Sendinblue) for OTP & notifications
- ✅ **Firebase** integration for push notifications
- ✅ **Wishlist** system for events
- ✅ **Global Error Handling** & structured API responses
- ✅ **Graceful Shutdown** with auto-restart on crash

---

## 🛠️ Tech Stack

| Technology       | Version  | Purpose                          |
|------------------|----------|----------------------------------|
| Node.js          | ≥18.x    | Runtime                          |
| TypeScript       | ^5.9.3   | Language                         |
| Express.js       | ^5.1.0   | Web framework                    |
| Prisma           | ^7.0.0   | ORM (PostgreSQL)                 |
| PostgreSQL        | —        | Primary database                 |
| JWT              | ^9.0.3   | Authentication                   |
| Bcrypt           | ^6.0.0   | Password hashing                 |
| Cloudinary       | ^2.9.0   | Image/file storage               |
| AWS S3           | ^3.982.0 | Alternative file storage         |
| SSLCommerz       | ^1.2.0   | Payment gateway (BDT)            |
| Stripe           | ^20.3.0  | Payment gateway (USD)            |
| Firebase Admin   | ^13.6.0  | Push notifications               |
| Multer           | ^2.0.2   | File upload handling             |
| Zod              | ^4.3.6   | Request validation               |
| ts-node-dev      | ^2.0.0   | Dev server with hot reload       |

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ezy-ticket-server.git
cd ezy-ticket-server
```

### 2. Install Dependencies

```bash
# using npm
npm install

# using bun (recommended — bun.lock is included)
bun install
```

### 3. Setup Environment Variables

Create a `.env` file in the project root and fill in the required values:

```env
# Server
NODE_ENV=development
PORT=5000
SERVER_URL=http://localhost:5000

# Frontend
FRONTEND_BASE_URL=http://localhost:3000
APP_DASHBOARD_URL=http://localhost:3000/dashboard

# Database (PostgreSQL)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# JWT
JWT_SECRET=your_jwt_secret
EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d
RESET_PASS_TOKEN=your_reset_pass_token
RESET_PASS_TOKEN_EXPIRES_IN=5m
RESET_PASS_LINK=http://localhost:3000/reset-password

# Password Hashing
BCRYPT_SALT_ROUNDS=12

# Email (SMTP)
EMAIL=your_email@gmail.com
APP_PASS=your_gmail_app_password
smtp_server=smtp.gmail.com
smtp_port=587
smtp_user=your_email@gmail.com
smtp_pass=your_smtp_password

# Brevo (Sendinblue) Email
BREVO_API_KEY=your_brevo_api_key
BREVO_EMAIL=your_brevo_email
BREVO_SENDER_NAME=EzyTicket

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_ADMIN_ACCOUNT_ID=acct_xxx

# SSLCommerz
STORE_ID=your_store_id
STORE_PASS=your_store_pass
IS_LIVE=false

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Platform Charge
PLATFORM_CHARGE_PERCENTAGE=10
```

### 4. Setup Prisma & Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to browse DB
npx prisma studio
```

### 5. Run the Development Server

```bash
# using npm
npm run dev

# using bun
bun run dev
```

---

## 📜 Available Scripts

```bash
# Run in development mode (hot reload with ts-node-dev)
npm run dev

# Build for production (TypeScript → JavaScript)
npm run build

# Run production build
npm run start

# Run tests
npm run test
```

---

## 📁 Folder Structure

```
ezy-ticket-server/
│
├── prisma/
│   ├── schema.prisma          # Database schema & models
│   └── migrations/            # Prisma migration history
│
├── src/
│   ├── app.ts                 # Express app setup (middleware, routes)
│   ├── server.ts              # Server entry point & graceful shutdown
│   │
│   ├── config/
│   │   └── index.ts           # Environment variables configuration
│   │
│   ├── app/
│   │   ├── middlewares/       # Auth, error handling, block check
│   │   ├── routes/
│   │   │   └── index.ts       # Central route aggregator (/api/v1)
│   │   │
│   │   └── modules/
│   │       ├── Auth/          # Register, Login, OTP, Password reset
│   │       ├── User/          # User profile, role management
│   │       ├── Event/         # Event CRUD & verification
│   │       ├── Entertainment/ # Cinema halls & movies
│   │       ├── Travel/        # Bus services, schedules, locations
│   │       └── Order/         # Orders & payment processing
│   │
│   ├── constants/             # App-wide constants
│   ├── enums/                 # TypeScript enums
│   ├── errors/                # Custom error classes
│   ├── helpars/               # File upload helpers (Cloudinary, S3)
│   ├── interfaces/            # Shared TypeScript interfaces
│   ├── lib/                   # Utility libraries
│   └── shared/                # Shared utilities & helpers
│
├── package.json               # Project metadata & scripts
├── bun.lock                   # Bun lockfile
├── tsconfig.json              # TypeScript configuration
├── prisma.config.ts           # Prisma configuration
└── README.md                  # Documentation
```

---

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### 🔐 Auth  `/api/v1/auth`
| Method | Endpoint                    | Access      | Description              |
|--------|-----------------------------|-------------|--------------------------|
| POST   | `/register`                 | Public      | Register new user        |
| POST   | `/login`                    | Public      | User login               |
| POST   | `/logout`                   | Auth        | User logout              |
| POST   | `/email-verification-otp`   | Public      | Send email OTP           |
| POST   | `/verify-otp`               | Public      | Verify OTP               |
| POST   | `/forgot-password`          | Public      | Forgot password request  |
| POST   | `/reset-password`           | Public      | Reset password           |
| PUT    | `/change-password`          | Auth        | Change password          |
| POST   | `/resend-otp`               | Public      | Resend OTP               |
| DELETE | `/delete-user`              | Auth        | Delete own account       |

### 👤 User  `/api/v1/user`
| Method | Endpoint                      | Access | Description               |
|--------|-------------------------------|--------|---------------------------|
| GET    | `/profile`                    | Auth   | Get my profile            |
| PUT    | `/update-profile`             | Auth   | Update profile & image    |
| PUT    | `/role-change`                | Auth   | Request role change       |
| GET    | `/admin/users`                | Admin  | Get all users             |
| GET    | `/admin/user/:id`             | Admin  | Get user by ID            |
| PATCH  | `/admin/user/suspend/:id`     | Admin  | Suspend a user            |
| PATCH  | `/admin/change-role/:id`      | Admin  | Change user role          |
| DELETE | `/admin/user/:id`             | Admin  | Remove user               |
| GET    | `/:email`                     | Auth   | Get user by email         |

### 🎉 Events  `/api/v1/events`
| Method | Endpoint                    | Access                  | Description          |
|--------|-----------------------------|-------------------------|----------------------|
| GET    | `/`                         | Public                  | Get all events       |
| GET    | `/:id`                      | Public                  | Get single event     |
| GET    | `/my-added-events/:email`   | Auth                    | Get my events        |
| POST   | `/`                         | Admin / Event Manager   | Create event         |
| PATCH  | `/:id`                      | Admin / Event Manager   | Update event         |
| DELETE | `/:id`                      | Admin / Event Manager   | Delete event         |
| PATCH  | `/verifyEvent/:id`          | Admin                   | Verify event         |

### 🎬 Entertainment  `/api/v1/entertainment`
| Method | Endpoint        | Access                        | Description          |
|--------|-----------------|-------------------------------|----------------------|
| GET    | `/halls`        | Public                        | Get all cinema halls |
| POST   | `/halls`        | Admin / Entertainment Manager | Create cinema hall   |
| GET    | `/movies`       | Public                        | Get all movies       |
| GET    | `/movies/:id`   | Public                        | Get single movie     |
| POST   | `/movies`       | Admin / Entertainment Manager | Create movie         |
| PATCH  | `/movies/:id`   | Admin / Entertainment Manager | Update movie         |
| DELETE | `/movies/:id`   | Admin / Entertainment Manager | Delete movie         |

### 🚌 Travel  `/api/v1/travel`
| Method | Endpoint          | Access                   | Description              |
|--------|-------------------|--------------------------|--------------------------|
| GET    | `/bus`            | Auth                     | Get bus services         |
| GET    | `/bus/:id`        | Auth                     | Get bus by ID            |
| POST   | `/bus-create`     | Admin / Travel Manager   | Create bus service       |
| PUT    | `/bus/:id`        | Admin / Travel Manager   | Update bus service       |
| DELETE | `/bus/:id`        | Admin / Travel Manager   | Delete bus service       |
| GET    | `/bus-ticket`     | Public                   | Get all bus tickets      |
| POST   | `/bus-ticket`     | Admin / Travel Manager   | Create bus schedule      |
| GET    | `/schedule/:id`   | Public                   | Get schedule by ID       |
| GET    | `/stand`          | Public                   | Get bus stands           |
| GET    | `/`               | Public                   | Get travel locations     |
| POST   | `/`               | Public                   | Create travel location   |

### 🛒 Orders & Payments  `/api/v1/orders`
| Method | Endpoint                      | Access          | Description                  |
|--------|-------------------------------|-----------------|------------------------------|
| GET    | `/`                           | Admin           | Get all orders               |
| GET    | `/my-orders`                  | Travel Manager  | Get my bus orders            |
| POST   | `/create-payment`             | Auth            | Create bus/travel order      |
| POST   | `/event-payment`              | Auth            | Create event order           |
| GET    | `/:tranId`                    | Public          | Get order by transaction ID  |
| POST   | `/payment/success/:tranId`    | Public          | SSLCommerz payment success   |
| POST   | `/payment/fail/:tranId`       | Public          | SSLCommerz payment fail      |
| POST   | `/payment/cancel/:tranId`     | Public          | SSLCommerz payment cancel    |
| POST   | `/payment/ipn`                | Public          | SSLCommerz IPN listener      |

---

## 🗄️ Database Models

| Model           | Description                             |
|-----------------|-----------------------------------------|
| `User`          | Platform users with roles               |
| `Event`         | Events (concerts, sports, etc.)         |
| `EventReview`   | User reviews for events                 |
| `CinemaHall`    | Cinema venues                           |
| `Movie`         | Movies screened at cinema halls         |
| `BusService`    | Bus operators & routes                  |
| `BusSchedule`   | Bus time schedules with seat tracking   |
| `Order`         | Purchase orders for any ticket type     |
| `Wishlist`      | Saved events per user                   |
| `TravelLocation`| Travel pickup/drop-off locations        |

---

## 💳 Payment Gateways

| Gateway     | Currency | Status     |
|-------------|----------|------------|
| SSLCommerz  | BDT      | ✅ Active  |
| Stripe      | USD      | ✅ Active  |

---

## 🔑 User Roles

| Role                     | Description                              |
|--------------------------|------------------------------------------|
| `SUPER_ADMIN`            | Full system access                       |
| `ADMIN`                  | Manage all modules & users               |
| `EVENT_MANAGER`          | Manage events                            |
| `TRAVEL_MANAGER`         | Manage bus services & schedules          |
| `ENTERTAINMENT_MANAGER`  | Manage cinema halls & movies             |
| `USER`                   | Browse, book tickets & write reviews     |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is **ISC** licensed.