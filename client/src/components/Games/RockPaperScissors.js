import React, { useState } from "react";
import "./RockPaperScissors.css";

const choices = [
  { name: "rock", icon: "✊" },
  { name: "paper", icon: "✋" },
  { name: "scissors", icon: "✌" }
];

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [result, setResult] = useState("");
  const [thinking, setThinking] = useState(false);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const getAIChoice = () => {
    const rand = Math.floor(Math.random() * choices.length);
    return choices[rand];
  };

  const determineWinner = (player, ai) => {
    if (player.name === ai.name) return "draw";

    if (
      (player.name === "rock" && ai.name === "scissors") ||
      (player.name === "paper" && ai.name === "rock") ||
      (player.name === "scissors" && ai.name === "paper")
    ) {
      return "win";
    }

    return "lose";
  };

  const play = (choice) => {
    setPlayerChoice(choice);
    setThinking(true);
    setResult("");
    setAiChoice(null);

    setTimeout(() => {
      const ai = getAIChoice();
      setAiChoice(ai);

      const outcome = determineWinner(choice, ai);

      if (outcome === "win") {
        setPlayerScore((s) => s + 1);
        setResult("You Win!");
      } else if (outcome === "lose") {
        setAiScore((s) => s + 1);
        setResult("You Lose!");
      } else {
        setResult("Draw!");
      }

      setThinking(false);
    }, 900);
  };

  const resetGame = () => {
    setPlayerScore(0);
    setAiScore(0);
    setPlayerChoice(null);
    setAiChoice(null);
    setResult("");
  };

  const resultClass =
    result === "You Win!"
      ? "win"
      : result === "You Lose!"
      ? "lose"
      : result === "Draw!"
      ? "draw"
      : "";

  return (
    <div className="card rps-container">

      <h2 className="rps-title">🎮 Rock Paper Scissors</h2>

      <div className="rps-arena">

        <div className="rps-side">
          <span className="rps-label">YOU</span>
          <div className="rps-choice player">
            {playerChoice ? playerChoice.icon : "❓"}
          </div>
        </div>

        <div className="rps-vs">VS</div>

        <div className="rps-side">
          <span className="rps-label">AI</span>
          <div className={`rps-choice ai ${thinking ? "thinking" : ""}`}>
            {thinking ? "🤖" : aiChoice ? aiChoice.icon : "❓"}
          </div>
        </div>

      </div>

      <div className="rps-buttons">
        {choices.map((c) => (
          <button key={c.name} onClick={() => play(c)}>
            <span className="btn-icon">{c.icon}</span>
            {c.name}
          </button>
        ))}
      </div>

      {result && (
        <div className={`rps-result ${resultClass}`}>
          {result}
        </div>
      )}

      <div className="rps-scoreboard">
        <div>🏆 You: {playerScore}</div>
        <div>🤖 AI: {aiScore}</div>
      </div>

      <button className="rps-reset" onClick={resetGame}>
        Reset Game
      </button>

    </div>
  );
}