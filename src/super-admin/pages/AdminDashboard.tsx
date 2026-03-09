import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Wallet,
  FileText,
  ChevronDown,
  Calendar,
  LogOut,
  Globe,
  ShieldCheck,
  LayoutDashboard,
  Smartphone,
  UserPlus,
  ArrowRight,
  Power,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdminDashboardProps {
  t: any;
  lang: string;
  isRtl: boolean;
  activeView: SubView;
  setActiveView: (view: SubView) => void;
}

type SubView = 'overview' | 'companies' | 'financial' | 'wallet';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ t, lang, isRtl }) => {
  const { logout } = useAuth();
  const { setLang } = useLanguage();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<SubView>('overview');
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [financials, setFinancials] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalWashes: 0,
    totalCollected: 0,
    totalReceivables: 0,
    totalCustomers: 0,
    totalCompanies: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);

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

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats({
        activeUsers: data.activeUsers,
        totalWashes: data.totalWashes,
        totalCollected: data.totalRevenue,
        totalReceivables: data.totalReceivables,
        totalCustomers: data.customerCount,
        totalCompanies: data.businessCount
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/admin/businesses');
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const fetchFinancials = async () => {
    try {
      const res = await fetch('/api/admin/financials');
      const data = await res.json();
      setFinancials(data);
    } catch (err) {
      console.error('Error fetching financials:', err);
    }
  };

  const fetchReports = async (businessId: number) => {
    try {
      const res = await fetch(`/api/admin/reports/${businessId}`);
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCompanies();
    fetchFinancials();

    const interval = setInterval(() => {
      fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'APPROVED' ? 'REJECTED' : 'APPROVED';
    try {
      const res = await fetch(`/api/admin/businesses/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchCompanies();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const financialData = [
    { name: t.january, collected: 15000, receivables: 20000 },
    { name: t.february, collected: 18000, receivables: 22000 },
    { name: t.march, collected: 22000, receivables: 25000 },
    { name: t.april, collected: 20000, receivables: 24000 },
    { name: t.may, collected: 25000, receivables: 28000 },
    { name: t.june, collected: 28000, receivables: 32000 },
  ];

  const transactionReport = [
    { id: 'TX-001', date: '2026-02-28 14:30', customer: 'Ahmed Ali', phone: '0501234567', service: 'Full Wash', amount: '150' },
    { id: 'TX-002', date: '2026-02-28 12:15', customer: 'Sara Mohammed', phone: '0559876543', service: 'Interior Cleaning', amount: '80' },
    { id: 'TX-003', date: '2026-02-27 18:45', customer: 'Khalid Abdullah', phone: '0544443322', service: 'Polishing', amount: '300' },
    { id: 'TX-004', date: '2026-02-27 10:00', customer: 'Noura Salem', phone: '0566667788', service: 'Full Wash', amount: '150' },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111111] p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-yellow/5 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-brand-yellow/10 transition-all" />
          <div className="w-10 h-10 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center mb-4"><Users className="w-5 h-5" /></div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{t.activeUsers}</p>
          <p className="text-2xl font-bold text-white gold-glow">{stats.activeUsers}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#111111] p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-yellow/5 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-brand-yellow/10 transition-all" />
          <div className="w-10 h-10 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center mb-4"><Activity className="w-5 h-5" /></div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{t.platformWashes}</p>
          <p className="text-2xl font-bold text-white gold-glow">{stats.totalWashes.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#111111] p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-yellow/5 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-brand-yellow/10 transition-all" />
          <div className="w-10 h-10 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center mb-4"><DollarSign className="w-5 h-5" /></div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{t.totalCollectedAmounts}</p>
          <p className="text-2xl font-bold text-white gold-glow">{stats.totalCollected.toLocaleString()} {t.sar}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#111111] p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-yellow/5 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-brand-yellow/10 transition-all" />
          <div className="w-10 h-10 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center mb-4"><Clock className="w-5 h-5" /></div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{t.totalReceivables}</p>
          <p className="text-2xl font-bold text-white gold-glow">{stats.totalReceivables.toLocaleString()} {t.sar}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#111111] p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-yellow/5 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-brand-yellow/10 transition-all" />
          <div className="w-10 h-10 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center mb-4"><Users className="w-5 h-5" /></div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{t.totalCustomers}</p>
          <p className="text-2xl font-bold text-white gold-glow">{stats.totalCustomers.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#111111] p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-yellow/5 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-brand-yellow/10 transition-all" />
          <div className="w-10 h-10 bg-brand-yellow/10 text-brand-yellow rounded-xl flex items-center justify-center mb-4"><Store className="w-5 h-5" /></div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{t.totalCompanies}</p>
          <p className="text-2xl font-bold text-white gold-glow">{stats.totalCompanies.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Financial Analysis Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111111] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white">{t.financialAnalysis}</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Monthly Performance Comparison</p>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px' }} />
              <Line type="monotone" dataKey="collected" name={t.totalCollectedAmounts} stroke="#C9A227" strokeWidth={3} dot={{ r: 4, fill: '#C9A227' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="receivables" name={t.totalReceivables} stroke="#ffffff20" strokeWidth={3} dot={{ r: 4, fill: '#ffffff20' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );

  const renderCompanies = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold gold-gradient">{t.companyManagement}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder={t.search} 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-[#111111] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white w-64" 
          />
        </div>
      </div>
      <div className="bg-[#111111] rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-950/50 text-zinc-500 uppercase tracking-widest">
                <th className="px-8 py-5 font-bold">{t.centerName}</th>
                <th className="px-8 py-5 font-bold">{t.crNumber}</th>
                <th className="px-8 py-5 font-bold">{t.taxNumber}</th>
                <th className="px-8 py-5 font-bold">{t.registrationDate}</th>
                <th className="px-8 py-5 font-bold">{t.accountStatus}</th>
                <th className="px-8 py-5 font-bold">{t.procedures}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5 font-bold text-white">{company.center_name || company.name}</td>
                  <td className="px-8 py-5 text-zinc-400">{company.commercial_registration || 'N/A'}</td>
                  <td className="px-8 py-5 text-zinc-400">{company.tax_number || 'N/A'}</td>
                  <td className="px-8 py-5 text-zinc-400">{new Date(company.created_at).toLocaleDateString()}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${company.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {company.status === 'APPROVED' ? t.active : t.inactive}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => handleToggleStatus(company.id, company.status)}
                      className={`p-2 rounded-lg transition-all ${company.status === 'APPROVED' ? 'text-red-500 hover:bg-red-500/10' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
                      title={company.status === 'APPROVED' ? t.deactivate : t.activate}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold gold-gradient">{t.financialStatus}</h2>
      <div className="bg-[#111111] rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-950/50 text-zinc-500 uppercase tracking-widest">
                <th className="px-8 py-5 font-bold">{t.centerName}</th>
                <th className="px-8 py-5 font-bold">{t.totalRevenue}</th>
                <th className="px-8 py-5 font-bold">{t.pendingInvoices}</th>
                <th className="px-8 py-5 font-bold">{t.amountPaid}</th>
                <th className="px-8 py-5 font-bold">{t.procedures}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {financials.map((fin) => (
                <tr key={fin.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5 font-bold text-white">{fin.center_name || fin.business_name}</td>
                  <td className="px-8 py-5 text-zinc-400">{(fin.total_revenue || 0).toLocaleString()} {t.sar}</td>
                  <td className="px-8 py-5 text-brand-yellow font-bold">{(fin.total_revenue * 0.2).toLocaleString()} {t.sar}</td>
                  <td className="px-8 py-5 text-emerald-500 font-bold">{(fin.total_revenue * 0.8).toLocaleString()} {t.sar}</td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => { setSelectedCompany(fin); fetchReports(fin.id); setShowReportPopup(true); }}
                      className="flex items-center gap-2 text-brand-yellow hover:underline font-bold"
                    >
                      <FileText className="w-4 h-4" />
                      {t.reports}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold gold-gradient">{t.wallet}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financials.map((fin) => (
          <motion.div key={fin.id} whileHover={{ y: -5 }} className="bg-[#111111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-yellow/10 rounded-2xl flex items-center justify-center text-brand-yellow font-bold text-lg">
                {fin.center_name?.[0] || fin.business_name?.[0]}
              </div>
              <div>
                <h3 className="text-white font-bold">{fin.center_name || fin.business_name}</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.walletBalance}</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <p className="text-3xl font-display font-bold gold-gradient">{(fin.total_revenue * 0.1).toFixed(0)}</p>
              <span className="text-brand-yellow font-bold text-sm">{t.sar}</span>
            </div>
            <button className="w-full py-3 bg-[#0B0B0B] border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-brand-yellow hover:text-zinc-950 transition-all">
              {t.settlement}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-[#0B0B0B] text-white font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'overview' && renderOverview()}
            {activeView === 'companies' && renderCompanies()}
            {activeView === 'financial' && renderFinancial()}
            {activeView === 'wallet' && renderWallet()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Transaction Report Popup */}
      <AnimatePresence>
        {showReportPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#111111] w-full max-w-5xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative">
              <button onClick={() => setShowReportPopup(false)} className="absolute top-8 right-8 p-2 text-zinc-500 hover:text-white transition-colors z-10">
                <XCircle className="w-8 h-8" />
              </button>
              <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white gold-glow">{t.transactionReport}</h2>
                    <p className="text-brand-yellow font-bold mt-1">{selectedCompany?.center_name || selectedCompany?.name}</p>
                    <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest">{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">{t.totalRevenue}</p>
                    <p className="text-2xl font-display font-bold text-white">15,000 {t.sar}</p>
                  </div>
                </div>
                <div className="bg-[#0B0B0B] rounded-[2rem] border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-zinc-950/50 text-zinc-500 uppercase tracking-widest">
                          <th className="px-8 py-5 font-bold">{t.serialNumber}</th>
                          <th className="px-8 py-5 font-bold">{t.dateTime}</th>
                          <th className="px-8 py-5 font-bold">{t.theName}</th>
                          <th className="px-8 py-5 font-bold">{t.phone}</th>
                          <th className="px-8 py-5 font-bold">{t.service}</th>
                          <th className="px-8 py-5 font-bold text-brand-yellow">{t.amountPaid}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {reports.map((tx, i) => (
                          <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-8 py-5 text-zinc-500">{tx.id}</td>
                            <td className="px-8 py-5 text-zinc-400">{new Date(tx.wash_date).toLocaleString()}</td>
                            <td className="px-8 py-5 font-bold text-white">{tx.customer_name || 'N/A'}</td>
                            <td className="px-8 py-5 text-zinc-400">{tx.customer_phone || 'N/A'}</td>
                            <td className="px-8 py-5 text-zinc-400">{tx.service_name || 'N/A'}</td>
                            <td className="px-8 py-5 font-bold text-brand-yellow">{tx.price} {t.sar}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                  <button onClick={() => setShowReportPopup(false)} className="px-8 py-3 bg-[#0B0B0B] border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-all">{t.close}</button>
                  <button className="px-8 py-3 bg-gradient-to-r from-brand-yellow to-yellow-600 text-zinc-950 rounded-xl text-xs font-bold shadow-lg shadow-yellow-500/10 transition-all flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {t.printReport}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


