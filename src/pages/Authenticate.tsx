import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioWaveform } from '../components/AudioWaveform';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import { getVoiceSamples, deleteDatabase } from '../utils/db';
import { calculateSimilarity } from '../utils/voiceProcessing';

const AUTHENTICATION_PHRASE = "Access Granted";

export const Authenticate: React.FC = () => {
  const navigate = useNavigate();
  const [userId] = useState(() => {
    const storedId = localStorage.getItem('userId');
    if (!storedId) {
      navigate('/register');
      return '';
    }
    return storedId;
  });

  useEffect(() => {
    if (!userId) {
      navigate('/register');
    }
  }, [userId, navigate]);

  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
  const [authError, setAuthError] = useState<string>('');
  const { isRecording, recordings, error, stream, startNewRecording, resetRecordings } = 
    useVoiceRecording(userId, AUTHENTICATION_PHRASE);

  const handleAuthenticate = async () => {
    try {
      setAuthError('');
      
      if (recordings.length === 0) {
        startNewRecording();
        return;
      }

      const storedSamples = await getVoiceSamples(userId);
      console.log('Retrieved samples for user:', userId, storedSamples?.length);
      
      if (!storedSamples || storedSamples.length === 0) {
        setAuthError('No voice samples found. Please register first.');
        return;
      }

      const currentRecording = recordings[0];
      const storedSample = storedSamples[storedSamples.length - 1];
      
      if (!currentRecording || !storedSample?.audioData) {
        setAuthError('Invalid recording data. Please try again.');
        return;
      }

      const similarity = await calculateSimilarity(currentRecording, storedSample.audioData);
      setMatchPercentage(similarity);
    } catch (err) {
      console.error('Authentication error:', err);
      if (err instanceof Error && err.message.includes('index')) {
        try {
          await deleteDatabase();
          setAuthError('Database error occurred. Please register again.');
          navigate('/register');
        } catch (deleteErr) {
          setAuthError('A critical error occurred. Please refresh the page.');
        }
      } else {
        setAuthError('Authentication failed. Please try again.');
      }
    }
  };

  const handleReset = () => {
    setMatchPercentage(null);
    setAuthError('');
    resetRecordings();
  };

  const getStatusColor = () => {
    if (!matchPercentage) return '';
    if (matchPercentage >= 90) return 'text-green-600';
    if (matchPercentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusMessage = () => {
    if (!matchPercentage) return '';
    if (matchPercentage >= 90) return 'Authentication successful!';
    if (matchPercentage >= 70) return 'Close match. Please try again.';
    return 'Authentication failed. Please try again.';
  };

  if (!userId) {
    return null;
  }

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
            Voice Authentication
          </h1>

          <div className="mb-8">
            <p className="text-center text-gray-600 mb-4">
              Please say the following phrase:
            </p>
            <p className="text-center text-xl font-semibold text-blue-600 mb-4">
              "{AUTHENTICATION_PHRASE}"
            </p>
          </div>

          {(error || authError) && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error || authError}
            </div>
          )}

          <AudioWaveform isRecording={isRecording} stream={stream} />

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleAuthenticate}
              disabled={isRecording}
              isLoading={isRecording}
              className="flex items-center"
            >
              <Mic className="w-5 h-5 mr-2" />
              {isRecording ? 'Recording...' : 'Start Authentication'}
            </Button>
          </div>

          {matchPercentage !== null && (
            <div className="mt-6 text-center">
              <p className={`text-lg font-semibold ${getStatusColor()}`}>
                {getStatusMessage()}
              </p>
              <p className="text-gray-600 mt-2">
                Match Percentage: {matchPercentage.toFixed(1)}%
              </p>
              {matchPercentage < 90 && (
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  className="mt-4"
                >
                  Try Again
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};