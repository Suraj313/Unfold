# Unfold

Understand. Verify. Practice.

## Overview

Unfold is an AI-powered study workspace designed to help students actively engage with their learning materials. Instead of just reading, students can upload their study PDFs, ask questions grounded strictly in their own documents (with exact page-level citations), and automatically generate multiple-choice quizzes to test their understanding. It forms a complete Understand → Verify → Practice learning loop.

## Live Demo

- **Frontend (Try it here):** [https://unfold-2-pqzy.onrender.com](https://unfold-2-pqzy.onrender.com)
- **Backend (Health Check):** [https://unfold-1.onrender.com/api/health](https://unfold-1.onrender.com/api/health)

*Note: The application is hosted on Render's free tier. The backend may take ~50 seconds to spin up from sleep on your first request.*

## Screenshots

**1. Landing Page**
![Landing Page](docs/assets/landing-page.png)
*Modern, responsive landing page highlighting the Understand → Verify → Practice loop.*

**2. Workspace Dashboard**
![Workspace Dashboard](docs/assets/workspace-dashboard.png)
*Main dashboard for uploading and managing study materials.*

**3. Ask AI (RAG with Citations)**
![Ask AI](docs/assets/ask-ai-rag.png)
*AI Q&A with exact page-level citations grounded in the uploaded document.*

**4. Practice Quiz**
![Practice Quiz](docs/assets/practice-quiz.png)
*Auto-generated multiple-choice quizzes to test retention and understanding.*

## Features

- **PDF Document Upload**: Securely upload study materials with automatic PDF validation and 10MB limits.
- **Document Processing**: Page-aware extraction, chunking, and local vector embeddings.
- **Ask AI (RAG)**: Ask questions and receive AI-generated answers grounded *only* in your uploaded documents.
- **Page-Level Sources**: Every AI answer cites the exact source document and page number.
- **Practice Quizzes**: Automatically generate exactly 5 multiple-choice questions from representative document sections, complete with scoring and explanations.
- **Authentication**: Secure JWT-based authentication using HttpOnly cookies.
- **Security & Reliability**: Built-in rate limiting, LLM retry mechanisms with exponential backoff, and strict data ownership isolation.

## Product Workflow

1. **Upload**: Users upload a PDF study guide, lecture slides, or textbook chapter.
2. **Understand**: The backend processes the document, extracting text, generating vector embeddings, and storing them in PostgreSQL.
3. **Verify**: Users query the document using the "Ask AI" feature to clarify complex topics, verifying information via page-level citations.
4. **Practice**: Users generate a targeted quiz to test their retention of the material.

## Architecture

```mermaid
graph TD
    Client[React + Vite Frontend]
    API[Express Backend API]
    DB[(PostgreSQL + pgvector)]
    Storage[(Supabase / Local Storage)]
    Embedder[Jina AI / Ollama]
    Groq[Groq API]

    Client <-->|REST / JSON| API
    API <-->|SQL| DB
    API <-->|Files| Storage
    API -->|API| Embedder
    API -->|SDK| Groq

    subgraph Document Processing
        Extract[PDF Extraction] --> Chunk[Page-aware Chunking]
        Chunk --> Embed[Generate Embeddings]
        Embed --> Store[Store in DB]
    end

    subgraph RAG / Ask AI
        Search[Vector Similarity Search] --> Threshold[Relevance Filter]
        Threshold --> Prompt[Context Construction]
        Prompt --> LLM[Grounded Generation]
    end

    API -.-> Extract
    API -.-> Search
```

## RAG Pipeline

When a user asks a question, the system executes a Retrieval-Augmented Generation (RAG) pipeline:
1. **Query Embedding**: The user's question is embedded using the configured provider (Jina AI for production, or Ollama for local offline use).
2. **Vector Similarity Search**: A secure `pgvector` query retrieves the top-K chunks from the database, strictly scoped to the authenticated user's documents.
3. **Relevance Threshold**: Chunks with a cosine similarity below `0.50` are discarded to prevent noise.
4. **Context Construction**: Surviving chunks are assembled into a prompt containing exact page numbers and document text.
5. **Grounded Generation**: The Groq API (`openai/gpt-oss-120b`) generates a student-friendly answer based *only* on the provided context, actively rejecting prompt injections.
6. **Sources**: The exact page numbers and document titles are returned alongside the answer for UI citation.

## Document Processing

1. **Extraction**: The PDF is parsed to extract text while explicitly maintaining page boundaries.
2. **Chunking**: Text is split into chunks of approximately 600 words with a 100-word overlap. Chunks **never cross page boundaries** to guarantee citation accuracy.
3. **Embeddings**: Chunks are embedded via the configured provider (e.g., Jina AI) into 768-dimensional vectors.
4. **Storage**: Text, metadata, and vectors are saved to PostgreSQL. The physical PDF is uploaded to Supabase Storage (or local storage during dev).
5. **State Management**: Documents are tracked via `UPLOADED`, `PROCESSING`, `READY`, and `FAILED` states. Failed uploads safely clean up orphaned physical files.

## Practice Generation

1. **Context Selection**: The backend selects 5 representative chunks distributed evenly across the document to ensure broad coverage.
2. **LLM Generation**: Groq is prompted in strict JSON mode to generate exactly 5 MCQs with 4 options each.
3. **Validation**: The JSON output is parsed and validated using Zod to ensure schema correctness.
4. **Hallucination Defense**: The backend verifies that the `sourcePageNumber` returned by the LLM exactly matches one of the page numbers provided in the context blocks.
5. **Scoring**: The quiz is sent to the client, where scoring and option highlighting happen in the browser. (Note: Quiz history is not persisted in the database).

## Security

- **JWT Authentication**: Tokens are stored in `HttpOnly` cookies, preventing JavaScript access to mitigate the impact of Cross-Site Scripting (XSS).
- **SameSite=Strict**: Provides strong protection against Cross-Site Request Forgery (CSRF).
- **Data Isolation**: Every database query and vector search explicitly enforces `userId` equality checks.
- **Upload Validation**: Multer enforces 10MB limits, PDF MIME types, and generates secure UUID filenames to prevent path traversal.
- **Rate Limiting**: Global API endpoints are limited to 100 requests/15m. Expensive AI endpoints (`/api/chat`, `/api/practice`) have a stricter 10 requests/15m limit per IP.
- **SQL Injection**: Prevented entirely by Prisma ORM and parameterized `Prisma.sql` vector queries.

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios, React Markdown.
**Backend:** Node.js, Express, TypeScript, Prisma, Zod, JWT, bcrypt, Multer, Groq SDK.
**Database & Storage:** PostgreSQL with `pgvector` extension, Supabase Storage.
**AI Models:** Jina AI (Embeddings), `openai/gpt-oss-120b` (Groq API).

## Project Structure

```text
Unfold/
├── client/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level views (Workspace, Practice, AskAI)
│   │   └── services/    # Axios API wrappers
├── server/
│   ├── prisma/          # Database schema and migrations
│   ├── src/
│   │   ├── controllers/ # HTTP request/response handling
│   │   ├── middleware/  # Auth, upload, and rate-limiting
│   │   ├── routes/      # Express route definitions
│   │   └── services/    # Core business logic (RAG, LLM, PDF)
```

## Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (with `pgvector` extension installed)
- Ollama (installed locally)
- Groq API Key

### Database & Embeddings Setup
1. Ensure PostgreSQL is running and create a database (e.g., `unfold_db`).
2. Run `CREATE EXTENSION vector;` in your PostgreSQL database.
3. If using local embeddings instead of Jina AI, start Ollama and pull the model:
   ```bash
   ollama run nomic-embed-text
   ```

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file (see Environment Variables below).
3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Environment Variables

**server/.env**
```env
# =====================================================================
# Unfold Environment Configuration
# =====================================================================
# Unfold supports modular infrastructure providers depending on your environment.
# For local development: Use 'local' storage and 'ollama' embeddings to avoid hosted embedding API costs. Groq is still required for LLM responses.
# For production: Use 'supabase' storage and 'jina' embeddings for scalable cloud performance.

# Server Configuration
PORT=8000
CLIENT_URL=http://localhost:5173

# Database Configuration
# NOTE: This example URL is for local development only.
# Production database credentials should be configured directly in your hosting
# provider's environment variables (e.g. Render) and NEVER committed to Git.
DATABASE_URL="postgresql://postgres:root@localhost:5432/unfold_dev?schema=public"

# Authentication
JWT_SECRET="your_jwt_secret_here"

# Groq LLM Configuration
GROQ_API_KEY="your_groq_api_key_here"

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434

# Embedding Configuration (Providers: 'jina', 'ollama')
EMBEDDING_PROVIDER=jina
JINA_API_KEY="your_jina_api_key_here"
JINA_EMBEDDING_MODEL="jina-embeddings-v5-text-nano"

# Storage Configuration (Providers: 'supabase', 'local')
STORAGE_PROVIDER=supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
```

## API Overview

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- **Documents**: `POST /api/documents`, `GET /api/documents`, `DELETE /api/documents/:id`
- **Ask AI**: `POST /api/chat`
- **Practice**: `POST /api/practice/generate`

## Testing

The current implementation has been manually verified against:
- **Authentication**: Registration, login, and HttpOnly cookie lifecycle.
- **Document Processing**: PDF parsing, chunk boundaries, and orphaned file cleanup on failure.
- **RAG & Search**: Proper filtering via the 0.50 similarity threshold, exact cross-user data isolation.
- **Prompt Injection**: LLM adherence to strict grounding rules and ignoring malicious instructions within uploaded PDFs.
- **Rate Limiting & Retries**: 429/5xx transient error recovery and IP-based rate limiting.

## Current Limitations (MVP)

This project is built as a Minimum Viable Product, intentionally accepting the following constraints:
- **Synchronous Processing**: Document uploads block the HTTP response until extraction and embedding are complete. Very large PDFs may cause timeout errors.
- **Stateless Quizzes**: Quiz history and scores are not saved to the database.

## Future Improvements (V2)

- **Background Workers**: Implement BullMQ/Redis for asynchronous document processing.
- **Streaming LLM Responses**: Use Server-Sent Events (SSE) in the Ask AI chat to improve perceived latency.
- **Quiz History**: Add database persistence to track long-term learning progress.

## Portfolio & Engineering Highlights

Unfold demonstrates practical, real-world full-stack engineering skills, specifically:
- **Resilient AI Integration**: Implementation of exponential backoffs, strict JSON validation via Zod, and hallucination defenses, proving an understanding that LLMs are volatile and untrusted.
- **Vector Search & RAG**: Moving beyond simple toy apps by managing exact chunking boundaries, similarity thresholds, and raw parameterized `pgvector` SQL queries for multi-tenant isolation.
- **Backend Reliability**: Defensive programming practices including rate limiting, file cleanup on failure, and layered Express architecture.
- **Security Posture**: Implementation of HttpOnly/SameSite cookies, bcrypt hashing, and strict data ownership checks.
