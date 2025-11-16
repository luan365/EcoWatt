import React from 'react';

// Este é o SVG oficial do Google
export const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="#4285F4"
      d="M24 9.5c3.54 0 6.7 1.7 8.57 4.14L37.74 8.5C33.6 4.8 28.18 2.5 22 2.5C13.5 2.5 6.3 7.6 3.8 14.9l6.1 4.8C11.5 14.5 17.2 9.5 24 9.5z"
    />
    <path
      fill="#34A853"
      d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h12.8c-.5 2.8-2.3 5.3-4.9 7l6.1 4.8c3.6-3.3 5.7-8.1 5.7-13.8z"
    />
    <path
      fill="#FBBC05"
      d="M10.1 28.5c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-6.1-4.8C2.5 17.6 1.5 20.7 1.5 24s1 6.4 3.5 9.3l6.1-4.8z"
    />
    <path
      fill="#EA4335"
      d="M24 45.5c5.1 0 9.4-1.7 12.6-4.6l-6.1-4.8c-1.7 1.2-3.9 1.9-6.5 1.9-6.8 0-12.5-5-14.1-11.7l-6.1 4.8C6.3 39.4 13.5 45.5 24 45.5z"
    />
  </svg>
);