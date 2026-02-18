import React from 'react';
import { motion } from 'framer-motion';
import { hoverLift, itemVariants, pageVariants } from './motionConfig';

const sections = [
  {
    title: 'Acceptance of terms',
    body: 'By using GameHub, you agree to these terms and any related policies that govern your use of the platform.',
  },
  {
    title: 'Account responsibilities',
    body: 'You are responsible for maintaining the security of your login credentials and for activity under your account.',
  },
  {
    title: 'Allowed use',
    body: 'You may use GameHub for personal, lawful gameplay. Abuse, unauthorized access attempts, or harmful behavior are prohibited.',
  },
  {
    title: 'Intellectual property',
    body: 'GameHub branding, UI assets, and platform content are protected by applicable intellectual property laws.',
  },
  {
    title: 'Service availability',
    body: 'We may update, suspend, or discontinue features to improve reliability, security, or overall user experience.',
  },
  {
    title: 'Contact',
    body: 'Questions about these terms can be directed through official GameHub support channels.',
  },
];

const TermsOfService = () => {
  return (
    <motion.main className="info-page" initial="hidden" animate="visible" variants={pageVariants}>
      <section className="info-shell">
        <motion.header className="info-hero" variants={itemVariants}>
          <span className="info-badge">Terms of Service</span>
          <h1>Clear rules for a fair gaming space.</h1>
          <p>
            These terms set expectations for account use, permitted behavior, and platform
            operations.
          </p>
        </motion.header>

        <section className="info-stack" aria-label="Terms of service sections">
          {sections.map((section) => (
            <motion.article
              key={section.title}
              className="info-section"
              variants={itemVariants}
              whileHover={hoverLift}
              whileTap={{ scale: 0.995 }}
            >
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </motion.article>
          ))}
        </section>
      </section>
    </motion.main>
  );
};

export default TermsOfService;
