import React from 'react';
import GameList from './GameList';

const Home = () => {
    return (
        <div className="home-page">
            <section className="hero">
                <h1>Welcome to GameHub</h1>
                <p>Your ultimate destination for classic games! Play, compete, and have fun with friends.</p>
            </section>

            <section className="games-section" id="games">
                <GameList />
            </section>
        </div>
    );
};

export default Home;
