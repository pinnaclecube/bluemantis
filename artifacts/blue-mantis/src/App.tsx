import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import SecurityPage from './pages/SecurityPage';

/* ──────────────────────────────────────────────────────────────────────────
   LAUNCH SWITCH — flip this one flag to go live.

   false → waitlist / coming-soon page is the homepage (`/`).
           The full marketing site stays previewable at `/preview`.
   true  → full marketing landing page becomes the homepage (`/`).
           The waitlist page remains reachable at `/waitlist`.
   ────────────────────────────────────────────────────────────────────────── */
const LAUNCHED = false;

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={LAUNCHED ? <LandingPage /> : <HomePage />} />
        <Route path="/preview" element={<LandingPage />} />
        <Route path="/waitlist" element={<HomePage />} />
        <Route path="/security" element={<SecurityPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
