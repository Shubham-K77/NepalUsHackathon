# MannKoKura (Nepal-US Hackathon)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Frontend](https://img.shields.io/badge/Frontend-React%20Router%20v7-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Prisma-orange)

**MannKoKura** is a web application tailored explicitly for senior citizens (users aged 55+), designed to be highly accessible, simple, and engaging. It features a sleek, intuitive UI localized to Nepali and integrates voice-based interaction to ensure ease of use for the target demographic. This project was built for the Nepal-US Hackathon by Team 29, Yukti.

## Features

- **Voice Interaction:** Seamlessly integrated with **Vapi AI** to allow elderly users to interact via voice.
- **Seniors-First UI/UX:** A clean, accessible, and highly responsive Notion-inspired design with a black-and-white aesthetic, large text, and clear layouts.
- **Localized Content:** Fully localized in **Nepali** to bridge the language gap for local users.
- **Protected Routing:** Secure authentication flow (Signup/Login) with JWT and cookies leading to a personalized dashboard.
- **Smart Suggestions:** Uses **Groq AI** to provide helpful suggestions, with a history of past interactions visible on the user dashboard.
- **Robust Backend & API:** RESTful architecture built with Node.js and Express, documented using Swagger UI.

## 🛠 Tech Stack

### Frontend
- **Framework:** React Router v7 (React 19) via Vite
- **Styling:** Tailwind CSS v4
- **Voice Integrations:** Vapi Web SDK

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **AI Integration:** Groq SDK
- **API Documentation:** Swagger UI & swagger-jsdoc

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shubham-K77/NepalUsHackathon.git
   cd NepalUsHackathon
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   > **Note on Environment Variables:**
   > For security reasons, we could not share the internal `.env` files with sensitive info (like database URLs or API keys). 
   > Instead, please refer to the `backend.env.example` file in the root directory. Copy its contents into a new `.env` file within the `backend` folder and fill in the missing keys.

   - Create a `.env` file in the `backend` directory.
   - Add necessary environment variables (e.g., `DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`, etc.).
   - Run database migrations:
     ```bash
     npx prisma db push
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   > **Note on Environment Variables:**
   > Similar to the backend, sensitive information is excluded. Please refer to the `frontend.env.example` in the root directory. Copy its structure into a `.env` file in the `frontend` folder.

   - Create a `.env` file in the `frontend` directory (if needed for Vapi or API keys).
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Open in Browser**
   - The frontend will typically run on `http://localhost:5173` (or as specified by Vite).
   - The backend API typically runs on the port specified in your `.env` (e.g., `http://localhost:5000`).
   - Access API documentation at `http://localhost:<PORT>/api-docs` (if configured).

## Meet the Team (Team 29, Yukti)
- Built with ❤️ during the **Nepal-US Hackathon**.

## License
This project is open-source and available under the [MIT License](LICENSE).
