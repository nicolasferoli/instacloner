import React from 'react';
import { Clock, Unlock, Ghost, MapPin } from 'lucide-react';
import FeatureCard from './ui/FeatureCard';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Clock />,
      title: "Monitoramento 24/7",
      description: "Acompanhe cada movimento em tempo real. Receba notificações instantâneas sobre novas atividades - postagens, stories, comentários, curtidas. Nada escapa do nosso sistema.",
      color: "text-instagram-purple",
      gradient: "from-instagram-purple/20 to-transparent"
    },
    {
      icon: <Unlock />,
      title: "Acesso a mensagens, stories e arquivados",
      description: "Visualize mensagens privadas, stories que desaparecem e até mesmo conteúdo arquivado. Tenha acesso total até mesmo a perfis privados, sem precisar de aprovação.",
      color: "text-instagram-pink",
      gradient: "from-instagram-pink/20 to-transparent"
    },
    {
      icon: <Ghost />,
      title: "100% invisível",
      description: "Nossa tecnologia avançada garante que seu monitoramento seja completamente invisível. Sem notificações, sem visualizações detectáveis, sem rastros digitais. Segurança absoluta.",
      color: "text-instagram-blue",
      gradient: "from-instagram-blue/20 to-transparent"
    },
    {
      icon: <MapPin />,
      title: "Localização em tempo real (beta)",
      description: "Recurso exclusivo: Descubra a localização exata do perfil monitorado em tempo real. Mesmo quando a localização não está compartilhada publicamente. (Recurso em fase beta)",
      color: "text-instagram-yellow",
      gradient: "from-instagram-yellow/20 to-transparent"
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden" id="features">
      <div className="absolute inset-0 -z-10 bg-dark-300"></div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            O Que O <span className="bg-clip-text text-transparent bg-insta-gradient">InstaCloner</span> Oferece?
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Vigilância completa, invisível e poderosa. Descubra tudo o que acontece no Instagram sem ser detectado.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconColor={feature.color}
              gradientClass={feature.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;