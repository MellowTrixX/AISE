import React from 'react';
import { ExtractionMode } from '../types';
import { TextIcon, ImageIcon } from './Icons';

interface ModeSelectorProps {
  onSelect: (mode: ExtractionMode) => void;
}

const ModeCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-surface/50 backdrop-blur-sm border border-muted/30 rounded-lg p-6 text-center w-full sm:w-80 h-64 flex flex-col items-center justify-center transition-all duration-300 hover:border-accent hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-accent hover:shadow-glow"
  >
    <div className="mb-4 text-accent">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-light">{title}</h3>
    <p className="text-muted">{description}</p>
  </button>
);

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-light">Wählen Sie einen Modus</h2>
      <p className="text-lg text-muted mb-12">Was möchten Sie aus Ihrem Screenshot extrahieren?</p>
      <div className="flex flex-col sm:flex-row gap-8">
        <ModeCard
          title="Text extrahieren"
          description="Lesen und extrahieren Sie den gesamten Text aus dem Bild."
          icon={<TextIcon />}
          onClick={() => onSelect(ExtractionMode.TEXT)}
        />
        <ModeCard
          title="Bildprompt generieren"
          description="Erstellen Sie einen professionellen Prompt für Bild-Generatoren."
          icon={<ImageIcon />}
          onClick={() => onSelect(ExtractionMode.PROMPT)}
        />
      </div>
    </div>
  );
};

export default ModeSelector;