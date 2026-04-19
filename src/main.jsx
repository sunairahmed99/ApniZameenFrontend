import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

import { SocketProvider } from './context/SocketContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
import { preloadCriticalData } from './utils/dataPreloader'
import './utils/axiosConfig';
import ErrorBoundary from './Components/Common/ErrorBoundary';

// Disable all console logs in production
if (import.meta.env.MODE === 'production') {
  console.log = () => { };
  console.warn = () => { };
  console.error = () => { };
  console.info = () => { };
  console.debug = () => { };
  console.trace = () => { };

  // Disable Right Click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Disable Keyboard Shortcuts for Inspect Element/View Source
  document.addEventListener('keydown', (e) => {
    // Disable F12
    if (e.key === 'F12') e.preventDefault();

    // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect/Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) {
      e.preventDefault();
    }

    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
    }
  });
}

// Preload critical data when app starts
preloadCriticalData();

import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'}>
      <Provider store={store}>
        <ErrorBoundary>
          <HelmetProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </HelmetProvider>
        </ErrorBoundary>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
