import React from 'react';
import { motion } from 'framer-motion';
import { hoverLift, itemVariants, pageVariants } from './motionConfig';

const featureCards = [
  {
    title: 'Curated Classics',
    description:
      'GameHub focuses on easy-to-start classic games so anyone can jump in and play in seconds.',
  },
  {
    title: 'Simple Accounts',
    description:
      'Create an account to track your sessions, keep your profile, and return to your favorite games.',
  },
  {
    title: 'Built for Fun',
    description:
      'Every screen is designed to stay fast, clean, and responsive across desktop and mobile devices.',
  },
];

const About = () => {
  return (
    <motion.main className="info-page" initial="hidden" animate="visible" variants={pageVariants}>
      <section className="info-shell">
        <motion.header className="info-hero" variants={itemVariants}>
          <span className="info-badge">About GameHub</span>
          <h1>Play classic games in a modern hub.</h1>
          <p>
            GameHub is a lightweight gaming space built around quick entertainment, clean UI, and
            zero friction between opening the site and starting a game.
          </p>
        </motion.header>

        <section className="info-grid" aria-label="GameHub highlights">
          {featureCards.map((card) => (
            <motion.article
              key={card.title}
              className="info-card"
              variants={itemVariants}
              whileHover={hoverLift}
              whileTap={{ scale: 0.995 }}
            >
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </motion.article>
          ))}
        </section>

        <motion.section className="info-section" variants={itemVariants} whileHover={hoverLift}>
          <h2>Our mission</h2>
          <p>
            We want casual gaming to feel polished without becoming complicated. That means keeping
            onboarding simple, delivering smooth interactions, and iterating on features that make
            your game sessions better.
          </p>
        </motion.section>
      </section>
    </motion.main>
  );
};

export default About;
