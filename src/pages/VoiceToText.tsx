import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Download } from 'lucide-react';
import { Button } from '../components/Button';
import { TranscriptDisplay } from '../components/TranscriptDisplay';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const VoiceToText: React.FC = () => {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState('');

  const handleTranscriptResult = useCallback((newTranscript: string) => {
    setTranscript(newTranscript);
  }, []);

  const {
    isListening,
    error,
    toggleListening,
    isSupported,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    onResult: handleTranscriptResult,
  });

  const handleDownload = () => {
    if (!transcript) return;

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setTranscript('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Voice to Text
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!isSupported && (
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-6">
              Speech recognition is not supported in your browser. Please try using a modern browser like Chrome.
            </div>
          )}

          <div className="mb-8 space-y-4">
            <div className="flex justify-center space-x-4">
              <Button
                onClick={toggleListening}
                variant={isListening ? 'danger' : 'primary'}
                disabled={!isSupported}
                className="flex items-center"
              >
                <Mic className="w-5 h-5 mr-2" />
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </Button>

              {transcript && (
                <>
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    className="flex items-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Text
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="danger"
                  >
                    Clear
                  </Button>
                </>
              )}
            </div>
          </div>

          <TranscriptDisplay
            transcript={transcript}
            isListening={isListening}
          />

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Tips for better recognition:</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Speak clearly and at a normal pace</li>
              <li>Use a quiet environment</li>
              <li>Keep your microphone close</li>
              <li>Use proper punctuation commands (like "period", "comma", "question mark")</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};