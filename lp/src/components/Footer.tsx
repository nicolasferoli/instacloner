import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-400 border-t border-dark-300 py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src="/lp/Logo.svg" alt="InstaCloner" className="h-8" />
          </div>
          
          <div>
            <ul className="flex flex-wrap gap-6 justify-center">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Suporte</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} - Todos os direitos reservados.
          </p>
          <p>
            O uso deste software é de total responsabilidade do usuário.
            Não nos responsabilizamos pelo uso indevido desta ferramenta.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;