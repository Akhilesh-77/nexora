# NEXORA — Campus Placement Preparation Platform
### Enterprise Engineering & Recruitment Intelligence Engine

NEXORA is a comprehensive, production-grade campus placement platform designed to prepare engineering students across multiple disciplines for technical interviews, coding rounds, and aptitude tests. It features a robust client-server architecture powered by Node.js, Express, and MongoDB, complete with integrated deterministic evaluation engines and zero mandatory cloud dependencies or third-party tracking.

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │    NEXORA System Architecture          │
                      └───────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                     ┌────────────────────────┐
     │  Frontend Application  │                     │  Backend Express API   │
     │  • React 19 + Vite     │◄───(JWT / REST)────►│  • Node.js + Express   │
     │  • Tailwind CSS v4     │                     │  • TypeScript (ESM)    │
     │  • Lucide React Icons  │                     │  • Rate Limiting & Auth│
     │  • Responsive & Themes │                     │  • Server-Side Grading │
     └────────────────────────┘                     └───────────┬────────────┘
                                                                │
                                                                ▼ (Mongoose ODM)
                                                    ┌────────────────────────┐
                                                    │ MongoDB Database Server│
                                                    │ mongodb://127.0.0.1    │
                                                    │ :27017/nexora          │
                                                    └────────────────────────┘
```

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti.
- **Backend:** Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs.
- **Database:** MongoDB Community Server (`mongodb://127.0.0.1:27017/nexora`), inspected via MongoDB Compass.
- **AI & Evaluation Engine:** High-performance, transparent deterministic rule-based algorithms with domain keyword verification, STAR framework validation, and Google XYZ resume bullet refinement.

---

## Prerequisites

1. **Node.js:** v18.0.0 or higher.
2. **MongoDB Community Server:** Installed and accessible on `127.0.0.1:27017`.
3. **MongoDB Compass (Optional):** Recommended for viewing database collections directly.

---

## Quick Start & Setup

### 1. Clone & Install Dependencies

```bash
cd "d:\EL 2 PHASE\nexxaistud"
npm install
```

### 2. Configure Environment Variables

The backend loads configuration from `.env`. An example template is provided in `.env.example`:

```bash
cp .env.example .env
```

Default `.env` configuration:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/nexora
JWT_SECRET=nexora_production_jwt_secret_key_2026_super_secure!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=AdminSecurePass2026!
ADMIN_EMAIL=admin@nexora.edu
```

### 3. Seed Database (Initial Setup)

Populate the database with the initial administrator, 28 career roles, 6 multi-discipline engineering modules, and 3,570 verified technical questions (70 Easy, 70 Medium, 70 Hard across 17 subjects):

```bash
npm run seed
```

> **Note:** The seeding script is fully idempotent. Re-running it will safely preserve existing records without creating duplicates.

### 4. Start the Application

Start the unified development server:

```bash
npm run dev
```

Open your browser at **http://localhost:3000**.

---

## Authentication & Credentials

### Default Administrator Credentials
- **Login Portal:** Navigate to `/admin` or click "Administrator Portal" on the sign-in modal.
- **Identifier:** `admin`
- **Password:** `AdminSecurePass2026!`

### Student Accounts
- Any student can register via the **"Create Free Account"** tab using their Name, Username, Email, and Password.
- Passwords are securely hashed with `bcryptjs` (salt rounds: 10).
- Public registration strictly enforces the `student` role; administrative privileges cannot be acquired through client registration.
- Private learning progress, quiz attempts, bookmarks, notes, and resume data are strictly isolated per user.

---

## Core Platform Capabilities

### 1. Administrator Dashboard (`/admin`)
- **System Overview & Health:** Live database connection status, memory metrics, registered student counts, active users (last 7 days), and cumulative lesson completions.
- **User Management:** Search and filter registered students, view individual learning logs, and safely disable or re-enable accounts.
- **Question Bank Management:** Search 3,570+ questions by branch, subject, and difficulty. Create, edit, validate, and delete questions directly in MongoDB.
- **Learning Modules:** Review domain learning modules across engineering branches.

### 2. Learning Studio (`/learning-studio`)
- Branch-specific content tailored for **CSE, ISE, ECE, EEE, Mechanical, Chemical, Civil, AI/ML, and Data Science**.
- Each module provides:
  - Concept introduction & simple definition
  - Step-by-step worked examples
  - Common pitfalls and debugging tips
  - Practice exercises with hints and complete solutions
  - Interactive knowledge-check quiz
  - Mark-as-complete (prevents duplicate credit)
  - Persistent bookmarks and private student notes

### 3. Practice Lab & Randomized Quizzes
- **Database-Backed Quizzes:** Configurable quiz length (5, 10, 15, 20 questions) dynamically sampled from MongoDB based on branch, subject, and difficulty.
- **Zero Client-Side Leaks:** Answer keys and explanations are stripped on question generation and only computed upon server-side submission.
- **Comprehensive Question Bank:** 3,570 technical questions covering 17 subjects:
  - *CSE / ISE / AI:* Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks, Software Engineering, Object-Oriented Programming, Machine Learning & AI, Discrete Mathematics.
  - *ECE / EEE:* Digital Electronics, Signals & Systems, Analog Electronics, Microprocessors & Microcontrollers, Power Systems & Machines.
  - *Mechanical:* Engineering Thermodynamics, Fluid Mechanics, Strength of Materials.
  - *Chemical:* Chemical Reaction Engineering, Mass Transfer Operations.
  - *Civil:* Structural Analysis, Concrete Technology & Soil Mechanics.
  - *Placement Screening:* Quantitative Aptitude, Logical Reasoning, Verbal Ability.

### 4. Transparent Interview Studio
- Rule-based evaluation engine analyzing word count, domain keywords, STAR structure, and edge-case awareness.
- Provides immediate feedback: Overall score, Technical score, Communication score, Demonstrated strengths, Missing considerations, and an exemplary Model Answer.
- Speech-to-Text (STT) and Text-to-Speech (TTS) audio support.
- Full session records saved to MongoDB with streak tracking.

### 5. Recruiter-Approved Resume Studio
- 4 ATS-friendly templates (Modern Technical, Classic Professional, Minimal ATS, Executive Clean).
- Real-time preview with automated Google XYZ bullet point enhancer.
- Persistent real-time sync directly into student's MongoDB account.
- One-click print / Save as PDF.

### 6. High-Availability Database Resilience
- If MongoDB is stopped, NEXORA displays a prominent connection warning banner (`Database Offline: Ensure MongoDB service is running on 127.0.0.1:27017`).
- Never silently falls back to Atlas or cloud APIs.
- Never fabricates scores or progress ("Not assessed yet" shown until real assessments are completed).

---

## Verification & Testing

To run the complete automated 10-phase end-to-end verification suite:

```bash
npm test
```

This verifies:
1. Database connectivity & health reporting
2. Role enforcement & duplicate prevention
3. Authentication & JWT security
4. Progress tracking idempotency (no duplicate lesson credit)
5. Randomized quiz sampling & anti-leak verification
6. Learning Studio module structures
7. Interview Studio scoring & resume bullet enhancement
8. MongoDB resume data persistence
9. Rule-based assistant queries
10. Admin dashboard CRUD operations & account enable/disable

---

## Available NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the full-stack server (Node.js + Vite middleware) |
| `npm run build` | Compiles the client with Vite into `/dist` |
| `npm run start` | Starts the production server serving `/dist` |
| `npm run seed` | Seeds admin, 28 roles, modules, and 3,570 questions |
| `npm test` | Executes the comprehensive E2E verification test suite |
| `npm run lint` | Runs `tsc --noEmit` across all client and server files |
