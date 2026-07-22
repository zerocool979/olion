## OLION – Anonymous Discussion Platform X LIA - Retrieval-Augmented Generation Chatbot untuk OLION

![Olion Logo](images/olion.png)

![LIA Logo](images/lia.png)

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)
![Transformers.js](https://img.shields.io/badge/Embedding-Xenova%2Ftransformers-FF6F00)
![Gemini](https://img.shields.io/badge/LLM%20Utama-Gemini%202.5%20Flash-4285F4?logo=googlegemini&logoColor=white)
![Claude](https://img.shields.io/badge/LLM%20Cadangan-Claude%20Sonnet-D97757?logo=anthropic&logoColor=white)
![License](https://img.shields.io/badge/status-internal%20module-lightgrey)

---
Akses di [https://olion.vercel.app](https://olion.vercel.app)

| email          | password     |
| -------------- | ------------ |
| user1@olion.id | Password123! |
| user1 sd 12    | Password123! |
| mod@olion.id   | -----        |
| pakar@olion.id | -----        |
| admin@olion.id |              |

---

### Clone repository:

```bash
git clone https://github.com/zerocool979/olion.git
cd olion
```

### Backend

```bash
cd backend && npm install && cp .env.example .env && npm run migrate && npm run seed && npm run dev
```
> _"Backend running on http://localhost:4000"_

### Prisma studio

```bash
cd olion/backend && npx prisma studio
```
> _"Prisma Studio is up on http://localhost:5555"_

### Frontend

```bash
cd frontend && npm install && npm run dev
```
> _"Access the page at http://localhost:3000"_
