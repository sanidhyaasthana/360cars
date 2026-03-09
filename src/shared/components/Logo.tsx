import React from 'react';
import { motion } from 'motion/react';
import { Car } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const logoHeights = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-14',
    xl: 'h-20'
  };

  const textHeights = {
    sm: 'h-7',
    md: 'h-8',
    lg: 'h-9',
    xl: 'h-14'
  };

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const [logoError, setLogoError] = React.useState(false);
  const [textError, setTextError] = React.useState(false);

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative flex items-center justify-center shrink-0"
      >
        {!logoError ? (
          <img
            src="/images/logo.png"
            alt="360Cars Logo"
            className={`${logoHeights[size]} w-auto object-contain`}
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
            <div className="absolute inset-0 bg-brand-yellow/15 blur-lg rounded-full" />
            <div className="relative z-10 w-full h-full rounded-xl border border-brand-yellow/40 overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center shadow-lg shadow-brand-yellow/10">
              <Car className="w-1/2 h-1/2 text-brand-yellow" />
            </div>
          </div>
        )}
      </motion.div>

      {showText && (
        <>
          {!textError ? (
            <img
              src="/images/text.png"
              alt="360Cars"
              className={`${textHeights[size]} w-auto object-contain hidden sm:block`}
              onError={() => setTextError(true)}
            />
          ) : (
            <div className="hidden sm:flex flex-col -space-y-1">
              <span className={`font-display font-black tracking-tighter text-white italic leading-none ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-3xl' : 'text-5xl'}`}>
                360
              </span>
              <span className={`font-bold tracking-[0.25em] text-brand-yellow uppercase ${size === 'sm' ? 'text-[5px]' : size === 'md' ? 'text-[7px]' : size === 'lg' ? 'text-[9px]' : 'text-[13px]'}`}>
                Cars
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
