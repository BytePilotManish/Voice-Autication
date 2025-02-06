import { extractFeatures } from './audio/features';
import { compareFeatures } from './audio/comparison';

export const startRecording = async (): Promise<MediaRecorder> => {
  const stream = await navigator.mediaDevices.getUserMedia({ 
    audio: { 
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 44100,
    } 
  });
  
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm',
  });
  
  return mediaRecorder;
};

export const calculateSimilarity = async (sample1: Blob, sample2: Blob): Promise<number> => {
  try {
    const features1 = await extractFeatures(sample1);
    const features2 = await extractFeatures(sample2);
    
    // Calculate similarity score
    const similarity = compareFeatures(features1, features2);
    
    // Apply minimum duration threshold (0.5 seconds)
    if (features1.duration < 0.5 || features2.duration < 0.5) {
      return similarity * 0.5; // Penalty for short recordings
    }
    
    // Scale to percentage and ensure bounds
    return Math.max(0, Math.min(100, similarity * 100));
  } catch (error) {
    console.error('Error calculating voice similarity:', error);
    throw new Error('Failed to compare voice samples');
  }
};