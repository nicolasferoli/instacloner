import React from 'react';
import { Lock, Zap, Shield } from 'lucide-react';
import Button from './ui/Button';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-16 pb-20 md:pt-20 md:pb-24 px-4 overflow-hidden relative" id="hero">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute h-40 w-40 rounded-full bg-instagram-purple/30 blur-3xl -top-10 -left-10"></div>
        <div className="absolute h-40 w-40 rounded-full bg-instagram-pink/20 blur-3xl top-20 right-10"></div>
        <div className="absolute h-40 w-40 rounded-full bg-instagram-blue/20 blur-3xl bottom-10 left-20"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            <img src="/lp/Logo.svg" alt="InstaCloner" className="max-w-[200px] md:max-w-[300px] mx-auto mb-16" />
            <span className="text-white">VIGILÂNCIA TOTAL DO INSTAGRAM</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Tenha controle absoluto sobre qualquer perfil do Instagram sem deixar rastros.
            O monitoramento mais poderoso e discreto jamais criado.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mb-12">
            <div className="bg-dark-300 rounded-xl p-6 border border-dark-100 shadow-lg transform transition-all hover:shadow-insta">
              <Zap className="w-10 h-10 text-instagram-yellow mb-3 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">ACESSO COMPLETO</h3>
              <p className="text-gray-400">a qualquer perfil - até privados</p>
            </div>
            
            <div className="bg-dark-300 rounded-xl p-6 border border-dark-100 shadow-lg transform transition-all hover:shadow-insta">
              <Shield className="w-10 h-10 text-instagram-blue mb-3 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">ZERO RASTROS</h3>
              <p className="text-gray-400">Eles NUNCA vão descobrir</p>
            </div>
            
            <div className="bg-dark-300 rounded-xl p-6 border border-dark-100 shadow-lg transform transition-all hover:shadow-insta">
              <Lock className="w-10 h-10 text-instagram-purple mb-3 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">7 DIAS DE GARANTIA</h3>
              <p className="text-gray-400">Teste sem medo</p>
            </div>
          </div>
          
          <Button href="#cta" variant="primary">
            ⚡ Garanta Seu Acesso Agora!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;