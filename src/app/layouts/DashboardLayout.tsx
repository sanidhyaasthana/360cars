import React, { useState } from 'react';
import {
  LayoutDashboard,
  Clock,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  LogIn,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  Store,
  Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSubView?: string;
  setActiveSubView?: (view: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeSubView = 'dashboard', 
  setActiveSubView 
}) => {
  const { user, logout } = useAuth();
  const { t, isRtl, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await fetch(`/api/admin/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const menuItems = user?.role === 'SUPER_ADMIN' ? [
    { id: 'overview', icon: LayoutDashboard, label: t.navDashboard },
    { id: 'companies', icon: Store, label: t.companyManagement },
    { id: 'financial', icon: TrendingUp, label: t.financialStatus },
    { id: 'wallet', icon: Wallet, label: t.wallet },
  ] : [
    { id: 'main', icon: LayoutDashboard, label: t.dashboard },
    { id: 'pending', icon: Clock, label: t.pendingRequests },
    { id: 'sales', icon: TrendingUp, label: t.sales },
    { id: 'purchases', icon: ShoppingCart, label: t.purchases },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  const SidebarItem = ({ id, icon: Icon, label, active = false }: any) => (
    <motion.div 
      whileHover={{ x: isRtl ? -4 : 4 }}
      onClick={() => {
        if (setActiveSubView) setActiveSubView(id);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all relative group ${
        active 
          ? 'bg-gradient-to-r from-brand-yellow/20 to-transparent text-brand-yellow border-l-2 border-brand-yellow shadow-[0_0_20px_rgba(250,204,21,0.1)]' 
          : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-brand-yellow drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : ''}`} />
      <span className="text-sm font-medium">{label}</span>
      {active && (
        <div className="absolute inset-0 bg-brand-yellow/5 blur-xl -z-10 rounded-xl" />
      )}
    </motion.div>
  );

  const SidebarContent = () => (
    <>
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-yellow to-yellow-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)]">
          <span className="text-zinc-950 font-display font-bold text-2xl">3</span>
        </div>
        <span className="text-xl font-display font-bold bg-gradient-to-r from-brand-yellow to-yellow-600 bg-clip-text text-transparent">360Cars</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.id} 
            id={item.id}
            icon={item.icon} 
            label={item.label} 
            active={activeSubView === item.id} 
          />
        ))}
      </nav>

      <div className="p-6 border-t border-white/5" />
    </>
  );

  return (
    <div className={`min-h-screen bg-[#09090b] text-zinc-200 flex ${isRtl ? 'rtl' : 'ltr'} font-sans overflow-hidden`}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-white/5 bg-[#0c0c0e] flex-col sticky top-0 h-screen z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: isRtl ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? 300 : -300 }}
              className={`fixed top-0 ${isRtl ? 'right-0' : 'left-0'} h-full w-64 bg-[#0c0c0e] border-r border-white/5 z-[70] flex flex-col lg:hidden shadow-2xl`}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-brand-yellow transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-sm md:text-lg font-bold text-white">{lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Administrator Panel'}</h1>
              <span className="text-[10px] md:text-xs text-zinc-500">{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex items-center bg-zinc-900/50 border border-white/5 rounded-lg p-1">
              <button 
                onClick={() => setLang('ar')}
                className={`px-2 md:px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === 'ar' ? 'bg-brand-yellow text-zinc-950 shadow-lg shadow-yellow-500/20' : 'text-zinc-500 hover:text-white'}`}
              >
                AR
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-2 md:px-3 py-1 text-[10px] font-bold rounded-md transition-all ${lang === 'en' ? 'bg-brand-yellow text-zinc-950 shadow-lg shadow-yellow-500/20' : 'text-zinc-500 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-4 border-r border-white/5 pr-3 md:pr-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder={t.search} 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-zinc-900/50 border border-white/5 rounded-xl pl-10 pr-4 py-1.5 text-[10px] outline-none focus:ring-1 focus:ring-brand-yellow text-white w-40 md:w-64" 
                />
                {searchResults && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-2xl p-4 z-[100] max-h-[400px] overflow-y-auto">
                    <h4 className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest mb-3">Search Results</h4>
                    {searchResults.requests.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[8px] text-zinc-500 uppercase mb-2">Companies</p>
                        {searchResults.requests.map((r: any) => (
                          <div key={r.id} className="p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                            <p className="text-xs font-bold text-white">{r.center_name || r.name}</p>
                            <p className="text-[9px] text-zinc-500">{r.commercial_registration}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchResults.bookings.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[8px] text-zinc-500 uppercase mb-2">Bookings</p>
                        {searchResults.bookings.map((b: any) => (
                          <div key={b.id} className="p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                            <p className="text-xs font-bold text-white">{b.customer_name}</p>
                            <p className="text-[9px] text-zinc-500">{b.service_name} - {b.time_slot}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchResults.customers.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[8px] text-zinc-500 uppercase mb-2">Customers</p>
                        {searchResults.customers.map((c: any) => (
                          <div key={c.id} className="p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                            <p className="text-xs font-bold text-white">{c.name}</p>
                            <p className="text-[9px] text-zinc-500">{c.phone}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {!searchResults.requests.length && !searchResults.bookings.length && !searchResults.customers.length && (
                      <p className="text-xs text-zinc-500 text-center py-4">No results found</p>
                    )}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setActiveSubView && setActiveSubView('pending')}
                className="p-1.5 md:p-2 text-zinc-400 hover:text-brand-yellow transition-colors relative"
              >
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                <span className="absolute top-1.5 md:top-2 right-1.5 md:right-2 w-1.5 md:w-2 h-1.5 md:h-2 bg-brand-yellow rounded-full border-2 border-[#09090b]" />
              </button>
            </div>

            <div className="relative">
              <div
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 md:gap-3 group cursor-pointer"
              >
                <div className="flex flex-col items-end">
                  <span className="text-xs md:text-sm font-bold text-white group-hover:text-brand-yellow transition-colors">{user?.business?.center_name || user?.name || 'Sahar Moqbel'}</span>
                  <span className="text-[8px] md:text-[10px] text-zinc-500 uppercase tracking-widest">{user?.role === 'BUSINESS_OWNER' ? t.businessOwner : t.admin}</span>
                </div>
                <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-zinc-500 group-hover:text-brand-yellow transition-all ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-[80]" onClick={() => setIsProfileDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-2 w-48 bg-[#0c0c0e] border border-white/10 rounded-xl shadow-2xl z-[90] overflow-hidden`}
                    >
                      <button
                        onClick={() => { setIsProfileDropdownOpen(false); navigate('/login/businesses'); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-zinc-400 hover:text-brand-yellow hover:bg-white/5 transition-colors"
                      >
                        <LogIn className="w-4 h-4" />
                        {t.login}
                      </button>
                      <div className="border-t border-white/5" />
                      <button
                        onClick={() => { setIsProfileDropdownOpen(false); logout(); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-mesh scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
};
