import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Help: React.FC = () => {
  const navigate = useNavigate();

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
            Help & FAQs
          </h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                How to Register Your Voice
              </h2>
              <p className="text-gray-600">
                1. Navigate to the Register page<br />
                2. Click the "Start Recording" button<br />
                3. Speak the displayed phrase clearly three times<br />
                4. Wait for confirmation of successful registration
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Authentication Process
              </h2>
              <p className="text-gray-600">
                1. Go to the Authentication page<br />
                2. Click "Start Authentication"<br />
                3. Speak the same phrase used during registration<br />
                4. View your authentication results
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Voice-to-Text Feature
              </h2>
              <p className="text-gray-600">
                1. Navigate to the Voice-to-Text page<br />
                2. Click "Start Listening"<br />
                3. Speak clearly into your microphone<br />
                4. Your speech will be converted to text in real-time
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Troubleshooting
              </h2>
              <ul className="list-disc list-inside text-gray-600">
                <li>Ensure your microphone is properly connected and enabled</li>
                <li>Speak clearly and at a consistent volume</li>
                <li>Use the same phrase and tone during authentication</li>
                <li>Try in a quiet environment for better results</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};