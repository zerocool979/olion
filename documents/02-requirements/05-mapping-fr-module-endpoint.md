---

# Mapping FR → Module → Endpoint

**Project Name:** OLION
**Document Type:** FR Mapping to Module & API Endpoint
**Owner/Developer:** beel (Solo Fullstack)
**Version:** 1.0
**Last Update:** 2026-01-28

---

## 1) Tujuan Dokumen

Dokumen ini memetakan **Functional Requirements (FR)** dari SRS ke:

* **Module Backend**
* **Endpoint REST API**
* **Auth (Public / Authenticated / Role)**
* **Catatan rules MVP** (pseudonym, edit window, soft delete, dsb)

Dokumen ini dipakai sebagai acuan implementasi backend & sinkronisasi frontend.

---

## 2) Konvensi API OLION (Standar)

### 2.1 Base Path

* Base API: `/api`

### 2.2 Auth Header

* Access token dikirim via:

  * `Authorization: Bearer <access_token>`

### 2.3 Standard Response Format

Semua endpoint wajib konsisten:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "errors": []
}
```

### 2.4 Roles

* **Public**: tidak login
* **Auth**: semua user login (User/Expert/Moderator/Admin)
* **Moderator+**: Moderator dan Admin
* **Admin only**: hanya Admin

---

## 3) Mapping FR → Module → Endpoint

---

# A) Auth & Account Module

### FR-01 — Register

**Module:** `auth`
**Endpoint:** `POST /api/auth/register`
**Access:** Public
**Rules:**

* password min 10 char
* pseudonym auto-generate `society_XXXX`

---

### FR-02 — Login (access + refresh)

**Module:** `auth`
**Endpoint:** `POST /api/auth/login`
**Access:** Public
**Output:**

* accessToken (15 min)
* refreshToken (30 days)

---

### FR-03 — Logout (revoke refresh token)

**Module:** `auth`
**Endpoint:** `POST /api/auth/logout`
**Access:** Auth
**Rules:**

* refresh token revoked server-side

---

### FR-04 — Generate pseudonym default

**Module:** `auth` / `user`
**Endpoint:** (implicit in register)
**Access:** Public
**Rules:**

* format: `society_XXXX`
* unique

---

### FR-05 — Update pseudonym (max 3x lifetime)

**Module:** `user`
**Endpoint:** `PATCH /api/users/me/pseudonym`
**Access:** Auth
**Rules:**

* unique
* allowed chars: alnum + `_`
* max 3 changes total

---

### FR-06 — RBAC enforcement

**Module:** `middlewares/auth` + `middlewares/role`
**Endpoint:** (all protected endpoints)
**Access:** System rule
**Rules:**

* role-based guard for Admin/Moderator endpoints

---

### FR-07 — Suspended/Banned user is read-only

**Module:** `user` + `middlewares/auth`
**Endpoint:** (enforced on write endpoints)
**Access:** System rule
**Rules:**

* banned/suspended cannot create/edit/vote/report

---

### FR-44 (tambahan dari MVP) — Forgot Password Request

**Module:** `auth`
**Endpoint:** `POST /api/auth/forgot-password`
**Access:** Public
**Rules:**

* rate limit 5 req/min/IP

---

### FR-45 (tambahan dari MVP) — Reset Password

**Module:** `auth`
**Endpoint:** `POST /api/auth/reset-password`
**Access:** Public
**Rules:**

* reset token must be valid

---

---

# B) Category Module

### FR-18 — Category support (if active)

**Module:** `category`
**Endpoint (Public/Auth):**

* `GET /api/categories` (Public)
* `GET /api/categories/:id` (Public)

**Endpoint (Admin only):**

* `POST /api/categories`
* `PATCH /api/categories/:id`
* `DELETE /api/categories/:id`

**Rules:**

* category wajib dipilih saat create diskusi

---

---

# C) Discussion Module

### FR-08 — Create discussion

**Module:** `discussion`
**Endpoint:** `POST /api/discussions`
**Access:** Auth
**Rules:**

* category wajib
* status default: `OPEN`
* text-only, link allowed

---

### FR-09 — List discussions (pagination)

**Module:** `discussion`
**Endpoint:** `GET /api/discussions?page=1&limit=20`
**Access:** Public
**Rules:**

* default limit = 20

---

### FR-10 — Get discussion detail

**Module:** `discussion`
**Endpoint:** `GET /api/discussions/:id`
**Access:** Public
**Output includes:**

* discussion detail
* answers list
* comments list (threaded or flat)

---

### FR-11 — Update discussion (edit window 24h)

**Module:** `discussion`
**Endpoint:** `PATCH /api/discussions/:id`
**Access:** Auth (Owner only)
**Rules:**

* editable ≤ 24 jam sejak created_at

---

### FR-12 — Soft delete discussion

**Module:** `discussion`
**Endpoint:** `DELETE /api/discussions/:id`
**Access:** Auth (Owner only)
**Rules:**

* soft delete only

---

### FR-17 — Search discussions (keyword)

**Module:** `discussion`
**Endpoint:** `GET /api/discussions/search?q=keyword&page=1&limit=20`
**Access:** Public
**Rules:**

* Postgres FTS

---

### FR-46 (tambahan dari MVP) — Update status discussion (OPEN/SOLVED)

**Module:** `discussion`
**Endpoint:** `PATCH /api/discussions/:id/status`
**Access:** Auth (Owner only)
**Rules:**

* allowed: OPEN, SOLVED

---

---

# D) Answer Module

### FR-13 — Create answer

**Module:** `answer`
**Endpoint:** `POST /api/discussions/:id/answers`
**Access:** Auth
**Rules:**

* text-only

---

### FR-15 — Update answer (edit window 24h)

**Module:** `answer`
**Endpoint:** `PATCH /api/answers/:id`
**Access:** Auth (Owner only)
**Rules:**

* editable ≤ 24 jam

---

### FR-16 — Soft delete answer

**Module:** `answer`
**Endpoint:** `DELETE /api/answers/:id`
**Access:** Auth (Owner only)
**Rules:**

* soft delete

---

---

# E) Comment Module

### FR-14 — Create comment (on discussion/answer)

**Module:** `comment`
**Endpoint options:**

* `POST /api/discussions/:id/comments`
* `POST /api/answers/:id/comments`
  **Access:** Auth
  **Rules:**
* text-only

---

### FR-15 — Update comment (edit window 24h)

**Module:** `comment`
**Endpoint:** `PATCH /api/comments/:id`
**Access:** Auth (Owner only)
**Rules:**

* editable ≤ 24 jam

---

### FR-16 — Soft delete comment

**Module:** `comment`
**Endpoint:** `DELETE /api/comments/:id`
**Access:** Auth (Owner only)
**Rules:**

* soft delete

---

---

# F) Vote Module

### FR-19 — Vote discussion + answer

**Module:** `vote`
**Endpoint:**

* `POST /api/discussions/:id/votes`
* `POST /api/answers/:id/votes`
  **Access:** Auth
  **Payload:**
* `{ "type": "UP" | "DOWN" }`

---

### FR-20 — 1 user 1 vote per content

**Module:** `vote`
**Endpoint:** (enforced on vote create/update)
**Access:** System rule
**Rules:**

* unique constraint (user_id + target_type + target_id)

---

### FR-21 — Undo vote

**Module:** `vote`
**Endpoint options:**

* `DELETE /api/discussions/:id/votes`
* `DELETE /api/answers/:id/votes`
  **Access:** Auth

---

### FR-22 — Score vote per content

**Module:** `vote`
**Endpoint:** (included in detail response)
**Access:** Public
**Rules:**

* score = upvotes - downvotes

---

### FR-23 — Reputation basic

**Module:** `reputation`
**Endpoint options:**

* `GET /api/users/:id/reputation` (Public)
* `GET /api/users/me/reputation` (Auth)

**Rules:**

* reputasi dipengaruhi upvote & downvote

---

---

# G) Report & Moderation Module

### FR-24 — Report content

**Module:** `report`
**Endpoint:**

* `POST /api/reports`
  **Access:** Auth (non-banned only)
  **Payload:**
* targetType: `DISCUSSION | ANSWER | COMMENT`
* targetId: string
* reason: `SPAM | BULLYING | HATE | MISINFO | OTHER`
* note: optional

---

### FR-26 — Report masuk moderation queue

**Module:** `report`
**Endpoint:** (implicit in report create)
**Access:** System rule
**Rules:**

* default status: `OPEN`

---

### FR-27 — Moderator/Admin lihat daftar report

**Module:** `report`
**Endpoint:** `GET /api/reports?status=OPEN&page=1&limit=20`
**Access:** Moderator+

---

### FR-28 — Hide content (moderation action)

**Module:** `moderation`
**Endpoint:** `POST /api/moderation/hide`
**Access:** Moderator+
**Payload:**

* targetType
* targetId
* reason/note

**Rules:**

* konten hidden: publik tidak lihat
* owner tetap bisa lihat

---

### FR-29 — Resolve report

**Module:** `report`
**Endpoint:** `POST /api/reports/:id/resolve`
**Access:** Moderator+
**Rules:**

* status report menjadi `RESOLVED`

---

### FR-30 — Warn user (optional minimal MVP)

**Module:** `moderation`
**Endpoint:** `POST /api/moderation/warn`
**Access:** Moderator+
**Payload:**

* userId
* message

---

---

# H) Expert Verification Module

### FR-31 — Submit expert verification request

**Module:** `expert`
**Endpoint:** `POST /api/expert/requests`
**Access:** Auth
**Payload:**

* document (file upload) — PDF/JPG/PNG max 5MB
* portfolioLink (required)

---

### FR-33 — Admin approve/reject expert request

**Module:** `expert`
**Endpoint (Admin only):**

* `POST /api/expert/requests/:id/approve`
* `POST /api/expert/requests/:id/reject`

---

### FR-34 — Admin revoke expert status

**Module:** `expert`
**Endpoint:** `POST /api/expert/:userId/revoke`
**Access:** Admin only

---

### FR-35 — Expert label shown on profile + answers

**Module:** `user` + `answer`
**Endpoint:** (included in response payload)
**Access:** Public
**Rules:**

* user profile includes `isExpert=true`
* answer includes `author.isExpert=true`

---

---

# I) Admin & Moderator Panel Module

### FR-36 — Panel access by role

**Module:** `admin` / `moderator`
**Endpoint:** (frontend routing + RBAC)
**Access:** Role-based

---

### FR-37 — Admin manage users (list)

**Module:** `admin`
**Endpoint:** `GET /api/admin/users?page=1&limit=20`
**Access:** Admin only

---

### FR-38 — Admin change user role

**Module:** `admin`
**Endpoint:** `PATCH /api/admin/users/:id/role`
**Access:** Admin only
**Payload:**

* role: `USER | EXPERT | MODERATOR | ADMIN`

---

### FR-39 — Admin manage categories

**Module:** `admin` / `category`
**Endpoint:** (lihat Category Module)
**Access:** Admin only

---

---

# J) Documentation, Testing, Deployment

### FR-40 — Swagger API Documentation

**Module:** `docs`
**Endpoint:** `/api/docs` or `/api/swagger`
**Access:** Public (recommended)

---

### FR-41 — Test Plan + Test Cases

**Module:** `testing`
**Repo Location:** `06-testing/` (atau sesuai struktur OLION)
**Access:** Internal doc

---

### FR-42 — Testing Evidence (screenshot + log)

**Module:** `testing`
**Repo Location:** `06-testing/evidence/`
**Access:** Internal doc

---

### FR-43 — Deployment guide + docker

**Module:** `deployment`
**Repo Location:** `07-deployment/`
**Access:** Internal doc

---

## 4) Catatan Penting MVP (Rules Summary)

* Edit konten maksimal **24 jam**
* Delete user = **soft delete**
* Voting hanya untuk **diskusi + jawaban**
* Report untuk semua konten, moderasi minimal hide + resolve
* Expert verification: dokumen + link portofolio wajib
* Auth: access token 15m, refresh token 30d, rotation ON
* Admin identity view hanya via audit mode + audit log

---

