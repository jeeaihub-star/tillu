import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Persistent reports storage file
const DATA_DIR = path.join(__dirname, 'data');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(REPORTS_FILE)) {
  fs.writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

function getStoredReports() {
  try {
    const raw = fs.readFileSync(REPORTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveReports(reports: unknown[]) {
  try {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save reports to disk:', err);
  }
}

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for timeout
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

// API: Save Submission Report
app.post('/api/reports', (req, res) => {
  try {
    const reportData = req.body;
    const reports = getStoredReports();
    const newEntry = {
      id: 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      ...reportData,
    };
    reports.unshift(newEntry);
    saveReports(reports.slice(0, 100)); // Keep latest 100
    res.json({ success: true, report: newEntry });
  } catch (err) {
    console.error('Error saving report:', err);
    res.status(500).json({ error: 'Failed to record report' });
  }
});

// API: Get All Stored Reports (For Friend Insights Dashboard)
app.get('/api/reports', (req, res) => {
  try {
    const reports = getStoredReports();
    res.json({ reports });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ reports: [] });
  }
});

// API: Clear/Delete a Report
app.delete('/api/reports/:id', (req, res) => {
  try {
    const { id } = req.params;
    const reports = getStoredReports();
    const filtered = reports.filter((r: { id: string }) => r.id !== id);
    saveReports(filtered);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// API: Gemini Fast Pamper & Emotional Analysis Engine
app.post('/api/gemini/pamper', async (req, res) => {
  const {
    moodTitle,
    batteryLevel,
    overthinkingLevel,
    craving,
    situationTitle,
    supportPreference,
    personalNote,
    problemCategory,
    customProblemText,
  } = req.body;

  const curatedFallback = {
    validation: `Tejaswi, feeling ${moodTitle || 'overwhelmed'} with ${batteryLevel * 10}% battery is completely normal. Your mind has been working overtime${customProblemText ? ` with "${customProblemText.substring(0, 50)}..."` : ''}, and giving yourself permission to pause is the strongest, kindest thing you can do tonight.`,
    pamperRitual: [
      `Comfort Fuel: Treat yourself to ${craving || 'your favorite comfort snack'} in your comfiest clothes with zero guilt.`,
      'Do Not Disturb Window: Put your phone on DND for at least 45 minutes and play gentle ambient rain sounds.',
      'Soft Decompression: Do one relaxing thing purely for your own joy without feeling guilty about what didn’t get done.',
    ],
    friendPlaybook: [
      `Check in gently with ${craving || 'comfort treats'} and zero demand for an immediate reply.`,
      'Listen without giving unsolicited lectures or trying to fix everything right away.',
      'Remind her that she is doing an incredible job navigating through busy days.',
    ],
    affirmation: 'You don’t have to carry the whole universe tonight, Tejaswi. You are already enough just as you are.',
  };

  // If no API key, return immediate curated fallback
  if (!process.env.GEMINI_API_KEY) {
    return res.json(curatedFallback);
  }

  try {
    const prompt = `You are a high-empathy, emotionally intelligent wellness & psychological comfort advisor writing a personalized Pampering & Emotional Support Guide for Tejaswi, a college student/young adult living in Assam, India.
Her current state:
- Mood: ${moodTitle || 'Tired'}
- Social/Physical Battery: ${batteryLevel * 10}%
- Overthinking Level: ${overthinkingLevel}/10
- Comfort Craving: ${craving || 'Hot Assam CTC Chai & Momos'}
- Headspace: "${situationTitle || 'A lot happening'}"
- Preferred Support Style: "${supportPreference || 'Listening'}"
${problemCategory ? `- Problem Category: ${problemCategory}` : ''}
${customProblemText ? `- Her Real Problem She Shared: "${customProblemText}"` : ''}
${personalNote ? `- Personal Note she wrote: "${personalNote}"` : ''}

Key Context & Principles:
- If she mentions exams, results, backlogs, or study stress, reassure her with conviction that marks or backlogs NEVER define her intelligence, worth, or future.
- If she mentions family pressure, validate her boundary need and mental sanctuary.
- Acknowledge local comfort where fitting (e.g. warm Assam CTC chai, street momos, fresh Kaji Nemu cooler, cozy blankets).
- If smoking is mentioned as a stress reliever, encourage her with care and zero judgment to hydrate, breathe clean air, and protect her lungs.

Provide a thoughtful, warm, pampering response with ZERO cringe, NO clichés, and a genuinely validating tone. Format as JSON with:
1. "validation": 2-3 sentences of comforting psychological validation explaining why her feeling makes total sense.
2. "pamperRitual": 3 specific, cozy pampering steps for her tonight.
3. "friendPlaybook": 3 specific, thoughtful ways her friend can pamper and support her in real life without being overwhelming.
4. "affirmation": 1 elegant, uplifting sentence reminding her of her worth.`;

    const apiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            validation: { type: Type.STRING },
            pamperRitual: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            friendPlaybook: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            affirmation: { type: Type.STRING },
          },
          required: ['validation', 'pamperRitual', 'friendPlaybook', 'affirmation'],
        },
      },
    });

    // 3.5s timeout race for instant responsiveness
    const response = await withTimeout(apiCall, 3500, null);

    if (response && response.text) {
      const parsed = JSON.parse(response.text);
      return res.json(parsed);
    }

    return res.json(curatedFallback);
  } catch (err) {
    console.error('Gemini Pamper API error:', err);
    return res.json(curatedFallback);
  }
});

// API: Fast AI Vent & Soothe (Quick mood helper)
app.post('/api/gemini/vent-soothe', async (req, res) => {
  try {
    const { vent, category } = req.body;
    if (!vent || !vent.trim()) {
      return res.status(400).json({ error: 'Please share a thought' });
    }

    const fallbackResponse = {
      insight: `Carrying "${vent.substring(0, 60)}" would drain anyone. Your feelings are 100% valid, and you don't have to carry it all by yourself.`,
      soothingTip: 'Take three slow deep breaths, drink a glass of water, and give yourself credit for holding things together today.',
    };

    if (!process.env.GEMINI_API_KEY) {
      return res.json(fallbackResponse);
    }

    const apiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Tejaswi (living in Assam, India) just shared this personal problem (${category || 'General'}): "${vent}".
Act as an empathetic, deeply reassuring, non-judgmental friend and psychological counselor.
- If about exams, results, or backlogs: reassure her that grades or backlogs do not define her worth or future, and that she can tackle it step by step.
- If about family pressure: validate her need for mental boundaries and self-care.
- If about diet or fitness: encourage gentle nourishment and rest without pressure.
- If about smoking/habits: gently encourage clean breathing, hydration, and self-compassion.
Return JSON:
- "insight": 2 sentences of comforting psychological validation explaining why it's okay to feel this way and uplifting her spirits.
- "soothingTip": 1 immediate micro-action she can do to feel lighter right now.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insight: { type: Type.STRING },
            soothingTip: { type: Type.STRING },
          },
          required: ['insight', 'soothingTip'],
        },
      },
    });

    const response = await withTimeout(apiCall, 3000, null);
    if (response && response.text) {
      return res.json(JSON.parse(response.text));
    }
    return res.json(fallbackResponse);
  } catch (err) {
    return res.json({
      insight: 'Whatever is weighing on your mind, you do not have to figure it all out tonight. Give your brain permission to pause.',
      soothingTip: 'Drink a glass of water, exhale slowly, and give yourself credit for getting through today.',
    });
  }
});

// Mount Vite or Serve Static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
