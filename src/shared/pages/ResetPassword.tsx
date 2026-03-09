import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export const ResetPassword: React.FC = () => {
  const { t, isRtl, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setErrorMessage(data.error || (lang === 'ar' ? 'حدث خطأ ما' : 'Something went wrong'));
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage(lang === 'ar' ? 'خطأ في الشبكة' : 'Network error');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-4 ${isRtl ? 'rtl' : 'ltr'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900/50 p-8 md:p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/5 blur-3xl -mr-16 -mt-16 rounded-full" />
        
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-widest relative"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          {t.back}
        </button>

        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C9A227]/10 rounded-3xl mb-6">
            <ShieldCheck className="text-[#C9A227] w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-3">
            {lang === 'ar' ? 'تعيين كلمة مرور جديدة' : 'Set New Password'}
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-[280px] mx-auto">
            {lang === 'ar' 
              ? 'يرجى إدخال كلمة المرور الجديدة الخاصة بك. تأكد من أنها قوية وسهلة التذكر بالنسبة لك.'
              : 'Please enter your new password. Make sure it is strong and easy for you to remember.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                {lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#C9A227] transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-zinc-800 border border-white/5 text-white text-sm focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                  required
                  minLength={6}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#C9A227] transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-zinc-800 border border-white/5 text-white text-sm focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || status === 'success'}
            className="w-full bg-[#C9A227] text-zinc-950 py-5 rounded-2xl font-bold text-sm hover:bg-yellow-400 transition-all shadow-xl shadow-[#C9A227]/10 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
            ) : (
              lang === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'
            )}
          </button>

          <AnimatePresence>
            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <p className="text-emerald-500 font-bold text-xs">
                  {lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح! سيتم توجيهك لتسجيل الدخول...' : 'Password updated successfully! Redirecting to login...'}
                </p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-500 font-bold text-xs">{errorMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};
