import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuth2Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = () => {
      // Extract token from URL hash if present
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');

      if (accessToken) {
        // Store the token securely (consider using a more secure method in production)
        sessionStorage.setItem('youtube_token', accessToken);
      }

      // Redirect back to the main page
      navigate('/');
    };

    handleCallback();
  }, [navigate]);

  return <div>Processing authentication...</div>;
}

export default OAuth2Callback;