import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  const apiRouter = express.Router();

  apiRouter.get('/health', (req, res) => {
    console.log('Health check requested');
    res.json({ 
      status: 'ok', 
      time: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development'
    });
  });

  apiRouter.post('/search', async (req, res) => {
    console.log('Search request received:', req.body);
    const { token, type, audience, region, ddi, source } = req.body;
    const apiKey = token || process.env.SERPER_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: 'Falta o token de acesso (SERPER_API_KEY).' });
    }

    try {
      let query = `"${audience}" "${region}" "${ddi}"`;
      if (source && source !== 'All') {
        const domainMap: Record<string, string> = {
          'Instagram': 'instagram.com',
          'Facebook': 'facebook.com',
          'LinkedIn': 'linkedin.com',
          'YouTube': 'youtube.com'
        };
        const domain = domainMap[source] || source.toLowerCase();
        query += ` site:${domain}`;
      }

      console.log('Executing Serper query:', query);

      const endpoint = type === 'maps' ? 'https://google.serper.dev/maps' : 'https://google.serper.dev/search';
      
      const response = await axios.post(
        endpoint,
        { q: query, num: 20 },
        {
          headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error('Serper search error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Erro na busca. Verifique seu token.' });
    }
  });

  app.use('/api', apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
