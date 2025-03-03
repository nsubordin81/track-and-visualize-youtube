import React, { useEffect, useState } from 'react';
import { config } from '../config.js';
import { redirect } from 'react-router-dom';

function YouTubeAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeGoogleAuth = () => {
      window.gapi.client.init({
        apiKey: config.googleApiKey,
        clientId: config.googleClientId,
        discoveryDocs: ['https://youtubeanalytics.googleapis.com/$discovery/rest?version=v2'],
        scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly'
      }).then(() => {
        // Listen for sign-in state changes
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle initial sign-in state
        updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    };

    const updateSigninStatus = (isSignedIn) => {
      setIsAuthenticated(isSignedIn);
      if (isSignedIn) {
        const token = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
        fetchYouTubeAnalytics(token);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => window.gapi.load('client:auth2', initializeGoogleAuth);
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
      {!analyticsData && !isAuthenticated && (
        <button onClick={() => window.gapi.auth2.getAuthInstance().signIn()}>
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