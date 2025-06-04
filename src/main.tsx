
import { createRoot } from 'react-dom/client'
import { initializeFirebase } from './services/firebase'
import App from './App.tsx'
import './index.css'

// Initialize Firebase before rendering the app
try {
  initializeFirebase();
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

createRoot(document.getElementById("root")!).render(<App />);
