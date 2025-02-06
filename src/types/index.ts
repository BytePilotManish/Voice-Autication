export interface VoiceSample {
  id?: number;
  userId: string;
  audioData: Blob;
  timestamp: number;
  phrase: string;
}

export interface AudioFeatures {
  waveform: Float32Array;
  energy: number;
  zeroCrossings: number;
  maxAmplitude: number;
  spectralCentroid: number;
  spectralFlatness: number;
  duration: number;
}

export interface AuthenticationResult {
  success: boolean;
  matchPercentage: number;
  message: string;
}