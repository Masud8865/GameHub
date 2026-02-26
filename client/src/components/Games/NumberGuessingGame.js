import React, { useState, useRef } from "react";
import "./NumberGuessingGame.css";

const NumberGuessingGame = () => {
    const generateNumber = () => Math.floor(Math.random() * 100) + 1;

    const [target, setTarget] = useState(generateNumber());
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("Start guessing...");
    const [attempts, setAttempts] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const inputRef = useRef(null);

    const handleGuess = () => {
        if (!guess || gameOver) return;

        const userGuess = Number(guess);

        // Validation
        if (userGuess < 1 || userGuess > 100) {
            setMessage("⚠️ Enter a number between 1 and 100");
            setGuess("");
            inputRef.current?.focus();
            return;
        }

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        // Hint logic
        if (userGuess > target) {
            setMessage("⬇️ Aim lower");
        } else if (userGuess < target) {
            setMessage("⬆️ Aim higher");
        } else {
            setMessage("🎉 Correct Guess!");
            setGameOver(true);
        }

        setGuess("");
        inputRef.current?.focus();
    };

    const restartGame = () => {
        setTarget(generateNumber());
        setGuess("");
        setAttempts(0);
        setMessage("New game started! Guess again...");
        setGameOver(false);
        inputRef.current?.focus();
    };

    return (
        <div className="number-game-container">
            <div
                className={`number-game-card ${message.includes("lower")
                        ? "card-high"
                        : message.includes("higher")
                            ? "card-low"
                            : gameOver
                                ? "card-correct"
                                : ""
                    }`}
            >
                <h2>🎯 Number Guessing Game</h2>

                <p className="subtitle">
                    Guess a number between <strong>1 — 100</strong>
                </p>

                {/* FORM enables ENTER key */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleGuess();
                    }}
                >
                    <input
                        ref={inputRef}
                        type="number"
                        placeholder="Enter your guess..."
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        disabled={gameOver}
                    />

                    <button
                        type="submit"
                        className="guess-btn"
                        disabled={gameOver}
                    >
                        Submit Guess
                    </button>
                </form>

                <div
                    className={`message ${message.includes("lower")
                            ? "high"
                            : message.includes("higher")
                                ? "low"
                                : gameOver
                                    ? "correct"
                                    : ""
                        }`}
                >
                    {message}
                </div>

                <div className="attempts">
                    Attempts: <strong>{attempts}</strong>
                </div>

                <button className="restart-btn" onClick={restartGame}>
                    🔄 Restart Game
                </button>
            </div>
        </div>
    );
};

export default NumberGuessingGame;