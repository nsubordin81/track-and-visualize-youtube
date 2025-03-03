import React, { useEffect, useState, useRef } from 'react';
import { config } from '../config.js';

function YouTubeAnalytics() {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [scriptError, setScriptError] = useState(null);
    const buttonContainerRef = useRef(null);

    // First useEffect: Load the Google script
    useEffect(() => {
        const loadGoogleScript = () => {
            return new Promise((resolve, reject) => {
                if (window.google) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = "https://accounts.google.com/gsi/client";
                script.async = true;
                script.defer = true;
                
                script.onload = () => {
                    console.log("Script loaded successfully");
                    resolve();
                };
                
                script.onerror = (error) => {
                    console.error("Script failed to load:", error);
                    reject(error);
                };

                document.body.appendChild(script);
            });
        };

        loadGoogleScript()
            .then(() => setIsScriptLoaded(true))
            .catch(error => setScriptError(error));

        return () => {
            const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Second useEffect: Initialize Google Sign-In after script loads AND ref is available
    useEffect(() => {
        if (!isScriptLoaded || !buttonContainerRef.current) return;

        try {
            window.google.accounts.id.initialize({
                client_id: config.googleClientId,
                callback: handleCredentialResponse
            });

            window.google.accounts.id.renderButton(
                buttonContainerRef.current,
                {
                    type: 'standard',
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    shape: 'rectangular',
                    logo_alignment: 'left',
                    width: 250
                }
            );
        } catch (error) {
            console.error("Failed to initialize Google Sign-In:", error);
            setScriptError(error);
        }
    }, [isScriptLoaded]);

    const handleCredentialResponse = (response) => {
        console.log("Encoded JWT ID token: " + response.credential);
        setIsAuthenticated(true);
    };

    if (scriptError) {
        return <div>Error loading Google Sign-In: {scriptError.message}</div>;
    }

    return (
        <div className="youtube-analytics-container">
            {!isScriptLoaded ? (
                <div>Loading sign-in... (Check console for details)</div>
            ) : !isAuthenticated ? (
                <div 
                    ref={buttonContainerRef}
                    style={{ minHeight: '40px', display: 'flex', justifyContent: 'center' }}
                />
            ) : (
                <div>Authenticated!</div>
            )}
        </div>
    );
}

export default YouTubeAnalytics;