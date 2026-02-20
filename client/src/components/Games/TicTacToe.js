import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TicTacToe.css';

// Pure functions moved outside component to avoid dependency issues
const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    return null;
};

const minimax = (board, depth, isMaximizing) => {
    const result = calculateWinner(board);
    
    if (result && result.winner === 'O') return 10 - depth;
    if (result && result.winner === 'X') return depth - 10;
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const TicTacToe = () => {
    // Game State
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [winningLine, setWinningLine] = useState(null);
    const [gameMode, setGameMode] = useState('pvp'); // 'pvp' or 'pvai'
    const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
    const [scores, setScores] = useState({ playerX: 0, playerO: 0, draws: 0 });
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isGameStarted, setIsGameStarted] = useState(false);
    
    const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

    // Load scores from localStorage on mount
    useEffect(() => {
        const savedScores = localStorage.getItem('tictactoe_scores');
        if (savedScores) {
            setScores(JSON.parse(savedScores));
        }
    }, []);

    // Save scores to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('tictactoe_scores', JSON.stringify(scores));
    }, [scores]);

    // Sound effects - wrapped in useCallback to be used in other useCallbacks/useEffects
    const playSound = useCallback((type) => {
        if (!soundEnabled) return;
        const audio = new Audio();
        switch(type) {
            case 'click':
                audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCx+zPLTgjMGHm7A7+OZSBAMTZ/m77BcHQU9k9n0xXMnBSl7y/HajD0IEl+07OujUA0ISJ7i8bllHAU2jdXzzn0vBSd6zPDajT4IFGCz7OyjUA0ISJ7i8bllHAU2jdXzzn0vBSd6zPDajT4IFGCz7OyjUA0ISJ7i8bllHAU2jdXzzn0vBSd6zPDajT4IFGCz7OyjUA0ISJ7i8bllHAU3jdXzzn0vBSd6zPDajT4IFGCz7OyjUA0ISJ7i8bllHAU3jdXzzn0vBSd6zPDajT4IFGCz7OyjUA0ISJ7i8bllHAU3jdXzzn0vBSd6zPDajT4IF2Cz7OyjUA0ISZ7j8bllHAU';
                break;
            case 'win':
                audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCx+zPLTgjMGHm7A7+OZSBAMTZ/m77BcHQU9k9n0xXMnBSl7y/HajD0IEl+07OujUA0ISJ7i8bllHAU2jdXzzn0vBSd6zPDajT4IFGCz7OyjUA0ISJ7i8bllHAU2jdXzzn0vBSd6zPDajT4IFGCz7OyjUA0ISJ7i8bllHAU2jdXzzn0vBSd6zPDajT4IFGCz7OyjUA0ISJ7i8bllHAU3jdXzzn0vBSd6zPDajT4IFGCz7OyjUA0ISJ7i8bllHAU3jdXzzn0vBSd6zPDajT4IFGCz7OyjUA0ISJ7i8bllHAU3jdXzzn0vBSd6zPDajT4IF2Cz7OyjUA0ISZ7j8bllHAU';
                break;
            case 'draw':
                audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVg';
                break;
            default:
                return;
        }
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }, [soundEnabled]);

    // Update scores
    const getAIMove = useCallback((currentBoard) => {
        const availableMoves = currentBoard
            .map((cell, idx) => cell === null ? idx : null)
            .filter(val => val !== null);

        if (availableMoves.length === 0) return null;

        switch(difficulty) {
            case 'easy':
                // Random move
                return availableMoves[Math.floor(Math.random() * availableMoves.length)];
            
            case 'medium':
                // 70% smart move, 30% random
                if (Math.random() < 0.7) {
                    // Try to win or block
                    for (let move of availableMoves) {
                        // Check if AI can win
                        const testBoard = [...currentBoard];
                        testBoard[move] = 'O';
                        if (calculateWinner(testBoard)?.winner === 'O') return move;
                    }
                    for (let move of availableMoves) {
                        // Check if need to block
                        const testBoard = [...currentBoard];
                        testBoard[move] = 'X';
                        if (calculateWinner(testBoard)?.winner === 'X') return move;
                    }
                    // Take center if available
                    if (currentBoard[4] === null) return 4;
                    // Take corner
                    const corners = [0, 2, 6, 8].filter(i => currentBoard[i] === null);
                    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
                }
                return availableMoves[Math.floor(Math.random() * availableMoves.length)];
            
            case 'hard':
                // Minimax algorithm - unbeatable
                let bestScore = -Infinity;
                let bestMove = availableMoves[0];
                
                for (let move of availableMoves) {
                    const testBoard = [...currentBoard];
                    testBoard[move] = 'O';
                    let score = minimax(testBoard, 0, false);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = move;
                    }
                }
                return bestMove;
            
            default:
                return availableMoves[0];
        }
    }, [difficulty]);

    // Handle cell click
    const handleClick = (index) => {
        if (board[index] || winner) return;
        if (gameMode === 'pvai' && !isXNext) return; // Prevent clicking during AI turn

        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        playSound('click');

        const result = calculateWinner(newBoard);
        if (result) {
            setWinner(result.winner);
            setWinningLine(result.line);
            playSound('win');
            updateScores(result.winner);
            saveScoreToServer(result.winner);
        } else if (!newBoard.includes(null)) {
            setWinner('Draw');
            playSound('draw');
            updateScores('Draw');
        } else {
            setIsXNext(!isXNext);
        }
    };

    // Save score to server - wrapped in useCallback to be used in other useCallbacks/useEffects
    const saveScoreToServer = useCallback(async (result) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const score = result === 'X' ? 1 : result === 'O' ? 0 : 0.5;
            await axios.post(`${API_BASE}/api/scores`, 
                { game: 'TicTacToe', score }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error('Failed to save score:', err);
        }
    }, [API_BASE]);

    // AI Move Effect
    useEffect(() => {
        if (gameMode === 'pvai' && !isXNext && !winner && isGameStarted) {
            const timer = setTimeout(() => {
                const aiMoveIndex = getAIMove(board);
                if (aiMoveIndex !== null) {
                    const newBoard = [...board];
                    newBoard[aiMoveIndex] = 'O';
                    setBoard(newBoard);
                    playSound('click');

                    const result = calculateWinner(newBoard);
                    if (result) {
                        setWinner(result.winner);
                        setWinningLine(result.line);
                        playSound('win');
                        updateScores(result.winner);
                        saveScoreToServer(result.winner);
                    } else if (!newBoard.includes(null)) {
                        setWinner('Draw');
                        playSound('draw');
                        updateScores('Draw');
                    } else {
                        setIsXNext(true);
                    }
                }
            }, 500); // AI delay for better UX

            return () => clearTimeout(timer);
        }
    }, [isXNext, winner, board, gameMode, getAIMove, isGameStarted, playSound, saveScoreToServer]);

    const updateScores = (result) => {
        setScores(prev => {
            if (result === 'X') return { ...prev, playerX: prev.playerX + 1 };
            if (result === 'O') return { ...prev, playerO: prev.playerO + 1 };
            if (result === 'Draw') return { ...prev, draws: prev.draws + 1 };
            return prev;
        });
    };

    // Reset game
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setWinningLine(null);
        setIsGameStarted(true);
    };

    // New game (reset everything including mode)
    const newGame = () => {
        resetGame();
        setIsGameStarted(false);
    };

    // Reset scores
    const resetScores = () => {
        if (window.confirm('Are you sure you want to reset all scores?')) {
            setScores({ playerX: 0, playerO: 0, draws: 0 });
            localStorage.removeItem('tictactoe_scores');
        }
    };

    // Start game with selected mode
    const startGame = (mode) => {
        setGameMode(mode);
        resetGame();
    };

    return (
        <div className="tictactoe-container">
            <div className="game-header">
                <h1 className="game-title">🎮 Tic-Tac-Toe Pro</h1>
                <button 
                    className="sound-toggle"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    title={soundEnabled ? "Sound On" : "Sound Off"}
                >
                    {soundEnabled ? '🔊' : '🔇'}
                </button>
            </div>

            {/* Scoreboard */}
            <div className="scoreboard">
                <div className="score-item player-x">
                    <span className="score-label">Player X</span>
                    <span className="score-value">{scores.playerX}</span>
                </div>
                <div className="score-item draws">
                    <span className="score-label">Draws</span>
                    <span className="score-value">{scores.draws}</span>
                </div>
                <div className="score-item player-o">
                    <span className="score-label">Player O</span>
                    <span className="score-value">{scores.playerO}</span>
                </div>
            </div>

            {/* Game Mode Selection */}
            {!isGameStarted && (
                <div className="mode-selection">
                    <h2>Select Game Mode</h2>
                    <div className="mode-buttons">
                        <button 
                            className="mode-btn pvp-btn"
                            onClick={() => startGame('pvp')}
                        >
                            👥 Player vs Player
                        </button>
                        <button 
                            className="mode-btn pvai-btn"
                            onClick={() => startGame('pvai')}
                        >
                            🤖 Player vs AI
                        </button>
                    </div>
                </div>
            )}

            {/* Difficulty Selection (only for AI mode) */}
            {isGameStarted && gameMode === 'pvai' && !winner && (
                <div className="difficulty-selector">
                    <label>AI Difficulty: </label>
                    <button 
                        className={`diff-btn ${difficulty === 'easy' ? 'active' : ''}`}
                        onClick={() => setDifficulty('easy')}
                    >
                        Easy
                    </button>
                    <button 
                        className={`diff-btn ${difficulty === 'medium' ? 'active' : ''}`}
                        onClick={() => setDifficulty('medium')}
                    >
                        Medium
                    </button>
                    <button 
                        className={`diff-btn ${difficulty === 'hard' ? 'active' : ''}`}
                        onClick={() => setDifficulty('hard')}
                    >
                        Hard
                    </button>
                </div>
            )}

            {/* Game Status */}
            {isGameStarted && (
                <div className="game-status">
                    {winner ? (
                        <div className="status-message winner-message">
                            {winner === 'Draw' ? 
                                "🤝 It's a Draw!" : 
                                `🎉 Player ${winner} Wins!`
                            }
                        </div>
                    ) : (
                        <div className="status-message">
                            {gameMode === 'pvai' && !isXNext ? 
                                '🤖 AI is thinking...' : 
                                `Player ${isXNext ? 'X' : 'O'}'s Turn`
                            }
                        </div>
                    )}
                </div>
            )}

            {/* Game Board */}
            {isGameStarted && (
                <div className="game-board-wrapper">
                    <div className={`game-board ${winner ? 'game-over' : ''}`}>
                        {board.map((cell, index) => (
                            <button
                                key={index}
                                className={`cell ${cell ? 'filled' : ''} ${
                                    winningLine && winningLine.includes(index) ? 'winning-cell' : ''
                                } ${cell === 'X' ? 'cell-x' : cell === 'O' ? 'cell-o' : ''}`}
                                onClick={() => handleClick(index)}
                                disabled={!!winner}
                            >
                                {cell && <span className="cell-content">{cell}</span>}
                            </button>
                        ))}
                    </div>
                    {winningLine && (
                        <div className={`winning-line line-${winningLine.join('-')}`}></div>
                    )}
                </div>
            )}

            {/* Game Controls */}
            {isGameStarted && (
                <div className="game-controls">
                    <button className="control-btn restart-btn" onClick={resetGame}>
                        🔄 Restart Game
                    </button>
                    <button className="control-btn new-game-btn" onClick={newGame}>
                        🎮 New Game
                    </button>
                    <button className="control-btn reset-score-btn" onClick={resetScores}>
                        🗑️ Reset Scores
                    </button>
                </div>
            )}

            {/* Game Info */}
            <div className="game-info">
                <p>
                    <strong>Mode: </strong> 
                    {gameMode === 'pvp' ? 'Player vs Player' : `Player vs AI (${difficulty})`}
                </p>
                {gameMode === 'pvai' && (
                    <p className="ai-info">
                        <strong>AI Level:</strong> {
                            difficulty === 'easy' ? 'Easy - Random moves' :
                            difficulty === 'medium' ? 'Medium - Basic strategy' :
                            'Hard - Minimax (Unbeatable!)'
                        }
                    </p>
                )}
            </div>
        </div>
    );
};

export default TicTacToe;
