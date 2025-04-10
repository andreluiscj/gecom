
import React from 'react';

interface GecomLogoProps {
  className?: string;
  size?: number;
}

export const GecomLogo: React.FC<GecomLogoProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="8" fill="#FFFFFF" />
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#9b87f5"
        fontSize="28"
        fontWeight="bold"
      >
        $
      </text>
    </svg>
  );
};

export default GecomLogo;
