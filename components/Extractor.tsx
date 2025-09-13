import React, { useEffect, useCallback } from 'react';
import { ExtractionMode } from '../types';
import { PasteIcon, ExtractIcon, NewImageIcon, LoadingSpinner } from './Icons';

interface ExtractorProps {
  mode: ExtractionMode;
  imageData: string | null;
  isLoading: boolean;
  onImagePaste: (dataUrl: string) => void;
  onExtract: () => void;
  onNewImage: () => void;
}

const Extractor: React.FC<ExtractorProps> = ({ mode, imageData, isLoading, onImagePaste, onExtract, onNewImage }) => {
  const handlePaste = useCallback((event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            onImagePaste(e.target?.result as string);
          };
          reader.readAsDataURL(blob);
        }
        break;
      }
    }
  }, [onImagePaste]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const modeText = mode === ExtractionMode.TEXT ? 'Text aus Screenshot extrahieren' : 'Bildprompt aus Screenshot generieren';

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <h2 className="text-2xl font-bold text-light mb-4">{modeText}</h2>
      
      {!imageData ? (
        <div className="w-full h-64 border-2 border-dashed border-muted/50 rounded-lg flex flex-col items-center justify-center bg-surface/50 p-4">
          <PasteIcon />
          <p className="mt-4 text-muted">Screenshot hier einfügen mit <kbd className="font-sans px-2 py-1.5 text-xs font-semibold text-light bg-surface border border-muted/30 rounded-lg">Strg</kbd> + <kbd className="font-sans px-2 py-1.5 text-xs font-semibold text-light bg-surface border border-muted/30 rounded-lg">V</kbd></p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
            <div className="mb-6 p-2 bg-surface/50 border border-muted/30 rounded-lg shadow-lg">
                <img src={imageData} alt="Eingefügter Screenshot" className="max-w-full max-h-64 rounded" />
            </div>
            <div className="flex items-center gap-4">
                 <button
                    onClick={onExtract}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-accent text-background font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-muted disabled:cursor-not-allowed"
                >
                    {isLoading ? <LoadingSpinner/> : <ExtractIcon/>}
                    {isLoading ? 'Analysiere...' : 'Extrahieren'}
                </button>
                 <button
                    onClick={onNewImage}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-surface text-light font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-muted disabled:opacity-50"
                >
                    <NewImageIcon/>
                    Neues Bild
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Extractor;