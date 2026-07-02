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
 */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <ProductSection />
      <ProofSection />
      <ROICalculator />
      <IntegrationsSection />
      <PricingSection />
      <Footer />
    </>
  );
}
