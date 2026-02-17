import React from 'react';
import { Link } from 'react-router-dom';

const GameCard = ({ name, description, path, icon }) => {
    return (
        <Link to={path} className="game-card">
            <span className="game-icon">{icon}</span>
            <h3>{name}</h3>
            <p>{description}</p>
        </Link>
    );
};

export default GameCard;
