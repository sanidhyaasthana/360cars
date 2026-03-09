import React from 'react';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ChevronRight,
  ArrowRight,
  
} from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';

interface FooterProps {
  onOpenLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLogin }) => {
  const { t, isRtl, lang } = useLanguage();
  const navigate = useNavigate();

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1834Ekvnrv/?mibextid=wwXIfr', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/360cars.platform?igsh=MWdpd2dpMjdscG4yMQ%3D%3D&utm_source=qr', label: 'Instagram' },
    { icon: Twitter, href: 'http://localhost:3000/#', label: 'X (Twitter)' },
    { icon: Linkedin, href: 'http://localhost:3000/#', label: 'LinkedIn' },

  ];

  const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(201,162,39,0.5)]">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.22 8.22 0 004.76 1.52V7.05a4.85 4.85 0 01-1-.36z"/>
    </svg>
  );

  const quickLinks = [
    { label: t.home, href: '/' },
    { label: t.personal, action: () => navigate('/') },
    { label: t.businessOwners, action: () => navigate('/') },
    { label: t.adminPanel || 'Admin', href: '/admin/login' },
    { label: t.login, action: () => onOpenLogin ? onOpenLogin() : navigate('/login') },
    { label: t.register, action: () => onOpenLogin ? onOpenLogin() : navigate('/login') },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-hidden">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-[#C9A227] via-[#D4B133] to-[#E5C158] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-zinc-950 mb-1.5">
                {t.ctaBannerTitle}
              </h2>
              <p className="text-zinc-900/60 font-medium text-sm">
                {lang === 'en' ? 'Join over 500+ car wash owners across the kingdom.' : 'انضم إلى أكثر من 500+ صاحب مغسلة سيارات في جميع أنحاء المملكة.'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onOpenLogin ? onOpenLogin() : navigate('/login')}
              className="bg-zinc-950 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:shadow-zinc-950/20 transition-all flex items-center gap-3 group shrink-0"
            >
              {t.ctaBannerBtn}
              <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-[#080808] text-zinc-400 pt-16 sm:pt-20 pb-8 sm:pb-10 border-t border-[#C9A227]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16"
          >
            {/* Column 1: Identity */}
            <motion.div variants={itemVariants} className="space-y-5">
              <Logo size="md" />
              <p className="text-sm leading-relaxed text-zinc-500">
                {t.footerDesc}
              </p>
              <div className="pt-1">
                <button
                  onClick={() => onOpenLogin ? onOpenLogin() : navigate('/login')}
                  className="premium-btn px-6 py-3 rounded-xl text-xs flex items-center gap-2 group"
                >
                  {t.startNow}
                  <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </motion.div>

            {/* Column 2: Quick Links */}
            <motion.div variants={itemVariants} className="space-y-5">
              <h3 className="text-white font-display font-bold text-base flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                {t.quickLinks}
              </h3>
              <ul className="space-y-2.5">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    {link.action ? (
                      <button
                        onClick={link.action}
                        className="text-sm hover:text-[#C9A227] transition-all flex items-center gap-2 group text-left w-full py-0.5"
                      >
                        <span className="w-0 group-hover:w-3 h-px bg-[#C9A227] transition-all duration-300" />
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.href || '/'}
                        className="text-sm hover:text-[#C9A227] transition-all flex items-center gap-2 group py-0.5"
                      >
                        <span className="w-0 group-hover:w-3 h-px bg-[#C9A227] transition-all duration-300" />
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3: Contact Info */}
            <motion.div variants={itemVariants} className="space-y-5">
              <h3 className="text-white font-display font-bold text-base flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                {t.contactUs}
              </h3>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3 group">
                  <div className="bg-white/[0.03] p-2 rounded-lg group-hover:bg-[#C9A227]/10 transition-colors border border-white/[0.04] shrink-0">
                    <MapPin className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div className="text-sm">
                    <p className="text-zinc-300">{t.address_val}</p>
                    <p className="text-zinc-600 text-xs">{t.street_val}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="bg-white/[0.03] p-2 rounded-lg group-hover:bg-[#C9A227]/10 transition-colors border border-white/[0.04] shrink-0">
                    <Phone className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <a href="tel:+9665566052044" className="text-sm text-zinc-300 hover:text-[#C9A227] transition-colors">
                    +966 5566052044
                  </a>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="bg-white/[0.03] p-2 rounded-lg group-hover:bg-[#C9A227]/10 transition-colors border border-white/[0.04] shrink-0">
                    <Mail className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <a href="mailto:info@cleancarsksa.com" className="text-sm text-zinc-300 hover:text-[#C9A227] transition-colors">
                    info@cleancarsksa.com
                  </a>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="bg-white/[0.03] p-2 rounded-lg group-hover:bg-[#C9A227]/10 transition-colors border border-white/[0.04] shrink-0">
                    <Clock className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div className="text-sm">
                    <p className="text-zinc-300">{t.workingHours}</p>
                    <p className="text-zinc-600 text-xs">{t.workingHours_val}</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Column 4: Newsletter & Social */}
            <motion.div variants={itemVariants} className="space-y-7">
              <div className="space-y-4">
                <h3 className="text-white font-display font-bold text-base flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                  {t.newsletter}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {t.newsletterDesc}
                </p>
                <div className="relative group">
                  <input
                    type="email"
                    placeholder={lang === 'en' ? 'Your email address' : 'عنوان بريدك الإلكتروني'}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#C9A227]/20 focus:border-[#C9A227]/30 transition-all text-white pr-12 hover:border-white/10"
                  />
                  <button className={`absolute ${isRtl ? 'left-1.5' : 'right-1.5'} top-1.5 bottom-1.5 bg-gradient-to-r from-[#C9A227] to-[#E5C158] text-zinc-950 px-3 rounded-lg hover:shadow-lg hover:shadow-brand-yellow/10 transition-all flex items-center justify-center`}>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t.followUs}</h4>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {socialLinks.map((social, idx) => (
                    <motion.a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.05 }}
                      className="w-10 h-10 bg-white/[0.03] rounded-xl flex items-center justify-center text-zinc-400 hover:text-[#C9A227] hover:bg-[#C9A227]/10 transition-all border border-white/[0.06] group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(201,162,39,0.5)]" />
                    </motion.a>
                  ))}
                  <motion.a
                    href="https://www.tiktok.com/@360cars1?_r=1&_t=ZS-94ObhjhOgr7"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.05 }}
                    className="w-10 h-10 bg-white/[0.03] rounded-xl flex items-center justify-center text-zinc-400 hover:text-[#C9A227] hover:bg-[#C9A227]/10 transition-all border border-white/[0.06] group"
                    aria-label="TikTok"
                  >
                    <TikTokIcon />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Sub Footer */}
          <div className="pt-6 sm:pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-zinc-600 font-medium">
              &copy; 2026 360Cars. {t.allRightsReserved}
            </p>
            <div className="flex items-center gap-6 sm:gap-8">
              <Link to="/terms" className="text-[10px] text-zinc-600 hover:text-[#C9A227] transition-colors uppercase tracking-[0.15em] font-bold">
                {t.privacyPolicy}
              </Link>
              <Link to="/terms" className="text-[10px] text-zinc-600 hover:text-[#C9A227] transition-colors uppercase tracking-[0.15em] font-bold">
                {t.termsConditions}
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent" />
      </footer>
    </div>
  );
};
