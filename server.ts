import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { AIService } from './server/aiService.js';
import {
  getRAGStatus,
  getAllRAGDocuments,
  getRAGDocument,
  searchRAGKnowledgeBase,
} from './server/ragKnowledgeBase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// 1. Ask Career Saathi (Conversational Agent with Selective RAG)
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  try {
    const { question, studentContext, currentJD, chatHistory } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const result = await AIService.askCareerSaathi({
      question,
      studentContext,
      currentJD,
      chatHistory,
    });

    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/ai/ask:', error);
    return res.status(500).json({
      error: 'Failed to process career query',
      details: error.message,
    });
  }
});

// 2. Parse Job Description (Semantic Requirement Extraction & Classification)
app.post('/api/ai/parse-jd', async (req: Request, res: Response) => {
  try {
    const { jdText } = req.body;
    if (!jdText) return res.status(400).json({ error: 'Job description text is required' });

    const parsed = await AIService.parseJobDescription(jdText);
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error parsing JD:', err);
    return res.status(500).json({ error: 'Failed to parse JD', message: err.message });
  }
});

// 3. AI Practice Coach Answer Evaluation (STAR / Case / Technical Rubrics)
app.post('/api/ai/evaluate-practice', async (req: Request, res: Response) => {
  try {
    const { question, answer, category, targetRole, rubricFramework } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and student answer are required' });
    }

    const evaluation = await AIService.evaluatePracticeAnswer({
      question,
      answer,
      category: category || 'Personal Interview',
      targetRole: targetRole || 'Software Development Engineer',
      rubricFramework: rubricFramework || 'STAR Method',
    });

    return res.json(evaluation);
  } catch (err: any) {
    console.error('Error in practice evaluation:', err);
    return res.status(500).json({ error: 'Failed to evaluate practice answer', message: err.message });
  }
});

// 4. CV Analysis (Cross-Validation: Profile ↔ CV ↔ Target JD)
app.post('/api/ai/analyze-cv', async (req: Request, res: Response) => {
  try {
    const { profile, cvText, activeJD } = req.body;
    if (!cvText) return res.status(400).json({ error: 'CV text is required' });

    const analysis = await AIService.analyzeCV(profile, cvText, activeJD);
    return res.json(analysis);
  } catch (err: any) {
    console.error('Error in CV analysis:', err);
    return res.status(500).json({ error: 'Failed to analyze CV', message: err.message });
  }
});

// 5. LinkedIn Analysis (Visibility vs Genuine Skill Gaps)
app.post('/api/ai/analyze-linkedin', async (req: Request, res: Response) => {
  try {
    const { profile, linkedInData, activeJD } = req.body;
    const analysis = await AIService.analyzeLinkedIn(profile, linkedInData, activeJD);
    return res.json(analysis);
  } catch (err: any) {
    console.error('Error in LinkedIn analysis:', err);
    return res.status(500).json({ error: 'Failed to analyze LinkedIn profile', message: err.message });
  }
});

// 6. Authorized Gmail Report Delivery Simulation & Activity Logging (FR-056, FR-057)
const emailActivityLog: Array<{
  id: string;
  timestamp: string;
  recipient: string;
  recipientRole: string;
  reportTitle: string;
  subject: string;
  status: 'SENT' | 'FAILED' | 'PENDING_APPROVAL';
  authenticatedSender: string;
}> = [];

app.post('/api/email/send-report', async (req: Request, res: Response) => {
  try {
    const { recipient, recipientRole, reportTitle, customMessage, studentName } = req.body;
    if (!recipient) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    const logEntry = {
      id: `email-${Date.now()}`,
      timestamp: new Date().toISOString(),
      recipient,
      recipientRole: recipientRole || 'Academic Advisor / Mentor',
      reportTitle: reportTitle || 'Career Saathi Readiness Diagnostic Report',
      subject: `Career Readiness Report: ${studentName || 'Student'} [Career Saathi Dossier]`,
      status: 'AUDIT_LOGGED' as const,
      authenticatedSender: 'student@careersaathi.internal',
    };

    emailActivityLog.unshift(logEntry);

    return res.json({
      success: true,
      message: `Report export recorded in local audit register for ${recipient}.`,
      log: logEntry,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Email delivery failed', message: err.message });
  }
});

app.get('/api/email/logs', (_req: Request, res: Response) => {
  return res.json({ logs: emailActivityLog });
});

// 7. RAG Knowledge Base Endpoints (Directly linked to /RAG_KNOWLEDGE_BASE)
app.get('/api/rag/status', (_req: Request, res: Response) => {
  return res.json(getRAGStatus());
});

app.get('/api/rag/documents', (_req: Request, res: Response) => {
  return res.json({ documents: getAllRAGDocuments() });
});

app.get('/api/rag/documents/:docId', (req: Request, res: Response) => {
  const doc = getRAGDocument(req.params.docId);
  if (!doc) {
    return res.status(404).json({ error: `RAG document ${req.params.docId} not found` });
  }
  return res.json(doc);
});

app.post('/api/rag/query', (req: Request, res: Response) => {
  const { query, limit } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  const matches = searchRAGKnowledgeBase(query, limit ? Number(limit) : 5);
  return res.json({ query, matches });
});

// 8. System Healthcheck & Service Status
app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    service: 'Career Saathi AI Centralized Intelligence Service',
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
    version: '1.0.0',
    mode: process.env.NODE_ENV || 'development',
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = Number(PORT) || 3000;
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Career Saathi AI Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
