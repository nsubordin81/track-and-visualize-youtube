import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import YouTubeAnalytics from './components/YouTubeAnalytics';
import OAuth2Callback from './components/oauth2callback';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<YouTubeAnalytics />} />
          <Route path="/oauth2callback" element={<OAuth2Callback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;