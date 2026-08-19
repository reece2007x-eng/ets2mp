// Dynamic Section Routing & State Management
const state = {
  currentUser: null,
  servers: [
    { name: "Simulation 1 (EU)", players: 4120, maxPlayers: 4500 },
    { name: "ProMods Server (EU)", players: 2890, maxPlayers: 3000 },
    { name: "Arcade (No Speed Limit)", players: 1105, maxPlayers: 2000 }
  ],
  livePlayers: [
    { id: 101, name: "ConvoyMaster", coords: "X: 1240, Y: 410", speed: "88 km/h" },
    { id: 102, name: "SpeedyDriver", coords: "X: -510, Y: 120", speed: "135 km/h" },
    { id: 103, name: "Hauler_99", coords: "X: 890, Y: -320", speed: "0 km/h" }
  ]
};

const sectionTitles = {
  'home': { title: 'Home Portal', desc: 'Welcome to the official ETS2MP multiplayer modification hub.' },
  'announcements': { title: 'Announcements', desc: 'Official updates from executive leadership.' },
  'changelog': { title: 'Development Updates', desc: 'Detailed technical patch notes for the ETS2MP game client.' },
  'blog': { title: 'Blog Posts', desc: 'Community articles and feature highlights.' },
  'servers': { title: 'Server Status', desc: 'Real-time player distribution across ETS2MP.' },
  'vtc-list': { title: 'VTC Directory', desc: 'Browse verified Virtual Trucking Companies.' },
  'vtc-create': { title: 'Create a VTC', desc: 'Form your own company and recruit drivers.' },
  'vtc-events': { title: 'VTC Events', desc: 'Private and public company convoys.' },
  'events-calendar': { title: 'Event Calendar', desc: 'Scheduled community events and convoys.' },
  'events-system': { title: 'Request Event Server', desc: 'Submit a server request for major public events.' },
  'forum': { title: 'Official Forums', desc: 'Join the ongoing discussion on the official board.' },
  'discord': { title: 'Discord Community', desc: 'Chat directly with drivers and staff.' },
  'staff': { title: 'Meet the Staff', desc: 'View active team members across all divisions.' },
  'rules': { title: 'Official Rules', desc: 'In-game and service-wide community guidelines.' },
  'reports': { title: 'Report a Player', desc: 'Submit evidence against rule breakers.' },
  'appeals': { title: 'Ban Appeals', desc: 'Appeal an active ban on your account.' },
  'knowledgebase': { title: 'Knowledgebase / FAQ', desc: 'Troubleshooting guide and launcher setup instructions.' },
  'tickets': { title: 'Support Tickets', desc: 'Get direct help from our technical support team.' },
  'feedback': { title: 'Feedback System', desc: 'Send feedback directly to project management.' },
  'admin': { title: 'Staff Command Dashboard', desc: 'Manage user roles, monitor live gameplay, and enforce server rules.' }
};

// Tab Handler
function switchTab(tabKey) {
  const info = sectionTitles[tabKey];
  if (info) {
    document.getElementById('tab-title').innerText = info.title;
    document.getElementById('tab-desc').innerText = info.desc;
  }

  // Manage Active Panels
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  
  const targetPanel = document.getElementById(tabKey);
  if (targetPanel) {
    targetPanel.classList.add('active');
  } else {
    // Default fallback to servers view for general text views
    document.getElementById('servers').classList.add('active');
  }
}

// Launcher Download Action
function executeLauncherDownload() {
  alert('Downloading TruckersMP-style Launcher Setup (ETS2MP_Launcher.zip)...');
  toggleDownloadModal(false);
}

// Modals
function toggleAuthModal(show) { document.getElementById('auth-modal').style.display = show ? 'flex' : 'none'; }
function toggleDownloadModal(show) { document.getElementById('download-modal').style.display = show ? 'flex' : 'none'; }

// Auth Handler
function handleAuth(event) {
  event.preventDefault();
  const username = document.getElementById('auth-username').value;
  const role = document.getElementById('auth-role').value;

  state.currentUser = { name: username, role: role };
  
  document.getElementById('display-name').innerText = username;
  const roleBadge = document.getElementById('display-role');
  roleBadge.innerText = role;
  roleBadge.className = `role-badge role-${role.toLowerCase()}`;

  document.getElementById('user-badge').style.display = 'flex';
  document.getElementById('btn-auth').style.display = 'none';

  if (['Owner', 'Admin', 'Moderator'].includes(role)) {
    document.getElementById('admin-tab').style.display = 'block';
  }

  toggleAuthModal(false);
}

// Staff & Moderation Actions
function assignUserRole() {
  const target = document.getElementById('role-target-user').value;
  const newRole = document.getElementById('role-select').value;
  if (!target) return alert('Enter a target username.');
  alert(`Role Granted: ${target} is now assigned as ${newRole}.`);
  document.getElementById('role-target-user').value = '';
}

function kickPlayer(id) {
  alert(`Command Sent: Player #${id} kicked from server.`);
  state.livePlayers = state.livePlayers.filter(p => p.id !== id);
  renderLivePlayers();
}

function banPlayer(id) {
  alert(`Command Sent: Player #${id} banned from ETS2MP.`);
  state.livePlayers = state.livePlayers.filter(p => p.id !== id);
  renderLivePlayers();
}

function spectatePlayer(id) {
  alert(`Opening live telemetry video feed for Player #${id}...`);
}

// Rendering Data
function renderServers() {
  const container = document.getElementById('server-grid-list');
  if (!container) return;
  container.innerHTML = state.servers.map(s => `
    <div class="server-card">
      <h3>${s.name}</h3>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${(s.players/s.maxPlayers)*100}%"></div>
      </div>
      <p>${s.players} / ${s.maxPlayers} Players</p>
    </div>
  `).join('');
}

function renderLivePlayers() {
  const tbody = document.getElementById('live-players-body');
  if (!tbody) return;
  tbody.innerHTML = state.livePlayers.map(p => `
    <tr>
      <td>#${p.id}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.coords}</td>
      <td>${p.speed}</td>
      <td><button class="btn-outline" onclick="spectatePlayer(${p.id})">Watch Feed</button></td>
      <td>
        <button class="btn-kick" onclick="kickPlayer(${p.id})">Kick</button>
        <button class="btn-ban" onclick="banPlayer(${p.id})">Ban</button>
      </td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderServers();
  renderLivePlayers();
});