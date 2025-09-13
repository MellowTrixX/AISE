import React, { useState, useCallback, useEffect } from 'react';
import { ExtractionMode } from './types';
import { extractTextFromImage, generatePromptFromImage } from './services/geminiService';
import ModeSelector from './components/ModeSelector';
import Extractor from './components/Extractor';
import ResultDisplay from './components/ResultDisplay';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [mode, setMode] = useState<ExtractionMode | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeSelect = (selectedMode: ExtractionMode) => {
    setMode(selectedMode);
    // Reset other states when changing mode
    setImageData(null);
    setResult(null);
    setError(null);
  };

  const handleImagePaste = (dataUrl: string) => {
    setImageData(dataUrl);
    setResult(null);
    setError(null);
  };

  const handleExtraction = useCallback(async () => {
    if (!imageData || !mode) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Data = imageData.split(',')[1];
      let responseText: string;

      if (mode === ExtractionMode.TEXT) {
        responseText = await extractTextFromImage(base64Data);
      } else {
        responseText = await generatePromptFromImage(base64Data);
      }
      setResult(responseText);
    } catch (e: any) {
      console.error("Extraction failed:", e);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  }, [imageData, mode]);

  const handleReset = () => {
    setMode(null);
    setImageData(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };
  
  const handleNewImage = () => {
    setImageData(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen text-light flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-grow">
        <Header onReset={handleReset} />
        <main className="flex-grow flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8">
          {!mode ? (
            <ModeSelector onSelect={handleModeSelect} />
          ) : (
            <div className="w-full max-w-2xl">
              <Extractor
                mode={mode}
                imageData={imageData}
                onImagePaste={handleImagePaste}
                onExtract={handleExtraction}
                onNewImage={handleNewImage}
                isLoading={isLoading}
              />
              <ResultDisplay
                isLoading={isLoading}
                result={result}
                error={error}
                mode={mode}
              />
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;