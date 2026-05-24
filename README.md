# Multimodal Document Analyzer AI

A full-stack, production-ready AI project that allows users to upload, analyze, and search through various document types using LangChain, OpenAI, and MongoDB.

## Features
- **Multimodal Upload:** Supports PDF, DOCX, TXT, CSV, JSON, XLSX, and Images.
- **AI Analysis:** Extracts text and generates summaries, keywords, insights, and tags.
- **Semantic Search:** Uses vector embeddings to find documents by context, not just exact keywords.
- **Modern Dashboard:** Built with React, Tailwind CSS, and Framer Motion for a premium feel.

## Architecture
- **Frontend:** React + Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (with Vector Search capabilities)
- **AI Engine:** LangChain, OpenAI (`gpt-3.5-turbo`, text-embedding models)

## Folder Structure
```
multimodal-analyzer/
│
├── frontend/             # React application
│   ├── src/              # Components, pages, services
│   ├── public/           # Static assets
│   ├── tailwind.config.js
│   └── vercel.json       # Vercel deployment config for SPA
│
├── backend/              # Express API
│   ├── api/              # Vercel Serverless entry
│   ├── config/           # DB connection
│   ├── controllers/      # Route handlers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── services/         # Parsing and AI logic
│   └── vercel.json       # Vercel deployment config for API
```

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone YOUR_GITHUB_URL
   cd multimodal-analyzer
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and add your MONGO_URL, OPENAI_API_KEY, and LANGCHAIN_API_KEY
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   # .env is already configured for local dev (VITE_API_URL=http://localhost:5000/api)
   npm run dev
   ```

## Environment Setup
Ensure you have a MongoDB cluster running. If you want to use advanced semantic search, set up an Atlas Vector Search index on the `embedding` field in your `documents` collection. Otherwise, the app falls back to basic cosine similarity in memory (only recommended for development!).

## Vercel Deployment

**Backend:**
- Import the `backend` folder as a project in Vercel.
- Select "Other" framework or leave it default.
- Set Environment Variables.
- Vercel will use `backend/vercel.json` and deploy `api/index.js` as a serverless function.

**Frontend:**
- Import the `frontend` folder as a project in Vercel.
- Select "Vite" framework.
- Set `VITE_API_URL` to your deployed backend URL.
- Vercel will use `frontend/vercel.json` to handle React Router rewrites.

## GitHub Push Commands
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```
