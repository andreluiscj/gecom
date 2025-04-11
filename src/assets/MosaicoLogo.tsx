
import React from 'react';

interface MosaicoLogoProps {
  className?: string;
  size?: number;
}

export const MosaicoLogo: React.FC<MosaicoLogoProps> = ({ className = '', size = 200 }) => {
  return (
    <img 
      src="/lovable-uploads/b81639ad-2b05-401a-8fbe-8b05c81df9ce.png"
      alt="Mosaico Logo"
      width={size}
      height={size * 0.6}
      className={className}
    />
  );
};

export default MosaicoLogo;
