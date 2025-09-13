import React, { useState, useCallback, useEffect } from 'react';
import { ExtractionMode } from './types';
import { extractRawTextFromImage, structureTextFromText, generatePromptFromImage } from './services/geminiService';
import ModeSelector from './components/ModeSelector';
import Extractor from './components/Extractor';
import ResultDisplay from './components/ResultDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import CorrectionStep from './components/CorrectionStep';

const App: React.FC = () => {
  const [mode, setMode] = useState<ExtractionMode | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeSelect = (selectedMode: ExtractionMode) => {
    setMode(selectedMode);
    handleResetStateForModeChange();
  };

  const resetCommonState = () => {
    setImageData(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    setOcrText(null);
  }

  const handleResetStateForModeChange = () => {
    resetCommonState();
  };
  
  const handleImagePaste = (dataUrl: string) => {
    resetCommonState();
    setImageData(dataUrl);
  };

  const handleOcrRequest = useCallback(async () => {
    if (!imageData) return;

    setIsLoading(true);
    setError(null);
    setOcrText(null);

    try {
      const base64Data = imageData.split(',')[1];
      const rawText = await extractRawTextFromImage(base64Data);
      setOcrText(rawText);
    } catch (e: any) {
      console.error("OCR failed:", e);
      setError('Die Texterkennung ist fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  }, [imageData]);
  
  const handleStructureRequest = useCallback(async () => {
    if (!ocrText) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const structuredText = await structureTextFromText(ocrText);
      setResult(structuredText);
    } catch (e: any) {
      console.error("Structuring failed:", e);
      setError('Die Strukturierung des Textes ist fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  }, [ocrText]);
  
  const handlePromptRequest = useCallback(async () => {
    if (!imageData) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Data = imageData.split(',')[1];
      const responseText = await generatePromptFromImage(base64Data);
      setResult(responseText);
    } catch (e: any) {
      console.error("Prompt generation failed:", e);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  }, [imageData]);

  const handleReset = () => {
    setMode(null);
    resetCommonState();
  };
  
  const handleNewImage = () => {
    resetCommonState();
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

  const renderContent = () => {
    if (!mode) {
      return <ModeSelector onSelect={handleModeSelect} />;
    }

    if (mode === ExtractionMode.PROMPT) {
       return (
        <div className="w-full max-w-2xl">
          <Extractor
            mode={mode}
            imageData={imageData}
            onImagePaste={handleImagePaste}
            onExtract={handlePromptRequest}
            onNewImage={handleNewImage}
            isLoading={isLoading}
          />
          <ResultDisplay
            isLoading={isLoading && !result}
            result={result}
            error={error}
            mode={mode}
          />
        </div>
      );
    }

    if (mode === ExtractionMode.TEXT) {
      return (
         <div className="w-full max-w-2xl">
           {!ocrText && !result && (
              <Extractor
                mode={mode}
                imageData={imageData}
                onImagePaste={handleImagePaste}
                onExtract={handleOcrRequest}
                onNewImage={handleNewImage}
                isLoading={isLoading}
              />
           )}
           {ocrText && !result && (
              <CorrectionStep
                ocrText={ocrText}
                onTextChange={setOcrText}
                onStructure={handleStructureRequest}
                isLoading={isLoading}
                onNewImage={handleNewImage}
              />
           )}
           <ResultDisplay
            isLoading={isLoading && !result && !!ocrText}
            result={result}
            error={error}
            mode={mode}
          />
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen text-light flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-grow">
        <Header onReset={handleReset} />
        <main className="flex-grow flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;