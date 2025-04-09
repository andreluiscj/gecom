
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
      <rect width="48" height="48" rx="8" fill="#9b87f5" />
      <path
        d="M33 16L24 25L15 16"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 16H33V30C33 30.5304 32.7893 31.0391 32.4142 31.4142C32.0391 31.7893 31.5304 32 31 32H17C16.4696 32 15.9609 31.7893 15.5858 31.4142C15.2107 31.0391 15 30.5304 15 30V16Z"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 25V32"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 25V32"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default GecomLogo;
