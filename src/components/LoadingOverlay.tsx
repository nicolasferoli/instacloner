
import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card p-8 rounded-xl w-[280px] flex flex-col items-center border border-border">
        <div className="w-16 h-16 border-4 border-instacloner-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-200">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
