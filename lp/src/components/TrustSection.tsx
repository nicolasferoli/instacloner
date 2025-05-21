import React from 'react';
import { ShieldCheck, Clock, HeartHandshake } from 'lucide-react';

const TrustSection: React.FC = () => {
  return (
    <section className="py-20 px-4" id="trust">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 gsap-section-title">
            Por Que Confiar No <span className="text-instagram-pink">InstaCloner</span>?
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto gsap-section-subtitle">
            Anos de experiência em segurança digital e tecnologia avançada garantem sua tranquilidade.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="gsap-trust-card bg-dark-300 rounded-xl p-8 border border-dark-100 shadow-lg">
            <ShieldCheck className="w-12 h-12 text-instagram-blue mb-4" />
            <h3 className="text-xl font-semibold mb-3">Tecnologia Segura</h3>
            <p className="text-gray-400">
              Nosso sistema utiliza criptografia de ponta a ponta e protocolos de segurança avançados para garantir que suas atividades permaneçam 100% anônimas.
            </p>
          </div>
          
          <div className="gsap-trust-card bg-dark-300 rounded-xl p-8 border border-dark-100 shadow-lg">
            <Clock className="w-12 h-12 text-instagram-purple mb-4" />
            <h3 className="text-xl font-semibold mb-3">Suporte 24/7</h3>
            <p className="text-gray-400">
              Nossa equipe de especialistas está disponível 24 horas por dia, 7 dias por semana, para ajudar com qualquer dúvida ou necessidade técnica.
            </p>
          </div>
          
          <div className="gsap-trust-card bg-dark-300 rounded-xl p-8 border border-dark-100 shadow-lg">
            <HeartHandshake className="w-12 h-12 text-instagram-pink mb-4" />
            <h3 className="text-xl font-semibold mb-3">Garantia Total</h3>
            <p className="text-gray-400">
              Oferecemos 7 dias de garantia completa. Se não ficar satisfeito com os resultados, devolvemos 100% do seu investimento, sem questionamentos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;