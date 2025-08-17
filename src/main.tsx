import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupInteractionTracking } from './utils/accessibility'

// Initialize accessibility features
setupInteractionTracking();

createRoot(document.getElementById("root")!).render(<App />);
