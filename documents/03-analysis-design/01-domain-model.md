# Domain Model — OLION

**Project Name:** OLION
**Layer:** Analysis & Design
**Document Type:** Domain Model Specification
**Version:** 1.0 (MVP Baseline)
**Status:** Implementation Foundation
**Last Updated:** 2026-03-27

---

# 1. Purpose

Dokumen ini mendefinisikan **domain entities**, atribut utama, relasi antar entity, serta aturan bisnis yang melekat pada masing‑masing objek sistem.

Domain Model menjadi fondasi untuk:

* ERD (Entity Relationship Diagram)
* Database Schema Design
* ORM Model Definition
* Business Logic Layer
* API Implementation

Dokumen ini harus dianggap sebagai **source of truth** sebelum pembuatan database migration.

---

# 2. Domain Entity Overview

Entity utama dalam sistem OLION:

```
User
Role
Discussion
Answer
Comment
Vote
Report
Category
ExpertRequest
AuditLog
RefreshToken
Notification (Future-ready)
```

---

# 3. Core Domain Entities

---

# 3.1 User

Represents a registered individual in the platform.

## Attributes

| Field                | Type         | Constraint                  | Notes              |
| -------------------- | ------------ | --------------------------- | ------------------ |
| id                   | UUID         | PK                          | Primary identifier |
| email                | VARCHAR(255) | UNIQUE                      | Login identity     |
| passwordHash         | TEXT         | REQUIRED                    | Hashed password    |
| pseudonym            | VARCHAR(50)  | UNIQUE                      | Public identity    |
| roleId               | UUID         | FK → Role                   | Access level       |
| status               | ENUM         | ACTIVE / SUSPENDED / BANNED | Account state      |
| pseudonymChangeCount | INT          | DEFAULT 0                   | Max 3 changes      |
| createdAt            | TIMESTAMP    | REQUIRED                    |                    |
| updatedAt            | TIMESTAMP    | REQUIRED                    |                    |
| deletedAt            | TIMESTAMP    | NULLABLE                    | Soft delete        |

## Relationships

* User → Role (Many-to-One)
* User → Discussion (One-to-Many)
* User → Answer (One-to-Many)
* User → Comment (One-to-Many)
* User → Vote (One-to-Many)
* User → Report (One-to-Many)
* User → ExpertRequest (One-to-Many)
* User → RefreshToken (One-to-Many)
* User → AuditLog (One-to-Many)

---

# 3.2 Role

Defines access level permissions.

## Attributes

| Field     | Type      | Constraint               |
| --------- | --------- | ------------------------ |
| id        | UUID      | PK                       |
| name      | ENUM      | USER / MODERATOR / ADMIN |
| createdAt | TIMESTAMP |                          |

## Relationships

* Role → User (One-to-Many)

---

# 3.3 Discussion

Represents top-level discussion created by user.

## Attributes

| Field       | Type         | Constraint    |
| ----------- | ------------ | ------------- |
| id          | UUID         | PK            |
| authorId    | UUID         | FK → User     |
| categoryId  | UUID         | FK → Category |
| title       | VARCHAR(255) | REQUIRED      |
| content     | TEXT         | REQUIRED      |
| voteCount   | INT          | DEFAULT 0     |
| answerCount | INT          | DEFAULT 0     |
| isDeleted   | BOOLEAN      | DEFAULT FALSE |
| createdAt   | TIMESTAMP    |               |
| updatedAt   | TIMESTAMP    |               |
| deletedAt   | TIMESTAMP    | NULLABLE      |

## Relationships

* Discussion → User (Many-to-One)
* Discussion → Category (Many-to-One)
* Discussion → Answer (One-to-Many)
* Discussion → Vote (One-to-Many)
* Discussion → Report (One-to-Many)

---

# 3.4 Answer

Represents user response to discussion.

## Attributes

| Field        | Type      | Constraint      |
| ------------ | --------- | --------------- |
| id           | UUID      | PK              |
| discussionId | UUID      | FK → Discussion |
| authorId     | UUID      | FK → User       |
| content      | TEXT      | REQUIRED        |
| voteCount    | INT       | DEFAULT 0       |
| isDeleted    | BOOLEAN   | DEFAULT FALSE   |
| createdAt    | TIMESTAMP |                 |
| updatedAt    | TIMESTAMP |                 |
| deletedAt    | TIMESTAMP | NULLABLE        |

## Relationships

* Answer → Discussion (Many-to-One)
* Answer → User (Many-to-One)
* Answer → Comment (One-to-Many)
* Answer → Vote (One-to-Many)
* Answer → Report (One-to-Many)

---

# 3.5 Comment

Represents nested feedback on answers.

## Attributes

| Field     | Type      | Constraint    |
| --------- | --------- | ------------- |
| id        | UUID      | PK            |
| answerId  | UUID      | FK → Answer   |
| authorId  | UUID      | FK → User     |
| content   | TEXT      | REQUIRED      |
| isDeleted | BOOLEAN   | DEFAULT FALSE |
| createdAt | TIMESTAMP |               |
| deletedAt | TIMESTAMP | NULLABLE      |

## Relationships

* Comment → Answer (Many-to-One)
* Comment → User (Many-to-One)

---

# 3.6 Vote

Stores upvote/downvote actions.

## Attributes

| Field      | Type      | Constraint          |
| ---------- | --------- | ------------------- |
| id         | UUID      | PK                  |
| userId     | UUID      | FK → User           |
| targetType | ENUM      | DISCUSSION / ANSWER |
| targetId   | UUID      | REQUIRED            |
| voteType   | ENUM      | UP / DOWN           |
| createdAt  | TIMESTAMP |                     |

## Relationships

* Vote → User (Many-to-One)

## Business Rules

* Satu user hanya boleh vote sekali per target

---

# 3.7 Report

Represents content reporting mechanism.

## Attributes

| Field      | Type      | Constraint                    |
| ---------- | --------- | ----------------------------- |
| id         | UUID      | PK                            |
| reporterId | UUID      | FK → User                     |
| targetType | ENUM      | DISCUSSION / ANSWER / COMMENT |
| targetId   | UUID      | REQUIRED                      |
| reason     | TEXT      | REQUIRED                      |
| status     | ENUM      | OPEN / RESOLVED / REJECTED    |
| resolvedBy | UUID      | FK → User                     |
| createdAt  | TIMESTAMP |                               |
| resolvedAt | TIMESTAMP | NULLABLE                      |

## Relationships

* Report → User (Many-to-One)

---

# 3.8 Category

Represents classification of discussions.

## Attributes

| Field       | Type         | Constraint |
| ----------- | ------------ | ---------- |
| id          | UUID         | PK         |
| name        | VARCHAR(100) | UNIQUE     |
| description | TEXT         |            |
| createdAt   | TIMESTAMP    |            |
| deletedAt   | TIMESTAMP    | NULLABLE   |

## Relationships

* Category → Discussion (One-to-Many)

---

# 3.9 ExpertRequest

Handles expert verification workflow.

## Attributes

| Field         | Type      | Constraint                    |
| ------------- | --------- | ----------------------------- |
| id            | UUID      | PK                            |
| userId        | UUID      | FK → User                     |
| documentUrl   | TEXT      | REQUIRED                      |
| portfolioLink | TEXT      | REQUIRED                      |
| status        | ENUM      | PENDING / APPROVED / REJECTED |
| reviewedBy    | UUID      | FK → User                     |
| reviewedAt    | TIMESTAMP | NULLABLE                      |
| createdAt     | TIMESTAMP |                               |

## Relationships

* ExpertRequest → User (Many-to-One)

---

# 3.10 RefreshToken

Handles session continuation securely.

## Attributes

| Field     | Type      | Constraint |
| --------- | --------- | ---------- |
| id        | UUID      | PK         |
| userId    | UUID      | FK → User  |
| tokenHash | TEXT      | REQUIRED   |
| expiresAt | TIMESTAMP | REQUIRED   |
| revokedAt | TIMESTAMP | NULLABLE   |
| createdAt | TIMESTAMP |            |

## Relationships

* RefreshToken → User (Many-to-One)

---

# 3.11 AuditLog

Tracks critical system actions.

## Attributes

| Field      | Type         | Constraint |
| ---------- | ------------ | ---------- |
| id         | UUID         | PK         |
| actorId    | UUID         | FK → User  |
| action     | VARCHAR(100) | REQUIRED   |
| targetType | VARCHAR(50)  |            |
| targetId   | UUID         |            |
| metadata   | JSON         |            |
| createdAt  | TIMESTAMP    |            |

## Relationships

* AuditLog → User (Many-to-One)

---

# 4. Domain Relationship Summary

```
User ───< Discussion
User ───< Answer
User ───< Comment
User ───< Vote
User ───< Report
User ───< ExpertRequest
User ───< RefreshToken
User ───< AuditLog

Discussion ───< Answer
Discussion ───< Vote
Discussion ───< Report

Answer ───< Comment
Answer ───< Vote
Answer ───< Report

Category ───< Discussion

Role ───< User
```

---

# 5. Cross-Domain Business Constraints

## Identity Protection

* Email tidak boleh ditampilkan publik
* Pseudonym menjadi identitas utama publik

## Soft Delete Policy

Entity yang mendukung soft delete:

* User
* Discussion
* Answer
* Comment
* Category

## Moderation Integrity

Semua aktivitas berikut harus tercatat dalam AuditLog:

* Delete content
* Resolve report
* Change role
* Approve expert

## Vote Integrity

Constraint wajib:

```
UNIQUE(userId, targetType, targetId)
```

---

# 6. Lifecycle Notes

## User Lifecycle

```
REGISTERED
    ↓
ACTIVE
    ↓
(SUSPENDED / BANNED)
    ↓
DELETED (Soft)
```

## Expert Verification Lifecycle

```
PENDING
    ↓
APPROVED / REJECTED
```

## Report Lifecycle

```
OPEN
    ↓
RESOLVED / REJECTED
```

---

# 7. Implementation Readiness Status

Domain model ini dianggap siap untuk tahap berikutnya apabila:

* Semua entity utama telah terdefinisi
* Relasi antar entity telah jelas
* Constraint bisnis kritikal telah ditentukan
* Tidak ada entitas ambigu

Status Saat Ini:

**READY FOR ERD GENERATION**
