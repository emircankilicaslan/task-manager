# Task Manager

A full-stack task management app: a **Laravel 11** REST API with token authentication and a **Next.js 14** (App Router) frontend.

<!-- Add a screenshot or GIF here, for example: ![Task Manager](docs/screenshot.png) -->

---

## Features

- Register, log in and log out with token-based authentication (Laravel Sanctum)
- Create, view, edit and delete tasks; update only the status through a dedicated endpoint
- Filter tasks by status and priority, search by title (debounced) and browse a paginated list
- Authorization through policies and recoverable deletes (soft deletes)
- Protected routes on the frontend and a central redirect to the login page on `401` responses

---

## Tech Stack

**Backend**
- PHP 8.2 / Laravel 11
- Laravel Sanctum (token-based auth)
- MySQL
- Form Requests, API Resources, Policies, SoftDeletes

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- TanStack React Query v5
- React Hook Form
- Tailwind CSS

---

## Getting Started

### Prerequisites

- PHP >= 8.2 and Composer
- Node.js >= 18 and npm
- MySQL

### Backend (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Create the environment file
cp .env.example .env
php artisan key:generate

# Update the database settings in .env:
# DB_DATABASE=task_manager
# DB_USERNAME=root
# DB_PASSWORD=

# Create the database, then run the migrations
php artisan migrate

# (Optional) Load demo data
php artisan db:seed

# Check the stateful domains in config/sanctum.php for CORS, then start the server
php artisan serve
```

The API runs at `http://localhost:8000`.
Demo account (after seeding): `demo@example.com` / `password`

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Create the environment file
cp .env.example .env.local

# Start the development server
npm run dev
```

The app runs at `http://localhost:3000`.

---

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out (auth required) |
| GET | `/api/auth/me` | Current user (auth required) |

### Tasks (auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (filterable, paginated) |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/{id}` | Task details |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |
| PATCH | `/api/tasks/{id}/status` | Update the status only |

**Query parameters (`GET /api/tasks`):**

| Parameter | Values | Description |
|-----------|--------|-------------|
| `status` | `todo`, `in_progress`, `done` | Filter by status |
| `priority` | `low`, `medium`, `high` | Filter by priority |
| `search` | string | Search in the title |
| `page` | integer | Page number |

---

## Architecture Decisions

**Backend**
- **Form Requests:** keep controllers thin; validation lives in its own layer.
- **API Resources:** the response format is controlled in one place and isolated from model changes.
- **Policies:** authorization logic stays outside the controllers, with a separate policy per resource.
- **Query scope filtering:** the model exposes a reusable query-builder filter instead of repeating conditions.
- **SoftDeletes:** records are deleted without data loss and can be recovered.

**Frontend**
- **React Query:** server-state caching and automatic refetching.
- **React Hook Form:** uncontrolled inputs with validation, for better form performance.
- **Custom hooks:** `useTasks` and `useAuth` keep API logic out of the components.
- **Axios interceptors:** token attachment and the `401` redirect are handled in one place.
- **Debounced search:** waits 400 ms instead of sending a request on every keystroke.
- **TypeScript:** every API response type is defined.

---

## Project Structure

```
task-manager/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/    # TaskController, AuthController
│   │   │   ├── Requests/           # Form request validation
│   │   │   └── Resources/          # API resource transformers
│   │   ├── Models/                 # Task, User
│   │   └── Policies/               # TaskPolicy
│   ├── database/
│   │   ├── migrations/
│   │   ├── factories/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
└── frontend/
    └── src/
        ├── app/                    # Next.js App Router pages
        │   ├── page.tsx            # Main task page
        │   ├── login/page.tsx
        │   ├── register/page.tsx
        │   ├── layout.tsx
        │   └── providers.tsx
        ├── components/             # UI components
        │   ├── TaskCard.tsx
        │   ├── TaskForm.tsx
        │   ├── TaskFiltersBar.tsx
        │   ├── Modal.tsx
        │   └── Pagination.tsx
        ├── hooks/                  # React Query hooks
        │   ├── useTasks.ts
        │   └── useAuth.ts
        ├── lib/
        │   ├── api.ts              # Axios instance
        │   └── utils.ts
        ├── types/
        │   └── index.ts
        └── middleware.ts           # Route protection
```
