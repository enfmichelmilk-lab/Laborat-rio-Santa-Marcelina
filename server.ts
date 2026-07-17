import express from 'express';
import path from 'path';
import fs from 'fs';

async function startServer() {
  const app = express();
  
  // Robust port detection for Phusion Passenger / cPanel / Hostinger and Cloud Run
  const rawPort = process.env.PORT || '3000';
  const isSocket = typeof rawPort === 'string' && isNaN(Number(rawPort));

  // Determine production mode:
  // We are in production if the built 'dist' directory with 'index.html' exists,
  // or if NODE_ENV is set to production.
  const distPath = path.join(process.cwd(), 'dist');
  const indexHtmlExists = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || indexHtmlExists;

  console.log(`Starting server. Mode: ${isProduction ? 'production' : 'development'}`);

  if (isProduction) {
    if (indexHtmlExists) {
      console.log(`Serving static files from: ${distPath}`);
      // Serve static assets from dist
      app.use(express.static(distPath));
      
      // Fallback for SPA routing/tab state to index.html
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.error(`Production mode active but 'dist/index.html' was not found at ${distPath}`);
      app.get('*', (req, res) => {
        res.status(500).send("Application build files are missing. Please build the application first.");
      });
    }
  } else {
    // In development, hook up Vite middleware
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite development middleware mounted successfully.');
    } catch (err) {
      console.error('Failed to load Vite development server. Falling back to serving build files if they exist.', err);
      if (indexHtmlExists) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      } else {
        app.get('*', (req, res) => {
          res.status(500).send("Development server failed to load and no build files found.");
        });
      }
    }
  }

  if (isSocket) {
    // Passenger Unix Socket
    app.listen(rawPort, () => {
      console.log(`Server running on Unix socket: ${rawPort}`);
    });
  } else {
    const portNum = parseInt(rawPort, 10);
    app.listen(portNum, '0.0.0.0', () => {
      console.log(`Server running on port ${portNum} in ${isProduction ? 'production' : 'development'} mode.`);
    });
  }
}

startServer().catch((err) => {
  console.error('Fatal: Failed to start server:', err);
});
