import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogIn,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Store,
  UserCircle,
  Phone,
  User as UserIcon,
  Lock,
  Car as CarIcon,
  Layers,
  ArrowLeft,
  Paperclip
} from 'lucide-react';
import { Logo } from './Logo';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthActions } from '../hooks/useAuthActions';
import { Role } from '../types/common.types';
import { PasswordField } from './PasswordField';

interface AuthFormProps {
  audience: 'INDIVIDUALS' | 'BUSINESSES';
}

export const AuthForm: React.FC<AuthFormProps> = ({ audience }) => {
  const { lang, t, isRtl } = useLanguage();
  const navigate = useNavigate();
  const [type, setType] = useState<'login' | 'register'>('login');
  const { handleLogin, handleRegister, notification, setNotification } = useAuthActions();
  const [selectedRole, setSelectedRole] = useState<Role>(audience === 'INDIVIDUALS' ? 'CUSTOMER' : 'BUSINESS_OWNER');

  useEffect(() => {
    setSelectedRole(audience === 'INDIVIDUALS' ? 'CUSTOMER' : 'BUSINESS_OWNER');
  }, [audience]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const inputIconClass = "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-brand-yellow transition-colors pointer-events-none";
  const inputBaseClass = `w-full py-2 rounded-xl bg-black/50 border border-white/[0.06] text-white text-sm focus:ring-2 focus:ring-brand-yellow/30 focus:border-brand-yellow/50 outline-none transition-all placeholder:text-zinc-600 hover:border-white/10`;

  return (
    <div className={`fixed inset-0 z-[100] bg-[#0B0B0B] flex items-center justify-center p-3 sm:p-4 overflow-y-auto ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-yellow/3 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full relative z-10 ${type === 'register' ? 'max-w-2xl' : 'max-w-lg'}`}
      >
        {/* Header Section */}
        <div className="text-center mb-3 shrink-0">
          <div className="flex justify-center mb-1.5">
            <Logo size="sm" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold gold-gradient mb-0.5">
            {type === 'login' ? t.loginTitle : t.registerTitle}
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">
            {lang === 'ar' ? 'نظام العناية الفائقة بالسيارات' : 'Premium Car Care Ecosystem'}
          </p>
        </div>

        {/* Main Card */}
        <div className="premium-card p-4 sm:p-5">
          {/* Type Switcher (Login/Register) */}
          <div className="flex bg-black/50 p-0.5 rounded-xl border border-white/[0.06] mb-3">
            <button
              onClick={() => setType('login')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                type === 'login'
                  ? 'bg-gradient-to-r from-brand-yellow to-yellow-500 text-zinc-950 shadow-lg shadow-brand-yellow/20'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              {t.login}
            </button>
            <button
              onClick={() => setType('register')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                type === 'register'
                  ? 'bg-gradient-to-r from-brand-yellow to-yellow-500 text-zinc-950 shadow-lg shadow-brand-yellow/20'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              {t.register}
            </button>
          </div>

          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setSelectedRole('CUSTOMER')}
              className={`flex items-center justify-center gap-2 p-2 rounded-xl border-2 transition-all duration-300 ${
                selectedRole === 'CUSTOMER'
                  ? 'bg-brand-yellow/10 border-brand-yellow/50 text-brand-yellow shadow-lg shadow-brand-yellow/5'
                  : 'bg-black/30 border-white/[0.06] text-zinc-500 hover:border-white/10 hover:text-zinc-300'
              }`}
            >
              <UserCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.personal}</span>
            </button>
            <button
              onClick={() => setSelectedRole('BUSINESS_OWNER')}
              className={`flex items-center justify-center gap-2 p-2 rounded-xl border-2 transition-all duration-300 ${
                selectedRole === 'BUSINESS_OWNER'
                  ? 'bg-brand-yellow/10 border-brand-yellow/50 text-brand-yellow shadow-lg shadow-brand-yellow/5'
                  : 'bg-black/30 border-white/[0.06] text-zinc-500 hover:border-white/10 hover:text-zinc-300'
              }`}
            >
              <Store className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.businessOwners}</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={(e) => type === 'login' ? handleLogin(e) : handleRegister(e)}>
            <input type="hidden" name="role" value={selectedRole} />

            <AnimatePresence mode="wait">
              <motion.div
                key={`${type}-${selectedRole}`}
                initial={{ opacity: 0, x: isRtl ? 15 : -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? -15 : 15 }}
                transition={{ duration: 0.25 }}
              >
                {type === 'register' ? (
                  <>
                    {/* Two-column grid for register fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
                      {/* Full Name */}
                      <div className="relative group">
                        <UserIcon className={`${inputIconClass} ${isRtl ? 'right-3' : 'left-3'}`} />
                        <input
                          name="name"
                          required
                          placeholder={t.fullName}
                          className={`${inputBaseClass} ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative group">
                        <Phone className={`${inputIconClass} ${isRtl ? 'right-3' : 'left-3'}`} />
                        <input
                          name="phone"
                          type="tel"
                          required
                          placeholder={t.phonePlaceholder}
                          className={`${inputBaseClass} ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                        />
                      </div>

                      {selectedRole === 'CUSTOMER' && (
                        <>
                          <div className="relative group">
                            <CarIcon className={`${inputIconClass} ${isRtl ? 'right-3' : 'left-3'}`} />
                            <input
                              name="carBrand"
                              required
                              placeholder={t.carBrandPlaceholder}
                              className={`${inputBaseClass} ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                            />
                          </div>

                          <div className="relative group">
                            <CarIcon className={`${inputIconClass} ${isRtl ? 'right-3' : 'left-3'}`} />
                            <input
                              name="carCategory"
                              required
                              placeholder={t.carCategoryPlaceholder}
                              className={`${inputBaseClass} ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                            />
                          </div>

                          <div className="relative group">
                            <Layers className={`${inputIconClass} ${isRtl ? 'right-3' : 'left-3'}`} />
                            <input
                              name="carModel"
                              required
                              placeholder={t.carModelPlaceholder}
                              className={`${inputBaseClass} ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                            />
                          </div>
                        </>
                      )}

                      {selectedRole === 'BUSINESS_OWNER' && (
                        <>
                          <div className="relative group">
                            <Store className={`${inputIconClass} ${isRtl ? 'right-3' : 'left-3'}`} />
                            <input
                              name="centerName"
                              required
                              placeholder={t.centerName}
                              className={`${inputBaseClass} ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                            />
                          </div>
                          <div className="relative group">
                            <MapPin className={`${inputIconClass} ${isRtl ? 'right-3' : 'left-3'}`} />
                            <input
                              name="address"
                              required
                              placeholder={t.addressPlaceholder}
                              className={`${inputBaseClass} ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                            />
                          </div>
                          <div>
                            <input
                              name="taxNumber"
                              required
                              placeholder={t.taxNumber}
                              className={`${inputBaseClass} px-3`}
                            />
                            <label className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-zinc-400 cursor-pointer hover:bg-white/10 transition-colors">
                              <Paperclip className="w-2.5 h-2.5" />
                              {t.attachTax}
                              <input type="file" name="taxCertificate" className="hidden" />
                            </label>
                          </div>
                          <div>
                            <input
                              name="commercialRegistration"
                              required
                              placeholder={t.commercialRegistration}
                              className={`${inputBaseClass} px-3`}
                            />
                            <label className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-zinc-400 cursor-pointer hover:bg-white/10 transition-colors">
                              <Paperclip className="w-2.5 h-2.5" />
                              {t.attachComm}
                              <input type="file" name="commercialCertificate" className="hidden" />
                            </label>
                          </div>
                        </>
                      )}

                      {/* Password fields */}
                      <div className="relative group">
                        <Lock className={`${inputIconClass} ${isRtl ? 'right-3' : 'left-3'}`} />
                        <PasswordField
                          name="password"
                          required
                          placeholder={t.password}
                          className={`${inputBaseClass} ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                        />
                      </div>
                      <div className="relative group">
                        <Lock className={`${inputIconClass} ${isRtl ? 'right-3' : 'left-3'}`} />
                        <PasswordField
                          name="confirmPassword"
                          required
                          placeholder={lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                          className={`${inputBaseClass} ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                        />
                      </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-center gap-2 py-1.5 mt-1.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="terms"
                        id="terms"
                        required
                        className="w-3.5 h-3.5 rounded border-white/10 bg-black/40 text-brand-yellow focus:ring-brand-yellow accent-[#C9A227]"
                      />
                      <span className="text-[11px] text-zinc-400 group-hover:text-white transition-colors">
                        {t.terms}
                      </span>
                    </label>
                  </>
                ) : (
                  <div className="space-y-2.5">
                    {/* Login: Phone */}
                    <div className="relative group">
                      <Phone className={`${inputIconClass} ${isRtl ? 'right-3' : 'left-3'}`} />
                      <input
                        name="phone"
                        type="tel"
                        required
                        placeholder={t.phonePlaceholder}
                        className={`${inputBaseClass} ${isRtl ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                      />
                    </div>

                    {/* Login: Password */}
                    <div className="relative group">
                      <Lock className={`${inputIconClass} ${isRtl ? 'right-3' : 'left-3'}`} />
                      <PasswordField
                        name="password"
                        required
                        placeholder={t.password}
                        className={`${inputBaseClass} ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="text-[10px] font-bold text-zinc-500 hover:text-brand-yellow transition-colors uppercase tracking-widest"
                      >
                        {t.forgotPassword}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Submit button */}
            <button type="submit" className="premium-btn w-full mt-3 py-2.5 flex items-center justify-center gap-2">
              {type === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  {t.login}
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  {t.register}
                </>
              )}
            </button>
          </form>

          {/* Notification Area */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`mt-2 p-2 rounded-lg text-xs font-bold flex items-center gap-2 ${
                  notification.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {notification.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Link */}
        <div className="mt-2 flex justify-center shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-brand-yellow transition-colors font-medium group"
          >
            <ArrowLeft className={`w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
            {t.back}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
