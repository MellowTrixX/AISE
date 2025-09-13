import React from 'react';
import { ExtractIcon, LoadingSpinner, NewImageIcon } from './Icons';

interface CorrectionStepProps {
  ocrText: string;
  onTextChange: (newText: string) => void;
  onStructure: () => void;
  isLoading: boolean;
  onNewImage: () => void;
}

const CorrectionStep: React.FC<CorrectionStepProps> = ({ ocrText, onTextChange, onStructure, isLoading, onNewImage }) => {
  return (
    <div className="w-full max-w-2xl flex flex-col items-center animate-fade-in">
      <h2 className="text-2xl font-bold text-light mb-2">Schritt 2: Text korrigieren</h2>
      <p className="text-muted mb-6 text-center">
        Die KI hat den folgenden Text extrahiert. Bitte überprüfen und korrigieren Sie ihn bei Bedarf, bevor Sie die Strukturierung starten.
      </p>
      
      <textarea
        value={ocrText}
        onChange={(e) => onTextChange(e.target.value)}
        className="w-full h-64 bg-surface/80 border border-muted/30 rounded-lg p-4 text-light font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Extrahierter Text zum Korrigieren"
        spellCheck="false"
      />
      
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <button
            onClick={onStructure}
            disabled={isLoading || !ocrText.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent text-background font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-muted disabled:cursor-not-allowed"
        >
            {isLoading ? <LoadingSpinner/> : <ExtractIcon/>}
            {isLoading ? 'Strukturiere...' : 'Text strukturieren'}
        </button>
        <button
            onClick={onNewImage}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-surface text-light font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-muted disabled:opacity-50"
        >
            <NewImageIcon/>
            Anderes Bild
        </button>
      </div>
    </div>
  );
};

export default CorrectionStep;
