import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, Globe, LogIn, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Logo } from '../../shared/components/Logo';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PasswordField } from '../../shared/components/PasswordField';

export const SuperAdminLogin: React.FC = () => {
  const { lang, t, isRtl } = useLanguage();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: trimmedEmail, password: trimmedPassword }) // phone field in API handles both phone and email
      });
      
      const data = await res.json();
      
      if (data.user && data.user.role === 'SUPER_ADMIN') {
        setNotification({ message: t.loginSuccess, type: 'success' });
        setTimeout(() => {
          setUser(data.user);
          navigate('/dashboard');
        }, 1000);
      } else if (data.user) {
        setNotification({ message: lang === 'en' ? 'Access denied. Super Admin only.' : 'تم رفض الوصول. للمشرفين فقط.', type: 'error' });
      } else {
        setNotification({ message: data.error || t.invalidPassword, type: 'error' });
      }
    } catch (err) {
      setNotification({ message: "Network error", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-4 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="absolute inset-0 bg-mesh opacity-20 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Admin Login Card */}
        <div className="bg-[#111111] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 blur-3xl rounded-full -mr-16 -mt-16" />
          
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <h1 className="text-3xl font-display font-bold gold-gradient gold-glow mb-2">
              {lang === 'en' ? '360 Cars Admin' : 'إدارة 360 Cars'}
            </h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em]">{lang === 'en' ? 'Admin Control Panel' : 'لوحة تحكم المشرف'}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-yellow group-focus-within:scale-110 transition-transform" />
                <input 
                  type="text" 
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                  className="w-full bg-[#0B0B0B] border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm outline-none focus:ring-1 focus:ring-brand-yellow focus:border-brand-yellow/50 transition-all placeholder:text-zinc-700"
                  required
                />
              </div>
              
              <div className="relative group">
                <PasswordField 
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={lang === 'en' ? 'Password' : 'الرقم السري'}
                  className="pl-14 py-4 rounded-2xl"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-yellow group-focus-within:scale-110 transition-transform pointer-events-none" />
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[10px] font-bold text-zinc-500 hover:text-brand-yellow transition-colors flex items-center gap-1 uppercase tracking-widest"
                >
                  <HelpCircle className="w-3 h-3" />
                  {t.forgotPassword}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-yellow to-yellow-600 text-zinc-950 font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(201,162,39,0.2)] hover:shadow-[0_0_40px_rgba(201,162,39,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {lang === 'en' ? 'Login' : 'تسجيل الدخول'}
                </>
              )}
            </button>

            <AnimatePresence>
              {notification && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-3 ${
                    notification.type === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}
                >
                  {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {notification.message}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2 text-zinc-500">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">360 Cars Admin v2.0</span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="text-[10px] font-bold text-brand-yellow hover:underline uppercase tracking-widest"
            >
              {t.back}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
