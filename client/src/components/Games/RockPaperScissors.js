import React, { useState } from 'react';
import axios from 'axios';

const RockPaperScissors = () => {
    const [playerChoice, setPlayerChoice] = useState(null);
    const [aiChoice, setAiChoice] = useState(null);
    const [result, setResult] = useState(null);
    const [playerPoints, setPlayerPoints] = useState(0);
    const [aiPoints, setAiPoints] = useState(0);

    const choices = ['Rock', 'Paper', 'Scissors'];
    const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
    const maxPoints = 5; // first to 5 points wins

    const play = (choice) => {
        if (playerPoints >= maxPoints || aiPoints >= maxPoints) return;

        const ai = choices[Math.floor(Math.random() * 3)];
        setPlayerChoice(choice);
        setAiChoice(ai);
        determineWinner(choice, ai);
    };

    const determineWinner = (player, ai) => {
        if (player === ai) {
            setResult('Draw!');
            return;
        }

        if (
            (player === 'Rock' && ai === 'Scissors') ||
            (player === 'Paper' && ai === 'Rock') ||
            (player === 'Scissors' && ai === 'Paper')
        ) {
            setResult('You Win this round!');
            setPlayerPoints(prev => prev + 1);
            saveScore(1); // send score to backend
        } else {
            setResult('AI Wins this round!');
            setAiPoints(prev => prev + 1);
            saveScore(0); // send score to backend
        }
    };

    const saveScore = async (score) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            await axios.post(
                `${API_BASE}/api/scores`,
                { game: 'RockPaperScissors', score },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error(err);
        }
    };

    const resetGame = () => {
        setPlayerChoice(null);
        setAiChoice(null);
        setResult(null);
        setPlayerPoints(0);
        setAiPoints(0);
    };

    const isGameOver = playerPoints >= maxPoints || aiPoints >= maxPoints;

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>🎮 Rock-Paper-Scissors (Point-Based)</h2>

            <div style={{ margin: '20px' }}>
                {choices.map(choice => (
                    <button
                        key={choice}
                        onClick={() => play(choice)}
                        disabled={isGameOver}
                        style={{ margin: '0 10px', padding: '10px 20px', fontSize: '16px' }}
                    >
                        {choice}
                    </button>
                ))}
            </div>

            {playerChoice && aiChoice && (
                <p>
                    You chose: <b>{playerChoice}</b> | AI chose: <b>{aiChoice}</b>
                </p>
            )}

            {result && <h3>{result}</h3>}

            <p>
                Score → You: <b>{playerPoints}</b> | AI: <b>{aiPoints}</b>
            </p>

            {isGameOver && (
                <div>
                    <h2>
                        {playerPoints > aiPoints
                            ? '🎉 You Won the Game!'
                            : '💀 AI Won the Game!'}
                    </h2>
                    <button
                        onClick={resetGame}
                        style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}
                    >
                        Reset Game
                    </button>
                </div>
            )}
        </div>
    );
};

export default RockPaperScissors;
