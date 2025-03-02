import React, { useEffect, useState } from 'react';
import { config } from '../config.js';

function YouTubeAnalytics() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (window.google) {
      setIsGoogleLoaded(true);
      return;
    }

    window.onGoogleScriptLoad = () => {
      setIsGoogleLoaded(true);
    };
  }, []);

  const handleLogin = () => {
    if (!isGoogleLoaded) return;

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: config.googleClientId,
      scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly',
      callback: (response) => {
        if (response.access_token) {
          setIsAuthenticated(true);
          fetchYouTubeAnalytics(response.access_token);
        }
      },
      error_callback: (error) => {
        console.error('Auth error:', error);
      },
      redirect_uri: 'http://localhost:5173/oauth2callback'
    });

    client.requestAccessToken();
  };

  const fetchYouTubeAnalytics = async (accessToken) => {
    try {
      const response = await fetch(
        'https://youtubeanalytics.googleapis.com/v2/reports?dimensions=video&metrics=estimatedMinutesWatched,views,likes,subscribersGained&sort=-estimatedMinutesWatched&maxResults=10',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching YouTube Analytics:', error);
    }
  };

  if (!isGoogleLoaded) {
    return <div>Loading Google API...</div>;
  }

  if (!isAuthenticated) {
    return (
      <button onClick={handleLogin}>
        Sign in with Google
      </button>
    );
  }

  return <div>YouTube Analytics Loading...</div>;
}

export default YouTubeAnalytics;