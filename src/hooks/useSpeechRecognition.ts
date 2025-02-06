import { useState, useEffect, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
}

export const useSpeechRecognition = ({
  continuous = true,
  interimResults = true,
  onResult,
}: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string>('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize speech recognition
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition is not supported in this browser.');
      }

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = continuous;
      recognitionInstance.interimResults = interimResults;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        onResult?.(transcript);
      };

      recognitionInstance.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize speech recognition');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [continuous, interimResults, onResult]);

  const startListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.start();
      setIsListening(true);
      setError('');
    } catch (err) {
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.stop();
      setIsListening(false);
    } catch (err) {
      setError('Failed to stop speech recognition');
    }
  }, [recognition]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    error,
    toggleListening,
    startListening,
    stopListening,
    isSupported: !!recognition,
  };
};