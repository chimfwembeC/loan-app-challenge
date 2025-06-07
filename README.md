---

# Loan Application System (NestJS + TypeORM + PostgreSQL)

A backend API for managing loan applications, clients, and user accounts using NestJS.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/chimfwembeC/loan-app-challenge.git
cd loan-app-challenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install ts-node globally (if not installed)

```bash
npm install -g ts-node
```

### 4. Ensure you have PostgreSQL installed and running

Create the PostgreSQL database with the following commands:

```bash
# Switch to the postgres user (Linux/macOS)
sudo -i -u postgres

# Open the PostgreSQL prompt
psql
```

Inside the `psql` prompt, run:

```sql
CREATE DATABASE loan_db OWNER postgres;
GRANT ALL PRIVILEGES ON DATABASE loan_db TO postgres;
\q
```

> Replace `postgres` with your PostgreSQL superuser if different.

> Make sure to update your database connection settings in your `.env` or `ormconfig.json` file accordingly (database name, username, password, host, port).

### 5. Run database seed script (optional, if available)

```bash
npm run seed
```

This will populate your database with initial data.

### 6. Start the development server

```bash
npm run start:dev
```

Your API should now be running at [http://localhost:3000](http://localhost:3000).

---

## 🚀 Features

* JWT Authentication (register, login)
* Role-based access (`user`, `admin`)
* Clients and Loans CRUD with ownership rules
* Validation using DTOs and `class-validator`
* Swagger API documentation
* PostgreSQL with TypeORM integration
* Global error handling
* Unit tests for key services

---

## 🧱 Tech Stack

* NestJS
* TypeORM
* PostgreSQL
* JWT & Passport.js
* class-validator
* Swagger
* Jest

---

## 📦 API Endpoints

### 🔐 Auth (under `/auth`)

| Method | Route          | Description                  |
| ------ | -------------- | ---------------------------- |
| POST   | /auth/register | Register a new user          |
| POST   | /auth/login    | Login and get JWT            |
| GET    | /auth/profile  | Get logged-in user info      |
| PATCH  | /auth/profile  | Update logged-in user's info |

### 👤 Clients (authenticated)

| Method | Route               | Description                           |
| ------ | ------------------- | ------------------------------------- |
| POST   | /clients            | Create a client                       |
| GET    | /clients            | Get all your clients (admins get all) |
| GET    | /clients/\:id/loans | Get all loans for a specific client   |

### 💰 Loans (authenticated)

| Method | Route  | Description                |
| ------ | ------ | -------------------------- |
| POST   | /loans | Create a loan for a client |

---

## 🔒 Rules & Validations

* Clients must have unique `nationalId` and `phoneNumber`
* Only one **active** loan allowed per client
* Users can only manage their own clients and loans
* Admins have full access to all data

---