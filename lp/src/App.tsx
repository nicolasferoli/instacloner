import React from 'react';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import TrustSection from './components/TrustSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-dark-gradient text-white font-sans">
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <TrustSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;