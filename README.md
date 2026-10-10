# Syncora - Watch YouTube Together

Syncora is a real-time web application that allows users to create rooms, invite friends, and watch YouTube videos perfectly synchronized together. Built with a modern tech stack featuring React, Node.js, Socket.IO, MongoDB, and Supabase for authentication.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- A MongoDB database (e.g., MongoDB Atlas)
- A Supabase project for Authentication

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd Syncora-project
```

### 2. Backend Setup (Server)

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory and configure the following variables. *Replace the sample values with your actual credentials.*

```env
# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database (MongoDB)
MONGO_URI=

# Supabase Authentication
# You can find these in your Supabase Dashboard -> Project Settings -> API
SUPABASE_URL=https://abcdefghijklmnopqrst.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIIkpXbhgcrrerxVCJ9... (your anon public key)
# Find JWT Secret in Supabase Dashboard -> Project Settings -> API -> JWT Settings
SUPABASE_JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long
```

4. Start the server:
```bash
# For development (auto-restarts on changes)
npm run dev

# For production
npm start
```

### 3. Frontend Setup (Client)

1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the `client` directory. Configure the following variables using the same Supabase details as the server:

```env
# Supabase Authentication
VITE_SUPABASE_URL=https://abcdefghijklmnopqrst.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOidfhdrthiIsInR5cCI6IkpXVCJ9... (your anon public key)

# Backend API URL (Use localhost for development, or your deployed URL for production)
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

### 4. Running the App

Once both the server and client are running:
1. Open your browser and navigate to `http://localhost:5173`
2. Create an account or sign in
3. Create a new room or join an existing one using a room code
4. Paste a YouTube URL and enjoy watching in sync!

## Deployment

- **Frontend:** The `client` directory can be easily deployed to [Vercel](https://vercel.com/) or Netlify. Make sure to add the `.env.local` variables to the platform's Environment Variables settings.
- **Backend:** The `server` directory requires a Node.js hosting platform that supports WebSockets (e.g., [Render](https://render.com/), Railway, or Heroku). Remember to set the Environment Variables in your hosting dashboard and ensure `FRONTEND_URL` is set to your deployed frontend URL.
