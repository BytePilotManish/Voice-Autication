import { AudioFeatures } from '../../types';

const WEIGHTS = {
  waveform: 0.3,
  energy: 0.15,
  zeroCrossings: 0.15,
  spectralCentroid: 0.2,
  spectralFlatness: 0.2,
};

export const compareFeatures = (features1: AudioFeatures, features2: AudioFeatures): number => {
  const similarities = {
    waveform: compareWaveforms(features1.waveform, features2.waveform),
    energy: compareValues(features1.energy, features2.energy),
    zeroCrossings: compareValues(
      features1.zeroCrossings / features1.duration,
      features2.zeroCrossings / features2.duration
    ),
    spectralCentroid: compareValues(features1.spectralCentroid, features2.spectralCentroid),
    spectralFlatness: compareValues(features1.spectralFlatness, features2.spectralFlatness),
  };

  let totalSimilarity = 0;
  for (const [feature, similarity] of Object.entries(similarities)) {
    totalSimilarity += similarity * WEIGHTS[feature as keyof typeof WEIGHTS];
  }

  // Apply duration penalty
  const durationDiff = Math.abs(features1.duration - features2.duration);
  const durationPenalty = Math.max(0, 1 - durationDiff / Math.max(features1.duration, features2.duration));
  
  return totalSimilarity * durationPenalty;
};

const compareWaveforms = (waveform1: Float32Array, waveform2: Float32Array): number => {
  const targetLength = Math.min(waveform1.length, waveform2.length);
  const step1 = waveform1.length / targetLength;
  const step2 = waveform2.length / targetLength;
  
  let similarity = 0;
  let totalComparisons = 0;
  
  for (let i = 0; i < targetLength; i++) {
    const idx1 = Math.floor(i * step1);
    const idx2 = Math.floor(i * step2);
    
    if (idx1 < waveform1.length && idx2 < waveform2.length) {
      const diff = Math.abs(waveform1[idx1] - waveform2[idx2]);
      similarity += (1 - diff);
      totalComparisons++;
    }
  }
  
  return similarity / totalComparisons;
};

const compareValues = (value1: number, value2: number): number => {
  const maxValue = Math.max(Math.abs(value1), Math.abs(value2));
  if (maxValue === 0) return 1;
  return 1 - Math.abs(value1 - value2) / maxValue;
};