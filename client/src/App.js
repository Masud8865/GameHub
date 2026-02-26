import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TicTacToe from './components/Games/TicTacToe';
import RockPaperScissors from './components/Games/RockPaperScissors';
import About from './components/Info/About';
import PrivacyPolicy from './components/Info/PrivacyPolicy';
import TermsOfService from './components/Info/TermsOfService';
import NumberGuessingGame from './components/Games/NumberGuessingGame';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
            <Route
              path="/games/number-guessing"
              element={<NumberGuessingGame />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
