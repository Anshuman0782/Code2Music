// // src/main.jsx
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'


// createRoot(document.getElementById('root')).render(
 
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>

// )
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import InstallPrompt from './components/InstallPrompt.jsx'; // Import the component

function Root() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });

    window.addEventListener('appinstalled', () => {
      console.log('App installed!');
      setDeferredPrompt(null);
      setShowInstall(false);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setShowInstall(false);
      });
    }
  };

  return (
    <StrictMode>
      <BrowserRouter>
        <App />
        <InstallPrompt show={showInstall} onInstall={handleInstallClick} />
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
