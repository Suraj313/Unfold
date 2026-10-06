import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ValueSection } from '../components/landing/ValueSection';
import { LearningLoop } from '../components/landing/LearningLoop';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeatureShowcase } from '../components/landing/FeatureShowcase';
import { RagSection } from '../components/landing/RagSection';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-bg-main font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main>
        <HeroSection />
        <ValueSection />
        <LearningLoop />
        <HowItWorks />
        <FeatureShowcase />
        <RagSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
