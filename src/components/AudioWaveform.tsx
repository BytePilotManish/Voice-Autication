import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isRecording: boolean;
  stream?: MediaStream;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ isRecording, stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isRecording || !stream || !canvasRef.current) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d')!;

    const draw = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      const sliceWidth = WIDTH / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * HEIGHT / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();

    return () => {
      source.disconnect();
      audioContext.close();
    };
  }, [isRecording, stream]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-32 bg-gray-100 rounded-lg"
      width={600}
      height={128}
    />
  );
};