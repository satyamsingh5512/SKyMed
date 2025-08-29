import React from 'react';

interface AeroVitaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AeroVitaLogo: React.FC<AeroVitaLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg`}>
      <div className="text-white font-bold text-lg">
        {size === 'sm' ? 'A' : size === 'md' ? 'AV' : 'AERO'}
      </div>
    </div>
  );
};

export default AeroVitaLogo;