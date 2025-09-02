import React from 'react';

interface SkyMedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SkyMedLogo: React.FC<SkyMedLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg`}>
      <div className="text-white font-bold text-lg">
        {size === 'sm' ? 'S' : size === 'md' ? 'SM' : 'SKY'}
      </div>
    </div>
  );
};

export default SkyMedLogo;