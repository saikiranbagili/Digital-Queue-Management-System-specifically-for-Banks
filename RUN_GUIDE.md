# BankQ — Complete Project Execution & Run Guide
**Digital Queue Management System**  
*Document Generated for Local & Production Deployment*

---

## 1. Project Directory Overview

Your project is located at:
```text
C:\Users\NIKHITHA\.gemini\antigravity-ide\scratch\digital-queue-management-system\
```

The system is split into two independent applications:
- **Backend**: `digital-queue-management-system\backend` (Java 17, Spring Boot 3, Maven, H2/PostgreSQL)
- **Frontend**: `digital-queue-management-system\frontend` (React 18, Vite 6, JavaScript, Axios)

---

## 2. Step-by-Step Commands to Run the Application

### Terminal 1 — Start the Backend (Spring Boot Server)

1. Open PowerShell or Command Prompt.
2. Navigate to the backend directory:
   ```powershell
   cd C:\Users\NIKHITHA\.gemini\antigravity-ide\scratch\digital-queue-management-system\backend
   ```
3. Run using Maven:
   ```powershell
   .\mvn.cmd spring-boot:run
   ```

> **Fast Alternative (Run the Pre-built Standalone JAR):**
> ```powershell
> cd C:\Users\NIKHITHA\.gemini\antigravity-ide\scratch\digital-queue-management-system\backend
> & "C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot\bin\java.exe" -jar target\bankq-backend-1.0.0.jar
> ```

- **Status Check**: Once running, you will see `Tomcat started on port 8080 (http)`.
- **Backend URL**: [http://localhost:8080](http://localhost:8080)
- **API Health Check**: [http://localhost:8080/api/health](http://localhost:8080/api/health)

---

### Terminal 2 — Start the Frontend (React + Vite Web App)

1. Open a **second** PowerShell or Command Prompt window.
2. Navigate to the frontend directory:
   ```powershell
   cd C:\Users\NIKHITHA\.gemini\antigravity-ide\scratch\digital-queue-management-system\frontend
   ```
3. Start the development web server:
   ```powershell
   npm run dev
   ```

- **Frontend Website URL**: 👉 **[http://localhost:5173](http://localhost:5173)**
- The frontend automatically connects to the backend on port 8080 through the configured Vite proxy.

---

## 3. Account Login & Registration Options

When you open **[http://localhost:5173](http://localhost:5173)** in your browser:

### Option A: Create Your Own Account (Self Sign-Up)
1. Click the **"Create Account"** tab at the top of the card.
2. Fill in:
   - **Full Name**: e.g., *Your Name*
   - **Email Address**: e.g., *yourname@email.com*
   - **Password**: Minimum 6 characters
   - **Account Role**:
     - **Customer**: Request and track personal bank queue tokens.
     - **Staff**: Operate counter desks, call waiting tokens, and complete transactions.
     - **Administrator**: Full branch analytics, view all tokens, audit logs, and user directories.
3. Click **"Sign Up & Enter BankQ"** to create your account and automatically log in.

### Option B: Pre-Seeded Demo Accounts
You can also click the quick-fill buttons on the login page:

| Role | Email | Password | What You Can Do |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@bankq.demo` | `Customer123` | Generate bank service tokens & track live queue position |
| **Staff** | `staff@bankq.demo` | `Staff123` | Call next waiting customer & complete desk service |
| **Administrator** | `admin@bankq.demo` | `Admin123` | View executive dashboards, user lists, and queue distribution |

---

## 4. How to Inspect the Database

The database file `bankqdb.mv.db` is an internal binary file and cannot be opened directly in a text editor. Use the built-in web console instead:

1. Open **[http://localhost:8080/h2-console](http://localhost:8080/h2-console)** in your browser.
2. Enter these connection settings:
   - **Driver Class**: `org.h2.Driver`
   - **JDBC URL**: `jdbc:h2:file:./data/bankqdb`
   - **User Name**: `sa`
   - **Password**: *(leave blank)*
3. Click **Connect**.
4. You can browse tables (`USERS`, `QUEUE_TOKENS`, `BANKING_SERVICES`, `COUNTERS`) and run SQL queries.

---

## 5. Build Commands for Production

### Package Backend into a Standalone JAR:
```powershell
cd C:\Users\NIKHITHA\.gemini\antigravity-ide\scratch\digital-queue-management-system\backend
.\mvn.cmd package -DskipTests
```
*Generated Output: `target\bankq-backend-1.0.0.jar`*

### Build Frontend into Minified Production Bundle:
```powershell
cd C:\Users\NIKHITHA\.gemini\antigravity-ide\scratch\digital-queue-management-system\frontend
npm run build
```
*Generated Output: `frontend\dist\`*
