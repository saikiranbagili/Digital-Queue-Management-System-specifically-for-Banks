# BankQ — Digital Queue Management System
> **"Smarter Queues. Better Banking."**

BankQ is a full-stack, enterprise-grade Digital Queue Management System designed specifically for modern retail bank branches. The system completely decouples the frontend and backend architectures: a responsive React + Vite application communicates seamlessly via JSON REST APIs with a hardened Java 17 + Spring Boot 3 backend.

---

## 1. System Architecture & Features

### Core Capabilities
- **Customer Self-Service Portal**: Instant token generation across 6 core banking services, real-time live queue tracking with 5-second polling, wait time estimation, and journey status indicators.
- **Staff Counter Desk**: Real-time waiting queue inspection, one-click `Call Next` operations with concurrency locking, and status transitions to `COMPLETED`.
- **Executive Administration Console**: Live queue load distribution graphs, service volume breakdown, master token inspection with filters, registered user directories, and station configuration.
- **Persistent Storage**: Persistent file-based H2 database for local development, with seamless zero-code-change support for PostgreSQL in production via environment variables.
- **Enterprise Security**: Role-based access control (RBAC), BCrypt password hashing, stateless JWT authentication, and strict ownership validation.

### Demo User Accounts & Roles
The backend automatically seeds these demo credentials on initial startup:

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **CUSTOMER** | `customer@bankq.demo` | `Customer123` | Request tokens, track personal queues, view ticket history |
| **STAFF** | `staff@bankq.demo` | `Staff123` | Inspect waiting queue, call next customer, complete service |
| **ADMIN** | `admin@bankq.demo` | `Admin123` | Master overview, system audit, user directory, counter stats |

---

## 2. Technology Stack

### Frontend Application (`/frontend`)
- **Framework**: React 18
- **Build Tool**: Vite 6
- **Routing**: React Router DOM 6 (Client-side routing with SPA rewrites)
- **HTTP Client**: Axios with configured interceptors & token injection
- **Icons**: Lucide React
- **Styling**: Tailored responsive Vanilla CSS design system (Navy `#0f2744`, Teal `#0284c7`, Emerald `#059669`)

### Backend Application (`/backend`)
- **Runtime**: Java 17 (Microsoft OpenJDK 17 LTS)
- **Framework**: Spring Boot 3.2.5
- **Security**: Spring Security 6 with BCrypt & Stateless JWT (JJWT 0.11.5)
- **Data Access**: Spring Data JPA & Hibernate ORM
- **Database**: H2 (file-based persistent local storage) + PostgreSQL Driver (production ready)
- **Build Tool**: Apache Maven 3.9

---

## 3. Project Directory Structure

```
digital-queue-management-system/
│
├── frontend/
│   ├── package.json               # Frontend dependencies & build scripts
│   ├── vite.config.js             # Vite configuration with port 5173 & /api proxy
│   ├── .env.example               # Environment variables template
│   ├── .env                       # Local environment configuration
│   ├── index.html                 # HTML shell with Google Fonts & meta tags
│   ├── vercel.json                # Vercel SPA rewrite routing rules
│   ├── netlify.toml               # Netlify SPA redirect rules
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx         # Header bar with real-time status & sync
│       │   ├── Sidebar.jsx        # Role-based desktop & mobile navigation
│       │   ├── StatusBadge.jsx    # Status pills (WAITING, CALLED, COMPLETED)
│       │   ├── TokenCard.jsx      # Ticket card with queue position & timers
│       │   └── StatCard.jsx       # Metric card component
│       ├── pages/
│       │   ├── Login.jsx          # Login portal with one-click demo fillers
│       │   ├── CustomerDashboard.jsx # Customer overview & active ticket
│       │   ├── RequestToken.jsx   # Banking service selection & generation
│       │   ├── MyTokens.jsx       # Active & historical token records
│       │   ├── TrackToken.jsx     # Live token tracking with 5s auto-polling
│       │   ├── StaffDashboard.jsx # Branch traffic & desk status
│       │   ├── StaffQueue.jsx     # Counter desk queue operator
│       │   └── AdminDashboard.jsx # Executive analytics & user directories
│       ├── layouts/
│       │   ├── MainLayout.jsx     # Shell layout with responsive navigation
│       │   └── ProtectedRoute.jsx # Role and authentication route guard
│       ├── context/
│       │   └── AuthContext.jsx    # JWT authentication state provider
│       ├── services/
│       │   └── api.js             # Centralized Axios REST client
│       ├── App.jsx                # Application routes
│       ├── main.jsx               # React DOM entry point
│       └── index.css              # Custom banking design system
│
├── backend/
│   ├── pom.xml                    # Maven build file with dependencies
│   ├── Dockerfile                 # Multi-stage production container build
│   ├── .env.example               # Backend environment variables template
│   ├── mvnw.cmd                   # Local Maven wrapper
│   ├── mvn.cmd                    # Local Maven command
│   └── src/
│       ├── main/
│       │   ├── java/com/bankq/
│       │   │   ├── config/
│       │   │   │   ├── DataInitializer.java  # Demo user and service seed
│       │   │   │   └── SecurityConfig.java   # Spring Security & CORS setup
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── CustomerController.java
│       │   │   │   ├── StaffController.java
│       │   │   │   ├── AdminController.java
│       │   │   │   └── HealthController.java
│       │   │   ├── dto/
│       │   │   ├── entity/
│       │   │   │   ├── BankingService.java
│       │   │   │   ├── Counter.java
│       │   │   │   ├── QueueToken.java
│       │   │   │   ├── Role.java
│       │   │   │   ├── TokenStatus.java
│       │   │   │   └── User.java
│       │   │   ├── exception/
│       │   │   ├── repository/
│       │   │   ├── security/
│       │   │   └── service/
│       │   │       ├── AuthService.java
│       │   │       └── QueueService.java
│       │   └── resources/
│       │       └── application.properties    # H2 and production configs
│       └── test/
│           └── java/com/bankq/
│               └── BankQApplicationTests.java
│
├── .gitignore                     # Git exclusion rules
└── README.md                      # Comprehensive project documentation
```

---

## 4. Local Development Quickstart

### Prerequisites
- **Node.js**: v18+ (tested on v25.8.0)
- **Java JDK**: 17+ (tested on Microsoft OpenJDK 17.0.20)
- **Maven**: 3.9+ (bundled or installed)

### Step 1: Run the Backend Independently
Navigate to the `backend/` directory:
```bash
cd digital-queue-management-system/backend
```
To run directly using Maven:
```bash
mvn spring-boot:run
```
*(Or on Windows using the provided wrapper: `.\mvn.cmd spring-boot:run`)*

Alternatively, run the packaged standalone JAR:
```bash
java -jar target/bankq-backend-1.0.0.jar
```
- **Backend Port**: `http://localhost:8080`
- **Health Check**: `http://localhost:8080/api/health`
- **H2 Database Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/bankqdb`, User: `sa`, Password: empty)

### Step 2: Run the Frontend Independently
In a separate terminal, navigate to the `frontend/` directory:
```bash
cd digital-queue-management-system/frontend
npm install
npm run dev
```
- **Frontend Port**: `http://localhost:5173`
- The Vite development server automatically proxies all `/api` requests to `http://localhost:8080`.

---

## 5. REST API Specifications

### Health & Monitoring
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System status and uptime indicator |

### Authentication & User Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account with BCrypt password hashing & JWT issue |
| `POST` | `/api/auth/login` | Public | Validate credentials, issue JWT token |
| `GET` | `/api/auth/me` | Authenticated | Fetch current user session and role |

### Customer Operations
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/customer/dashboard` | CUSTOMER, ADMIN | Get customer overview & active ticket |
| `POST` | `/api/customer/tokens` | CUSTOMER, ADMIN | Request new service token |
| `GET` | `/api/customer/tokens` | CUSTOMER, ADMIN | List all tokens requested by customer |
| `GET` | `/api/customer/tokens/{id}` | CUSTOMER, ADMIN | Get token details (enforces ownership) |
| `GET` | `/api/customer/tokens/{id}/status`| CUSTOMER, ADMIN | Real-time queue status & position |

### Staff Operations
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/staff/dashboard` | STAFF, ADMIN | Staff branch metrics and active serving |
| `GET` | `/api/staff/queue` | STAFF, ADMIN | Waiting queue list (filter by service) |
| `POST` | `/api/staff/queue/call-next` | STAFF, ADMIN | Call next waiting token to counter |
| `POST` | `/api/staff/tokens/{id}/complete` | STAFF, ADMIN | Mark called token as completed |

### Administrator Operations
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | ADMIN | Branch-wide KPIs and distribution |
| `GET` | `/api/admin/tokens` | ADMIN | Master token list with service & status filters |
| `GET` | `/api/admin/users` | ADMIN | User account directory |
| `GET` | `/api/admin/services` | ADMIN | Configured services and counter mappings |
| `GET` | `/api/admin/counters` | ADMIN | Counter station directory |

---

## 6. Build and Test Verification

### Backend Build & Test
```bash
cd backend
mvn clean package
```
Runs all automated unit and Spring context tests, compiling all 35 source classes and generating `target/bankq-backend-1.0.0.jar`.

### Frontend Production Build
```bash
cd frontend
npm run build
```
Generates the minified, production-ready static assets in `frontend/dist/`.

---

## 7. Separate Production Deployment

### Frontend Deployment (Vercel / Netlify)
1. **Repository Settings**:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
2. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-bankq-backend.onrender.com/api
   ```
3. **SPA Routing**: The included `vercel.json` and `netlify.toml` automatically route all deep links to `index.html` preventing 404 errors on browser page reloads.

### Backend Deployment (Render / Railway / AWS / Docker)
1. **Container / Platform Build**:
   - Use the provided multi-stage `backend/Dockerfile` or native Java 17 environment.
   - Start Command: `java -Dserver.port=${PORT} -jar app.jar`
2. **Required Production Environment Variables**:
   ```env
   PORT=8080
   SPRING_DATASOURCE_URL=jdbc:postgresql://<db-host>:5432/<db-name>
   SPRING_DATASOURCE_USERNAME=<db-user>
   SPRING_DATASOURCE_PASSWORD=<db-password>
   SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
   JWT_SECRET=<generate-a-secure-256-bit-hex-or-base64-secret>
   CORS_ALLOWED_ORIGINS=https://your-bankq-frontend.vercel.app
   ```
3. **Database Migration**: Hibernate automatically sets up the tables on PostgreSQL upon first boot (`spring.jpa.hibernate.ddl-auto=update`), and `DataInitializer` idempotently seeds initial service definitions and admin accounts.

---

## 8. Security & Known Limitations
- **Demo Passwords**: Demo accounts use pre-configured passwords for demonstration purposes. In production, change all seed credentials.
- **Local Persistence**: H2 file database persists to `backend/data/bankqdb.mv.db`. For cloud platforms where file systems are ephemeral (like free Render or Heroku dynos), always configure a PostgreSQL instance using the provided environment variables.
