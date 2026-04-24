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

  // API Route for Searching
  app.post('/api/search', async (req, res) => {
    const { token, type, audience, region, ddi, source } = req.body;

    // Use the provided token or fallback to environment variable
    const apiKey = token || process.env.SERPER_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: 'Falta o token de acesso (SERPER_API_KEY).' });
    }

    try {
      // Logic from user: "público" "região" "DDI" site:origem
      // Example: "pizzaria" "Orlando" "+55" site:instagram.com
      let query = `"${audience}" "${region}" "${ddi}"`;
      if (source !== 'All') {
        const domainMap: Record<string, string> = {
          'Instagram': 'instagram.com',
          'Facebook': 'facebook.com',
          'LinkedIn': 'linkedin.com',
          'YouTube': 'youtube.com'
        };
        const domain = domainMap[source] || source.toLowerCase();
        query += ` site:${domain}`;
      }

      console.log('Performing query:', query);

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
      console.error('Search error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Erro ao realizar a busca. Verifique seu token e tente novamente.' });
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
