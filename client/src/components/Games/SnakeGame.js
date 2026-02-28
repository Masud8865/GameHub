import React, { useEffect, useRef, useState } from "react";
import "./SnakeGame.css";

const GRID_SIZE = 20;
const TILE_COUNT = 20;

const SnakeGame = () => {
  const canvasRef = useRef(null);

  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  //  Keyboard controls
useEffect(() => {
  const handleKey = (e) => {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      e.preventDefault();
    }

    setDirection((prev) => {
      if (e.key === "ArrowUp" && prev.y !== 1) return { x: 0, y: -1 };
      if (e.key === "ArrowDown" && prev.y !== -1) return { x: 0, y: 1 };
      if (e.key === "ArrowLeft" && prev.x !== 1) return { x: -1, y: 0 };
      if (e.key === "ArrowRight" && prev.x !== -1) return { x: 1, y: 0 };
      return prev;
    });
  };

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, []);

  //  Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, 180);

    return () => clearInterval(interval);
  });

  const moveSnake = () => {
    setSnake((prev) => {
      const newHead = {
        x: prev[0].x + direction.x,
        y: prev[0].y + direction.y,
      };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= TILE_COUNT ||
        newHead.y >= TILE_COUNT
      ) {
        setGameOver(true);
        return prev;
      }

      // Self collision
      if (prev.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
        setGameOver(true);
        return prev;
      }

      let newSnake = [newHead, ...prev];

      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 1);
        setFood({
          x: Math.floor(Math.random() * TILE_COUNT),
          y: Math.floor(Math.random() * TILE_COUNT),
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  //  Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(
      food.x * GRID_SIZE,
      food.y * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE
    );

    // Snake
    ctx.fillStyle = "#22c55e";
    snake.forEach((seg) => {
      ctx.fillRect(
        seg.x * GRID_SIZE,
        seg.y * GRID_SIZE,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });
  }, [snake, food]);

  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="snake-container">
      <h2>🐍 Snake Game</h2>
      <p>Use Arrow Keys to Move</p>

      <canvas
        ref={canvasRef}
        width={GRID_SIZE * TILE_COUNT}
        height={GRID_SIZE * TILE_COUNT}
      />

      <div className="snake-info">
        Score: <strong>{score}</strong>
      </div>

      {gameOver && <div className="game-over">Game Over!</div>}

      <button onClick={restartGame}>Restart</button>
    </div>
  );
};

export default SnakeGame;