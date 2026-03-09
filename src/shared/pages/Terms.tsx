import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  FileText, 
  ArrowLeft, 
  Users, 
  Scale, 
  CreditCard, 
  Ban, 
  ShieldAlert, 
  Database, 
  Copyright, 
  Calendar,
  Lock,
  Info,
  Gavel
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

type LegalTab = 'terms' | 'privacy' | 'support' | 'disclaimer';

export const Terms: React.FC = () => {
  const { lang, t, isRtl } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LegalTab>('terms');

  const tabs = [
    { id: 'terms', label: lang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', icon: Lock },
    { id: 'support', label: lang === 'ar' ? 'سياسة الدعم' : 'Support Policy', icon: Shield },
    { id: 'disclaimer', label: lang === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimer', icon: Info },
  ];

  const termsSections = [
    {
      title: lang === 'ar' ? "1. طبيعة المنصة" : "1. Nature of the Platform",
      icon: Scale,
      content: lang === 'ar' ? (
        <p>360Cars هي منصة تقنية (SaaS) تعمل كوسيط لربط أصحاب مغاسل السيارات بالعملاء. المنصة لا تملك أو تدير أي مغسلة سيارات بشكل مباشر.</p>
      ) : (
        <p>360Cars is a technology platform (SaaS) that acts as an intermediary connecting car wash owners with customers. The platform does not own or operate any car wash directly.</p>
      )
    },
    {
      title: lang === 'ar' ? "2. مسؤولية مقدم الخدمة" : "2. Service Provider Responsibility",
      icon: Users,
      content: lang === 'ar' ? (
        <p>أصحاب الأعمال (مقدمو الخدمة) هم المسؤولون الوحيدون عن تسعير الخدمات، جودتها، وتوافرها. المنصة غير مسؤولة عن أي أخطاء تشغيلية تقع داخل الفروع.</p>
      ) : (
        <p>Business owners (Service Providers) are solely responsible for service pricing, quality, and availability. The platform is not liable for any operational errors occurring within the branches.</p>
      )
    },
    {
      title: lang === 'ar' ? "3. دقة المعلومات" : "3. Information Accuracy",
      icon: Database,
      content: lang === 'ar' ? (
        <p>يجب على جميع المستخدمين تقديم معلومات دقيقة وصحيحة عند التسجيل. يحق للمنصة تعليق أي حساب يقدم معلومات مضللة.</p>
      ) : (
        <p>All users must provide accurate and correct information upon registration. The platform reserves the right to suspend any account that provides misleading information.</p>
      )
    },
    {
      title: lang === 'ar' ? "4. القانون الواجب التطبيق" : "4. Governing Law",
      icon: Gavel,
      content: lang === 'ar' ? (
        <p>تخضع هذه الشروط والأحكام وتفسر وفقاً لأنظمة المملكة العربية السعودية. يكون الاختصاص القضائي لمحاكم مدينة الرياض.</p>
      ) : (
        <p>These terms and conditions are governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia. Judicial jurisdiction shall be with the courts of Riyadh.</p>
      )
    }
  ];

  const supportPolicy = [
    {
      title: lang === 'ar' ? "وقت الاستجابة" : "Response Time",
      content: lang === 'ar' ? "نلتزم بالرد على جميع الاستفسارات خلال 24-48 ساعة عمل." : "We commit to responding to all inquiries within 24–48 business hours."
    },
    {
      title: lang === 'ar' ? "نطاق الدعم" : "Support Scope",
      content: lang === 'ar' ? "الدعم متاح للمستخدمين المسجلين في المنصة فقط بخصوص المشاكل التقنية أو استفسارات الحساب." : "Support is available for registered platform users only regarding technical issues or account inquiries."
    },
    {
      title: lang === 'ar' ? "النزاعات" : "Disputes",
      content: lang === 'ar' ? "المنصة غير مسؤولة عن النزاعات التي تنشأ بين العملاء ومغاسل السيارات الفردية." : "The platform is not responsible for disputes arising between customers and individual car wash branches."
    }
  ];

  return (
    <div className={`min-h-screen bg-[#0B0B0B] pt-32 pb-20 px-4 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors group text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isRtl ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
          {t.back}
        </button>

        <div className="bg-zinc-900/50 rounded-[2.5rem] border border-white/5 p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/5 blur-[120px] -mr-48 -mt-48 rounded-full" />
          
          <div className="text-center mb-12 relative">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              {lang === 'ar' ? 'المركز القانوني لـ 360Cars' : '360Cars Legal Center'}
            </h1>
            <p className="text-zinc-500 text-sm max-w-2xl mx-auto">
              {lang === 'ar' 
                ? 'نحن نؤمن بالشفافية والوضوح. هنا تجد كافة السياسات القانونية التي تحكم علاقتك بمنصة 360Cars.'
                : 'We believe in transparency and clarity. Here you will find all the legal policies governing your relationship with the 360Cars platform.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 relative">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LegalTab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#C9A227] text-zinc-950 shadow-lg shadow-[#C9A227]/20' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {activeTab === 'terms' && (
                <div className="space-y-8">
                  {termsSections.map((section, i) => (
                    <div key={i} className="bg-zinc-800/30 rounded-3xl p-6 border border-white/5">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-zinc-900 rounded-xl">
                          <section.icon className="w-5 h-5 text-[#C9A227]" />
                        </div>
                        <h3 className="text-lg font-display font-bold text-white">{section.title}</h3>
                      </div>
                      <div className="text-zinc-400 text-sm leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'support' && (
                <div className="space-y-8">
                  <div className="bg-[#C9A227]/5 border border-[#C9A227]/20 rounded-3xl p-8 text-center">
                    <Shield className="w-12 h-12 text-[#C9A227] mx-auto mb-4" />
                    <h3 className="text-xl font-display font-bold text-white mb-2">
                      {lang === 'ar' ? 'سياسة الدعم الفني' : 'Technical Support Policy'}
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      {lang === 'ar' ? 'نحن هنا لمساعدتك في نجاح أعمالك.' : 'We are here to help your business succeed.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {supportPolicy.map((item, i) => (
                      <div key={i} className="bg-zinc-800/30 p-6 rounded-3xl border border-white/5 text-center">
                        <h4 className="text-[#C9A227] font-bold text-sm mb-3">{item.title}</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
                  <div className="bg-zinc-800/30 p-8 rounded-3xl border border-white/5">
                    <h3 className="text-white font-display font-bold text-xl mb-4">
                      {lang === 'ar' ? 'حماية البيانات الشخصية' : 'Personal Data Protection'}
                    </h3>
                    <p className="mb-4">
                      {lang === 'ar' 
                        ? 'نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية وفقاً لأعلى المعايير الأمنية والأنظمة المعمول بها في المملكة العربية السعودية.'
                        : 'We are committed to protecting your privacy and personal data in accordance with the highest security standards and applicable regulations in the Kingdom of Saudi Arabia.'}
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>{lang === 'ar' ? 'يتم تشفير جميع البيانات الحساسة.' : 'All sensitive data is encrypted.'}</li>
                      <li>{lang === 'ar' ? 'لا يتم مشاركة بياناتك مع أطراف ثالثة دون إذنك.' : 'Your data is not shared with third parties without your permission.'}</li>
                      <li>{lang === 'ar' ? 'يحق لك طلب حذف بياناتك في أي وقت.' : 'You have the right to request deletion of your data at any time.'}</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'disclaimer' && (
                <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-3xl">
                  <h3 className="text-red-500 font-display font-bold text-xl mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    {lang === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimer'}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {lang === 'ar' 
                      ? 'منصة 360Cars هي مزود لبرمجيات SaaS فقط. نحن لا نتحمل أي مسؤولية عن جودة الخدمات المقدمة من قبل الفروع المسجلة، أو أي أضرار قد تلحق بالمركبات أثناء عملية الغسيل. أي نزاع مالي أو تشغيلي يجب حله مباشرة بين العميل وصاحب المغسلة.'
                      : '360Cars platform is a SaaS software provider only. We do not assume any responsibility for the quality of services provided by registered branches, or any damage that may occur to vehicles during the washing process. Any financial or operational dispute must be resolved directly between the customer and the car wash owner.'}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-16 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
              © 2026 360Cars. {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
