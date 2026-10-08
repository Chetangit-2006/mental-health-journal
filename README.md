# Mental Health Journal and Chatbot


A full-stack mental wellness application that allows users to privately record journal entries, track moods, and interact with an AI-powered wellness assistant.



\## Features



\- User registration and login

\- JWT authentication

\- Private journal entries

\- Create, edit and delete journals

\- Mood tracking

\- Mood analytics

\- AI wellness chatbot

\- Chat history

\- MongoDB data persistence

\- Responsive UI



\## Tech Stack



\### Frontend

\- Next.js

\- React

\- TypeScript

\- Tailwind CSS



\### Backend

\- Node.js

\- Express.js

\- JWT

\- bcrypt



\### Database

\- MongoDB Atlas

\- Mongoose



\### AI

\- Google Gemini API



\## Project Structure



```text

mental-health-journal/

├── backend/

│   ├── config/

│   ├── middleware/

│   ├── models/

│   ├── routes/

│   └── server.js

│

├── frontend/

│   └── app/

│       ├── dashboard/

│       └── page.tsx

│

├── .gitignore

└── README.md

## API Overview

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

### Journal

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/journal` | Create journal |
| GET | `/api/journal` | Get user journals |
| PUT | `/api/journal/:id` | Update journal |
| DELETE | `/api/journal/:id` | Delete journal |

### AI Chat

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/chat` | Send message to AI |
| GET | `/api/ai/history` | Get chat history |

All protected endpoints require a JWT token.

## Security

- Passwords are hashed using bcrypt.
- JWT authentication protects private routes.
- MongoDB credentials are stored in environment variables.
- Gemini API keys are never exposed to the frontend.
- `.env` files are excluded from Git.
- Users can only access their own journal entries and chat history.