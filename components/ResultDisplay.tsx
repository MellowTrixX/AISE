import React, { useState, useEffect } from 'react';
import { ExtractionMode } from '../types';
import { CopyIcon, CheckIcon, ErrorIcon, LoadingSpinner } from './Icons';
import MarkdownRenderer from './MarkdownRenderer';

interface ResultDisplayProps {
  isLoading: boolean;
  result: string | null;
  error: string | null;
  mode: ExtractionMode;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, result, error, mode }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (result) {
      setCopied(false);
    }
  }, [result]);
  
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8 w-full p-6 bg-surface/50 border border-muted/30 rounded-lg flex flex-col items-center justify-center min-h-[150px] animate-pulse">
        <LoadingSpinner />
        <p className="mt-4 text-muted">KI analysiert das Bild...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 w-full p-6 bg-red-900/20 border border-red-500 rounded-lg flex items-center gap-4">
        <ErrorIcon />
        <span className="text-red-400">{error}</span>
      </div>
    );
  }

  if (!result) {
    return null;
  }
  
  const isJson = mode === ExtractionMode.PROMPT;

  return (
    <div className="mt-8 w-full p-6 bg-surface/50 backdrop-blur-sm border border-muted/30 rounded-lg text-left relative animate-fade-in">
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 bg-surface rounded-md hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Ergebnis kopieren"
        >
            {copied ? <CheckIcon/> : <CopyIcon />}
        </button>
        <div className="max-h-96 overflow-y-auto pr-4">
            {isJson ? (
                 <pre className="text-sm whitespace-pre-wrap break-words text-light">{result}</pre>
            ) : (
                <MarkdownRenderer markdown={result} />
            )}
        </div>
    </div>
  );
};

export default ResultDisplay;