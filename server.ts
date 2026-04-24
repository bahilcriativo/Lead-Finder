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

  // Global Request Logger
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    console.log('Health check hits direct route');
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  app.post('/api/search', async (req, res) => {
    console.log('Search hits direct route:', req.body);
    const { token, type, audience, region, ddi, source } = req.body;
    const apiKey = token || process.env.SERPER_API_KEY;

    if (!apiKey || apiKey === 'YOUR_SERPER_API_KEY' || apiKey.trim() === '') {
      return res.status(401).json({ 
        error: 'Token de acesso inválido ou ausente. Por favor, insira uma API Key válida do serper.dev no campo "Token de acesso".' 
      });
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
      if (error.response?.status === 403) {
        return res.status(403).json({ 
          error: 'A API Key fornecida foi rejeitada pelo Serper. Verifique se a chave está correta ou se você ainda possui créditos.' 
        });
      }
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Erro desconhecido na busca.';
      console.error('Serper search error:', errorMsg);
      res.status(error.response?.status || 500).json({ error: errorMsg });
    }
  });

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
