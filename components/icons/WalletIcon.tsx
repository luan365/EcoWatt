import React from 'react';

export const WalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19,4H5A3,3,0,0,0,2,7V17a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm0,2,0,4H5V7A1,1,0,0,1,6,6H18A1,1,0,0,1,19,6ZM5,17V12H19v5a1,1,0,0,1-1,1H6A1,1,0,0,1,5,17Z" />
    <path d="M16 15H14a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2z" />
  </svg>
);
