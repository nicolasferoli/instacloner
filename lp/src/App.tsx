import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TrustSection from './components/TrustSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-dark-gradient text-white font-sans">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TrustSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;