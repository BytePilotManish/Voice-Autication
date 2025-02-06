import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
  isListening: boolean;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcript,
  isListening,
}) => {
  return (
    <div className="relative bg-gray-50 rounded-lg p-4 min-h-[200px] mb-4">
      {isListening && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-500">Recording...</span>
          </div>
        </div>
      )}
      <p className="text-gray-700 whitespace-pre-wrap">
        {transcript || 'Start speaking to see the text appear here...'}
      </p>
    </div>
  );
};