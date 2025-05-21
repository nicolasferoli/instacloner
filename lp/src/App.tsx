import React, { useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import TrustSection from './components/TrustSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';

function App() {
  // Forçar o carregamento de todos os elementos na inicialização
  useEffect(() => {
    // Remover classes que possam estar causando carregamento lazy
    document.querySelectorAll('.gsap-section-title, .gsap-section-subtitle, .gsap-trust-card, .gsap-cta-title, .gsap-cta-subtitle, .gsap-main-cta')
      .forEach(el => {
        // Garantir que todos os elementos estejam visíveis desde o início
        el.classList.add('visible', 'opacity-100');
        el.classList.remove('opacity-0');
      });
  }, []);

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