import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import YouTubeAnalytics from './components/YouTubeAnalytics';
import OAuth2Callback from './components/oauth2callback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<YouTubeAnalytics />} />
        <Route path="/oauth2callback" element={<OAuth2Callback />} />
      </Routes>
    </Router>
  );
}

export default App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)