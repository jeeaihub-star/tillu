import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Free hosting has an ephemeral filesystem. Keep reports in memory instead of
// pretending that a local JSON file is durable. Reports reset when this process restarts.
type Report = { id: string; timestamp: string; [key: string]: unknown };
let reports: Report[] = [];

app.post('/api/reports', (req, res) => {
  const newEntry: Report = {
    ...req.body,
    id: 'rep_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    timestamp: new Date().toISOString(),
  };
  reports.unshift(newEntry);
  reports = reports.slice(0, 100);
  res.json({ success: true, report: newEntry });
});

app.get('/api/reports', (_req, res) => {
  res.json({ reports });
});

app.delete('/api/reports/:id', (req, res) => {
  reports = reports.filter((report) => report.id !== req.params.id);
  res.json({ success: true });
});

// Offline, deterministic comfort content. No AI provider or API key is used.
app.post('/api/gemini/pamper', (req, res) => {
  const {
    moodTitle, batteryLevel, craving, customProblemText,
  } = req.body ?? {};
  const battery = Number.isFinite(Number(batteryLevel)) ? Math.max(0, Math.min(10, Number(batteryLevel))) * 10 : 50;
  const detail = typeof customProblemText === 'string' ? customProblemText.trim().slice(0, 80) : '';
  const comfort = typeof craving === 'string' && craving.trim() ? craving.trim() : 'something comforting';
  const mood = typeof moodTitle === 'string' && moodTitle.trim() ? moodTitle.trim().toLowerCase() : 'overwhelmed';

  res.json({
    validation: `Feeling ${mood} with around ${battery}% of your energy is understandable. ${detail ? `You have a lot on your mind, including “${detail}”. ` : ''}You do not have to solve everything at once; taking a pause is a worthwhile step.`,
    pamperRitual: [
      `Comfort break: enjoy ${comfort} somewhere cozy, without feeling guilty about resting.`,
      'Quiet window: silence non-essential notifications for 20 minutes and give yourself a little breathing room.',
      'One gentle reset: stretch, wash your face, or listen to a favorite song—choose whichever feels easiest.',
    ],
    friendPlaybook: [
      'Check in gently and let her choose whether she wants to talk or simply have company.',
      'Listen without rushing to fix the situation or offering unsolicited advice.',
      'Offer one practical kindness, such as a snack, a short walk, or help with a small task.',
    ],
    affirmation: 'You deserve care and patience, including from yourself, even on the days when everything feels difficult.',
  });
});

app.post('/api/gemini/vent-soothe', (req, res) => {
  const vent = typeof req.body?.vent === 'string' ? req.body.vent.trim() : '';
  if (!vent) return res.status(400).json({ error: 'Please share a thought' });

  res.json({
    insight: 'It can be exhausting to carry something that matters this much. Your feelings deserve room, and you do not have to figure everything out in one sitting.',
    soothingTip: 'Unclench your jaw, take three slow breaths, sip some water, and choose one small thing that would make the next ten minutes easier.',
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tillu is listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start Tillu:', error);
  process.exit(1);
});
