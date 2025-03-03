import React, { useEffect, useState, useRef } from 'react';
import { config } from '../config.js';

function YouTubeAnalytics() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const buttonContainerRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            google.accounts.id.initialize({
                client_id: config.googleClientId,
                callback: handleCredentialResponse
            });
            console.log("Google API loaded");
            // Let Google render the button
            google.accounts.id.renderButton(
                buttonContainerRef.current,
                { theme: 'filled_blue', size: 'large' }  // Customization options
            );
            setIsLoading(false);
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleCredentialResponse = (response) => {
        console.log("Encoded JWT ID token: " + response.credential);
        setIsAuthenticated(true);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!isAuthenticated ? (
                <div ref={buttonContainerRef}></div>
            ) : (
                <div>Authenticated!</div>
            )}
        </div>
    );
}

export default YouTubeAnalytics;