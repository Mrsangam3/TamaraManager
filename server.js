import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Mock Database for TAAMARA CO-LIVE Manager Portal
const MOCK_DATA = {
  manager: {
    name: 'Alex',
    fullName: 'Alex Morgan',
    role: 'Super Admin • Sunrise',
    email: 'alex.morgan@taamaracolive.com',
    campus: 'Taamara Nanakramguda Campus (Block A & B)',
    isOnline: true,
  },
  profile: {
    name: 'Alex Morgan',
    role: 'Super Admin • Sunrise',
    campus: 'Taamara Nanakramguda Campus (Block A & B)',
    phone: '+91 98234 11029',
    email: 'alex.morgan@taamaracolive.com',
    node: 'Block A & B',
    shift: 'On Duty',
    status: 'Active',
    deviceId: 'HF-9022',
    appVersion: 'v2.4.1 (Stable)',
    build: '8920'
  },
  metrics: {
    occupancy: {
      percentage: 91,
      occupiedBeds: 68,
      totalBeds: 75,
      badge: '91% Filled'
    },
    tenants: {
      total: 68,
      growth: '+3 this week',
      subtitle: 'Men & Women • Capacity: 75 Beds',
      badge: '91% Filled'
    },
    available: {
      total: 7,
      single: 2,
      shared: 5,
      subtitle: 'Across 1, 2, 3, 4, 5 Sharing',
      badge: 'Ready to Move'
    },
    collection: {
      amount: 685000,
      formatted: '₹6,85,000',
      settledCount: 64,
      subtitle: 'Oct Cycle • Current Period',
      badge: '64 Settled'
    },
    overdue: {
      amount: 42500,
      formatted: '₹42,500',
      residentsCount: 4,
      subtitle: '4 Residents • Grace Over',
      badge: 'Action Req.'
    },
    pending: {
      total: 3,
      highPriority: 3,
      status: 'Action Req.'
    }
  },
  urgentActions: [
    {
      id: 'act-01',
      type: 'rent',
      title: 'Karthik Varma (Room 204 • Bed A) — Overdue ₹9,500',
      subtitle: 'Rent overdue by 5 days. Send instant WhatsApp payment reminder.',
      badge: 'Overdue',
      actionText: 'Collect',
      actionType: 'collect'
    },
    {
      id: 'act-02',
      type: 'checkin',
      title: 'Ankita Roy Check-in (Room 102 • Bed B) — 2:00 PM',
      subtitle: 'Continental Hospital staff arrival. Aadhaar verified, biometric registration pending.',
      badge: null,
      actionText: 'Enroll Gate',
      actionType: 'enroll'
    },
    {
      id: 'act-03',
      type: 'maintenance',
      title: 'Room 102 (Bunk A) — AC Leaking Water Continuously',
      subtitle: 'Reported by Elena Rostova. Dripping onto electrical socket board.',
      badge: 'Urgent',
      actionText: 'Assign Tech →',
      actionType: 'assign-tech'
    }
  ],
  liveActivity: [
    {
      id: 'act-log-1',
      title: 'Rahul Sharma checked in',
      time: '20m ago',
      details: 'Room 204-B · Biometric key issued',
      type: 'checkin'
    },
    {
      id: 'act-log-2',
      title: 'Wi-Fi Router Replaced',
      time: '1h ago',
      details: 'Ticket #1088 resolved by IT Tech Marcus',
      type: 'maintenance'
    }
  ],
  tenantsDirectory: {
    totalTenants: 176,
    occupancyRate: 94,
    assignedBeds: 166,
    totalBeds: 176,
    syncedCount: 172,
    tenants: [
      {
        id: 't-1',
        name: 'Aarav Mehta',
        initials: 'AM',
        avatarType: 'photo',
        room: 'Room 204',
        bed: 'Bed B (Shared 2-Bed)',
        block: 'Block A',
        phone: '+91 98765 43210',
        statusType: 'active-cleared',
        statusText: '• Active • Dues Cleared',
      },
      {
        id: 't-2',
        name: 'David Miller',
        initials: 'DM',
        avatarType: 'initials',
        room: 'Room 102',
        bed: 'Bed A (Single Deluxe)',
        block: 'Block A',
        phone: '+91 98450 11223',
        statusType: 'rent-due',
        statusText: '• Rent Due in 2 days',
      },
      {
        id: 't-3',
        name: 'Vikram Sen',
        initials: 'VS',
        avatarType: 'photo',
        room: 'Room 308',
        bed: 'Bed C (Triple)',
        block: 'Block B',
        phone: '+91 97110 88901',
        statusType: 'notice-period',
        statusText: '• Notice Period (Leaves Nov 15)',
      },
      {
        id: 't-4',
        name: 'Siddharth Rao',
        initials: 'SR',
        avatarType: 'initials',
        room: 'Room 110',
        bed: 'Bed A (Shared 2-Bed)',
        block: 'Block B',
        phone: '+91 99201 44556',
        statusType: 'active-verified',
        statusText: '• Active • Verified',
      }
    ]
  },
  operations: {
    campusWing: 'North Campus Wing',
    date: 'Today, Oct 24',
    occupancy: '92.4%',
    priorityAlerts: 4,
    allocation: {
      vacantBeds: 24,
      availableRooms: 12,
      blocks: 'Block A • B • C',
      progressPercent: 80,
      readyCheckInToday: 9,
    },
    complaints: {
      open: 3,
      escalated: 1,
      avgTurnaround: '38 mins',
      activeList: [
        { id: 'c-1', text: 'Plumbing (Rm 204)', icon: 'wrench' },
        { id: 'c-2', text: 'Electrician (Floor 3)', icon: 'bolt' },
        { id: 'c-3', text: 'Wi-Fi Mesh Node 2', icon: 'wifi' },
      ]
    },
    housekeeping: {
      cleanedFloors: 14,
      totalFloors: 18,
      inProgress: 4,
      turnoverDelay: 'None',
      shiftLead: 'Maria Santos',
    },
    maintenance: {
      pendingTechs: 2,
      scheduledTime: '2 PM',
      taskTitle: 'Water Pump Overhaul & HVAC Filter',
      vendor: 'Apex Facility Solutions',
      slot: '14:00',
      gatePassGenerated: true,
    },
    foodMenu: {
      messStatus: 'Open',
      mealsServed: 348,
      lunch: 'Dal Makhani, Paneer, Rice',
      dinner: 'Chapati, Mixed Veg, Soup',
      feedbackScore: '4.6 / 5.0',
    },
    staff: {
      onDuty: 6,
      onLeave: 1,
      nextSwitch: '18:00',
      activeRoles: [
        { role: 'Warden (Active)', type: 'active' },
        { role: 'Security (2)', type: 'active' },
        { role: 'Cooks (3)', type: 'active' },
        { role: '1 Leave (Night Guard)', type: 'leave' },
      ]
    },
    financials: {
      collected: 18450,
      targetMetPercent: 89,
      pending: 2200,
      overdueTenantsCount: 7,
      autoReconciled: true,
    }
  },
  requests: {
    actionableCount: 3,
    pendingCount: 3,
    approvedCount: 28,
    rejectedCount: 2,
    items: [
      {
        id: 'req-01',
        name: 'Rohan Varma',
        room: '201-A',
        type: 'night-pass',
        typeLabel: 'Night Out / Late Pass',
        status: 'pending-manager',
        statusLabel: '• Pending Manager',
        date: 'Tonight, 24 Oct',
        timeLimit: 'Return: > 11:30 PM',
        reason: 'Return after 11:30 PM • Final semester college project work with robotics team at campus lab.',
      },
      {
        id: 'req-02',
        name: 'Ananya Iyer',
        room: '305-B',
        type: 'room-change',
        typeLabel: 'Room Change',
        status: 'verification',
        statusLabel: '• Verification',
        currentSharing: 'Triple Sharing',
        preferredSharing: 'Double Bed',
        reason: 'Requesting move from Triple to Double Bed (Academics quiet room). Preparing for national entrance exam.',
      },
      {
        id: 'req-03',
        name: 'Karan Patel',
        room: '104',
        type: 'guest-pass',
        typeLabel: 'Guest Day Pass',
        status: 'urgent',
        statusLabel: 'Urgent (11h)',
        badge: 'Parents Visiting',
        timeSlot: '2:00 PM - 6:00 PM',
        reason: 'Father (Mr. Mukesh Patel) & Mother arriving by train. Requested common lounge and room guest tag.',
      }
    ]
  }
};

const server = http.createServer((req, res) => {
  req.on('error', (err) => console.error('Incoming request error:', err.message));
  res.on('error', (err) => console.error('Response error:', err.message));

  let pathname = '/';
  try {
    const host = req.headers.host || 'localhost:3000';
    const parsedUrl = new URL(req.url, `http://${host}`);
    pathname = parsedUrl.pathname;
  } catch {
    pathname = req.url || '/';
  }
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API Endpoints ---
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // GET /api/dashboard/summary
    if (pathname === '/api/dashboard/summary' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: MOCK_DATA
      }));
      return;
    }

    // GET /api/tenants
    if (pathname === '/api/tenants' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: MOCK_DATA.tenantsDirectory
      }));
      return;
    }

    // GET /api/operations
    if (pathname === '/api/operations' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: MOCK_DATA.operations
      }));
      return;
    }

    // GET /api/requests
    if (pathname === '/api/requests' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: MOCK_DATA.requests
      }));
      return;
    }

    // POST /api/requests/action
    if (pathname === '/api/requests/action' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { requestId, action, studentName } = JSON.parse(body || '{}');
          let message = `Request ${action} successfully.`;
          if (action === 'approve') {
            message = `Digital pass generated & sent to ${studentName || 'student'} via TAAMARA CO-LIVE app.`;
          } else if (action === 'reject' || action === 'decline') {
            message = `Request declined. Student notified with remarks.`;
          } else if (action === 'allocate') {
            message = `Room Allocation matrix opened for ${studentName || 'student'}.`;
          }
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/operations/send-reminders
    if (pathname === '/api/operations/send-reminders' && method === 'POST') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Bulk payment reminders dispatched to 7 overdue tenants via WhatsApp & SMS.',
      }));
      return;
    }

    // GET /api/profile
    if (pathname === '/api/profile' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: MOCK_DATA.profile
      }));
      return;
    }

    // POST /api/profile/update
    if (pathname === '/api/profile/update' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const updates = JSON.parse(body || '{}');
          MOCK_DATA.profile = { ...MOCK_DATA.profile, ...updates };
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Profile updated', profile: MOCK_DATA.profile }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/broadcast
    if (pathname === '/api/broadcast' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { title, audience } = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Notice "${title || 'Alert'}" dispatched to ${audience || 'residents'}.`
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/tenants/onboard
    if (pathname === '/api/tenants/onboard' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const tenant = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Tenant ${tenant.name || 'New Tenant'} successfully onboarded & queued for Bed Assignment!`,
            tenant
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/tenants/draft
    if (pathname === '/api/tenants/draft' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const draft = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Draft profile saved for ${draft.name || 'tenant'}.`
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/beds/assign
    if (pathname === '/api/beds/assign' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { tenantName, allocation, wing, floor } = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `${allocation || 'Bed'} locked & assigned to ${tenantName || 'tenant'} (${wing}, ${floor}). Digital key credentials issued.`,
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/tickets/create
    if (pathname === '/api/tickets/create' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const ticket = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Ticket #${ticket.ticketId || 'HF-4159'} dispatched! Apex technician assigned with SLA < 2h. Tracking SMS dispatched.`,
            ticket
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/tickets/memo
    if (pathname === '/api/tickets/memo' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const memo = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Issue draft saved as internal operations memo.`,
            memo
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/rollcall/siren
    if (pathname === '/api/rollcall/siren' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `🚨 Emergency siren push and IVR broadcast dispatched to ${data.unaccountedCount || 6} unaccounted residents! Curfew deadline: ${data.deadline || '10:30 PM'}.`,
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/rollcall/finalize
    if (pathname === '/api/rollcall/finalize' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const record = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Night Curfew Roll Call (${record.present || 162}/${record.total || 176}) signed off by Warden ${record.warden || 'Sunil Deshmukh'} and synced with Central Operations audit log.`,
            record
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/urgent/collect
    if (pathname === '/api/urgent/collect' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Payment of $${payload.amount || '840.00'} verified & marked as collected! Overdue status cleared.`,
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/inspections/submit
    if (pathname === '/api/inspections/submit' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Floor 3 Housekeeping Audit submitted & verified by Lead Maria Santos!`,
            data
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/inspections/reclean
    if (pathname === '/api/inspections/reclean' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Re-clean request dispatched for Room ${data.room || '302'} to Housekeeper ${data.housekeeper || 'Rajiv M.'}.`,
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/inspections/approve
    if (pathname === '/api/inspections/approve' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Room ${data.room || '302'} inspection approved with manager sign-off.`,
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/schedule/confirm-arrival
    if (pathname === '/api/schedule/confirm-arrival' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Technician arrival confirmed for Gate Pass #${data.gatePass || 'GP-8821'}. Biometric badge issued.`,
            status: 'arrived'
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/schedule/reschedule
    if (pathname === '/api/schedule/reschedule' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Task successfully rescheduled to ${data.newSlot || 'Tomorrow, 10:00 AM'}. Vendor notified via SMS.`,
            data
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/schedule/create-task
    if (pathname === '/api/schedule/create-task' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `New maintenance task '${data.title || 'General Maintenance'}' scheduled for ${data.timeSlot || 'Today'}.`,
            taskId: 'TASK-' + Math.floor(1000 + Math.random() * 9000),
            data
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/tickets/resolve
    if (pathname === '/api/tickets/resolve' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Ticket #${data.ticketId || 'HF-1092'} resolved and closed successfully! Tenant notified via SMS.`,
            ticketId: data.ticketId,
            resolvedAt: new Date().toISOString()
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/tickets/assign
    if (pathname === '/api/tickets/assign' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Plumber ${data.technician || 'Ramesh S.'} assigned to Ticket #${data.ticketId || 'HF-1095'}. Work order dispatched.`,
            data
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/tickets/ping
    if (pathname === '/api/tickets/ping' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            node: 'Wi-Fi Mesh Node #04',
            latencyMs: 24,
            packetLoss: '0%',
            status: 'Optimal',
            message: 'Diagnostic ping passed: 24ms latency, 0% packet loss. Mesh link stable.'
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/reminders/dispatch
    if (pathname === '/api/reminders/dispatch' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `✓ Bulk payment reminders successfully dispatched to ${data.tenantCount || 7} tenants across active channels (${(data.channels || ['WhatsApp', 'SMS']).join(', ')}).`,
            dispatchedCount: data.tenantCount || 7,
            channels: data.channels || ['WhatsApp', 'SMS'],
            timestamp: new Date().toISOString()
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/reminders/schedule-followup
    if (pathname === '/api/reminders/schedule-followup' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: '⏱ Automated 48-hour follow-up trigger scheduled for unpaid dues.',
            scheduledHours: 48
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // GET /api/roster
    if (pathname === '/api/roster' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        activeShift: {
          shiftNumber: 2,
          name: 'Evening Shift',
          time: '14:00 - 22:00',
          handoverIn: '3h 15m',
          onDuty: 6,
          onLeave: 1,
          biometricSynced: '13:58',
          turnoutTarget: '100%'
        },
        staff: [
          { name: 'Sunil Deshmukh', role: 'Chief Warden (North Wing)', post: '2A', checkin: '13:50 IST', coverage: 'Block A & Block B', category: 'wardens' },
          { name: 'Maria Santos', role: 'Housekeeping Lead', activeNow: true, mission: 'Floor 3 Deep Inspection', coverage: 'Floors 1 - 4 (Common Areas)', category: 'housekeeping' },
          { name: 'Rajesh Patel', role: 'Main Gate Head Guard', post: '01', zone: 'Campus Entry & Boom Barrier', gate: 'Lane 1 & 2 Active', category: 'security' },
          { name: 'Vikram Singh', role: 'Night Security Guard', status: 'leave', reason: 'Medical', substitute: 'Sub-Guard Hemant K.', category: 'security' },
          { name: 'Ram Prasad', role: 'Head Mess Cook', station: 'Central Mess (Dinner Prep)', schedule: '20:00 - 22:30 (320 Residents)', category: 'kitchen' }
        ]
      }));
      return;
    }

    // POST /api/roster/swap
    if (pathname === '/api/roster/swap' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Shift handover approved: ${data.incoming || 'Substitute'} taking over for ${data.outgoing || 'Staff'} for ${data.shift || 'Shift'}.`,
            timestamp: new Date().toISOString()
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/roster/assign-task
    if (pathname === '/api/roster/assign-task' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Task "${data.taskTitle || 'Operational Assignment'}" successfully dispatched to staff device.`,
            task: data
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // GET /api/menu/daily
    if (pathname === '/api/menu/daily' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        chef: { name: 'Chef Ram Prasad', rating: 4.6, reviews: 124, mealsPrepared: 340, turnout: '95.4%' },
        rsvp: { locksAt: '06:30 PM', dining: 168, optedOut: 8, scaledPortions: 175 },
        meals: {
          breakfast: { time: '07:30 - 09:30 AM', status: 'served', rating: 4.8, vegan: true },
          lunch: { time: '12:30 - 02:30 PM', status: 'active', traffic: 'Moderate', dishes: ['Dal Makhani', 'Paneer Butter Masala', 'Steamed Basmati Rice', 'Phulka Roti', 'Cucumber Salad', 'Gulab Jamun (Sweet!)'] },
          snacks: { time: '05:00 - 06:00 PM', status: 'upcoming', dishes: ['Veg Cutlet', 'Mint Chutney', 'Ginger Masala Tea'] },
          dinner: { time: '07:30 - 09:30 PM', status: 'pending_approval', special: 'Vegetarian Feast Night', dishes: ['Yellow Dal Tadka', 'Seasonal Mix Veg', 'Jeera Rice', 'Tawa Roti', 'Tomato Soup', 'Seasonal Fruit'] }
        }
      }));
      return;
    }

    // POST /api/menu/broadcast
    if (pathname === '/api/menu/broadcast' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'Daily menu successfully broadcasted to 176 tenants and synchronized to hostel WhatsApp group!',
            timestamp: new Date().toISOString()
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/menu/approve
    if (pathname === '/api/menu/approve' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `${data.meal || 'Dinner'} menu certified & published to kitchen monitors!`,
            meal: data.meal,
            status: 'approved'
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // GET /api/requests/approved
    if (pathname === '/api/requests/approved' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        month: 'October 2024',
        totalApproved: 28,
        violations: 0,
        requests: [
          { id: 'app-01', name: 'Rohan Varma', room: '201-A', type: 'night', passId: 'NO-2024-8819', curfew: '11:30 PM', status: 'Active Today', description: 'Late Robotics Lab Project' },
          { id: 'app-02', name: 'Kabir Singh', room: '202-A', type: 'visitor', passId: 'VIS-2024-1102', status: 'Completed', visitor: 'Mr. Mukesh Singh', departure: '17:52' },
          { id: 'app-03', name: 'Priya Nair', room: '102-D -> 204-A', type: 'room', status: 'Key Handover Pending', date: 'Oct 26', description: 'Internal Room Relocation' },
          { id: 'app-04', name: 'Aryan Sharma', room: '203-B', type: 'leave', status: 'Upcoming', dates: 'Oct 25 - Oct 27', destination: 'Indore (Parent Residence)' }
        ]
      }));
      return;
    }

    // POST /api/requests/revoke
    if (pathname === '/api/requests/revoke' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Gate pass for ${data.studentName || 'Student'} revoked. Turnstile permissions deactivated.`,
            revokedAt: new Date().toISOString()
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // GET /api/requests/rejected
    if (pathname === '/api/requests/rejected' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        totalRejected: 4,
        enforcement: 'Institutional Disciplinary Enforcement',
        entries: [
          { name: 'Dev Malik', room: '203-B', type: 'Late Night Pass', reason: 'Unexcused Absence History (3 Violations)', time: 'Oct 23, 21:00' },
          { name: 'Aditya Verma', room: '304-B', type: 'Room Change to Single Suite', reason: 'Zero Vacancy (Waitlist #3)', time: 'Oct 22, 14:15' },
          { name: 'Rahul Sharma', room: '204-B', type: 'Overnight Guest Pass', reason: 'Policy Violation Clause 4.2', time: 'Oct 21, 18:40' },
          { name: 'Sameer Khan', room: '301-C', type: 'Weekend Night Out', reason: 'Dues Pending ($620.00 Overdue)', time: 'Oct 20, 11:05' }
        ]
      }));
      return;
    }

    // POST /api/requests/reopen
    if (pathname === '/api/requests/reopen' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Request for ${data.studentName || 'Student'} re-opened for Warden Review. Justification logged: ${data.reason || 'None'}.`,
            status: 'under_review'
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // GET /api/requests/room-change
    if (pathname === '/api/requests/room-change' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        requestId: 'RC-429',
        priority: 'high',
        submitted: '3 hrs ago',
        tenant: {
          name: 'Ananya Iyer',
          tier: 'Tier 1 Tenant',
          course: 'Electrical Eng.',
          tenure: 'Staying 14 months',
          currentSpace: {
            room: 'Room 305-B',
            location: 'Block B, Floor 3 • Triple Sharing (2 Roommates)',
            rate: 280,
            complaint: 'High noise levels during late night study hours from hallway & roommates.'
          },
          target: {
            wing: 'Quiet Academic Wing',
            details: 'Double Bed • Preferred Floor 2 or 3 • Strict quiet hours',
            budget: 360
          }
        },
        vacancies: [
          {
            id: '203-B',
            title: 'Room 203 - Bed B',
            rate: 350,
            wing: 'Block A, Floor 2 • Twin Premium',
            amenities: 'Split AC • North Balcony Garden view',
            match: '98% Recommended Match',
            roommate: 'Kevin T. (Quiet Study, Final Year CS)',
            differential: 70,
            proratedDue: 42
          },
          {
            id: '202-B',
            title: 'Room 202 - Bed B',
            rate: 320,
            wing: 'Block A, Floor 2 • Non-AC',
            amenities: 'Ceiling Fan • Courtyard Facing',
            match: 'Standard Option',
            roommate: 'Vikram P. (PG Medicine Resident)',
            differential: 40,
            proratedDue: 24
          }
        ],
        settlement: {
          cycle: 'Cycle Day 12 / 30',
          remainingDays: 18,
          totalDays: 30,
          depositCarryover: 400
        }
      }));
      return;
    }

    // POST /api/requests/room-change/confirm
    if (pathname === '/api/requests/room-change/confirm' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Room relocation confirmed for ${data.tenant || 'Ananya Iyer'} into ${data.newRoom || 'Room 203 - Bed B'}. Key issued & WhatsApp Annexure dispatched!`,
            keyId: 'KEY-' + (data.newRoom || '203B') + '-' + Math.floor(1000 + Math.random() * 9000),
            data
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/requests/room-change/decline
    if (pathname === '/api/requests/room-change/decline' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Room Change request RC-429 declined (${data.reason || 'Reason recorded'}). Logged in disciplinary archive.`,
            status: 'declined'
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // GET /api/requests/batch
    if (pathname === '/api/requests/batch' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        summary: { queue: 5, verified: 4, alert: 1 },
        items: [
          { id: 'req-batch-01', name: 'Rohan Varma', room: 'R-204', type: 'Night Out', details: '24 Oct • 23:30 Return Expected', verified: true, verificationText: 'Parent Confirmed • 0 Red Flags' },
          { id: 'req-batch-02', name: 'Karan Patel', room: 'R-108', type: 'Day Pass', details: 'Parents Visiting • 14:00 - 18:00 Today', verified: true, verificationText: 'ID Proof Uploaded • Lounge Reserved' },
          { id: 'req-batch-03', name: 'Sneha Reddy', room: 'R-114', type: 'Library Pass', details: 'Extended Library Access • Till 00:00', verified: true, verificationText: 'HOD Sign-off Validated' },
          { id: 'req-batch-04', name: 'Amit Kumar', room: 'R-210', type: 'Home Leave', details: 'Weekend Trip • 25-27 Oct', verified: true, verificationText: 'Train ticket attached • Parent SMS verified' },
          { id: 'req-batch-05', name: 'Ananya Iyer', room: '305-B', type: 'Room Transfer', details: 'Transfer to 203-B Requested', verified: false, alertText: 'Manual Room Assignment Required' }
        ]
      }));
      return;
    }

    // POST /api/requests/batch-approve
    if (pathname === '/api/requests/batch-approve' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { requests } = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `${(requests || []).length} requests approved in fast-lane mode. Turnstiles synchronized.`,
            approvedCount: (requests || []).length,
            batchAuditId: 'BATCH-2024-OCT-' + Math.floor(10 + Math.random() * 90),
            timestamp: new Date().toISOString()
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/requests/batch-reject
    if (pathname === '/api/requests/batch-reject' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { names } = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `${(names || []).length} requests rejected & logged in Infraction archive.`,
            rejectedCount: (names || []).length
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // GET /api/requests/filters
    if (pathname === '/api/requests/filters' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        totalRequests: 38,
        activeFiltersCount: 3,
        matchedCount: 3,
        options: {
          status: [
            { label: 'Pending', count: 5, selected: true },
            { label: 'Approved', count: 28, selected: false },
            { label: 'Rejected', count: 4, selected: false }
          ],
          types: ['All Types', 'Night Pass', 'Room Change', 'Guest Entry', 'Maintenance', 'Vacation / Leave'],
          wings: ['All', 'Blk A', 'Blk B', 'Blk C'],
          timeRanges: ['Today', 'This Week', 'Upcoming Wknd', 'Custom Picker']
        }
      }));
      return;
    }

    // POST /api/requests/filter-query
    if (pathname === '/api/requests/filter-query' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const filters = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            matchedCount: 3,
            filters,
            results: [
              { name: 'Rohan Varma', room: '201-A', type: 'Night Pass', time: '10:30 PM', status: 'Pending', verification: 'Parent approval verified' },
              { name: 'Ananya Iyer', room: '305-B', type: 'Room Change', targetRoom: '410-A', status: 'Verifying', verification: 'Warden inspection passed' },
              { name: 'Karan Patel', room: '104', type: 'Guest Pass', urgency: '1h SLA Urgency', status: 'Pending', verification: 'Auto-escalates in 42 mins' }
            ]
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/auth/login
    if (pathname === '/api/auth/login' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { branchCode, managerId, password, rememberDevice } = JSON.parse(body || '{}');

          if (!branchCode || !managerId || !password) {
            res.writeHead(400);
            res.end(JSON.stringify({
              success: false,
              message: 'Branch code, Manager ID, and security key are required.',
            }));
            return;
          }

          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'Authentication successful. Redirecting to Manager Dashboard...',
            token: 'jwt_mgr_token_' + Date.now(),
            user: {
              ...MOCK_DATA.manager,
              branchCode,
              rememberDevice: !!rememberDevice,
            },
            redirectUrl: '/dashboard.html'
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid JSON request payload.' }));
        }
      });
      return;
    }

    // POST /api/auth/biometric
    if (pathname === '/api/auth/biometric' && method === 'POST') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Biometric signature verified via Hardware Token HST-BLR-04.',
        token: 'jwt_biometric_token_' + Date.now(),
        user: MOCK_DATA.manager,
        redirectUrl: '/dashboard.html'
      }));
      return;
    }

    // GET /api/rules/handbook
    if (pathname === '/api/rules/handbook' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        academicYear: 'AY 2024-25',
        version: 'v4.2 Official',
        essentials: {
          curfewLockdown: '22:00 PM',
          quietHours: '23:00 - 06:00',
          visitorCorridor: '10:00 - 18:00'
        },
        clauses: [
          { id: '1.2', category: 'curfew', title: 'Curfew, Biometric Turnstiles & Night Passes', subtitle: 'Biometric Turnstile Protocols', fine: '$25 fine for 2nd offense' },
          { id: '2.1', category: 'visitors', title: 'Guest Entry & Overnight Stays', subtitle: 'Zero-Tolerance Dorm Access', fine: '$50 fine & disciplinary hold' },
          { id: '3.4', category: 'all', title: 'Mess Hall Etiquette & Meal Timings', subtitle: 'Dining Hall Operational Hours', policy: 'Dinner RSVP locks at 18:30' },
          { id: '4.0', category: 'all', title: 'Electrical Appliances & Fire Safety', subtitle: 'High-Wattage Appliance Restriction', policy: 'No >1000W appliances' },
          { id: '5.3', category: 'all', title: 'Fee Schedule & Delinquency Policy', subtitle: 'Billing Cycles & Turnstile Suspension', policy: 'Dues >$500 trigger turnstile hold' }
        ]
      }));
      return;
    }

    // POST /api/rules/update
    if (pathname === '/api/rules/update' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { clause, text } = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Clause ${clause || '1.2'} updated and committed to property manager audit ledger.`,
            clause,
            text,
            timestamp: new Date().toISOString()
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // GET /api/preferences
    if (pathname === '/api/preferences' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        theme: 'light',
        compactMode: false,
        fontScale: 'standard',
        alerts: {
          curfew: true,
          requests: true,
          emergency: true,
          rent: true,
          volume: 100
        },
        operations: {
          defaultWing: 'all',
          sensorRefresh: true,
          haptic: true,
          offlineCache: true
        },
        storage: {
          cachedBytes: 148897792,
          cachedFormatted: '142 MB',
          version: 'v2.4.1 (Build 8920)'
        }
      }));
      return;
    }

    // POST /api/preferences/update
    if (pathname === '/api/preferences/update' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const prefs = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'App preferences saved and synchronized to cloud profile.',
            data: prefs,
            updatedAt: new Date().toISOString()
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/preferences/clear-cache
    if (pathname === '/api/preferences/clear-cache' && method === 'POST') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: '142 MB cached photo inspections and lease proofs cleared from device sandbox.',
        cachedFormatted: '0 KB'
      }));
      return;
    }

    // POST /api/broadcast/dispatch
    if (pathname === '/api/broadcast/dispatch' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: `Broadcast successfully dispatched to ${data.recipientCount || 176} recipients!`,
            data
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/support/ticket
    if (pathname === '/api/support/ticket' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const ticket = JSON.parse(body || '{}');
          const ticketId = 'INC-' + Math.floor(1000 + Math.random() * 9000);
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            ticketId,
            message: `Tech incident ticket #${ticketId} dispatched to Level-2 Engineering desk. SLA: 4 hours.`,
            ticket
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // GET /api/support/status
    if (pathname === '/api/support/status' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        systems: {
          biometrics: 'operational',
          smsGateway: 'operational',
          paymentReconciliation: 'operational',
          uptime: '99.9%'
        },
        staffOnline: 4,
        hotline: '+1 (800) 467-8353',
        pin: '#8824-OP'
      }));
      return;
    }

    // POST /api/security/pin
    if (pathname === '/api/security/pin' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { newPin } = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'Manager master PIN updated and synced with hardware tokens.'
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/security/revoke-session
    if (pathname === '/api/security/revoke-session' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: 'Requested sessions revoked from manager security registry.'
        }));
      });
      return;
    }

    // POST /api/security/toggle-biometrics
    if (pathname === '/api/security/toggle-biometrics' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { enabled } = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            biometricsEnabled: !!enabled,
            message: `Biometric authentication ${enabled ? 'enabled' : 'disabled'}.`
          }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
      return;
    }

    // POST /api/security/roles/update
    if (pathname === '/api/security/roles/update' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: 'Role permissions matrix updated successfully.'
        }));
      });
      return;
    }

    // POST /api/auth/logout
    if (pathname === '/api/auth/logout' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'Manager session terminated successfully. Terminal cleared.',
            payload,
            timestamp: new Date().toISOString()
          }));
        } catch {
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: 'Logged out successfully.' }));
        }
      });
      return;
    }

    // POST /api/occupancy/auto-match
    if (pathname === '/api/occupancy/auto-match' && method === 'POST') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: '10 waitlist candidates matched with vacant beds across Block A and Block B.',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ success: false, message: 'API route not found' }));
    return;
  }

  // --- Static File Serving ---
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const route = safePath.replace(/\\/g, '/').toLowerCase();

  // Clean route aliases
  if (route === '/preview' || route === '/preview.html' || route === 'preview') {
    const previewFilePath = path.join(__dirname, 'preview.html');
    fs.readFile(previewFilePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Preview Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    });
    return;
  }

  if (route === '/' || route === '' || route === '/login') {
    safePath = '/index.html';
  } else if (route === '/dashboard') {
    safePath = '/dashboard.html';
  } else if (route === '/tenants') {
    safePath = '/tenants.html';
  } else if (route === '/operations') {
    safePath = '/operations.html';
  } else if (route === '/requests') {
    safePath = '/requests.html';
  } else if (route === '/more') {
    safePath = '/more.html';
  } else if (route === '/onboard' || route === '/onboard-tenant') {
    safePath = '/onboard-tenant.html';
  } else if (route === '/assign-bed' || route === '/assign') {
    safePath = '/assign-bed.html';
  } else if (route === '/log-issue' || route === '/log-maintenance') {
    safePath = '/log-issue.html';
  } else if (route === '/roll-call' || route === '/rollcall') {
    safePath = '/roll-call.html';
  } else if (route === '/urgent-action' || route === '/urgent') {
    safePath = '/urgent-action.html';
  } else if (route === '/block-a' || route === '/block-a-overview') {
    safePath = '/block-a.html';
  } else if (route === '/block-b' || route === '/block-b.html' || route === '/block-b-overview' || route === '/blockb') {
    safePath = '/block-b.html';
  } else if (route === '/inspect-rooms' || route === '/inspect') {
    safePath = '/inspect-rooms.html';
  } else if (route === '/manage-schedule' || route === '/schedule' || route === '/maintenance-schedule') {
    safePath = '/manage-schedule.html';
  } else if (route === '/resolve-tickets' || route === '/tickets' || route === '/grievances') {
    safePath = '/resolve-tickets.html';
  } else if (route === '/bulk-reminders' || route === '/reminders' || route === '/send-bulk-reminders') {
    safePath = '/bulk-reminders.html';
  } else if (route === '/shift-roster' || route === '/shift-roaster' || route === '/roster' || route === '/shifts') {
    safePath = '/shift-roster.html';
  } else if (route === '/update-menu' || route === '/menu' || route === '/daily-menu' || route === '/dining') {
    safePath = '/update-menu.html';
  } else if (route === '/approved-requests' || route === '/approved' || route === '/approved-log' || route === '/archive') {
    safePath = '/approved-requests.html';
  } else if (route === '/rejected-requests' || route === '/rejected' || route === '/rejected-log' || route === '/infractions') {
    safePath = '/rejected-requests.html';
  } else if (route === '/room-change' || route === '/room-change.html' || route === '/room-change-request' || route === '/requests/room-change') {
    safePath = '/room-change.html';
  } else if (route === '/batch-processing' || route === '/batch-processing.html' || route === '/batch-requests' || route === '/batch-requests.html' || route === '/batch' || route === '/fastlane') {
    safePath = '/batch-processing.html';
  } else if (route === '/filter-requests' || route === '/filter-requests.html' || route === '/requests-filter' || route === '/requests/filter' || route === '/search-filter') {
    safePath = '/filter-requests.html';
  } else if (route === '/hostel-rules' || route === '/hostel-rules.html' || route === '/rules' || route === '/handbook' || route === '/policies') {
    safePath = '/hostel-rules.html';
  } else if (route === '/app-preferences' || route === '/app-preferences.html' || route === '/preferences' || route === '/settings') {
    safePath = '/app-preferences.html';
  } else if (route === '/broadcast' || route === '/broadcast.html' || route === '/broadcast-notice' || route === '/announcements') {
    safePath = '/broadcast.html';
  } else if (route === '/help-support' || route === '/help-support.html' || route === '/help' || route === '/support' || route === '/help-center') {
    safePath = '/help-support.html';
  } else if (route === '/security-permissions' || route === '/security-permissions.html' || route === '/security' || route === '/permissions') {
    safePath = '/security-permissions.html';
  } else if (route === '/logout-confirmation' || route === '/logout-confirmation.html' || route === '/logout' || route === '/logout.html' || route === '/confirm-logout') {
    safePath = '/logout-confirmation.html';
  } else if (route === '/occupancy' || route === '/occupancy.html' || route === '/campus-map' || route === '/occupancy-94' || route === '/rooms-map') {
    safePath = '/occupancy.html';
  } else if (route === '/quick-actions' || route === '/quick-actions.html' || route === '/quick-add' || route === '/quick-action-center' || route === '/fast-dispatch') {
    safePath = '/quick-actions.html';
  } else if (route === '/notifications' || route === '/notifications.html' || route === '/alerts') {
    safePath = '/notifications.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

server.listen(PORT, () => {
  console.log(`TAAMARA CO-LIVE Manager Server running at: http://localhost:${PORT}`);
  console.log(`Serving static files from: ${PUBLIC_DIR}`);
});
