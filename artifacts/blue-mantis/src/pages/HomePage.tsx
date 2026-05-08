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

export default function HomePage() {
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
