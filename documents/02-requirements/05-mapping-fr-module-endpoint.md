# Mapping FR → Module → Endpoint

**Project Name:** OLION
**Document Type:** Functional Requirement Mapping to Backend Module & REST Endpoint
**Owner:** beel
**Version:** 1.0 (MVP Ready)
**Status:** Implementation Reference
**Last Updated:** 2026-03-27

---

# 1. Purpose of This Document

Dokumen ini berfungsi sebagai referensi implementasi teknis yang menghubungkan:

* Functional Requirement (FR)
* Backend Module
* REST API Endpoint
* Access Scope (Public / Authenticated / Role-based)
* Critical Business Rules (MVP Constraints)

Dokumen ini harus digunakan sebagai:

* acuan implementasi backend
* referensi integrasi frontend
* dasar validasi API coverage
* referensi QA saat menyusun test cases

Setiap FR yang tercantum di SRS harus memiliki endpoint atau rule enforcement yang jelas pada dokumen ini.

---

# 2. Global API Conventions

## 2.1 Base Path

```
/api
```

## 2.2 Authentication Header

Semua endpoint yang memerlukan autentikasi menggunakan:

```
Authorization: Bearer <access_token>
```

## 2.3 Standard Response Format

Seluruh endpoint mengikuti format response konsisten:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {},
  "errors": []
}
```

## 2.4 Access Scope Definition

| Scope      | Description            |
| ---------- | ---------------------- |
| Public     | Tidak memerlukan login |
| Auth       | Semua user login       |
| Moderator+ | Moderator dan Admin    |
| Admin      | Hanya Admin            |
| System     | Middleware enforcement |

---

# 3. Functional Mapping — MVP Scope

---

# A. Authentication & Account Module

## FR-01 — User Registration

Module: `auth`

```
POST /api/auth/register
```

Access: Public

Key Rules:

* Password minimal 10 karakter
* Pseudonym dibuat otomatis
* Email harus unik

---

## FR-02 — Login (Access + Refresh Token)

Module: `auth`

```
POST /api/auth/login
```

Access: Public

Output:

* accessToken (15 menit)
* refreshToken (30 hari)

---

## FR-03 — Logout

Module: `auth`

```
POST /api/auth/logout
```

Access: Auth

Key Rules:

* Refresh token harus di-revoke server-side

---

## FR-04 — Default Pseudonym Generation

Module: `auth`, `user`

Triggered on:

```
POST /api/auth/register
```

Key Rules:

Format pseudonym:

```
society_XXXX
```

Must be unique.

---

## FR-05 — Update Pseudonym

Module: `user`

```
PATCH /api/users/me/pseudonym
```

Access: Auth

Constraints:

* Maksimal 3 perubahan seumur hidup
* Karakter: alphanumeric + underscore
* Harus unik

---

## FR-06 — Role-Based Access Control (RBAC)

Module:

```
middlewares/auth
middlewares/role
```

Scope:

All protected endpoints.

Behavior:

* Endpoint dibatasi berdasarkan role
* Unauthorized request harus ditolak

---

## FR-07 — Suspended/Banned User Restriction

Module:

```
user
middlewares/auth
```

Behavior:

User dengan status banned/suspended:

* Tidak dapat membuat konten
* Tidak dapat voting
* Tidak dapat report

---

## FR-44 — Forgot Password Request

Module: `auth`

```
POST /api/auth/forgot-password
```

Access: Public

---

## FR-45 — Reset Password

Module: `auth`

```
POST /api/auth/reset-password
```

Access: Public

---

# B. Discussion Module

## FR-08 — Create Discussion

Module: `discussion`

```
POST /api/discussions
```

Access: Auth

Rules:

* Author pseudonym digunakan sebagai identity publik

---

## FR-09 — Get Discussion List

Module: `discussion`

```
GET /api/discussions?page=1&limit=20
```

Access: Public

---

## FR-10 — Get Discussion Detail

Module: `discussion`

```
GET /api/discussions/:id
```

Access: Public

---

## FR-11 — Update Discussion

Module: `discussion`

```
PATCH /api/discussions/:id
```

Access: Auth (Owner)

Rules:

* Edit hanya dalam 24 jam

---

## FR-12 — Delete Discussion (Soft Delete)

Module: `discussion`

```
DELETE /api/discussions/:id
```

Access: Auth (Owner)

Behavior:

Soft delete only.

---

# C. Answer Module

## FR-13 — Create Answer

Module: `answer`

```
POST /api/answers
```

Access: Auth

---

## FR-14 — Update Answer

```
PATCH /api/answers/:id
```

Access: Auth (Owner)

---

## FR-15 — Delete Answer

```
DELETE /api/answers/:id
```

Access: Auth (Owner)

Soft delete required.

---

# D. Comment Module

## FR-16 — Create Comment

Module: `comment`

```
POST /api/comments
```

Access: Auth

---

## FR-17 — Delete Comment

```
DELETE /api/comments/:id
```

Access: Auth (Owner)

---

# E. Voting Module

## FR-18 — Vote Content

Module: `vote`

```
POST /api/votes
```

Access: Auth

Rules:

* One vote per user per content

---

## FR-19 — Remove Vote

```
DELETE /api/votes/:id
```

Access: Auth

---

# F. Report & Moderation Module

## FR-20 — Report Content

Module: `report`

```
POST /api/reports
```

Access: Auth

---

## FR-21 — View Report Queue

Module: `moderator`

```
GET /api/moderator/reports
```

Access: Moderator+

---

## FR-22 — Resolve Report

```
POST /api/moderator/reports/:id/resolve
```

Access: Moderator+

---

# G. Expert Verification Module

## FR-32 — Submit Expert Request

Module: `expert`

```
POST /api/expert/requests
```

Access: Auth

Payload:

* document (PDF/JPG/PNG max 5MB)
* portfolioLink (required)

---

## FR-33 — Approve / Reject Expert

Module: `expert`

```
POST /api/expert/requests/:id/approve
POST /api/expert/requests/:id/reject
```

Access: Admin

---

## FR-34 — Revoke Expert Status

```
POST /api/expert/:userId/revoke
```

Access: Admin

---

## FR-35 — Expert Badge Exposure

Module: `user`, `answer`

Included in response payload.

---

# H. Admin & Moderator Module

## FR-37 — List Users

Module: `admin`

```
GET /api/admin/users?page=1&limit=20
```

Access: Admin

---

## FR-38 — Change User Role

```
PATCH /api/admin/users/:id/role
```

Access: Admin

---

## FR-39 — Manage Categories

Module: `category`

```
POST /api/admin/categories
PATCH /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

Access: Admin

---

# I. Documentation & Deployment Module

## FR-40 — API Documentation Access

Module: `docs`

```
GET /api/docs
```

Access: Public

---

## FR-41 — Test Plan Repository

Location:

```
07-testing/
```

---

## FR-42 — Test Evidence Storage

Location:

```
07-testing/evidence/
```

---

## FR-43 — Deployment Guide

Location:

```
08-release-ops/
```

---

# 4. MVP Operational Constraints (Mandatory Rules)

Semua implementasi harus mematuhi aturan berikut:

* Edit window maksimal 24 jam
* Delete menggunakan soft delete
* Voting hanya pada discussion dan answer
* Semua moderasi harus tercatat dalam audit log
* Refresh token rotation wajib aktif
* Identity exposure hanya melalui audit mode
* Semua endpoint protected wajib RBAC-guarded

---

# 5. Implementation Readiness Summary

Dokumen ini dianggap **READY FOR IMPLEMENTATION** apabila:

* Seluruh FR memiliki module mapping
* Seluruh endpoint memiliki access scope jelas
* Semua business rule kritikal telah ditentukan
* Tidak ada FR tanpa jalur implementasi

Status Saat Ini:

**IMPLEMENTATION READY — MVP BASELINE**
