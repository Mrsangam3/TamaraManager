# TAAMARA CO-LIVE Management Portal

An enterprise-grade property and hostel management web application portal designed for **TAAMARA CO-LIVE** (Nanakramguda, Hyderabad). Built with Node.js, Express, Tailwind CSS, and vanilla modern JavaScript.

## Features

- **Dashboard & Live Telemetry**: Real-time occupancy statistics, revenue metrics, biometric gate status, and priority actions.
- **Residents Directory & KYC**: Detailed tenant records, KYC verification, overdue rent reminders, and phone checks.
- **Operations & Maintenance Hub**: Work order management, routine inspections, and emergency technical dispatch.
- **Requests & Complaint Triage**: Fast processing for tenant grievances, room change requests, and night passes.
- **Campus Governance & More Hub**: Admin profiles, shift rosters, hostel rules, security permissions, and broadcast announcements.
- **Notice & Notification Center**: Real-time broadcast composer and notification logs with priority badges.
- **Responsive Web Portal Architecture**: Enterprise dual-column layout, luxury color theme (`#180d19`, `#c59b27`, `#faf6f0`), and full mobile/desktop adaptability.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Mrsangam3/TamaraManager.git

# Navigate to the project directory
cd TamaraManager

# Install dependencies
npm install
```

### Running the Application

```bash
# Start the production server
npm start

# Or run with auto-reload (Node.js 18+)
npm run dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
tamara-manager/
├── public/                 # Static web application files
│   ├── css/                # Custom stylesheets and Tailwind builds
│   ├── js/                 # Modular client-side scripts
│   ├── index.html          # Manager Login Portal
│   ├── dashboard.html      # Operations Dashboard
│   ├── tenants.html        # Resident Directory
│   ├── occupancy.html      # Campus Capacity & Bed Matrix
│   ├── operations.html     # Maintenance Hub
│   ├── requests.html       # Grievance & Request Triage
│   ├── more.html           # Governance & More Hub
│   ├── broadcast.html      # Broadcast Notice Composer
│   ├── notifications.html  # Alert & Notification Center
│   ├── preview.html        # Multi-Screen Interactive Showcase
│   └── ...
├── server.js               # Node.js Express server & REST API
├── package.json            # Project dependencies and metadata
└── README.md
```

## License

Private repository - Proprietary property management system for TAAMARA CO-LIVE.

