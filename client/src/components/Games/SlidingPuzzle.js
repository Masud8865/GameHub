import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './SlidingPuzzle.css';

// Helper: Check if puzzle is solved
const isSolved = (tiles) => {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[tiles.length - 1] === 0;
};

// Helper: Get the index of the empty tile (0)
const getEmptyIndex = (tiles) => tiles.indexOf(0);

// Helper: Get neighboring indices that can swap with the empty tile
const getSwappableIndices = (emptyIndex) => {
  const row = Math.floor(emptyIndex / 3);
  const col = emptyIndex % 3;
  const neighbors = [];
  if (row > 0) neighbors.push(emptyIndex - 3); // up
  if (row < 2) neighbors.push(emptyIndex + 3); // down
  if (col > 0) neighbors.push(emptyIndex - 1); // left
  if (col < 2) neighbors.push(emptyIndex + 1); // right
  return neighbors;
};

// Helper: Check if a shuffle is solvable
const isSolvable = (tiles) => {
  let inversions = 0;
  const flat = tiles.filter((t) => t !== 0);
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
};

// Generate a solvable shuffled puzzle
const generatePuzzle = () => {
  let tiles;
  do {
    tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    // Fisher-Yates shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable(tiles) || isSolved(tiles));
  return tiles;
};

const SlidingPuzzle = () => {
  const [tiles, setTiles] = useState(generatePuzzle());
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [bestScore, setBestScore] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sliding_puzzle_best');
    if (saved) setBestScore(JSON.parse(saved));
  }, []);

  // Timer
  useEffect(() => {
    let interval = null;
    if (isRunning && !won) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, won]);

  // Save score to server
  const saveScoreToServer = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.post(
        `${API_BASE}/api/scores`,
        { game: 'SlidingPuzzle', score: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  }, [API_BASE]);

  // Handle tile click
  const handleTileClick = (index) => {
    if (won) return;

    const emptyIndex = getEmptyIndex(tiles);
    const swappable = getSwappableIndices(emptyIndex);

    if (!swappable.includes(index)) return;

    // Start timer on first move
    if (!isRunning) setIsRunning(true);

    const newTiles = [...tiles];
    [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
    setTiles(newTiles);
    setMoves((prev) => prev + 1);

    // Check win
    if (isSolved(newTiles)) {
      setWon(true);
      setIsRunning(false);

      const currentScore = { moves: moves + 1, time: timer };
      if (!bestScore || currentScore.moves < bestScore.moves) {
        setBestScore(currentScore);
        localStorage.setItem('sliding_puzzle_best', JSON.stringify(currentScore));
      }

      saveScoreToServer();
    }
  };

  // Reset / New game
  const resetGame = () => {
    setTiles(generatePuzzle());
    setMoves(0);
    setTimer(0);
    setIsRunning(false);
    setWon(false);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="sliding-puzzle-container">
      <div className="puzzle-header">
        <h1 className="puzzle-title">🧩 Sliding Puzzle</h1>
        <p className="puzzle-subtitle">Arrange tiles 1–8 in order. Click a tile next to the empty space to move it.</p>
      </div>

      {/* Stats */}
      <div className="puzzle-stats">
        <div className="stat-item">
          <span className="stat-label">Moves</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Time</span>
          <span className="stat-value">{formatTime(timer)}</span>
        </div>
        {bestScore && (
          <div className="stat-item best">
            <span className="stat-label">Best</span>
            <span className="stat-value">{bestScore.moves} moves</span>
          </div>
        )}
      </div>

      {/* Win message */}
      {won && (
        <div className="puzzle-win-message">
          🎉 Puzzle Solved in <strong>{moves}</strong> moves and <strong>{formatTime(timer)}</strong>!
        </div>
      )}

      {/* Puzzle Board */}
      <div className="puzzle-board">
        {tiles.map((tile, index) => (
          <button
            key={index}
            className={`puzzle-tile ${tile === 0 ? 'empty' : ''} ${won ? 'solved' : ''}`}
            onClick={() => handleTileClick(index)}
            disabled={tile === 0 || won}
          >
            {tile !== 0 ? tile : ''}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="puzzle-controls">
        <button className="puzzle-btn" onClick={resetGame}>
          🔄 New Puzzle
        </button>
      </div>
    </div>
  );
};

export default SlidingPuzzle;