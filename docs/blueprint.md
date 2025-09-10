# **App Name**: ClauseWise

## Core Features:

- Document Parsing: Upload and parse legal documents (PDF, DOCX, etc.) into structured text using Google Cloud Document AI.
- Clause Extraction: Intelligently split parsed text into individual clauses and sections.
- AI Clause Summarization: Use Vertex AI (Gemini) to generate plain English summaries and bullet points for each clause. A tool will be used to decide what details should be included from each source document based on user-selected levels of detail (short/medium/verbose).
- Risk Heatmap: Analyze clauses and compute risk scores based on keywords and Vertex AI to highlight high-risk clauses in red, medium in amber and low risk in green.
- Entity Recognition: Identify key entities like parties, dates, amounts, and obligations within clauses.
- Interactive Q&A: A tool will incorporate Vector database search to retrieve relevant clauses and answer user questions about the contract using Vertex AI, while providing references to the specific contract clauses used in the answer.
- Multilingual Support: Translate clause summaries and Q&A results into multiple languages using the Google Cloud Translation API.
- Dashboard / Analytics View: Show overall contract safety score, % of high-risk, medium-risk, and compliant clauses, and charts/graphs (e.g., pie chart, bar chart).
- Role-Based Explanations: Same clause explained differently for Lawyer (legal depth), Entrepreneur (financial & business risk), and Student (simple educational clarity).
- Export Report (PDF/CSV): Generate downloadable report with Document summary, High-risk clauses, Entity list, and Compliance % chart. Built using Firebase Functions + ReportLab / jsPDF.
- Gamified Visuals: Progress bar / dial showing how “safe” your contract is. Badges like ✅ “Safe to Sign”, ⚠️ “Review Carefully”, ❌ “High Risk Contract”. Makes the app engaging and memorable.

## Style Guidelines:

- Primary color: Indigo (#4B0082) to convey professionalism and trustworthiness.
- Background color: Very light gray (#F0F0F0), a desaturated version of indigo, for a clean, uncluttered interface.
- Accent color: Teal (#008080) for interactive elements and highlights, creating contrast and visual interest.
- Body text: 'Inter' (sans-serif) for the main content, including contract text, summaries, and risk explanations.
- Headline text: 'Poppins' (sans-serif) for headings, subheadings, and other emphasized text elements. The body text will be Inter.
- Use a consistent style of simple, outline-style icons throughout the application.
- Subtle animations for transitions and interactions to enhance the user experience without being distracting.