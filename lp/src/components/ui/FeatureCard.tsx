import React from 'react';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
  gradientClass: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  iconColor,
  gradientClass,
}) => {
  return (
    <div className="bg-dark-400 rounded-xl p-8 border border-dark-100 shadow-lg relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-10`}></div>
      
      <div className="relative z-10">
        <div className={`${iconColor} w-12 h-12 mb-4 flex items-center justify-center`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-3">
          <span className="bg-clip-text text-transparent bg-insta-gradient">✅</span> {title}
        </h3>
        
        <p className="text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;