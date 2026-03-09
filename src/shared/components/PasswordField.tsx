import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ label, className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t, isRtl } = useLanguage();

  return (
    <div className="w-full">
      {label && <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5 ml-1">{label}</label>}
      <div className="relative group">
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={className || `w-full px-3 ${isRtl ? 'pl-10' : 'pr-10'} py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-brand-yellow focus:border-transparent outline-none transition-all placeholder:text-zinc-700`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-yellow transition-colors z-10`}
          title={showPassword ? t.hidePassword : t.showPassword}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
