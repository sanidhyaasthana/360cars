import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  LayoutDashboard,
  Smartphone,
  UserPlus,
  Search,
  Wallet,
  Store,
  UserCircle,
  LogIn,
  User
} from 'lucide-react';
import { Logo } from './Logo';
import { NotificationCenter } from './NotificationCenter';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  audience?: 'INDIVIDUALS' | 'BUSINESSES';
  setAudience?: (audience: 'INDIVIDUALS' | 'BUSINESSES') => void;
  onOpenLogin?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ audience = 'INDIVIDUALS', setAudience, onOpenLogin, searchQuery: externalQuery, onSearchChange }) => {
  const { lang, setLang, t, isRtl } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState('');
  const navigate = useNavigate();

  const searchQuery = externalQuery ?? internalQuery;
  const setSearchQuery = (q: string) => {
    if (onSearchChange) onSearchChange(q);
    else setInternalQuery(q);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 ${isRtl ? 'rtl' : 'ltr'}`}>
        {/* Glassmorphism header */}
        <div className="bg-zinc-950/70 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              {/* Left: Logo */}
              <Link to="/" className="flex items-center gap-3 cursor-pointer group shrink-0">
                <Logo size="sm" />
              </Link>

              {/* Center: Search Bar (desktop) */}
              <div className="hidden md:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full group">
                  <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-brand-yellow transition-colors`} />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full bg-white/[0.03] border border-white/[0.06] rounded-xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-brand-yellow/20 focus:border-brand-yellow/30 transition-all placeholder:text-zinc-600 hover:bg-white/[0.05] hover:border-white/[0.1]`}
                  />
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                {/* Mobile Search Toggle */}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="md:hidden p-2 text-zinc-400 hover:text-brand-yellow transition-colors rounded-lg hover:bg-white/5"
                >
                  <Search className="w-5 h-5" />
                </button>

                {isAuthenticated && (
                  <>
                    <button onClick={() => navigate('/dashboard')} className="p-2 text-zinc-400 hover:text-brand-yellow transition-colors rounded-lg hover:bg-white/5">
                      <Wallet className="w-5 h-5" />
                    </button>
                    <NotificationCenter lang={lang} isRtl={isRtl} />
                  </>
                )}

                {/* Language Switcher */}
                <button
                  onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                  className="p-2 text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 rounded-lg hover:bg-white/5"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-[10px] font-bold hidden sm:inline uppercase tracking-wider">{t.switchLang}</span>
                </button>

                {/* Hamburger Menu */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-white hover:text-brand-yellow transition-colors rounded-lg hover:bg-white/5"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:hidden overflow-hidden pb-3"
                >
                  <div className="relative group">
                    <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-brand-yellow transition-colors`} />
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full bg-white/[0.03] border border-white/[0.06] rounded-xl ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 text-sm text-white outline-none focus:ring-2 focus:ring-brand-yellow/20 transition-all placeholder:text-zinc-600`}
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className={isRtl ? 'rtl' : 'ltr'}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: isRtl ? -320 : 320 }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? -320 : 320 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className={`fixed top-0 ${isRtl ? 'left-0' : 'right-0'} h-full w-[280px] sm:w-[300px] bg-zinc-950 border-x border-white/[0.06] z-[70] p-6 sm:p-8 shadow-2xl overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-8">
                <Logo size="sm" showText={false} />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {/* Register */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 text-sm font-display font-medium text-zinc-400 hover:text-brand-yellow cursor-pointer transition-all group p-3 rounded-xl hover:bg-white/[0.03]"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:bg-brand-yellow/10 group-hover:border-brand-yellow/20 transition-all">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  {t.register}
                </motion.div>

                {/* Login */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 text-sm font-display font-medium text-zinc-400 hover:text-brand-yellow cursor-pointer transition-all group p-3 rounded-xl hover:bg-white/[0.03]"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:bg-brand-yellow/10 group-hover:border-brand-yellow/20 transition-all">
                    <LogIn className="w-4 h-4" />
                  </div>
                  {t.login}
                </motion.div>

                {/* Business */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => { setAudience?.('BUSINESSES'); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 text-sm font-display font-medium text-zinc-400 hover:text-brand-yellow cursor-pointer transition-all group p-3 rounded-xl hover:bg-white/[0.03]"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:bg-brand-yellow/10 group-hover:border-brand-yellow/20 transition-all">
                    <Store className="w-4 h-4" />
                  </div>
                  {t.businessOwners}
                </motion.div>

                {/* Personal */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  onClick={() => { setAudience?.('INDIVIDUALS'); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 text-sm font-display font-medium text-zinc-400 hover:text-brand-yellow cursor-pointer transition-all group p-3 rounded-xl hover:bg-white/[0.03]"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:bg-brand-yellow/10 group-hover:border-brand-yellow/20 transition-all">
                    <UserCircle className="w-4 h-4" />
                  </div>
                  {t.personal}
                </motion.div>

                <div className="gold-divider my-4" />

                {/* Dashboard */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 text-sm font-display font-medium text-zinc-400 hover:text-brand-yellow cursor-pointer transition-all group p-3 rounded-xl hover:bg-white/[0.03]"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:bg-brand-yellow/10 group-hover:border-brand-yellow/20 transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  {t.navDashboard}
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  onClick={() => { navigate('/'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 100); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 text-sm font-display font-medium text-zinc-400 hover:text-brand-yellow cursor-pointer transition-all group p-3 rounded-xl hover:bg-white/[0.03]"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:bg-brand-yellow/10 group-hover:border-brand-yellow/20 transition-all">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  {t.navFeatures}
                </motion.div>

                {/* Admin Login */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => { navigate('/admin/login'); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 text-sm font-display font-medium text-zinc-400 hover:text-brand-yellow cursor-pointer transition-all group p-3 rounded-xl hover:bg-white/[0.03]"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:bg-brand-yellow/10 group-hover:border-brand-yellow/20 transition-all">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  {t.adminLogin}
                </motion.div>
              </div>

              {isAuthenticated && user ? (
                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-yellow to-yellow-600 flex items-center justify-center text-zinc-950 font-bold text-sm shadow-lg">
                      {user.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">{user.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-xs font-bold transition-colors p-3 rounded-xl hover:bg-red-500/5 border border-transparent hover:border-red-500/10"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.logout}
                  </button>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
