import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Phone, 
  Calendar, 
  Globe, 
  QrCode, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronRight,
  ArrowLeft,
  Save,
  Car as CarIcon,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, lang, setLang, isRtl } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [isEditing, setIsEditing] = useState(false);

  const [cars, setCars] = useState<any[]>(() => {
    if (user?.cars) {
      try { return JSON.parse(user.cars); } catch { return []; }
    }
    return [];
  });

  const handleSave = () => {
    // In a real app, call API to update profile
    setIsEditing(false);
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <div className={`min-h-screen bg-[#0B0B0B] text-white font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white">
              <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            <h1 className="text-sm font-bold text-white">{t.profile}</h1>
          </div>
          {isEditing ? (
            <button onClick={handleSave} className="text-brand-yellow font-bold text-sm flex items-center gap-2">
              <Save className="w-4 h-4" />
              {t.save}
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="text-zinc-400 font-bold text-sm flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              {t.edit}
            </button>
          )}
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-lg mx-auto space-y-8">
        {/* Profile Info Card */}
        <section className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-3xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow shadow-2xl">
              <User className="w-12 h-12" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">{t.editName}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-sm outline-none focus:border-brand-yellow/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">{t.editPhone}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-sm outline-none focus:border-brand-yellow/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  placeholder="example@mail.com"
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-sm outline-none focus:border-brand-yellow/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  placeholder="example@mail.com"
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-sm outline-none focus:border-brand-yellow/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">{t.dob}</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-zinc-950 border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-sm outline-none focus:border-brand-yellow/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Settings List */}
        <section className="space-y-3">
          <button 
            onClick={toggleLanguage}
            className="w-full bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-400">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">{t.switchLang}</h4>
                <p className="text-[10px] text-zinc-500">{lang === 'en' ? 'Switch to Arabic' : 'التحويل للإنجليزية'}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-brand-yellow transition-colors" />
          </button>

          <button 
            className="w-full bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-brand-yellow">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">{t.scanQr}</h4>
                <p className="text-[10px] text-zinc-500">Scan to enter a car wash center</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-brand-yellow transition-colors" />
          </button>
        </section>

        {/* Manage Cars Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{t.manageCars}</h3>
            <button className="w-8 h-8 rounded-full bg-brand-yellow/10 flex items-center justify-center text-brand-yellow hover:bg-brand-yellow hover:text-zinc-950 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {cars.map(car => (
              <div key={car.id} className="bg-zinc-900/50 p-4 rounded-3xl border border-white/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-white/5 p-2 flex items-center justify-center">
                    <img src={car.logo} alt={car.brand} className="w-full h-full object-contain opacity-80" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{car.brand} {car.model}</h4>
                    <p className="text-[10px] text-zinc-500">{car.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-zinc-600 hover:text-brand-yellow transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Logout Button */}
        <button 
          onClick={() => logout()}
          className="w-full py-5 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
        >
          {t.logout}
        </button>
      </main>
    </div>
  );
};
