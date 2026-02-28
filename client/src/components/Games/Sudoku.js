import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Sudoku.css';

// ─── Helpers ──────────────────────────────────────────────

const cloneGrid = (grid) => grid.map((row) => [...row]);

const isValid = (grid, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  return true;
};

const solve = (grid) => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(grid, r, c, num)) {
            grid[r][c] = num;
            if (solve(grid)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const DIFFICULTY_MAP = {
  easy: 36,
  medium: 46,
  hard: 54,
};

const generateSudoku = (difficulty = 'easy') => {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(grid);
  const solution = cloneGrid(grid);
  const puzzle = cloneGrid(grid);
  const removals = DIFFICULTY_MAP[difficulty] || 36;
  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9])
  );
  for (let i = 0; i < removals; i++) {
    const [r, c] = positions[i];
    puzzle[r][c] = 0;
  }
  return { puzzle, solution };
};

const isBoardComplete = (grid, solution) => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
};

// ─── Component ────────────────────────────────────────────

const Sudoku = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [solution, setSolution] = useState([]);
  const [initialPuzzle, setInitialPuzzle] = useState([]);
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(null);
  const [errors, setErrors] = useState(new Set());
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [bestTime, setBestTime] = useState(null);
  const [notesMode, setNotesMode] = useState(false);
  const [notes, setNotes] = useState(
    Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => new Set())
    )
  );

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  const startNewGame = useCallback((diff) => {
    const { puzzle, solution: sol } = generateSudoku(diff);
    setSolution(sol);
    setInitialPuzzle(cloneGrid(puzzle));
    setGrid(cloneGrid(puzzle));
    setSelected(null);
    setErrors(new Set());
    setWon(false);
    setTimer(0);
    setIsRunning(false);
    setMistakes(0);
    setNotesMode(false);
    setNotes(
      Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => new Set())
      )
    );
  }, []);

  useEffect(() => {
    startNewGame(difficulty);
    const saved = localStorage.getItem(`sudoku_best_${difficulty}`);
    if (saved) setBestTime(JSON.parse(saved));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let interval = null;
    if (isRunning && !won) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, won]);

  const saveScoreToServer = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.post(
        `${API_BASE}/api/scores`,
        { game: 'Sudoku', score: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to save score:', err);
    }
  }, [API_BASE]);

  const handleCellClick = (row, col) => {
    if (won) return;
    setSelected({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selected || won) return;
    const { row, col } = selected;
    if (initialPuzzle[row][col] !== 0) return;

    if (!isRunning) setIsRunning(true);

    if (notesMode) {
      const newNotes = notes.map((r) => r.map((s) => new Set(s)));
      if (num === 0) {
        newNotes[row][col].clear();
      } else if (newNotes[row][col].has(num)) {
        newNotes[row][col].delete(num);
      } else {
        newNotes[row][col].add(num);
      }
      setNotes(newNotes);
      return;
    }

    const newGrid = cloneGrid(grid);
    newGrid[row][col] = num;
    setGrid(newGrid);

    const newNotes = notes.map((r) => r.map((s) => new Set(s)));
    newNotes[row][col].clear();
    setNotes(newNotes);

    const key = `${row}-${col}`;
    const newErrors = new Set(errors);
    if (num !== 0 && num !== solution[row][col]) {
      newErrors.add(key);
      setMistakes((m) => m + 1);
    } else {
      newErrors.delete(key);
    }
    setErrors(newErrors);

    if (num !== 0 && isBoardComplete(newGrid, solution)) {
      setWon(true);
      setIsRunning(false);
      const currentTime = timer;
      if (!bestTime || currentTime < bestTime) {
        setBestTime(currentTime);
        localStorage.setItem(
          `sudoku_best_${difficulty}`,
          JSON.stringify(currentTime)
        );
      }
      saveScoreToServer();
    }
  };

  const handleErase = () => {
    if (!selected || won) return;
    const { row, col } = selected;
    if (initialPuzzle[row][col] !== 0) return;
    const newGrid = cloneGrid(grid);
    newGrid[row][col] = 0;
    setGrid(newGrid);
    const key = `${row}-${col}`;
    const newErrors = new Set(errors);
    newErrors.delete(key);
    setErrors(newErrors);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!selected || won) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        handleNumberInput(num);
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        handleErase();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleDifficultyChange = (diff) => {
    setDifficulty(diff);
    startNewGame(diff);
    const saved = localStorage.getItem(`sudoku_best_${diff}`);
    setBestTime(saved ? JSON.parse(saved) : null);
  };

  const getCellClass = (row, col) => {
    const classes = ['sudoku-cell'];
    const key = `${row}-${col}`;
    if (initialPuzzle[row]?.[col] !== 0) classes.push('locked');
    if (errors.has(key)) classes.push('error');
    if (won) classes.push('solved');
    if (selected && selected.row === row && selected.col === col)
      classes.push('selected');
    else if (selected && (selected.row === row || selected.col === col))
      classes.push('highlighted');
    else if (
      selected &&
      Math.floor(selected.row / 3) === Math.floor(row / 3) &&
      Math.floor(selected.col / 3) === Math.floor(col / 3)
    )
      classes.push('highlighted');

    // Same-number highlighting
    if (
      selected &&
      grid[selected.row]?.[selected.col] !== 0 &&
      grid[row][col] === grid[selected.row][selected.col] &&
      !(selected.row === row && selected.col === col)
    )
      classes.push('same-number');

    return classes.join(' ');
  };

  // ── Build the 9 boxes (each 3×3), laid out in a 3×3 meta-grid ──
  const renderBoard = () => {
    const boxes = [];
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const cells = [];
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const row = boxRow * 3 + r;
            const col = boxCol * 3 + c;
            const cell = grid[row]?.[col];

            cells.push(
              <button
                key={`${row}-${col}`}
                className={getCellClass(row, col)}
                onClick={() => handleCellClick(row, col)}
                disabled={won}
              >
                {cell !== 0 ? (
                  cell
                ) : notes[row][col].size > 0 ? (
                  <span className="sudoku-notes">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <span
                        key={n}
                        className={`note-num ${notes[row][col].has(n) ? 'visible' : ''}`}
                      >
                        {notes[row][col].has(n) ? n : ''}
                      </span>
                    ))}
                  </span>
                ) : (
                  ''
                )}
              </button>
            );
          }
        }
        boxes.push(
          <div className="sudoku-box" key={`box-${boxRow}-${boxCol}`}>
            {cells}
          </div>
        );
      }
    }
    return boxes;
  };

  return (
    <div className="sudoku-container">
      <div className="sudoku-header">
        <h1 className="sudoku-title">🔢 Sudoku</h1>
        <p className="sudoku-subtitle">
          Fill every row, column, and 3×3 box with digits 1–9.
        </p>
      </div>

      {/* Difficulty selector */}
      <div className="sudoku-difficulty">
        {['easy', 'medium', 'hard'].map((d) => (
          <button
            key={d}
            className={`diff-btn ${difficulty === d ? 'active' : ''}`}
            onClick={() => handleDifficultyChange(d)}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="sudoku-stats">
        <div className="stat-item">
          <span className="stat-label">Time</span>
          <span className="stat-value">{formatTime(timer)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Mistakes</span>
          <span className="stat-value">{mistakes}</span>
        </div>
        {bestTime !== null && (
          <div className="stat-item best">
            <span className="stat-label">Best</span>
            <span className="stat-value">{formatTime(bestTime)}</span>
          </div>
        )}
      </div>

      {/* Win message */}
      {won && (
        <div className="sudoku-win-message">
          🎉 Puzzle Solved in <strong>{formatTime(timer)}</strong> with{' '}
          <strong>{mistakes}</strong> mistake{mistakes !== 1 ? 's' : ''}!
        </div>
      )}

      {/* Board — 3×3 meta-grid of 3×3 boxes */}
      <div className="sudoku-board">{renderBoard()}</div>

      {/* Number pad */}
      <div className="sudoku-numpad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            className="numpad-btn"
            onClick={() => handleNumberInput(n)}
            disabled={won}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="sudoku-controls">
        <button className="sudoku-btn" onClick={handleErase} disabled={won}>
          ⌫ Erase
        </button>
        <button
          className={`sudoku-btn ${notesMode ? 'active' : ''}`}
          onClick={() => setNotesMode((m) => !m)}
          disabled={won}
        >
          ✏️ Notes {notesMode ? 'ON' : 'OFF'}
        </button>
        <button
          className="sudoku-btn"
          onClick={() => startNewGame(difficulty)}
        >
          🔄 New Game
        </button>
      </div>
    </div>
  );
};

export default Sudoku;