# ⚖️ LegalEase – AI-powered legal assistant

LegalEase is an **AI-powered contract analysis platform** that transforms dense legal documents into **simple, visual, and interactive insights**.  
Built with **Google Cloud AI**, **Firebase**, and **Next.js**, it helps lawyers, entrepreneurs, and students understand contracts faster, safer, and smarter.  

---

## ✨ Features  

### ✅ Core (MVP)  
- 📂 **Document Upload & Parsing** – Upload PDF/DOCX → parse into structured text (Google Cloud Document AI + Firebase Storage).  
- 📑 **Clause Extraction & Summarization** – Break contracts into clauses and summarize in plain English (short/medium/verbose).  
- 🔎 **Risk Heatmap** – Automatically classify clauses as **Low / Medium / High Risk** with color-coded highlights.  
- 🏷 **Entity & Obligation Recognition** – Detect parties, dates, money, deadlines, and responsibilities.  
- 💬 **Interactive Q&A** – Ask natural questions, get AI-powered answers from the contract.
- 📍 **Nearby Legal Advisor Finder** – Find verified legal advisors near you with contact info and directions.

### 🌍 Advanced & Extended (Future)  
- 📊 **Dashboard & Analytics** – Overall “safety score”, compliance graphs, risk % charts.  
- 🌐 **Multilingual Support** – Translate summaries & Q&A into multiple languages.  
- 📄 **Export Reports (PDF/CSV)** – Downloadable summaries, risk stats, and obligations.  
- 🎮 **Gamified Visuals** – Progress bars, badges like “Safe to Sign” or “Review Carefully”.  
- 🔮 **Scenario Simulation** – “What if I terminate early?” → AI simulates outcomes.  
- 🎤 **Voice Assistant** – Explain clauses aloud; voice-based Q&A.  
- 🔗 **Live Regulation Sync** – Auto re-score contracts when laws/regulations update.  

---

## 🛠️ Tech Stack  

**Frontend:**  
- [Next.js](https://nextjs.org/) (React + TypeScript)  
- [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)  
- Recharts / Chart.js for analytics  

**Backend & Infra:**  
- [Firebase Authentication](https://firebase.google.com/docs/auth)  
- [Firestore](https://firebase.google.com/docs/firestore) (Realtime DB)  
- [Firebase Storage](https://firebase.google.com/docs/storage)  
- [Firebase Functions](https://firebase.google.com/docs/functions) / Cloud Run  

**AI/ML Stack:**  
- [Google Cloud Document AI](https://cloud.google.com/document-ai) (Parsing & OCR)  
- [Vertex AI Gemini](https://cloud.google.com/vertex-ai) (Summarization, Q&A, Risk classification)  
- [Google NLP API](https://cloud.google.com/natural-language) (Entity recognition, syntax)  
- [Google Translation API](https://cloud.google.com/translate) (Multilingual support)  
- [Pinecone](https://www.pinecone.io/) / Vertex Matching Engine (Vector search & retrieval)  

---

## 🏆 Why LegalEase?

-Saves hours of manual review.
-Identifies risks before signing.
-Makes legal documents accessible to all.
-Blends law + AI + design into one smart platform.

