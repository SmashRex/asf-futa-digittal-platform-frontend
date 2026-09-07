/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'maroon' | 'white' | 'monochrome';
  variant?: 'symbol' | 'full' | 'compact';
  customLogoUrl?: string;
}

export default function Logo({ 
  size = 'md', 
  theme = 'maroon', 
  variant = 'symbol',
  customLogoUrl 
}: LogoProps) {
  const [imageError, setImageError] = useState(false);

  const getDimensions = () => {
    switch (size) {
      case 'xs': return 'w-6 h-6';
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-20 h-20';
      case 'xl': return 'w-28 h-28';
      case 'md':
      default: return 'w-12 h-12';
    }
  };

  const getColor = () => {
    switch (theme) {
      case 'white': return '#FFFFFF';
      case 'dark': return '#2B2622';
      case 'monochrome': return 'currentColor';
      case 'maroon':
      default: return '#7A1F2B';
    }
  };

  const getTextColorClass = () => {
    switch (theme) {
      case 'white': return 'text-white';
      case 'dark': return 'text-[#2B2622]';
      case 'monochrome': return 'text-current';
      case 'maroon':
      default: return 'text-[#7A1F2B]';
    }
  };

  // SVG Crest markup
  const renderCrest = () => (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      id="asf-logo-svg"
    >
      {/* Outer Ring */}
      <circle 
        cx="50" 
        cy="50" 
        r="46" 
        stroke={getColor()} 
        strokeWidth="3.5" 
        fill="none"
      />
      
      {/* Inner concentric ring */}
      <circle 
        cx="50" 
        cy="50" 
        r="41" 
        stroke={getColor()} 
        strokeWidth="1" 
        strokeDasharray="2 2"
        fill="none"
      />
      
      {/* Holy Cross */}
      <path 
        d="M50 18V66" 
        stroke={getColor()} 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      <path 
        d="M36 32H64" 
        stroke={getColor()} 
        strokeWidth="4" 
        strokeLinecap="round"
      />

      {/* Open Bible Pages */}
      <path 
        d="M26 76C34 76 43 72 50 66C57 72 66 76 74 76" 
        stroke={getColor()} 
        strokeWidth="3" 
        strokeLinecap="round" 
        fill="none"
      />
      <path 
        d="M26 62C34 62 43 58 50 52C57 58 66 62 74 62" 
        stroke={getColor()} 
        strokeWidth="3" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Graduation cap */}
      <path 
        d="M50 22L70 30L50 38L30 30L50 22Z" 
        fill={getColor()} 
        opacity="0.85"
      />
      
      {/* Cap tassel detail */}
      <path 
        d="M70 30V44L72 46" 
        stroke={getColor()} 
        strokeWidth="1.5" 
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  const renderLogoMedia = () => {
    if (customLogoUrl && !imageError) {
      return (
        <img
          src={customLogoUrl}
          alt="Anglican Students' Fellowship Logo"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain"
        />
      );
    }
    return renderCrest();
  };

  if (variant === 'symbol') {
    return (
      <div className={`flex items-center justify-center ${getDimensions()} select-none shrink-0`} id="asf-logo-container">
        {renderLogoMedia()}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 select-none" id="asf-branded-logo">
      <div className={`flex items-center justify-center ${getDimensions()} shrink-0`}>
        {renderLogoMedia()}
      </div>
      
      <div className="flex flex-col justify-center text-left">
        {variant === 'full' ? (
          <>
            <span className={`font-serif font-bold leading-tight ${getTextColorClass()} ${
              size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-base'
            }`}>
              Anglican Students' Fellowship
            </span>
            <span className="text-[9px] font-bold tracking-widest uppercase text-[var(--color-text-secondary)]">
              FUTA Chapter • Divine Light
            </span>
          </>
        ) : (
          <span className={`font-sans font-bold uppercase tracking-wider leading-none ${getTextColorClass()} ${
            size === 'xs' ? 'text-[11px]' : 'text-sm'
          }`}>
            ASF FUTA
          </span>
        )}
      </div>
    </div>
  );
}

