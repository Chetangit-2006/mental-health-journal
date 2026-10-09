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

```text
Next.js / React Frontend
          |
          | REST API
          v
Node.js + Express Backend
       /        \
      v          v
 MongoDB       Gemini API
 Atlas

 ## Screenshots

### Login / Registration

![Login](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Mood Analytics

![Mood Analytics](screenshots/dashboard-mood.png)

### Journal

![Journal](screenshots/journal.png)

### AI Chatbot

![AI Chatbot](screenshots/chatbox.png)