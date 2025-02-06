import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RecordingStatusProps {
  currentRecording: number;
  totalRecordings: number;
  isRecording: boolean;
  error?: string;
}

export const RecordingStatus: React.FC<RecordingStatusProps> = ({
  currentRecording,
  totalRecordings,
  isRecording,
  error,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-center space-x-2 mb-4">
        {Array.from({ length: totalRecordings }).map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full ${
              index < currentRecording
                ? 'bg-green-500'
                : index === currentRecording && isRecording
                ? 'bg-red-500 animate-pulse'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      {error ? (
        <div className="flex items-center justify-center text-red-500">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      ) : currentRecording < totalRecordings ? (
        <p className="text-center text-gray-600">
          Recording {currentRecording + 1} of {totalRecordings}
        </p>
      ) : (
        <div className="flex items-center justify-center text-green-500">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>All recordings complete!</span>
        </div>
      )}
    </div>
  );
};