require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Direct fallback URLs so it never crashes on startup
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://maokgjoenepqmgqogkdl.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_d9E-EAniv-ppm9VQgSQqdw_T-IGm9l1';

// Supabase Client Connection
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Healthcheck Route
app.get('/', (req, res) => {
  res.json({ status: 'ETS2MP API & WebSocket Server Running' });
});

// HTTP & WebSocket Integration
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket Client Connected');

  ws.on('message', (message) => {
    // Broadcast incoming gameplay/moderation packets to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});
