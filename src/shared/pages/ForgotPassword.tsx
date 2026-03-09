import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Send, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export const ForgotPassword: React.FC = () => {
  const { t, isRtl, lang } = useLanguage();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), lang })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setNotification({ 
          message: lang === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور بنجاح!' : 'Password reset link sent successfully!', 
          type: 'success' 
        });
        // In a real app, the user would check their email.
        // For this demo, we can show the link if it's returned (debug mode)
        if (data.debug_link) {
          console.log("Debug Reset Link:", data.debug_link);
        }
      } else {
        setNotification({ message: data.error || t.userNotFound, type: 'error' });
      }
    } catch (err) {
      setNotification({ message: lang === 'en' ? "Network error" : "خطأ في الشبكة", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-4 ${isRtl ? 'rtl' : 'ltr'}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/5 blur-3xl -mr-16 -mt-16 rounded-full" />
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-widest relative"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          {t.back}
        </button>

        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A227]/10 rounded-2xl mb-6">
            <Smartphone className="text-[#C9A227] w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">{t.forgotPassword}</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            {lang === 'ar' ? 'أدخل رقم هاتفك المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.' : 'Enter your registered phone number and we will send you a link to reset your password.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1 mb-1">{t.phone}</label>
            <div className="relative group">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#C9A227] transition-colors" />
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-800 border border-white/5 text-white text-sm focus:ring-1 focus:ring-[#C9A227] outline-none transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#C9A227] text-zinc-950 py-5 rounded-2xl font-bold text-sm hover:bg-yellow-400 transition-all shadow-xl shadow-[#C9A227]/10 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                {lang === 'ar' ? 'إرسال الرابط' : 'Send Reset Link'}
              </>
            )}
          </button>

          <AnimatePresence>
            {notification && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-xl text-xs font-bold flex items-center gap-3 ${notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
              >
                {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};
