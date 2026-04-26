# 🧠 AI Reading Companion — Technical Specification (MVP)

---

## 1. Overview

A full-stack web application that helps users:

- Capture ideas from reading (books, articles, thoughts)
- Automatically structure and embed them
- Retrieve knowledge via semantic search
- Reinforce memory through spaced recall

### Primary goal
> Build a lightweight personal knowledge system with semantic retrieval + recall loop.

This is NOT a notes app. It is a **memory system for reading**.

---

## 2. System Architecture

### High-Level Flow

```
Frontend (Next.js)
        ↓
API Routes (Next.js backend)
        ↓
Postgres DB (Supabase + pgvector)
        ↓
AI Provider Layer (abstracted)
```

---

## 3. Tech Stack

### Frontend
- Next.js (React framework)
- React
- TailwindCSS (optional)

### Backend
- Next.js API routes
- Serverless deployment (e.g. Vercel)

### Database
- Supabase Postgres
- pgvector extension for embeddings

### AI Layer
- Abstracted provider system (Ollama / cloud / mock)
- Embeddings + LLM used separately

---

## 4. Core Data Model

### entries

- id: uuid
- raw_text: text
- cleaned_text: text
- created_at: timestamp
- recall_score: integer
- last_reviewed_at: timestamp

---

### concepts

- id: uuid
- name: text

---

### entry_concepts

- entry_id: uuid
- concept_id: uuid

---

### embeddings

- entry_id: uuid
- vector: pgvector

---

## 5. API Design

### POST /api/entries
```json
{ "text": "string" }
```

### GET /api/entries
Returns feed

### POST /api/search
```json
{ "query": "string" }
```

### GET /api/recall
Returns next recall item

### POST /api/recall/update
```json
{ "entry_id": "uuid", "result": "got_it | missed" }
```

---

## 6. AI Provider Abstraction Layer

All AI must go through a provider interface.

Providers:
- Ollama
- OpenAI
- Mock

Environment:
AI_PROVIDER=ollama | openai | mock

---

## 7. AI Operations

- extractConcepts
- summariseEntry
- formatSearchResponse

---

## 8. AI Provider Interface

interface AIProvider {
  generateText(prompt: string): Promise<string>
  structuredOutput<T>(prompt: string): Promise<T>
}

---

## 9. AI Client Usage

aiClient.extractConcepts(text)
aiClient.summariseEntry(text)

---

## 10. Recall System

Score → interval:
0 → 1 day
1 → 2 days
2 → 4 days
3+ → 7+ days

---

## 11. Search System

- embed query
- vector search
- optional AI formatting

---

## 12. Frontend Pages

/
- feed
- recall card
- capture modal

/search
- query input
- results view

---

## 13. Constraints

- capture < 500ms
- search < 2s
- AI async only

---

## 14. MVP Scope

Must:
- capture
- feed
- search
- recall

Out:
- social
- gamification
- mobile app


---

## 15. Authentication & Users (Better Auth)

The system uses **Better Auth** for authentication and user management.

### Auth Provider
- Better Auth handles:
  - user sign-up
  - login/logout
  - session management
  - authentication middleware

---

### Better Auth Core Tables

These tables are managed by Better Auth. Do not modify their structure manually — use `npx auth@latest migrate` or `npx auth@latest generate`.

#### user

- id: string (primary key)
- name: string
- email: string (unique)
- emailVerified: boolean
- image: string (optional)
- createdAt: Date
- updatedAt: Date

#### session

- id: string (primary key)
- userId: string (FK → user.id, cascade delete)
- token: string (unique)
- expiresAt: Date
- ipAddress: string (optional)
- userAgent: string (optional)
- createdAt: Date
- updatedAt: Date

#### account

- id: string (primary key)
- userId: string (FK → user.id, cascade delete)
- accountId: string
- providerId: string
- accessToken: string (optional)
- refreshToken: string (optional)
- accessTokenExpiresAt: Date (optional)
- refreshTokenExpiresAt: Date (optional)
- scope: string (optional)
- idToken: string (optional)
- password: string (optional)
- createdAt: Date
- updatedAt: Date

#### verification

- id: string (primary key)
- identifier: string
- value: string
- expiresAt: Date
- createdAt: Date
- updatedAt: Date

---

### Data Isolation Rule

All domain data MUST be scoped per user:

#### entries (updated)

- id: uuid
- user_id: string (FK → user.id)
- raw_text: text
- cleaned_text: text
- created_at: timestamp
- recall_score: integer
- last_reviewed_at: timestamp

---

#### concepts (updated)

- id: uuid
- user_id: string (FK → user.id)
- name: text

---

#### entry_concepts (updated)

- entry_id: uuid
- concept_id: uuid

(implicitly scoped via entry/concept ownership)

---

#### embeddings (updated)

- entry_id: uuid
- vector: pgvector

---

### Authorization Rules

- Users can ONLY access their own entries, concepts, and embeddings
- All API routes must enforce session-based filtering
- No cross-user data access is allowed

---

### API Authentication Requirement

All API routes MUST:
- validate Better Auth session
- extract user_id from session
- scope all DB queries by user_id

---

### Security Constraint

If session is missing or invalid:
- return 401 Unauthorized
- do not fallback to public access
