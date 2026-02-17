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
