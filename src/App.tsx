import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Authenticate } from './pages/Authenticate';
import { VoiceToText } from './pages/VoiceToText';
import { Help } from './pages/Help';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/voice-to-text" element={<VoiceToText />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}

export default App;