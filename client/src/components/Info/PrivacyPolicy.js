import React from 'react';
import { motion } from 'framer-motion';
import { hoverLift, itemVariants, pageVariants } from './motionConfig';

const sections = [
  {
    title: 'Information we collect',
    body: 'We collect basic account data such as your name, email address, and authentication details when you register.',
  },
  {
    title: 'How we use information',
    body: 'Your data is used to create your account, secure access, and improve gameplay experience and platform reliability.',
  },
  {
    title: 'Data sharing',
    body: 'We do not sell personal data. Information may only be shared with service providers needed to operate core platform features.',
  },
  {
    title: 'Security',
    body: 'We apply reasonable technical and organizational controls to protect account and gameplay data from unauthorized access.',
  },
  {
    title: 'Your choices',
    body: 'You can request account updates or deletion through support channels in accordance with applicable privacy laws.',
  },
];

const PrivacyPolicy = () => {
  return (
    <motion.main className="info-page" initial="hidden" animate="visible" variants={pageVariants}>
      <section className="info-shell">
        <motion.header className="info-hero" variants={itemVariants}>
          <span className="info-badge">Privacy Policy</span>
          <h1>Your privacy matters to us.</h1>
          <p>
            This policy explains what data GameHub collects, how it is used, and the controls
            available to you.
          </p>
        </motion.header>

        <section className="info-stack" aria-label="Privacy policy sections">
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

export default PrivacyPolicy;
