SmartChat

AI-powered group chat platform that keeps busy conversations organized using real-time messaging, AI summarization, task extraction, and semantic search.

Problem

Group chats get messy with hundreds of messages. People miss important discussions, decisions, and tasks. SmartChat uses AI to automatically organize conversations.

Features


Real-time Group Chat — WebSocket-based messaging with rooms (Socket.io)
Person-wise Filter — view messages from a specific person only
AI Catch-Up Summary — summarize chat by time range using Gemini
AI Task Extraction — auto-detect and extract tasks from messages
Smart Search (RAG) — ask natural-language questions (e.g. "who shared the link?") and get AI-generated answers using pgvector similarity search


Tech Stack

LayerTechnologyFrameworkNext.js 14 (App Router)StylingTailwindCSSAuthNextAuth.js (credentials provider, JWT)DatabasePostgreSQL (Supabase) — raw SQL, no ORMVector Searchpgvector extensionReal-timeSocket.io (separate Node.js server)AIGemini API (@google/generative-ai)DeployVercel (Next.js) + Render (Socket.io server)

