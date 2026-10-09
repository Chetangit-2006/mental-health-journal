# Mental Health Journal and Chatbot

A full-stack AI-powered mental wellness application that helps users privately record journal entries, track moods, and interact with an AI wellness assistant.

## Features

- User registration and login
- JWT authentication
- Secure password hashing with bcrypt
- Private journal entries
- Create, edit, and delete journals
- Mood tracking
- Mood analytics
- AI-powered wellness chatbot
- Chat history
- MongoDB data persistence
- Responsive user interface

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT
- bcrypt

### Database
- MongoDB Atlas
- Mongoose

### AI
- Google Gemini API

## Architecture

The application uses a frontend-backend architecture. The frontend communicates with the Express backend through REST APIs. The backend interacts with MongoDB Atlas for data persistence and the Google Gemini API for AI chatbot responses.

```text
Next.js / React Frontend
          |
          | REST API
          v
Node.js + Express Backend
       /          \
      v            v
MongoDB Atlas   Gemini API
```


## Installation and Setup

### Prerequisites

* Node.js and npm
* MongoDB Atlas account or a local MongoDB instance
* Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/Chetangit-2006/mental-health-journal.git
cd mental-health-journal
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and configure the environment variables required by your backend, such as the MongoDB connection string, JWT secret, and Gemini API key.

Start the backend using the start script defined in `backend/package.json`.

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd mental-health-journal/frontend
npm install
```

Start the frontend using the start script defined in `frontend/package.json`.

### 4. Open the Application

Open the local URL printed in your frontend terminal, usually `http://localhost:3000`.

**Note:** Configure environment variables according to your project code. Never commit API keys, database credentials, or other secrets to GitHub.







