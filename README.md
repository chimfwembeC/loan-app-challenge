# Loan Application System (NestJS + TypeORM + PostgreSQL)

A backend API for managing loan applications, clients, and user accounts using NestJS.

---

## 🚀 Features

- JWT Authentication (register, login)
- User profile management (`GET /auth/profile`, `PATCH /auth/profile`)
- Role-based access (`user`, `admin`)
- Clients and Loans CRUD (with ownership rules)
- Validation using DTOs and `class-validator`
- Swagger API docs
- PostgreSQL with TypeORM
- Global error handling
- Unit tests for key services

---

## 🧱 Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- JWT & Passport
- class-validator
- Swagger
- Jest

---

## 📦 API Endpoints

### 🔐 Auth (under `/auth`)
| Method | Route            | Description                   |
|--------|------------------|-------------------------------|
| POST   | /auth/register   | Register a new user           |
| POST   | /auth/login      | Login and get JWT             |
| GET    | /auth/profile    | Get logged-in user info       |
| PATCH  | /auth/profile    | Update logged-in user's info  |

### 👤 Clients (authenticated)
| Method | Route              | Description                         |
|--------|--------------------|-------------------------------------|
| POST   | /clients           | Create a client                     |
| GET    | /clients           | Get all your clients (admin = all)  |
| GET    | /clients/:id/loans | Get all loans for a specific client |

### 💰 Loans (authenticated)
| Method | Route     | Description                      |
|--------|-----------|----------------------------------|
| POST   | /loans    | Create a loan for a client       |

---

## 🔒 Rules & Validations

- Clients must have unique `nationalId` and `phoneNumber`
- Only one **active** loan allowed per client
- Users can only manage their own clients/loans
- Admins can see everything

---

## ⚙️ Getting Started

### 1. Clone Repo

```bash
git clone https://github.com/chimfwembeC/loan-app-challenge.git
cd loan-app
