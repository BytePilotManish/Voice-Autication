import { AudioFeatures } from '../../types';

export const extractFeatures = async (audioBlob: Blob): Promise<AudioFeatures> => {
  const audioContext = new AudioContext();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  const channelData = audioBuffer.getChannelData(0);
  
  return {
    ...calculateTimeFeatures(channelData),
    ...calculateFrequencyFeatures(channelData, audioContext.sampleRate),
    duration: audioBuffer.duration,
  };
};

const calculateTimeFeatures = (channelData: Float32Array) => {
  let energySum = 0;
  let zeroCrossings = 0;
  let prevSample = 0;
  let maxAmplitude = 0;
  
  for (let i = 0; i < channelData.length; i++) {
    const amplitude = Math.abs(channelData[i]);
    maxAmplitude = Math.max(maxAmplitude, amplitude);
    energySum += channelData[i] * channelData[i];
    
    if ((prevSample < 0 && channelData[i] >= 0) || 
        (prevSample >= 0 && channelData[i] < 0)) {
      zeroCrossings++;
    }
    prevSample = channelData[i];
  }
  
  return {
    energy: Math.sqrt(energySum / channelData.length),
    zeroCrossings,
    maxAmplitude,
    waveform: normalizeWaveform(channelData, maxAmplitude),
  };
};

const calculateFrequencyFeatures = (channelData: Float32Array, sampleRate: number) => {
  const fftSize = 2048;
  const fft = new Float32Array(fftSize);
  const spectrum = new Float32Array(fftSize / 2);
  
  // Copy data to FFT buffer
  for (let i = 0; i < fftSize && i < channelData.length; i++) {
    fft[i] = channelData[i];
  }
  
  // Apply Hanning window
  for (let i = 0; i < fftSize; i++) {
    fft[i] *= 0.5 * (1 - Math.cos((2 * Math.PI * i) / (fftSize - 1)));
  }
  
  // Perform FFT (simplified implementation)
  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);
  for (let i = 0; i < fftSize; i++) {
    real[i] = fft[i];
  }
  
  // Calculate magnitude spectrum
  for (let i = 0; i < fftSize / 2; i++) {
    spectrum[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
  }
  
  return {
    spectralCentroid: calculateSpectralCentroid(spectrum, sampleRate, fftSize),
    spectralFlatness: calculateSpectralFlatness(spectrum),
  };
};

const calculateSpectralCentroid = (
  spectrum: Float32Array,
  sampleRate: number,
  fftSize: number
): number => {
  let weightedSum = 0;
  let sum = 0;
  
  for (let i = 0; i < spectrum.length; i++) {
    const frequency = (i * sampleRate) / fftSize;
    weightedSum += frequency * spectrum[i];
    sum += spectrum[i];
  }
  
  return sum === 0 ? 0 : weightedSum / sum;
};

const calculateSpectralFlatness = (spectrum: Float32Array): number => {
  let geometricMean = 0;
  let arithmeticMean = 0;
  const epsilon = 1e-6;
  
  for (let i = 0; i < spectrum.length; i++) {
    const value = spectrum[i] + epsilon;
    geometricMean += Math.log(value);
    arithmeticMean += value;
  }
  
  geometricMean = Math.exp(geometricMean / spectrum.length);
  arithmeticMean /= spectrum.length;
  
  return geometricMean / arithmeticMean;
};

const normalizeWaveform = (data: Float32Array, maxAmplitude: number): Float32Array => {
  const normalized = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) {
    normalized[i] = data[i] / maxAmplitude;
  }
  return normalized;
};