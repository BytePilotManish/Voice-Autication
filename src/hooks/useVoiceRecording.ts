import { useState, useCallback, useEffect } from 'react';
import { startRecording } from '../utils/voiceProcessing';
import { storeVoiceSample } from '../utils/db';

export const useVoiceRecording = (userId: string, phrase: string) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [error, setError] = useState<string>();
  const [stream, setStream] = useState<MediaStream>();
  const [isStoring, setIsStoring] = useState(false);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startNewRecording = useCallback(async () => {
    if (isStoring) return;

    try {
      setError(undefined);
      const mediaRecorder = await startRecording();
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const newRecordings = [...recordings, blob];
          setRecordings(newRecordings);
          
          if (newRecordings.length === 3) {
            setIsStoring(true);
            try {
              // Store each recording separately
              await Promise.all(newRecordings.map(async (recording) => {
                await storeVoiceSample({
                  userId,
                  audioData: recording,
                  timestamp: Date.now(),
                  phrase,
                });
              }));
              console.log('Successfully stored voice samples for user:', userId);
            } catch (err) {
              console.error('Failed to store recordings:', err);
              setError('Failed to store recordings. Please try again.');
            } finally {
              setIsStoring(false);
            }
          }
          
          setIsRecording(false);
        } catch (err) {
          setError('Failed to process recording. Please try again.');
          console.error('Recording processing error:', err);
        }
      };

      setStream(mediaRecorder.stream);
      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 5000);

    } catch (err) {
      setError('Failed to start recording. Please check your microphone permissions.');
      console.error('Recording error:', err);
    }
  }, [recordings, userId, phrase, isStoring]);

  const resetRecordings = useCallback(() => {
    setRecordings([]);
    setError(undefined);
  }, []);

  return {
    isRecording,
    recordings,
    error,
    stream,
    startNewRecording,
    resetRecordings,
    isStoring,
  };
};