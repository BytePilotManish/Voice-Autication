import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioWaveform } from '../components/AudioWaveform';
import { RecordingStatus } from '../components/RecordingStatus';
import { useVoiceRecording } from '../hooks/useVoiceRecording';

const AUTHENTICATION_PHRASE = "Access Granted";
const REQUIRED_RECORDINGS = 3;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [userId] = useState(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) return storedId;
    const newId = `user_${Date.now()}`;
    localStorage.setItem('userId', newId);
    return newId;
  });

  useEffect(() => {
    // Ensure userId is always in localStorage
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  const { isRecording, recordings, error, stream, startNewRecording, isStoring } = 
    useVoiceRecording(userId, AUTHENTICATION_PHRASE);

  const handleRecord = () => {
    if (recordings.length < REQUIRED_RECORDINGS && !isStoring) {
      startNewRecording();
    }
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
            Voice Registration
          </h1>

          <div className="mb-8">
            <p className="text-center text-gray-600 mb-4">
              Please read the following phrase three times:
            </p>
            <p className="text-center text-xl font-semibold text-blue-600 mb-4">
              "{AUTHENTICATION_PHRASE}"
            </p>
          </div>

          <RecordingStatus
            currentRecording={recordings.length}
            totalRecordings={REQUIRED_RECORDINGS}
            isRecording={isRecording}
            error={error}
          />

          <AudioWaveform isRecording={isRecording} stream={stream} />

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleRecord}
              disabled={isRecording || isStoring || recordings.length >= REQUIRED_RECORDINGS}
              isLoading={isRecording || isStoring}
              className="flex items-center"
            >
              <Mic className="w-5 h-5 mr-2" />
              {recordings.length >= REQUIRED_RECORDINGS
                ? 'Registration Complete'
                : isRecording
                ? 'Recording...'
                : isStoring
                ? 'Storing...'
                : 'Start Recording'}
            </Button>
          </div>

          {recordings.length >= REQUIRED_RECORDINGS && !isStoring && (
            <div className="mt-6 text-center">
              <p className="text-green-600 mb-4">
                Voice registration successful! You can now proceed to authentication.
              </p>
              <Button
                variant="secondary"
                onClick={() => navigate('/authenticate')}
              >
                Proceed to Authentication
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};