
import React from 'react';

interface GecomLogoProps {
  className?: string;
  size?: number;
}

export const GecomLogo: React.FC<GecomLogoProps> = ({ className = '', size = 48 }) => {
  return (
    <img
      src="/lovable-uploads/d6c59aa6-5f8d-498d-92db-f4a917a2f5b3.png"
      alt="GECOM Logo"
      width={size}
      height={size}
      className={className}
    />
  );
};

export default GecomLogo;
