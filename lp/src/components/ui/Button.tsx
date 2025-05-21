import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  href: string;
  variant: 'primary' | 'secondary';
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ children, href, variant, className = '' }) => {
  const baseStyles = 'inline-block py-3 px-8 rounded-full font-semibold transition-all duration-300 text-center';
  
  const variantStyles = {
    primary: 'bg-insta-gradient hover:shadow-insta hover:scale-105 text-white',
    secondary: 'bg-dark-300 border border-dark-100 hover:bg-dark-200 text-white'
  };
  
  return (
    <a 
      href={href} 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </a>
  );
};

export default Button;