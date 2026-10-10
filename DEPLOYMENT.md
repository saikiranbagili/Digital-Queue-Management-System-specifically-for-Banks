# BankQ — Production Deployment & Architecture Report

## 1. Executive Summary & Architecture

| Layer | Recommended / Configured Provider | Technology Stack | Configuration File |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** (or Netlify) | React 18, Vite 6, Tailwind/CSS | [`vercel.json`](./vercel.json) / [`frontend/vercel.json`](./frontend/vercel.json) |
| **Backend** | **Render.com** (or Railway) | Java 17, Spring Boot 3.2.5, Maven | [`render.yaml`](./render.yaml) / [`backend/Dockerfile`](./backend/Dockerfile) |
| **Database** | **Render Managed PostgreSQL** (or Supabase/Neon) | PostgreSQL 16 (H2 fallback locally) | Configured in [`render.yaml`](./render.yaml) & [`application.properties`](./backend/src/main/resources/application.properties) |
| **Repository** | **GitHub** | Git Monorepo (`main` branch) | [GitHub Repository](https://github.com/saikiranbagili/Digital-Queue-Management-System-specifically-for-Banks) |

---

## 2. 1-Click Cloud Deployment Steps

### Step A: Deploy Backend & PostgreSQL on Render (2 Minutes)

1. Open this direct **Render Blueprint Link**:
   👉 **[https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)**
2. Click **"New Blueprint Instance"**.
3. Select your GitHub repository:
   `saikiranbagili/Digital-Queue-Management-System-specifically-for-Banks`
4. Render will automatically read [`render.yaml`](./render.yaml) and create:
   - **`bankq-db`**: A managed PostgreSQL database.
   - **`bankq-backend`**: A Spring Boot Web Service compiled via [`backend/Dockerfile`](./backend/Dockerfile).
5. Click **"Apply"**.
6. When the build finishes (takes ~2 minutes), Render will display your live backend URL:
   `https://bankq-backend-xxxx.onrender.com`
7. Verify it by visiting: `https://bankq-backend-xxxx.onrender.com/api/health` (should return `{"status": "UP"}`).

---

### Step B: Deploy Frontend on Vercel (1 Minute)

1. Open this direct **Vercel Import Link**:
   👉 **[https://vercel.com/new](https://vercel.com/new)**
2. Click **"Import"** next to `saikiranbagili/Digital-Queue-Management-System-specifically-for-Banks`.
3. In the project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: Click *Edit* and select **`frontend`**
   - **Environment Variables**: Add one variable:
     - Name: `VITE_API_BASE_URL`
     - Value: `https://bankq-backend-xxxx.onrender.com/api` *(use your backend URL from Step A)*
4. Click **"Deploy"**.
5. Within 45 seconds, your frontend is live at:
   `https://digital-queue-management-system-xxxx.vercel.app`

---

## 3. Production Hardening Implemented

1. **Dynamic Port Binding**:
   - `backend/Dockerfile` now uses `ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]`, ensuring it binds to Render's injected `$PORT` dynamically.
2. **Wildcard & Multi-Domain CORS**:
   - `SecurityConfig.java` uses `setAllowedOriginPatterns` so that Vercel preview URLs, production domains, and localhost can access the API without CORS rejections even with `allowCredentials(true)`.
3. **Database Portability**:
   - `application.properties` auto-detects driver classes, allowing PostgreSQL in production via `SPRING_DATASOURCE_URL` while retaining zero-config persistent H2 for local testing.
4. **API Base URL Normalization**:
   - `frontend/src/services/api.js` automatically normalizes `VITE_API_BASE_URL` whether supplied with or without a trailing `/api`.
5. **SPA Routing Rewrites**:
   - `vercel.json` and `frontend/netlify.toml` ensure page refreshes on `/customer/tokens`, `/staff/queue`, and `/admin` do not result in HTTP 404.
