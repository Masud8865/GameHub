import React from 'react';
import GameCard from './GameCard';

const GameList = () => {
    const games = [
        {
            name: "Tic-Tac-Toe",
            path: "/games/tic-tac-toe",
            description: "Classic 3x3 strategy game. Get three in a row to win!",
            icon: "⭕"
        },
        {
            name: "Rock-Paper-Scissors",
            path: "/games/rock-paper-scissors",
            description: "Challenge the computer in this timeless hand game.",
            icon: "✊"
        },
        {
            name: "Number Guessing",
            path: "/games/number-guessing",
            description: "Guess the secret number between 1–100 with smart hints.",
            icon: "🎯"
        },
        {
            name: "Snake",
            path: "/games/snake",
            description: "Classic arcade snake. Grow longer and avoid crashing!",
            icon: "🐍"
        }
    ];

    return (
        <div>
            <h2>Available Games</h2>
            <div className="game-grid">
                {games.map(game => (
                    <GameCard key={game.path} {...game} />
                ))}
            </div>
        </div>
    );
};

export default GameList;
