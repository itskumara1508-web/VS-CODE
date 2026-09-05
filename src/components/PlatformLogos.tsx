import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

// 1. Official X (Twitter) Vector Logo
export const XLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    className={`fill-current ${className}`}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// 2. Official Telegram Vector Logo
export const TelegramLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    className={`fill-current ${className}`}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.18 3.35-1.39 3.73-1.39.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .28z" />
  </svg>
);

// 3. Official Instagram Vector Logo with Authentic Gradient Defs
export const InstagramLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    className={className}
  >
    <defs>
      <radialGradient id="igGradient" cx="20%" cy="100%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#igGradient)" />
    <path
      d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-8.3a1.17 1.17 0 11-2.34 0 1.17 1.17 0 012.34 0z"
      fill="#ffffff"
    />
    <rect
      x="3.5"
      y="3.5"
      width="17"
      height="17"
      rx="4.5"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.6"
    />
  </svg>
);

// 4. Official Facebook Vector Logo
export const FacebookLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    className={`fill-current ${className}`}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// 5. Official Reddit Snoo Vector Logo
export const RedditLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    className={`fill-current ${className}`}
  >
    <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-1.293 3.88a.75.75 0 00.949.948l3.88-1.293A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.814 14.59c.046.262.07.531.07.805 0 2.87-3.084 5.2-6.884 5.2-3.8 0-6.884-2.33-6.884-5.2 0-.274.024-.543.07-.805a2.247 2.247 0 01-1.072-1.916c0-1.24 1.008-2.25 2.25-2.25.617 0 1.176.25 1.58.653 1.135-.783 2.64-1.295 4.312-1.365l.777-3.655 2.544.54a1.75 1.75 0 11.233.974l-2.023-.43-.598 2.813c1.713.06 3.255.578 4.414 1.378a2.24 2.24 0 011.597-.678c1.242 0 2.25 1.01 2.25 2.25 0 .8-.423 1.503-1.066 1.91zM9.5 13.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zm6.25-1.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm-6.666 4.412a.625.625 0 00.832.924c.73-.657 1.745-1.026 2.834-1.026s2.104.369 2.834 1.026a.625.625 0 00.832-.924c-.932-.84-2.213-1.312-3.666-1.312s-2.734.472-3.666 1.312z" />
  </svg>
);

// 6. Official YouTube Vector Logo
export const YoutubeLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    className={`fill-current ${className}`}
  >
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const getPlatformIcon = (platform: string, className = 'w-5 h-5') => {
  switch (platform.toLowerCase()) {
    case 'x':
    case 'twitter':
      return <XLogo className={className} />;
    case 'telegram':
      return <TelegramLogo className={className} />;
    case 'instagram':
      return <InstagramLogo className={className} />;
    case 'facebook':
      return <FacebookLogo className={className} />;
    case 'reddit':
      return <RedditLogo className={className} />;
    case 'youtube':
      return <YoutubeLogo className={className} />;
    default:
      return null;
  }
};

