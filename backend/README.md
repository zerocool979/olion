#  Olion Backend

Backend untuk **Olion**, platform diskusi berbasis role (User, Pakar, Admin) dengan autentikasi JWT, sistem reputasi, notifikasi, voting, dan moderasi.

Backend ini dirancang dengan prinsip **clean architecture, separation of concerns, dan security-first**.

---

## Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **ORM**: Prisma
* **Database**: PostgreSQL (recommended)
* **Authentication**: JWT
* **Password Hashing**: bcrypt
* **Validation**: Custom middleware
* **Logging & Error Handling**: Centralized error handler

---

## Struktur Folder

```
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── app.js            # Setup express & middleware
│   ├── server.js         # HTTP server bootstrap
│   ├── prisma.js         # Prisma client instance
│   ├── controllers/      # Request handler (thin layer)
│   ├── services/         # Business logic
│   ├── routes/           # API routing
│   ├── middlewares/      # Auth, error, validation
│   ├── validators/       # Input validation
│   ├── utils/            # Helper & custom error
│   └── generated/        # Prisma generated types
├── package.json
└── .env
```

---

## Arsitektur & Alur

### Request Flow

```
Client
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Prisma ORM
  ↓
Database
```

**Controller** hanya mengelola request/response
**Service** berisi seluruh business logic
**Database logic tidak pernah langsung di controller**

---

## Authentication & Authorization

### JWT Flow

1. User login / register
2. Backend generate JWT (`id`, `role`)
3. Token dikirim ke frontend
4. Token diverifikasi oleh `authMiddleware`

### Role-based Access

* **User**: Diskusi, jawaban, vote, report
* **Pakar**: Jawaban terverifikasi
* **Admin**: Moderasi, user management

Frontend **tidak menentukan role**, semua keputusan di backend

---

##  risma ORM

### Lokasi Schema

```
prisma/schema.prisma
```

### Fungsi Prisma

* Data modeling
* Migration
* Query abstraction

### Command Umum

```bash
npx prisma generate      # Generate client
npx prisma migrate dev   # Migration + apply
npx prisma studio        # GUI database
```

---

## API Modules

### Core

* Auth
* User
* Discussion
* Answer
* Comment
* Vote

### Extended

* Notification
* Reputation
* Pakar
* Report
* Moderation

Semua endpoint:

* Menggunakan JWT
* Validasi input
* Error konsisten

---

## Error Handling

Menggunakan **centralized error handler**:

* `AppError` untuk error terkontrol
* Error tidak bocor stack trace ke client
* Status code konsisten

---

## ▶️ Menjalankan Backend

```bash
npm install
npx prisma migrate dev
npm run dev
```

### Environment Variable

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
PORT=5000
```

---

## Testing Checklist (Manual)

* [ ] Register & login
* [ ] Invalid credentials handling
* [ ] Token expiration
* [ ] Role-based access
* [ ] Prisma migration sync
* [ ] Error handling consistency

---

## Security Considerations

* Password hashed (bcrypt)
* JWT expiration enforced
* Protected routes via middleware
* No sensitive data returned
* Frontend tidak dipercaya

---

## Status Project

Backend **Not Finished, Finished But Not Perfect**

Siap untuk:

* Integrasi frontend
* Deployment
* Penilaian akademik

---

**Backend ini dirancang sebagai sistem yang scalable, aman, dan mudah dirawat.**
