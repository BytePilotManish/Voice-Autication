import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, UserCheck, Type, HelpCircle } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Voice Authentication System
        </h1>
        <p className="text-xl text-center text-gray-700 mb-12">
          Secure your access using advanced voice recognition technology
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/register"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <Mic className="w-8 h-8 text-blue-600" />
              <h2 className="text-xl font-semibold ml-3">Register Voice</h2>
            </div>
            <p className="text-gray-600">
              Enroll your voice for secure authentication
            </p>
          </Link>

          <Link
            to="/authenticate"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <UserCheck className="w-8 h-8 text-green-600" />
              <h2 className="text-xl font-semibold ml-3">Authenticate</h2>
            </div>
            <p className="text-gray-600">
              Verify your identity using voice recognition
            </p>
          </Link>

          <Link
            to="/voice-to-text"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <Type className="w-8 h-8 text-purple-600" />
              <h2 className="text-xl font-semibold ml-3">Voice-to-Text</h2>
            </div>
            <p className="text-gray-600">
              Convert your speech to text in real-time
            </p>
          </Link>

          <Link
            to="/help"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <HelpCircle className="w-8 h-8 text-orange-600" />
              <h2 className="text-xl font-semibold ml-3">Help & FAQs</h2>
            </div>
            <p className="text-gray-600">
              Learn how to use the voice authentication system
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};