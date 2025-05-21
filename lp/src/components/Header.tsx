import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-300/95 backdrop-blur-md py-3 shadow-md' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/lp/Logo.svg" alt="InstaCloner" className="h-8" />
        </div>
        <a 
          href="#cta" 
          className="bg-insta-gradient py-2 px-6 rounded-full font-semibold text-sm transition-transform hover:scale-105 hover:shadow-insta"
        >
          Acessar Agora
        </a>
      </div>
    </header>
  );
};

export default Header;