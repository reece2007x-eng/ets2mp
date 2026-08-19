const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Fallback credentials guarantee the app never boots with an empty URL
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://maokgjoenepqmgqogkdl.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_d9E-EAniv-ppm9VQgSQqdw_T-IGm9l1';

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Healthcheck Route
app.get('/', (req, res) => {
  res.json({ status: 'ETS2MP API & WebSocket Server Running' });
});

// POST route to submit a completed job from your game/client
app.post('/api/jobs', async (req, res) => {
  const { player_name, cargo, source_city, destination_city, income } = req.body;
  const { data, error } = await supabase
    .from('jobs')
    .insert([{ player_name, cargo, source_city, destination_city, income }]);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, data });
});

// GET route to view all logged jobs
app.get('/api/jobs', async (req, res) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*');

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// HTTP & WebSocket Integration
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket Client Connected');

  ws.on('message', (message) => {
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
