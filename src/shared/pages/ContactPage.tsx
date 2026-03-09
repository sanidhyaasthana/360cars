import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Shield, 
  Users, 
  Wrench, 
  Scale, 
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export const ContactPage: React.FC = () => {
  const { t, isRtl, lang } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    inquiryType: 'Support',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const inquiryTypes = [
    { value: 'Support', label: t.technicalSupport },
    { value: 'Partnership', label: t.businessPartnership },
    { value: 'Legal', label: t.legalInquiry },
    { value: 'Other', label: t.otherInquiry }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({
        fullName: '',
        inquiryType: 'Support',
        email: '',
        phone: '',
        message: ''
      });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t.officialEmail,
      value: 'info@cleancarsksa.com',
      href: 'mailto:info@cleancarsksa.com'
    },
    {
      icon: Phone,
      label: t.officialPhone,
      value: '+966 56 602 0844',
      href: 'tel:+966566020844'
    },
    {
      icon: MapPin,
      label: t.officeAddress,
      value: t.address_val,
      href: '#'
    }
  ];

  const purposes = [
    { icon: Users, label: t.businessOwners },
    { icon: Wrench, label: t.technicalSupport },
    { icon: Scale, label: t.legalInquiry },
    { icon: Lightbulb, label: t.businessPartnership }
  ];

  return (
    <div className={`min-h-screen bg-[#0B0B0B] text-white pt-32 pb-20 px-4 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#C9A227] transition-colors mb-8 text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            {t.back}
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              {t.contactTitle}
            </h1>
            <p className="text-zinc-500 max-w-2xl mx-auto text-sm leading-relaxed">
              {t.contactDesc}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-zinc-900/50 rounded-3xl border border-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#C9A227]" />
                {lang === 'ar' ? 'قنوات التواصل الرسمية' : 'Official Channels'}
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="bg-zinc-800 p-3 rounded-xl group-hover:bg-[#C9A227]/10 transition-colors">
                      <info.icon className="w-5 h-5 text-[#C9A227]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">{info.label}</p>
                      <a href={info.href} className="text-sm text-zinc-200 hover:text-[#C9A227] transition-colors font-medium">
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/50 rounded-3xl border border-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-lg font-display font-bold text-white mb-6">
                {lang === 'ar' ? 'لمن هذه الصفحة؟' : 'Who is this for?'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {purposes.map((p, idx) => (
                  <div key={idx} className="bg-zinc-800/50 p-4 rounded-2xl flex flex-col items-center text-center gap-3 border border-white/5">
                    <p.icon className="w-6 h-6 text-[#C9A227]" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 rounded-3xl border border-white/5 p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
              
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                      {t.fullName}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-1 focus:ring-[#C9A227] transition-all text-white"
                      placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                      {t.inquiryType}
                    </label>
                    <select 
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({...formData, inquiryType: e.target.value})}
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-1 focus:ring-[#C9A227] transition-all text-white appearance-none"
                    >
                      {inquiryTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-1 focus:ring-[#C9A227] transition-all text-white"
                      placeholder="example@mail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                      {t.phone} ({lang === 'ar' ? 'اختياري' : 'Optional'})
                    </label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-1 focus:ring-[#C9A227] transition-all text-white"
                      placeholder={t.phonePlaceholder}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                    {t.message}
                  </label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-1 focus:ring-[#C9A227] transition-all text-white resize-none"
                    placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#C9A227] text-zinc-950 py-5 rounded-2xl font-bold text-sm hover:bg-yellow-400 transition-all shadow-xl shadow-[#C9A227]/10 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t.sendMessage}
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-4"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                      <div className="space-y-1">
                        <p className="text-emerald-500 font-bold text-sm">
                          {lang === 'ar' ? 'تم استلام طلبك بنجاح' : 'Request Received Successfully'}
                        </p>
                        <p className="text-emerald-500/70 text-xs leading-relaxed">
                          {t.messageSent}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
