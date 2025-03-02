import React, { useEffect, useState } from 'react';
import { config } from '../config.js';
import { redirect } from 'react-router-dom';

function YouTubeAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    const initializeGoogleAuth = () => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: config.googleClientId,
        redirect_uri: 'http://localhost:5173/oauth2callback',
        scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly',
        callback: (response) => {
          if (response?.access_token) {
            fetchYouTubeAnalytics(response.access_token);
          }
        }
      });
      setTokenClient(client);
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initializeGoogleAuth;
    document.body.appendChild(script);

    return () => document.body.removeChild(script);
  }, []);

  const fetchYouTubeAnalytics = async (token) => {
    try {
      const response = await fetch(
        'https://youtubeanalytics.googleapis.com/v2/reports?dimensions=video&metrics=estimatedMinutesWatched,views,likes,subscribersGained&sort=-estimatedMinutesWatched&maxResults=10',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAnalyticsData(await response.json());
    } catch (error) {
      console.error('Error fetching YouTube Analytics:', error);
    }
  };

  return (
    <div>
      {!analyticsData && tokenClient && (
        <button onClick={() => tokenClient.requestAccessToken()}>
          Sign in with Google
        </button>
      )}
      {analyticsData && (
        <pre>{JSON.stringify(analyticsData, null, 2)}</pre>
      )}
    </div>
  );
}

export default YouTubeAnalytics;