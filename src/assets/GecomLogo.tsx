
import React from 'react';

interface GecomLogoProps {
  className?: string;
  size?: number;
}

export const GecomLogo: React.FC<GecomLogoProps> = ({ className = '', size = 48 }) => {
  return (
    <img
      src="/lovable-uploads/3ce91e14-27e4-47a1-b1f0-d19a2109cd33.png"
      alt="GECOM Logo"
      width={size}
      height={size}
      className={className}
    />
  );
};

export default GecomLogo;
