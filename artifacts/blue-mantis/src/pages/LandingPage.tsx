import '../landing.css';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import HowItWorks from '../components/HowItWorks';
import ProductSection from '../components/ProductSection';
import ProofSection from '../components/ProofSection';
import ROICalculator from '../components/ROICalculator';
import IntegrationsSection from '../components/IntegrationsSection';
import PricingSection from '../components/PricingSection';
import Footer from '../components/Footer';

/**
 * Full marketing landing page (the original Blue Mantis homepage).
 *
 * This is NOT the active homepage yet — the waitlist / coming-soon page owns `/`
 * until launch. Flip the LAUNCHED switch in App.tsx to make this the homepage.
 * Until then it stays reviewable at /preview.
 *
 * Visual language: cinematic dark + glassmorphism over an ambient aurora backdrop.
 * Shared primitives live in `src/landing.css` (`.lp-*`).
 */
export default function LandingPage() {
  return (
    <div className="lp-root">
      {/* Fixed ambient backdrop — aurora blobs + grid, behind all content */}
      <div className="lp-backdrop" aria-hidden="true">
        <div className="lp-grid" />
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />
        <div className="lp-blob lp-blob-3" />
      </div>

      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <HowItWorks />
        <ProductSection />
        <ProofSection />
        <ROICalculator />
        <IntegrationsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
