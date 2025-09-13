import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 text-center">
      <p className="text-sm text-muted">
        Entwickelt mit React & Gemini AI. Drücken Sie <kbd className="font-sans px-2 py-1.5 text-xs font-semibold text-light bg-surface border border-muted/30 rounded-lg">Esc</kbd> um zurückzusetzen.
      </p>
    </footer>
  );
};

export default Footer;