# Task Manager — Laravel + Next.js

Görev yönetim uygulaması. Laravel 11 REST API + Next.js 14 App Router ile geliştirilmiştir.

---

## Teknoloji Stack

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

## Kurulum

### Gereksinimler

- PHP >= 8.2 + Composer
- Node.js >= 18 + npm
- MySQL

---

### Backend (Laravel)

```bash
cd backend

# Bağımlılıkları yükle
composer install

# .env dosyasını oluştur
cp .env.example .env
php artisan key:generate

# Veritabanı bilgilerini .env'de güncelle:
# DB_DATABASE=task_manager
# DB_USERNAME=root
# DB_PASSWORD=

# Veritabanını oluştur ve migration çalıştır
php artisan migrate

# (Opsiyonel) Demo verisi yükle
php artisan db:seed

# CORS için config/sanctum.php içindeki stateful domains kontrol et
# Sunucuyu başlat
php artisan serve
```

API `http://localhost:8000` adresinde çalışır.
Demo kullanıcı: `demo@example.com` / `password`

---

### Frontend (Next.js)

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env.local

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

---

## API Endpointleri

### Auth

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/register` | Kayıt |
| POST | `/api/auth/login` | Giriş |
| POST | `/api/auth/logout` | Çıkış (auth gerekli) |
| GET | `/api/auth/me` | Aktif kullanıcı (auth gerekli) |

### Tasks (auth gerekli)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/tasks` | Görev listesi (filtreli, sayfalı) |
| POST | `/api/tasks` | Yeni görev oluştur |
| GET | `/api/tasks/{id}` | Görev detayı |
| PUT | `/api/tasks/{id}` | Görev güncelle |
| DELETE | `/api/tasks/{id}` | Görev sil |
| PATCH | `/api/tasks/{id}/status` | Sadece status güncelle |

**Query parametreleri (GET /api/tasks):**

| Parametre | Değerler | Açıklama |
|-----------|----------|----------|
| `status` | `todo`, `in_progress`, `done` | Durum filtresi |
| `priority` | `low`, `medium`, `high` | Öncelik filtresi |
| `search` | string | Başlıkta arama |
| `page` | integer | Sayfa numarası |

---

## Mimari Kararlar

**Backend**
- **Form Requests** — Controller'ları temiz tutar, validation mantığı ayrı katmanda
- **API Resources** — Response formatı merkezi olarak kontrol edilir, model değişimlerinden izole
- **Policies** — Authorization mantığı controller dışında, her resource için ayrı policy
- **Scope Filter** — Model'da query builder pattern, tekrar kullanılabilir filtreleme
- **SoftDeletes** — Veri kaybı olmadan silme, recovery imkânı

**Frontend**
- **React Query** — Server state cache yönetimi, otomatik refetch, optimistic UI
- **React Hook Form** — Controlled form yerine uncontrolled + validation, performanslı
- **Custom Hooks** — `useTasks`, `useAuth` ile API mantığı component'lardan ayrılmış
- **Axios Interceptors** — Token ekleme ve 401 redirect merkezi yerde yönetilir
- **Debounced Search** — Her tuşa API isteği atmak yerine 400ms bekleme
- **TypeScript** — Tüm API response tipleri tanımlı, tip güvenliği

---

## Klasör Yapısı

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
        │   ├── page.tsx            # Ana görev sayfası
        │   ├── login/page.tsx
        │   ├── register/page.tsx
        │   ├── layout.tsx
        │   └── providers.tsx
        ├── components/             # UI bileşenleri
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
