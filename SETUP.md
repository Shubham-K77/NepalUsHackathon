# MannKoKura — Setup Instructions

A step-by-step guide to get the **MannKoKura** application running locally on your machine.

---

## Prerequisites

Before you begin, make sure the following are installed on your system:

| Requirement | Version | Download |
|---|---|---|
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | Bundled with Node.js | — |
| **PostgreSQL** | Any recent version | [postgresql.org](https://www.postgresql.org/) |
| **Git** | Any recent version | [git-scm.com](https://git-scm.com/) |

> [!TIP]
> To verify your installations, run:
> ```bash
> node --version   # Should be v18+
> npm --version
> psql --version
> git --version
> ```

---

## Installation

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Shubham-K77/NepalUsHackathon.git
cd NepalUsHackathon
```

---

### Step 2 — Backend Setup

Navigate into the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

#### 2a. Configure Environment Variables

Copy the provided example file and fill in your credentials:

```bash
cp ../backend.env.example .env
```

Then open `.env` and fill in all the required values:

```env
PORT="3001"
GROQ_API_KEY="your_groq_api_key_here"
DIRECT_URL="your_postgresql_database_url_here"
JWT_SECRET="your_jwt_secret_here"
VAPI_API_KEY="your_vapi_api_key_here"
VAPI_ASSISTANT_ID="your_vapi_assistant_id_here"
VAPI_WEBHOOK_SECRET="your_vapi_webhook_secret_here"
WEBHOOK_URL="your_webhook_url_here"
```

| Variable | Description | Where to get it |
|---|---|---|
| `PORT` | Port the backend server listens on | Default: `3001` |
| `GROQ_API_KEY` | API key for Groq AI (smart suggestions) | [console.groq.com](https://console.groq.com) |
| `DIRECT_URL` | PostgreSQL connection string | Your local/hosted PostgreSQL instance |
| `JWT_SECRET` | Secret key for signing JWTs | Any long random string (e.g., use `openssl rand -hex 32`) |
| `VAPI_API_KEY` | Vapi AI server-side API key | [vapi.ai](https://vapi.ai) |
| `VAPI_ASSISTANT_ID` | ID of your Vapi assistant | Vapi dashboard |
| `VAPI_WEBHOOK_SECRET` | Secret for validating Vapi webhooks | Vapi dashboard |
| `WEBHOOK_URL` | Public URL for receiving Vapi webhook events | Your server's public URL (use [ngrok](https://ngrok.com) for local dev) |

> [!NOTE]
> **PostgreSQL `DIRECT_URL` format:**
> ```
> postgresql://USER:PASSWORD@HOST:PORT/DATABASE
> ```
> Example for a local setup:
> ```
> postgresql://postgres:mypassword@localhost:5432/mannkokura
> ```

#### 2b. Run Database Migrations

Apply the Prisma schema to your PostgreSQL database:

```bash
npx prisma db push
```

> [!IMPORTANT]
> Make sure your PostgreSQL server is running and the `DIRECT_URL` in your `.env` is correct before running this command.

#### 2c. Start the Backend Server

```bash
npm run dev
```

The backend API will be available at: **`http://localhost:3001`**  
Swagger API docs: **`http://localhost:3001/api-docs`**

---

### Step 3 — Frontend Setup

Open a **new terminal window**, then navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

#### 3a. Configure Environment Variables

Copy the provided example file:

```bash
cp ../frontend.env.example .env
```

Then open `.env` and fill in your Vapi public key:

```env
VITE_VAPI_PUBLIC_KEY="your_vapi_public_key_here"
```

| Variable | Description | Where to get it |
|---|---|---|
| `VITE_VAPI_PUBLIC_KEY` | Vapi Web SDK public key (used in the browser) | [vapi.ai](https://vapi.ai) dashboard → Public Key |

> [!NOTE]
> The `VITE_` prefix is required by Vite to expose environment variables to the browser.

#### 3b. Start the Frontend Dev Server

```bash
npm run dev
```

The frontend app will be available at: **`http://localhost:5173`**

---

## Accessing the Application

| Service | URL |
|---|---|
| **Frontend App** | `http://localhost:5173` |
| **Backend API** | `http://localhost:3001` |
| **Swagger API Docs** | `http://localhost:3001/api-docs` |

---

## Getting API Keys

### Groq AI (`GROQ_API_KEY`)
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Go to **API Keys** → **Create API Key**

### Vapi AI (`VAPI_API_KEY`, `VAPI_PUBLIC_KEY`, `VAPI_ASSISTANT_ID`)
1. Visit [vapi.ai](https://vapi.ai) and create an account
2. From your dashboard, find your **Public Key** and **Private/Server Key**
3. Create an **Assistant** to get `VAPI_ASSISTANT_ID`
4. Set up a **Webhook** endpoint and note the `VAPI_WEBHOOK_SECRET`

### JWT Secret (`JWT_SECRET`)
Generate a secure random secret locally:
```bash
openssl rand -hex 32
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `npx prisma db push` fails | Verify your `DIRECT_URL` and ensure PostgreSQL is running |
| Frontend shows API errors | Check the backend is running on port `3001` |
| Voice interaction not working | Verify `VITE_VAPI_PUBLIC_KEY` is correctly set in `frontend/.env` |
| Port already in use | Change `PORT` in `backend/.env` or kill the existing process |
| `npm install` fails | Ensure Node.js v18+ is installed (`node --version`) |

---

## Project Structure

```
NepalUsHackathon/
├── backend/                # Node.js + Express API server
│   ├── .env                # Your backend environment variables (create this)
│   └── ...
├── frontend/               # React Router v7 + Vite frontend
│   ├── .env                # Your frontend environment variables (create this)
│   └── ...
├── backend.env.example     # Backend env template
├── frontend.env.example    # Frontend env template
└── README.md
```

---

## License

This project is open-source under the [MIT License](LICENSE).

Built with ❤️ during the **Nepal-US Hackathon** by **Team 29, Yukti**.
