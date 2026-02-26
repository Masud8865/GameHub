# 🎮 GameHub – Multi-Game Platform

GameHub is a simple, open-source MERN stack project that hosts multiple browser-based games in one place.

The project is intentionally kept minimal and modular, making it ideal for students and beginners who want to understand full-stack development and easily add new games.

---

## 🕹️ Included Games

- Tic-Tac-Toe – Single player vs basic AI
- Rock-Paper-Scissors – Single player vs random AI

---

## ✨ Features

- User registration & login (JWT authentication)
- Score saving (win = 1, loss/draw = 0)
- Simple plain CSS styling
- Easy structure for adding new games
- Separate backend and frontend folders
- Ready for local development & free-tier deployment

---

## 🛠️ Tech Stack

Part | Technology  
---- | ----------
Frontend | React 18, React Router  
Backend | Node.js, Express  
Database | MongoDB + Mongoose  
Auth | JWT + bcrypt  
Styling | Plain CSS  

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

    git clone https://github.com/YOUR-USERNAME/gamehub.git
    cd gamehub

---

### 2️⃣ Install Dependencies

Backend:

    cd backend
    npm install

Frontend:

    cd ../frontend
    npm install

---

### 3️⃣ Create Environment Variables

backend/.env

    cd backend
    cp .env.example .env
    
Edit the `.env` file with your connection strings and secrets:

    MONGO_URI=mongodb://username:password@localhost:27017/dbname
    # MongoDB Atlas example:
    # MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority

    JWT_SECRET=your_jwt_secret_key_here
    PORT=5000
    CLIENT_URL=http://localhost:3000

    ACCESS_TOKEN_SECRET=your_access_token_secret_key_here
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here
    REFRESH_TOKEN_EXPIRY=10d

    # For Email Services (Password reset OTP email, etc)
    # Mail configurations
    SMTP_HOST=smtp.example.com
    SMTP_PORT=587
    SMTP_USER=user@example.com
    SMTP_PASS="password"
    SUPPORT_EMAIL=support@gamehub.com

    # Google OAuth
    GOOGLE_CLIENT_ID=your_google_client_id_here
    GOOGLE_CLIENT_SECRET=your_google_client_secret_here
    GOOGLE_REDIRECT_URI=http://localhost:5000/api/oauth/google/callback


or, Copy `.env.example` in `.env`

frontend/.env (optional)

    REACT_APP_API_URL=http://localhost:5000

---

### 4️⃣ Start MongoDB

Local MongoDB:

    mongod

MongoDB Atlas (recommended):

- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Copy the connection string
- Paste it into MONGO_URI in backend/.env

---

### 5️⃣ Run the Application

Terminal 1 – Backend:

    cd backend
    npm start

Expected output:

    MongoDB connected
    Server running on port 5000

Terminal 2 – Frontend:

    cd frontend
    npm start

Open in browser:

    http://localhost:3000

---

## ✅ Quick Test Flow

1. Register a new account (example: player1 / 123456)
2. Login
3. Open Tic-Tac-Toe or Rock-Paper-Scissors
4. Play games and verify scores are recorded

---

## ➕ How to Add a New Game

### 1. Create Game Component

    frontend/src/components/Games/YourGameName.js

### 2. Example Component

    import React, { useState } from 'react';

    const YourGameName = () => {
      const [score, setScore] = useState(0);

      const handleWin = () => {
        setScore(prev => prev + 1);
      };

      return (
        <div>
          <h2>Your Game Name</h2>
          <p>Score: {score}</p>
          <button onClick={handleWin}>I Win!</button>
        </div>
      );
    };

    export default YourGameName;

---

### 3. Add Game Link

    <li>
      <Link to="/games/your-game-name">Your Game Name</Link>
    </li>

---

### 4. Add Route

    <Route path="/games/your-game-name" element={<YourGameName />} />

Your game is now part of GameHub 🎉

---

## 🧯 Common Issues & Fixes

Problem | Cause | Fix  
------- | ----- | ---
MongoDB error | Mongo not running | Start mongod or check URI  
CORS error | Wrong API URL | Check REACT_APP_API_URL  
Module not found | npm install skipped | Run npm install  
No CSS | CSS not imported | Import index.css  
API 404 | Backend not running | Start backend on port 5000  

---

## 🤝 Contributing

Contributions are welcome.

Ideas:
- Add new games (Snake, Memory, 2048)
- Improve UI or add dark mode
- Add leaderboard
- Improve mobile responsiveness
- Fix documentation or typos

---

## 📄 License

MIT License

---

Happy coding & gaming 🎮  
— Suvayu & contributors
