import React from 'react';
import Button from './ui/Button';
import { Check } from 'lucide-react';

const CtaSection: React.FC = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden" id="cta">
      {/* Background effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute h-60 w-60 rounded-full bg-instagram-purple/20 blur-3xl -bottom-20 -right-20"></div>
        <div className="absolute h-40 w-40 rounded-full bg-instagram-pink/10 blur-3xl top-10 left-10"></div>
      </div>
      
      <div className="container mx-auto max-w-4xl">
        <div className="bg-dark-300 border border-dark-100 rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Comece Sua Vigilância Total Agora
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Acesso imediato após o pagamento. Interface intuitiva que não requer conhecimentos técnicos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="text-xl font-bold mb-4 text-instagram-yellow">Incluso no seu acesso:</h3>
              <ul className="space-y-3">
                {[
                  "Monitoramento 24/7 de perfis ilimitados",
                  "Acesso a conteúdo privado e stories",
                  "Visibilidade de mensagens diretas",
                  "Alertas em tempo real",
                  "Histórico completo de atividades",
                  "Suporte técnico especializado",
                  "Atualizações gratuitas"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-instagram-pink mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col justify-center items-center bg-dark-400 rounded-xl p-8">
              <div className="mb-6 text-center">
                <p className="text-gray-400 mb-1">Preço normal</p>
                <p className="text-2xl line-through text-gray-500">R$297,00</p>
                <p className="text-gray-400 mt-4 mb-1">Oferta por tempo limitado</p>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold mr-2">R$37</span>
                  <span className="text-gray-400">,00</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Pagamento único - sem mensalidades</p>
              </div>
              
              <Button href="https://pay.kirvano.com/6dda2ecf-0536-436b-ae34-179117c75e4e" variant="primary" className="w-full text-center">
                QUERO ACESSO TOTAL!
              </Button>
              
              <p className="text-sm text-gray-400 mt-4 text-center">
                Garantia de 7 dias ou seu dinheiro de volta
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Seus dados de pagamento são protegidos por criptografia de ponta a ponta.
              Trabalhamos com as plataformas de pagamento mais seguras do mercado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;