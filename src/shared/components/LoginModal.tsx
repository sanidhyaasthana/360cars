import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { Logo } from './Logo';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthActions } from '../hooks/useAuthActions';
import { Role } from '../types/common.types';
import { PasswordField } from './PasswordField';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAudience?: 'INDIVIDUALS' | 'BUSINESSES';
}

const inputClass = "w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-brand-yellow focus:border-transparent outline-none transition-all";
const labelClass = "block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5 ml-0.5";

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialAudience = 'INDIVIDUALS' }) => {
  const { lang, t, isRtl } = useLanguage();
  const navigate = useNavigate();
  const [type, setType] = useState<'login' | 'register'>('login');
  const { handleLogin, handleRegister, notification, setNotification } = useAuthActions();
  const [selectedRole, setSelectedRole] = useState<Role>(initialAudience === 'INDIVIDUALS' ? 'CUSTOMER' : 'BUSINESS_OWNER');

  useEffect(() => {
    setSelectedRole(initialAudience === 'INDIVIDUALS' ? 'CUSTOMER' : 'BUSINESS_OWNER');
  }, [initialAudience, isOpen]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!isOpen) return null;

  const isRegister = type === 'register';
  const isCustomer = selectedRole === 'CUSTOMER';
  const isBusiness = selectedRole === 'BUSINESS_OWNER';

  return (
    <AnimatePresence>
      {/*
        Overlay: fixed fullscreen scroll container.
        Uses overflow-y-auto + grid place-items-center so the modal is centered
        when it fits, and the whole overlay scrolls when it doesn't (zoom / small screens).
        min-h-full on the grid child ensures centering works.
      */}
      <div
        className={`fixed inset-0 z-[100] overflow-y-auto ${isRtl ? 'rtl' : 'ltr'}`}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Centering wrapper — scrolls naturally when content overflows */}
        <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`relative glass-card rounded-2xl shadow-2xl w-full my-auto ${isRegister ? 'max-w-[680px]' : 'max-w-md'}`}
          >
            {/* Decorative background glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none" />

            {/* Content — no max-height, no inner scroll. Natural document flow. */}
            <div className="relative p-4 sm:p-5">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 text-zinc-500 hover:text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="text-center mb-3">
                <div className="flex justify-center mb-1">
                  <Logo size="sm" />
                </div>
                <h2 className="text-base font-display font-bold text-white">
                  {type === 'login' ? t.login : t.register}
                </h2>
                <p className="text-[10px] text-zinc-500">
                  {lang === 'en' ? 'Join the premium car care community' : 'انضم إلى مجتمع العناية الفائقة بالسيارات'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={(e) => type === 'login' ? handleLogin(e) : handleRegister(e)}>

                {/* LOGIN FORM */}
                {!isRegister && (
                  <div className="space-y-2.5">
                    <input type="hidden" name="role" value={selectedRole} />

                    <div className="flex bg-white/5 p-0.5 rounded-xl border border-white/5">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('CUSTOMER')}
                        className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${selectedRole === 'CUSTOMER' ? 'bg-brand-yellow text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                      >
                        {t.loginPersonal}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('BUSINESS_OWNER')}
                        className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${selectedRole === 'BUSINESS_OWNER' ? 'bg-brand-yellow text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                      >
                        {t.loginBusiness}
                      </button>
                    </div>

                    <div>
                      <label className={labelClass}>{t.phone}</label>
                      <input name="phone" type="tel" required placeholder={t.phonePlaceholder} className={inputClass} />
                    </div>

                    <div>
                      <PasswordField label={t.password} name="password" required className={inputClass + (isRtl ? ' pl-10' : ' pr-10')} />
                      <div className="mt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => { onClose(); navigate('/forgot-password'); }}
                          className="text-[10px] text-zinc-500 hover:text-brand-yellow transition-colors font-bold uppercase tracking-wider flex items-center gap-1"
                        >
                          <HelpCircle className="w-3 h-3" />
                          {t.forgotPassword}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* REGISTER FORM */}
                {isRegister && (
                  <div>
                    {/* Consistent two-column grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
                      {/* Account Type | Full Name */}
                      <div>
                        <label className={labelClass}>{t.role}</label>
                        <select
                          name="role"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value as Role)}
                          className={inputClass + ' appearance-none'}
                        >
                          <option value="CUSTOMER">{t.personal}</option>
                          <option value="BUSINESS_OWNER">{t.businessOwners}</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>{t.fullName}</label>
                        <input name="name" required className={inputClass} />
                      </div>

                      {/* Phone | (varies) */}
                      <div>
                        <label className={labelClass}>{t.phone}</label>
                        <input name="phone" type="tel" required placeholder={t.phonePlaceholder} className={inputClass} />
                      </div>

                      {isCustomer && (
                        <>
                          <div>
                            <label className={labelClass}>{t.carBrand}</label>
                            <input name="carBrand" required placeholder={t.carBrandPlaceholder} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>{lang === 'en' ? 'Car Category' : 'فئة السيارة'}</label>
                            <input name="carCategory" required placeholder={t.carCategoryPlaceholder} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>{t.carModel}</label>
                            <input name="carModel" required placeholder={t.carModelPlaceholder} className={inputClass} />
                          </div>
                        </>
                      )}

                      {isBusiness && (
                        <>
                          <div>
                            <label className={labelClass}>{t.centerName}</label>
                            <input name="centerName" required className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>{t.address}</label>
                            <div className="relative">
                              <MapPin className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500`} />
                              <input name="address" required placeholder={t.addressPlaceholder} className={inputClass + (isRtl ? ' pr-8' : ' pl-8')} />
                            </div>
                          </div>
                          <div>
                            <label className={labelClass}>{t.taxNumber}</label>
                            <input name="taxNumber" required className={inputClass} />
                            <label className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-zinc-400 cursor-pointer hover:bg-white/10 transition-colors">
                              <Paperclip className="w-2.5 h-2.5" />
                              {t.attachTax}
                              <input type="file" name="taxCertificate" className="hidden" />
                            </label>
                          </div>
                          <div>
                            <label className={labelClass}>{t.commercialRegistration}</label>
                            <input name="commercialRegistration" required className={inputClass} />
                            <label className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-zinc-400 cursor-pointer hover:bg-white/10 transition-colors">
                              <Paperclip className="w-2.5 h-2.5" />
                              {t.attachComm}
                              <input type="file" name="commercialCertificate" className="hidden" />
                            </label>
                          </div>
                        </>
                      )}

                      {/* Password fields */}
                      <div>
                        <PasswordField label={t.password} name="password" required className={inputClass + (isRtl ? ' pl-10' : ' pr-10')} />
                      </div>
                      <div>
                        <PasswordField label={lang === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'} name="confirmPassword" required className={inputClass + (isRtl ? ' pl-10' : ' pr-10')} />
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <input type="checkbox" name="terms" id="modal-terms" required className="w-3 h-3 text-brand-yellow border-white/10 bg-zinc-800 rounded focus:ring-brand-yellow" />
                      <label htmlFor="modal-terms" className="text-[10px] text-zinc-400 leading-tight">
                        {lang === 'ar' ? (
                          <>أوافق على <Link to="/terms" className="text-brand-yellow hover:underline">الشروط والأحكام</Link></>
                        ) : (
                          <>I agree to the <Link to="/terms" className="text-brand-yellow hover:underline">Terms and Conditions</Link></>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button type="submit" className="w-full bg-brand-yellow text-zinc-950 py-2 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/10 mt-3 active:scale-[0.98]">
                  {type === 'login' ? t.login : t.register}
                </button>

                {/* Notification */}
                <AnimatePresence>
                  {notification && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 mt-2 ${notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                    >
                      {notification.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                      {notification.message}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Toggle link */}
              <p className="mt-2.5 text-center text-xs text-zinc-500">
                {type === 'login' ? (lang === 'en' ? "Don't have an account?" : "ليس لديك حساب؟") : (lang === 'en' ? "Already have an account?" : "لديك حساب بالفعل؟")}
                <button onClick={() => setType(type === 'login' ? 'register' : 'login')} className={`${isRtl ? 'mr-1.5' : 'ml-1.5'} text-brand-yellow font-bold hover:underline`}>
                  {type === 'login' ? t.register : t.login}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
