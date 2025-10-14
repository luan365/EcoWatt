import React from 'react';

export const PlugIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M21,13H18V11h2a1,1,0,0,0,0-2H18.33A4,4,0,0,0,15,5.67V4a1,1,0,0,0-2,0V5.67A4,4,0,0,0,9.67,9H6a1,1,0,0,0,0,2H8v2H5a1,1,0,0,0,0,2H8v7a1,1,0,0,0,2,0V13h4v7a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2ZM11,9a2,2,0,0,1,4,0V11H11Z" />
  </svg>
);
