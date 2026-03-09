import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Tag, 
  Map, 
  CreditCard, 
  UserPlus, 
  DollarSign, 
  Plus, 
  X, 
  Trash2, 
  Edit3, 
  Box, 
  Car, 
  Undo2,
  Clock,
  CheckCircle2,
  MapPin,
  Users,
  Share2,
  Printer,
  LogOut,
  ArrowLeft,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Activity,
  MoreHorizontal,
  ChevronDown,
  ShoppingCart,
  Smartphone
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import TicketSystem from '../components/TicketSystem';
import { AdministratorUserManagement } from '../components/AdministratorUserManagement';
import { DatePicker } from '../../shared/components/DatePicker';

import { useAuth } from '../../contexts/AuthContext';

import { useLanguage } from '../../contexts/LanguageContext';

interface BusinessDashboardProps {
  offers: any[];
  setOffers: (offers: any[]) => void;
  branches: any[];
  setBranches: (branches: any[]) => void;
  giftCards: any[];
  setGiftCards: (giftCards: any[]) => void;
  plans: any[];
  setPlans: (plans: any[]) => void;
  services: any[];
  setServices: (services: any[]) => void;
  purchases: any[];
  setPurchases: (purchases: any[]) => void;
  activeSubView: string;
  setActiveSubView: (view: string) => void;
  t: any;
  lang: string;
  isRtl: boolean;
  setNotification: (notif: any) => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  offers, setOffers,
  branches, setBranches,
  giftCards, setGiftCards,
  plans, setPlans,
  services, setServices,
  purchases, setPurchases,
  activeSubView, setActiveSubView,
  t, lang, isRtl,
  setNotification
}) => {
  const { user, hasPermission, logout, setUser } = useAuth();
  const { setLang } = useLanguage();
  const [localNotification, setLocalNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [customerFilter, setCustomerFilter] = useState<'week' | 'month' | 'year'>('month');
  const [salesFilters, setSalesFilters] = useState({
    date: '',
    name: '',
    mobile: '',
    service: ''
  });

  // Best Customers Data is now fetched from dashboardStats

  useEffect(() => {
    if (localNotification) {
      const timer = setTimeout(() => setLocalNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [localNotification]);

  const showNotification = (notif: any) => {
    setLocalNotification(notif);
    setNotification(notif);
  };

  const SubPageHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="flex items-center justify-between mb-8 bg-zinc-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
      {!isRtl ? (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all border border-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.returnToSettings}
        </button>
      ) : (
        <div className="flex bg-zinc-800 p-1 rounded-lg border border-white/5">
          <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${lang === 'en' ? 'bg-brand-yellow text-zinc-950' : 'text-zinc-500 hover:text-white'}`}>EN</button>
          <button onClick={() => setLang('ar')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${lang === 'ar' ? 'bg-brand-yellow text-zinc-950' : 'text-zinc-500 hover:text-white'}`}>AR</button>
        </div>
      )}
      
      <h2 className="text-xl font-display font-bold text-brand-yellow">{title}</h2>
      
      {isRtl ? (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all border border-white/5"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          {t.returnToSettings}
        </button>
      ) : (
        <div className="flex bg-zinc-800 p-1 rounded-lg border border-white/5">
          <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${lang === 'en' ? 'bg-brand-yellow text-zinc-950' : 'text-zinc-500 hover:text-white'}`}>EN</button>
          <button onClick={() => setLang('ar')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${lang === 'ar' ? 'bg-brand-yellow text-zinc-950' : 'text-zinc-500 hover:text-white'}`}>AR</button>
        </div>
      )}
    </div>
  );

  const WalletCard = () => (
    <div 
      onClick={() => setShowWalletReport(true)}
      className="bg-zinc-900/80 p-5 rounded-[2rem] border border-white/10 shadow-xl backdrop-blur-sm relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all active:scale-95 w-full"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-brand-yellow/10 transition-all" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-yellow/10 rounded-xl">
              <Wallet className="w-4 h-4 text-brand-yellow" />
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.wallet}</p>
          </div>
          <div className="flex -space-x-2 rtl:space-x-reverse">
            <div className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center">
              <DollarSign className="w-3 h-3 text-emerald-500" />
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center">
              <CreditCard className="w-3 h-3 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="flex items-end gap-2 mb-4">
          <h3 className="text-3xl font-display font-bold text-white">{walletBalance.toLocaleString()}</h3>
          <span className="text-brand-yellow font-bold text-xs mb-1.5">{t.sar}</span>
        </div>

        {/* Advantages / Features */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] text-zinc-400 font-medium">{t.onlinePayments}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[9px] text-zinc-400 font-medium">{t.settlement}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
            <span className="text-[9px] text-zinc-400 font-medium">{t.manageRevenue}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            <span className="text-[9px] text-zinc-400 font-medium">{lang === 'en' ? 'Instant Reports' : 'تقارير فورية'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: '',
    billingPeriod: 'monthly',
    totalWashes: '1',
    features: [] as string[],
    isPopular: false
  });

  const [newService, setNewService] = useState({
    code: '',
    name: '',
    description: '',
    prices: {
      small: '0',
      average: '0',
      large: '0',
      general: '0'
    }
  });

  const [newOffer, setNewOffer] = useState({
    name: '',
    code: '',
    discount: '',
    startDate: '',
    expiryDate: '',
    details: ''
  });

  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    commercialRegistration: '',
    mapLink: '',
    branchNumber: ''
  });

  const [newGiftCard, setNewGiftCard] = useState({
    senderName: '',
    recipientMobile: '',
    serviceId: '',
    price: '',
    description: '',
    isRedeemed: false
  });

  const [featureInput, setFeatureInput] = useState('');

  const [newPurchase, setNewPurchase] = useState({
    date: new Date().toISOString().split('T')[0],
    content: '',
    price: '',
    expenseType: 'other',
    addVat: false,
    attachment: null as File | null
  });

  const [purchaseFilters, setPurchaseFilters] = useState({
    type: 'all',
    date: ''
  });

  const [companyImages, setCompanyImages] = useState<string[]>(user?.business?.images ? JSON.parse(user.business.images) : []);
  const [companyLogo, setCompanyLogo] = useState<string>(user?.business?.logo || '');
  const [companyInfo, setCompanyInfo] = useState({
    name: user?.business?.center_name || user?.name || '',
    username: user?.name || '',
    phone: user?.phone || '',
    address: user?.business?.address || '',
    crNumber: user?.business?.commercial_registration || '',
    taxNumber: user?.business?.tax_number || '',
    mapLink: user?.business?.map_link || '',
    bookingFee: user?.business?.booking_fee || 0,
    autoConfirm: user?.business?.auto_confirm_bookings === 1,
    openingTime: user?.business?.opening_time || '08:00',
    closingTime: user?.business?.closing_time || '23:00'
  });

  const handleUploadLogo = async (url: string) => {
    try {
      const res = await fetch('/api/business/upload-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: user?.business?.id, logoUrl: url })
      });
      if (res.ok) {
        setCompanyLogo(url);
        setNotification({ message: lang === 'en' ? 'Logo updated' : 'تم تحديث الشعار', type: 'success' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadImages = async (urls: string[]) => {
    try {
      const res = await fetch('/api/business/upload-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: user?.business?.id, imageUrls: urls })
      });
      if (res.ok) {
        setCompanyImages(urls);
        setNotification({ message: lang === 'en' ? 'Images updated' : 'تم تحديث الصور', type: 'success' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.business) {
      setCompanyInfo({
        name: user.business.center_name || user.name,
        username: user.name,
        phone: user.phone,
        address: user.business.address || '',
        crNumber: user.business.commercial_registration || '',
        taxNumber: user.business.tax_number || '',
        mapLink: user.business.map_link || '',
        bookingFee: user.business.booking_fee || 0,
        autoConfirm: user.business.auto_confirm_bookings === 1
      });
      if (user.business.images) {
        setCompanyImages(JSON.parse(user.business.images));
      }
    }
  }, [user]);

  const [centerPolicy, setCenterPolicy] = useState({
    number: '',
    description: ''
  });
  const [centerPolicies, setCenterPolicies] = useState<any[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrModalData, setQrModalData] = useState<{name: string, value: string} | null>(null);
  const [showWalletReport, setShowWalletReport] = useState(false);
  const [walletTransactions, setWalletTransactions] = useState([
    { id: 1, type: 'payment', amount: 150.00, date: '2026-02-28', description: 'Online Payment - Order #1234' },
    { id: 2, type: 'payment', amount: 300.00, date: '2026-02-27', description: 'Online Payment - Order #1235' },
    { id: 3, type: 'settlement', amount: -200.00, date: '2026-02-25', description: 'Weekly Settlement' },
    { id: 4, type: 'payment', amount: 450.00, date: '2026-02-24', description: 'Online Payment - Order #1236' },
    { id: 5, type: 'settlement', amount: -150.00, date: '2026-02-20', description: 'Service Fee Settlement' },
  ]);
  const [sales, setSales] = useState<any[]>([]);
  const [selectedSales, setSelectedSales] = useState<number[]>([]);
  const [walletBalance, setWalletBalance] = useState(1250.50);
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState<any>(null);
  const [checkoutData, setCheckoutData] = useState({ discount: 0, paymentMethod: 'CASH' });

  const fetchActiveRequests = async () => {
    try {
      const res = await fetch(`/api/washes/active?businessId=${user?.business?.id}`);
      const data = await res.json();
      setActiveRequests(data);
    } catch (e) { console.error(e); }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/bookings/business?businessId=${user?.business?.id}`);
      const data = await res.json();
      setActiveBookings(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (user?.business?.id) {
      fetchActiveRequests();
      fetchBookings();
    }
  }, [user?.business?.id]);

  const handleUpdateWashStatus = async (washId: number, status: string) => {
    try {
      const res = await fetch('/api/washes/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ washId, status })
      });
      if (res.ok) {
        fetchActiveRequests();
        showNotification({ message: lang === 'en' ? 'Status updated' : 'تم تحديث الحالة', type: 'success' });
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateBookingStatus = async (bookingId: number, status: string) => {
    try {
      const res = await fetch('/api/bookings/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status })
      });
      if (res.ok) {
        fetchBookings();
        showNotification({ message: lang === 'en' ? 'Booking updated' : 'تم تحديث الحجز', type: 'success' });
      }
    } catch (e) { console.error(e); }
  };

  const handleCompletePayment = async () => {
    try {
      const totalPrice = showCheckoutModal.price - checkoutData.discount;
      const res = await fetch('/api/washes/complete-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          washId: showCheckoutModal.id,
          discountAmount: checkoutData.discount,
          paymentMethod: checkoutData.paymentMethod,
          totalPrice
        })
      });
      if (res.ok) {
        setShowCheckoutModal(null);
        fetchActiveRequests();
        showNotification({ message: lang === 'en' ? 'Payment completed' : 'تم إكمال الدفع بنجاح', type: 'success' });
      }
    } catch (e) { console.error(e); }
  };

  const [currentBranchId, setCurrentBranchId] = useState(1);
  const currentBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const handleSyncSettings = async () => {
    if (branches.length <= 1) {
      showNotification({ message: lang === 'en' ? 'No other branches to sync to' : 'لا توجد فروع أخرى للمزامنة معها', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/business/sync-branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: user?.id,
          mainBranchId: currentBranchId
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification({ message: lang === 'en' ? 'Settings synced to all branches successfully' : 'تمت مزامنة الإعدادات لجميع الفروع بنجاح', type: 'success' });
      }
    } catch (err) {
      showNotification({ message: 'Error syncing settings', type: 'error' });
    }
  };

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  const fetchDashboardStats = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/business/dashboard-stats?ownerId=${user.id}`);
      const data = await res.json();
      setDashboardStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  const chartData = dashboardStats?.weeklyData?.length > 0 ? 
    dashboardStats.weeklyData.map((d: any, i: number) => ({
      name: d.date.split('-')[2], // Day part
sales: Number(d.count || 0),
      purchases: dashboardStats.weeklyExpenses.find((e: any) => e.date === d.date)?.purchases || 0
    })) : [
      { name: 'Sun', sales: 0, purchases: 0 },
      { name: 'Mon', sales: 0, purchases: 0 },
      { name: 'Tue', sales: 0, purchases: 0 },
      { name: 'Wed', sales: 0, purchases: 0 },
      { name: 'Thu', sales: 0, purchases: 0 },
      { name: 'Fri', sales: 0, purchases: 0 },
      { name: 'Sat', sales: 0, purchases: 0 },
    ];

  const bestCustomersData = dashboardStats?.topCustomers || [];

  const [newSale, setNewSale] = useState({
    customerName: '',
    customerPhone: '',
    carDetails: '',
    serviceId: '',
    price: '',
    paymentMethod: 'Cash',
    notes: '',
    code: ''
  });

  const handleAddSale = async () => {
    if (!newSale.customerName || !newSale.serviceId || !newSale.price) {
      showNotification({ message: t.incompleteData, type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/washes/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSale,
          businessId: user?.id,
          washDate: new Date().toISOString()
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification({ message: lang === 'en' ? 'Sale added successfully' : 'تم إضافة العملية بنجاح', type: 'success' });
        setShowAddSaleModal(false);
        setNewSale({ customerName: '', customerPhone: '', carDetails: '', serviceId: '', price: '', paymentMethod: 'Cash', notes: '', code: '' });
        fetchDashboardStats();
        // Refresh sales
        const salesRes = await fetch(`/api/washes?businessId=${user?.id}`);
        const salesData = await salesRes.json();
        setSales(salesData.map((w: any) => ({
          id: w.id,
          date: w.wash_date.split('T')[0],
          customer: w.customer_name || 'Guest',
          car: w.car_details || 'Unknown',
          phone: w.customer_phone || '-',
          service: w.service_name || 'Service',
          price: w.price.toFixed(2),
          method: w.payment_method || 'Cash'
        })));
      }
    } catch (err) {
      showNotification({ message: 'Error adding sale', type: 'error' });
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/washes?businessId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSales(data.map((w: any) => ({
              id: w.id,
              date: w.wash_date.split('T')[0],
              customer: w.customer_name || 'Guest',
              car: w.car_details || 'Unknown',
              phone: w.customer_phone || '-',
              service: w.service_name || 'Service',
              price: w.price.toFixed(2),
              method: w.payment_method || 'Cash'
            })));
          }
        });
    }
  }, [user]);

  const qrValue = `https://360cars.app/wash/${companyInfo.name.replace(/\s+/g, '-').toLowerCase()}`;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (companyImages.length >= 4) {
        setNotification({ message: lang === 'en' ? 'Maximum 4 images allowed' : 'الحد الأقصى 4 صور', type: 'error' });
        return;
      }
      const newImage = URL.createObjectURL(e.target.files[0]);
      setCompanyImages([...companyImages, newImage]);
    }
  };

  const removeImage = (index: number) => {
    setCompanyImages(companyImages.filter((_, i) => i !== index));
  };

  const calculateTotal = (price: string, addVat: boolean) => {
    const p = parseFloat(price) || 0;
    return addVat ? p * 1.15 : p;
  };

  const handleSaveInvoice = async () => {
    if (!newPurchase.content || !newPurchase.price) {
      alert(lang === 'en' ? 'Please fill in all fields' : 'يرجى ملء جميع الحقول');
      return;
    }
    const basePrice = parseFloat(newPurchase.price) || 0;
    const totalPrice = calculateTotal(newPurchase.price, newPurchase.addVat);
    
    try {
      const res = await fetch('/api/expenses/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: user?.id,
          content: newPurchase.content,
          amount: totalPrice,
          expenseType: newPurchase.expenseType,
          date: newPurchase.date
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification({ message: lang === 'en' ? 'Purchase saved successfully' : 'تم حفظ المشتريات بنجاح', type: 'success' });
        fetchDashboardStats();
        setNewPurchase({
          date: new Date().toISOString().split('T')[0],
          content: '',
          price: '',
          expenseType: 'other',
          addVat: false,
          attachment: null as File | null
        });
      }
    } catch (err) {
      console.error('Error saving purchase:', err);
    }
  };

  const filteredPlans = plans.filter(p => p.branchId === currentBranchId);
  const filteredServices = services.filter(s => s.branchId === currentBranchId);
  const filteredOffers = offers.filter(o => o.branchId === currentBranchId);
  const filteredPurchases = purchases.filter(p => {
    const matchBranch = p.branchId === currentBranchId;
    const matchType = purchaseFilters.type === 'all' || p.expenseType === purchaseFilters.type;
    const matchDate = !purchaseFilters.date || p.date === purchaseFilters.date;
    return matchBranch && matchType && matchDate;
  });

  const totalSum = filteredPurchases.reduce((sum, p) => sum + parseFloat(p.totalPrice), 0);
  const totalBase = filteredPurchases.reduce((sum, p) => sum + parseFloat(p.basePrice), 0);
  const totalVat = filteredPurchases.reduce((sum, p) => sum + parseFloat(p.vatAmount), 0);

  const expenseTypes = [
    { id: 'cleaningSupplies', label: t.cleaningSupplies },
    { id: 'maintenance', label: t.maintenance },
    { id: 'rent', label: t.rent },
    { id: 'salaries', label: t.salaries },
    { id: 'other', label: t.other },
  ];

  if (activeSubView === 'sales') {
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.sales} onBack={() => setActiveSubView('main')} />
        
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-white/5 shadow-xl">
            <div className="flex flex-wrap gap-4 items-end justify-between">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.theDate}</label>
                  <input 
                    type="date" 
                    value={salesFilters.date}
                    onChange={(e) => setSalesFilters({...salesFilters, date: e.target.value})}
                    className="bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.customerName}</label>
                  <input 
                    type="text" 
                    placeholder={t.filterByName}
                    value={salesFilters.name}
                    onChange={(e) => setSalesFilters({...salesFilters, name: e.target.value})}
                    className="bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.mobile}</label>
                  <input 
                    type="text" 
                    placeholder="05XXXXXXXX"
                    value={salesFilters.mobile}
                    onChange={(e) => setSalesFilters({...salesFilters, mobile: e.target.value})}
                    className="bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white"
                  />
                </div>
                <button 
                  onClick={() => setSalesFilters({date: '', name: '', mobile: '', service: ''})}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition-all border border-white/5"
                >
                  {t.reset}
                </button>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveSubView('bestCustomers')}
                  className="px-4 py-2 bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow rounded-lg text-xs font-bold transition-all border border-brand-yellow/20 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  {t.bestCustomers}
                </button>
                <button 
                  onClick={() => setShowAddSaleModal(true)}
                  className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 rounded-lg text-xs font-bold transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t.addHandWash}
                </button>
              </div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="bg-zinc-900 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">{t.detailedWashingReport}</h3>
              <button className="p-2 text-zinc-400 hover:text-brand-yellow transition-colors">
                <Printer className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-center border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-500 border-b border-white/5">
                    <th className="p-4 font-bold uppercase tracking-widest">{t.billNumber}</th>
                    <th className="p-4 font-bold uppercase tracking-widest">{t.theDate}</th>
                    <th className="p-4 font-bold uppercase tracking-widest">{t.customerName}</th>
                    <th className="p-4 font-bold uppercase tracking-widest">{t.mobile}</th>
                    <th className="p-4 font-bold uppercase tracking-widest">{t.car}</th>
                    <th className="p-4 font-bold uppercase tracking-widest">{t.service}</th>
                    <th className="p-4 font-bold uppercase tracking-widest">{t.thePrice}</th>
                    <th className="p-4 font-bold uppercase tracking-widest">{t.paymentMethod}</th>
                    <th className="p-4 font-bold uppercase tracking-widest">{t.procedures}</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.filter(s => {
                    const matchDate = !salesFilters.date || s.date === salesFilters.date;
                    const matchName = !salesFilters.name || s.customer.toLowerCase().includes(salesFilters.name.toLowerCase());
                    const matchMobile = !salesFilters.mobile || s.phone.includes(salesFilters.mobile);
                    return matchDate && matchName && matchMobile;
                  }).length > 0 ? (
                    sales.filter(s => {
                      const matchDate = !salesFilters.date || s.date === salesFilters.date;
                      const matchName = !salesFilters.name || s.customer.toLowerCase().includes(salesFilters.name.toLowerCase());
                      const matchMobile = !salesFilters.mobile || s.phone.includes(salesFilters.mobile);
                      return matchDate && matchName && matchMobile;
                    }).map((s) => (
                      <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="p-4 font-mono text-zinc-500">#{s.id}</td>
                        <td className="p-4 text-zinc-400">{s.date}</td>
                        <td className="p-4 font-bold text-white">{s.customer}</td>
                        <td className="p-4 text-zinc-400">{s.phone}</td>
                        <td className="p-4 text-zinc-300">{s.car}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-brand-yellow/10 text-brand-yellow rounded-md text-[10px] font-bold">
                            {s.service}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-brand-yellow">{s.price} {t.sar}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                            s.method === 'Cash' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {s.method}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-zinc-500 hover:text-white transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-20 text-center">
                        <Activity className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-500 text-sm">{t.noRecordedSales}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubView === 'pending') {
    const statusColors: Record<string, string> = {
      PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      APPROVED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      IN_PROGRESS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    const statusLabels: Record<string, string> = lang === 'en'
      ? { PENDING: 'Pending', APPROVED: 'Approved', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed', CANCELLED: 'Cancelled' }
      : { PENDING: 'معلق', APPROVED: 'مقبول', IN_PROGRESS: 'قيد التنفيذ', COMPLETED: 'مكتمل', CANCELLED: 'ملغي' };
    const nextStatus: Record<string, string> = { PENDING: 'APPROVED', APPROVED: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED' };
    const nextLabel: Record<string, string> = lang === 'en'
      ? { PENDING: 'Approve', APPROVED: 'Start', IN_PROGRESS: 'Complete' }
      : { PENDING: 'قبول', APPROVED: 'بدء', IN_PROGRESS: 'إكمال' };
    const allItems = [
      ...activeRequests.map((r: any) => ({ ...r, _type: 'wash' })),
      ...activeBookings.map((b: any) => ({ ...b, _type: 'booking' })),
    ];
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.pendingRequests} onBack={() => setActiveSubView('main')} />
        {allItems.length === 0 ? (
          <div className="max-w-4xl mx-auto bg-zinc-900 p-12 rounded-3xl border border-white/5 text-center">
            <Clock className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-400 mb-2">{lang === 'en' ? 'No Pending Requests' : 'لا توجد طلبات معلقة'}</h3>
            <p className="text-zinc-500 text-sm">{lang === 'en' ? "You're all caught up! New requests will appear here." : 'أنت مطلع على كل شيء! ستظهر الطلبات الجديدة هنا.'}</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-3">
            {allItems.map((item: any) => (
              <div key={`${item._type}-${item.id}`} className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{item.customer_name || item.name || (lang === 'en' ? 'Customer' : 'عميل')}</p>
                  <p className="text-xs text-zinc-500">{item.service_name || item.car_brand_model || ''} {item.time_slot ? `• ${item.time_slot}` : ''}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{item._type === 'booking' ? (lang === 'en' ? 'Booking' : 'حجز') : (lang === 'en' ? 'Request' : 'طلب')}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${statusColors[item.status] || 'text-zinc-400'}`}>
                    {statusLabels[item.status] || item.status}
                  </span>
                  {nextStatus[item.status] && (
                    <button
                      onClick={() => item._type === 'wash' ? handleUpdateWashStatus(item.id, nextStatus[item.status]) : handleUpdateBookingStatus(item.id, nextStatus[item.status])}
                      className="px-3 py-1.5 bg-brand-yellow text-zinc-950 rounded-lg text-xs font-bold hover:bg-yellow-400 transition-colors"
                    >
                      {nextLabel[item.status]}
                    </button>
                  )}
                  {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' && (
                    <button
                      onClick={() => item._type === 'wash' ? handleUpdateWashStatus(item.id, 'CANCELLED') : handleUpdateBookingStatus(item.id, 'CANCELLED')}
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors"
                    >
                      {lang === 'en' ? 'Cancel' : 'إلغاء'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeSubView === 'reports') {
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.reports || 'Reports & Analytics'} onBack={() => setActiveSubView('main')} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[
            { title: lang === 'en' ? 'Sales Report' : 'تقرير المبيعات', icon: TrendingUp, desc: lang === 'en' ? 'Detailed analysis of sales and revenue' : 'تحليل مفصل للمبيعات والإيرادات' },
            { title: lang === 'en' ? 'Inventory Report' : 'تقرير المخزون', icon: Box, desc: lang === 'en' ? 'Track your supplies and stock levels' : 'تتبع المستلزمات ومستويات المخزون' },
            { title: lang === 'en' ? 'Customer Report' : 'تقرير العملاء', icon: Users, desc: lang === 'en' ? 'Analyze customer behavior and loyalty' : 'تحليل سلوك العملاء وولائهم' },
            { title: lang === 'en' ? 'Financial Summary' : 'الملخص المالي', icon: DollarSign, desc: lang === 'en' ? 'Monthly and yearly financial statements' : 'القوائم المالية الشهرية والسنوية' },
            { title: lang === 'en' ? 'Performance Metrics' : 'مقاييس الأداء', icon: Activity, desc: lang === 'en' ? 'Key performance indicators for your business' : 'مؤشرات الأداء الرئيسية لعملك' },
          ].map((report, i) => (
            <div key={i} className="bg-zinc-900 p-6 rounded-2xl border border-white/5 hover:border-brand-yellow/30 transition-all cursor-pointer group">
              <report.icon className="w-8 h-8 text-brand-yellow mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white mb-1">{report.title}</h3>
              <p className="text-xs text-zinc-500">{report.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSubView === 'settings') {
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.managingGeneralSettings} onBack={() => setActiveSubView('main')} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { label: t.priceListManagement, icon: Tag, color: 'bg-zinc-900 border-brand-yellow/20', action: () => setActiveSubView('services'), permission: 'PRICE_LIST_MANAGEMENT' },
            { label: t.offersManagement, icon: Tag, color: 'bg-zinc-900 border-brand-yellow/20', action: () => setActiveSubView('offers'), permission: 'OFFER_MANAGEMENT' },
            { label: t.subscriptionPlanManagement, icon: Calendar, color: 'bg-zinc-900 border-brand-yellow/20', action: () => setActiveSubView('plans'), permission: 'SUBSCRIPTION_PLAN_MANAGEMENT' },
            { label: t.branchManagement, icon: Map, color: 'bg-zinc-900 border-brand-yellow/20', action: () => setActiveSubView('branches'), permission: 'BRANCH_MANAGEMENT' },
            { label: t.giftCardsManagement, icon: CreditCard, color: 'bg-zinc-900 border-brand-yellow/20', action: () => setActiveSubView('giftCards'), permission: 'GIFT_CARD_MANAGEMENT' },
            { label: t.adminUserManagement, icon: Users, color: 'bg-zinc-900 border-brand-yellow/20', action: () => setActiveSubView('adminUsers'), permission: 'DASHBOARD_ACCESS' },
            { label: t.companyInformation, icon: Box, color: 'bg-zinc-900 border-brand-yellow/20', action: () => setActiveSubView('editCompany'), permission: 'DASHBOARD_ACCESS' },
            { label: t.centerPolicy, icon: CheckCircle2, color: 'bg-zinc-900 border-brand-yellow/20', action: () => setActiveSubView('centerPolicy'), permission: 'DASHBOARD_ACCESS' },
            { label: t.dataExport, icon: DollarSign, color: 'bg-zinc-900 border-brand-yellow/20', action: () => showNotification({message: t.dataExport, type: 'success'}), permission: 'DASHBOARD_ACCESS' },
          ].filter(item => !item.permission || hasPermission(item.permission as any)).map((item, i) => (
            <motion.button
              key={i}
              onClick={item.action}
              whileHover={{ scale: 1.02, borderColor: '#fac815' }}
              whileTap={{ scale: 0.98 }}
              className={`${item.color} p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4 transition-all border hover:bg-zinc-800 group`}
            >
              <item.icon className="w-10 h-10 text-brand-yellow group-hover:scale-110 transition-transform" />
              <span className="text-sm md:text-base font-bold text-center leading-tight text-white">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (activeSubView === 'bestCustomers') {
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.bestCustomers} onBack={() => setActiveSubView('sales')} />
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <button className="bg-[#4a5568] hover:bg-[#2d3748] text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors shadow-lg">{t.printReport}</button>
            <div className="flex bg-zinc-900 p-1 rounded-lg border border-white/5">
              <button onClick={() => setCustomerFilter('week')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${customerFilter === 'week' ? 'bg-brand-yellow text-zinc-950' : 'text-zinc-400 hover:text-white'}`}>{t.week}</button>
              <button onClick={() => setCustomerFilter('month')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${customerFilter === 'month' ? 'bg-brand-yellow text-zinc-950' : 'text-zinc-400 hover:text-white'}`}>{t.month}</button>
              <button onClick={() => setCustomerFilter('year')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${customerFilter === 'year' ? 'bg-brand-yellow text-zinc-950' : 'text-zinc-400 hover:text-white'}`}>{t.year}</button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-center border-collapse">
              <thead>
                <tr className="bg-zinc-950 text-zinc-400 border-b border-white/5">
                  <th className="p-4 font-bold">{t.name}</th>
                  <th className="p-4 font-bold">{t.phone}</th>
                  <th className="p-4 font-bold">{t.washesCount}</th>
                  <th className="p-4 font-bold">{t.totalPaid}</th>
                </tr>
              </thead>
              <tbody>
                {bestCustomersData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-zinc-500 italic">
                      {lang === 'en' ? 'No data available yet' : 'لا توجد بيانات متاحة بعد'}
                    </td> 
                  </tr>
                ) : (
                  bestCustomersData.map((c: any, idx: number) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white">{c.name}</td>
                      <td className="p-4 text-zinc-400">{c.phone}</td>
                      <td className="p-4 text-brand-yellow font-bold">{c.washes}</td>
                      <td className="p-4 font-bold">{c.total} {t.sar}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubView === 'centerPolicy') {
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.centerPolicy} onBack={() => setActiveSubView('settings')} />
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">{t.policyNumber}</label>
                <input 
                  type="text" 
                  value={centerPolicy.number} 
                  onChange={(e) => setCenterPolicy({...centerPolicy, number: e.target.value})} 
                  className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">{t.policyDescription}</label>
                <textarea 
                  value={centerPolicy.description} 
                  onChange={(e) => setCenterPolicy({...centerPolicy, description: e.target.value})} 
                  className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white h-32 resize-none" 
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button onClick={() => { setCenterPolicy({number: '', description: ''}); setActiveSubView('settings'); }} className="px-8 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-bold text-sm transition-all">{t.cancel}</button>
                <button onClick={() => { 
                  if (!centerPolicy.number || !centerPolicy.description) {
                    showNotification({ message: t.incompleteData, type: 'error' });
                    return;
                  }
                  setCenterPolicies([...centerPolicies, { ...centerPolicy, id: Date.now() }]);
                  setCenterPolicy({number: '', description: ''});
                  showNotification({ message: lang === 'en' ? 'Policy saved successfully' : 'تم حفظ السياسة بنجاح', type: 'success' }); 
                }} className="px-8 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 rounded-lg font-bold text-sm transition-all">{t.save}</button>
              </div>
            </div>
          </div>

          {centerPolicies.length > 0 && (
            <div className="bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-xl">
              <h2 className="text-xl font-bold text-brand-yellow mb-6">{t.centerPolicy}</h2>
              <div className="space-y-4">
                {centerPolicies.map((p) => (
                  <div key={p.id} className="bg-zinc-950 p-4 rounded-xl border border-white/5 flex justify-between items-start group">
                    <div>
                      <span className="text-brand-yellow font-bold text-sm block mb-1">#{p.number}</span>
                      <p className="text-sm text-zinc-300">{p.description}</p>
                    </div>
                    <button 
                      onClick={() => setCenterPolicies(centerPolicies.filter(item => item.id !== p.id))}
                      className="p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeSubView === 'adminUsers') {
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.adminUserManagement} onBack={() => setActiveSubView('settings')} />
        <AdministratorUserManagement 
          t={t}
          lang={lang}
          isRtl={isRtl}
          branches={branches}
          setActiveSubView={setActiveSubView}
          setNotification={showNotification}
        />
      </div>
    );
  }

  if (activeSubView === 'editCompany') {
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.editCompanyInfo} onBack={() => setActiveSubView('settings')} />
        <div className="max-w-4xl mx-auto bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">{t.companyName}</label>
                <input type="text" value={companyInfo.name} onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})} className="w-full bg-[#1a202c] border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">{t.username_label}</label>
                <input type="text" value={companyInfo.username} onChange={(e) => setCompanyInfo({...companyInfo, username: e.target.value})} className="w-full bg-[#1a202c] border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">{t.mobile}</label>
                <input type="text" value={companyInfo.phone} onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})} className="w-full bg-[#1a202c] border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">{t.crNumber_label}</label>
                <input type="text" value={companyInfo.crNumber} onChange={(e) => setCompanyInfo({...companyInfo, crNumber: e.target.value})} className="w-full bg-[#1a202c] border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">{t.taxNumber_label}</label>
                <input type="text" value={companyInfo.taxNumber} onChange={(e) => setCompanyInfo({...companyInfo, taxNumber: e.target.value})} className="w-full bg-[#1a202c] border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">{t.mapLink}</label>
                <input type="text" value={companyInfo.mapLink} onChange={(e) => setCompanyInfo({...companyInfo, mapLink: e.target.value})} className="w-full bg-[#1a202c] border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
              </div>
              <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-brand-yellow uppercase tracking-widest">{lang === 'en' ? 'Working Hours' : 'ساعات العمل'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">{lang === 'en' ? 'Opening Time' : 'وقت الافتتاح'}</label>
                    <input type="time" value={companyInfo.openingTime} onChange={(e) => setCompanyInfo({...companyInfo, openingTime: e.target.value})} className="w-full bg-[#1a202c] border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">{lang === 'en' ? 'Closing Time' : 'وقت الإغلاق'}</label>
                    <input type="time" value={companyInfo.closingTime} onChange={(e) => setCompanyInfo({...companyInfo, closingTime: e.target.value})} className="w-full bg-[#1a202c] border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-brand-yellow uppercase tracking-widest">{lang === 'en' ? 'Booking Settings' : 'إعدادات الحجز'}</h4>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">{lang === 'en' ? 'Booking Fee (SAR)' : 'رسوم الحجز (ريال)'}</label>
                  <input 
                    type="number" 
                    value={companyInfo.bookingFee || 0} 
                    onChange={(e) => setCompanyInfo({...companyInfo, bookingFee: Number(e.target.value)})} 
                    className="w-full bg-[#1a202c] border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white" 
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">{lang === 'en' ? 'Auto-confirm Bookings' : 'تأكيد الحجوزات تلقائياً'}</p>
                    <p className="text-[10px] text-zinc-500">{lang === 'en' ? 'New bookings will be confirmed automatically' : 'سيتم تأكيد الحجوزات الجديدة تلقائياً'}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={companyInfo.autoConfirm} 
                      onChange={(e) => setCompanyInfo({...companyInfo, autoConfirm: e.target.checked})} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-yellow"></div>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-2">{lang === 'en' ? 'Company Logo' : 'شعار الشركة'}</label>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-black/20 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
                  {companyLogo ? (
                    <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Box className="w-8 h-8 text-zinc-700" />
                  )}
                </div>
                <label className="bg-brand-yellow hover:bg-yellow-400 text-zinc-950 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all">
                  {lang === 'en' ? 'Upload Logo' : 'رفع الشعار'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const url = URL.createObjectURL(e.target.files[0]);
                      handleUploadLogo(url);
                    }
                  }} />
                </label>
              </div>

              <label className="block text-xs text-zinc-400 mb-2">{t.companyImages}</label>
              <div className="grid grid-cols-2 gap-4">
                {companyImages.map((img, i) => (
                  <div key={i} className="relative aspect-video bg-black/20 rounded-lg overflow-hidden border border-white/5">
                    <img src={img} alt="Company" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button onClick={() => {
                      const newImages = companyImages.filter((_, idx) => idx !== i);
                      handleUploadImages(newImages);
                    }} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-md transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {companyImages.length < 4 && (
                  <label className="aspect-video bg-black/20 rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                    <Plus className="w-6 h-6 text-zinc-500 mb-2" />
                    <span className="text-xs text-zinc-500">{t.addImage}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        handleUploadImages([...companyImages, url]);
                      }
                    }} />
                  </label>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button 
              onClick={async () => {
                try {
                  const res = await fetch('/api/business/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ownerId: user?.id,
                      centerName: companyInfo.name,
                      taxNumber: companyInfo.taxNumber,
                      commercialRegistration: companyInfo.crNumber,
                      address: companyInfo.address,
                      mapLink: companyInfo.mapLink,
                      name: companyInfo.username,
                      phone: companyInfo.phone,
                      images: companyImages,
                      bookingFee: companyInfo.bookingFee,
                      autoConfirmBookings: companyInfo.autoConfirm ? 1 : 0,
                      openingTime: companyInfo.openingTime,
                      closingTime: companyInfo.closingTime
                    })
                  });
                  const data = await res.json();
                  if (data.user) {
                    setUser(data.user);
                    
                    // Update main branch in the branches list
                    const updatedBranches = branches.map(b => 
                      b.isMain ? { ...b, name: companyInfo.name, address: companyInfo.address, mapLink: companyInfo.mapLink, commercialRegistration: companyInfo.crNumber } : b
                    );
                    setBranches(updatedBranches);

                    showNotification({ message: lang === 'en' ? 'Company info updated successfully' : 'تم تحديث معلومات الشركة بنجاح', type: 'success' });
                    setActiveSubView('settings');
                  } else {
                    showNotification({ message: data.error, type: 'error' });
                  }
                } catch (err) {
                  showNotification({ message: 'Network error', type: 'error' });
                }
              }} 
              className="bg-brand-yellow text-zinc-950 px-8 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
            >
              {t.save}
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (activeSubView === 'plans') {
    if (!hasPermission('SUBSCRIPTION_PLAN_MANAGEMENT')) {
      setActiveSubView('main');
      return null;
    }
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.subscriptionPlanManagement} onBack={() => setActiveSubView('settings')} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-4 bg-zinc-900 p-6 rounded-2xl border border-white/5 shadow-xl h-fit">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-brand-yellow" />
              <h2 className="text-lg font-bold text-white">{t.addPlan}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">{t.planName} *</label>
                <input type="text" value={newPlan.name} onChange={(e) => setNewPlan({...newPlan, name: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">{t.description}</label>
                <textarea value={newPlan.description} onChange={(e) => setNewPlan({...newPlan, description: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow h-20 resize-none text-white"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">{t.thePrice} (SAR) *</label>
                  <input type="number" value={newPlan.price} onChange={(e) => setNewPlan({...newPlan, price: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">{t.billingPeriod}</label>
                  <select value={newPlan.billingPeriod} onChange={(e) => setNewPlan({...newPlan, billingPeriod: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white appearance-none">
                    <option value="weekly">{t.weekly}</option>
                    <option value="monthly">{t.monthly}</option>
                    <option value="yearly">{t.yearly}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">{t.totalWashes}</label>
                <input type="number" value={newPlan.totalWashes} onChange={(e) => setNewPlan({...newPlan, totalWashes: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 mb-1">{t.features}</label>
                <div className="flex gap-2">
                  <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && featureInput.trim()) { setNewPlan({...newPlan, features: [...newPlan.features, featureInput.trim()]}); setFeatureInput(''); } }} className="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" />
                  <button onClick={() => { if (featureInput.trim()) { setNewPlan({...newPlan, features: [...newPlan.features, featureInput.trim()]}); setFeatureInput(''); } }} className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg border border-white/10 text-brand-yellow"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newPlan.features.map((f, idx) => (
                    <span key={idx} className="bg-zinc-800 text-[10px] px-2 py-1 rounded-md flex items-center gap-1 border border-white/5">
                      {f}
                      <button onClick={() => setNewPlan({...newPlan, features: newPlan.features.filter((_, i) => i !== idx)})}><X className="w-2.5 h-2.5 text-zinc-500 hover:text-red-400" /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" id="isPopular" checked={newPlan.isPopular} onChange={(e) => setNewPlan({...newPlan, isPopular: e.target.checked})} className="w-4 h-4 rounded border-white/10 bg-zinc-950 text-brand-yellow focus:ring-brand-yellow" />
                <label htmlFor="isPopular" className="text-xs text-zinc-400">{t.markAsPopular}</label>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => { setNewPlan({name: '', description: '', price: '', billingPeriod: 'monthly', totalWashes: '1', features: [], isPopular: false}); setFeatureInput(''); }} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl font-bold text-xs transition-all border border-white/5">{t.cancellation}</button>
                <button onClick={() => { if (!newPlan.name || !newPlan.price) { alert(lang === 'en' ? 'Please fill in required fields' : 'يرجى ملء الحقول المطلوبة'); return; } setPlans([{...newPlan, id: Date.now(), branchId: currentBranchId}, ...plans]); setNewPlan({name: '', description: '', price: '', billingPeriod: 'monthly', totalWashes: '1', features: [], isPopular: false}); }} className="flex-1 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 py-2.5 rounded-xl font-bold text-xs transition-all">{t.createPlan}</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-xl min-h-[500px]">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-brand-yellow">{t.yourPlans}</h2>
              <span className="text-xs text-zinc-500">{filteredPlans.length} {t.plans}</span>
            </div>
            {filteredPlans.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center"><Calendar className="w-8 h-8 text-zinc-600" /></div>
                <div><h3 className="text-lg font-bold text-zinc-400">{t.noPlansYet}</h3><p className="text-sm text-zinc-600 max-w-xs mx-auto">{t.createPlansDesc}</p></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPlans.map((p) => (
                  <div key={p.id} className="bg-zinc-950 p-6 rounded-2xl border border-white/5 relative group">
                    {p.isPopular && <span className="absolute -top-3 right-4 bg-brand-yellow text-zinc-950 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">POPULAR</span>}
                    <div className="flex justify-between items-start mb-4">
                      <div><h3 className="text-lg font-bold text-white">{p.name}</h3><p className="text-xs text-zinc-500">{p.description}</p></div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-zinc-500 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setPlans(plans.filter(item => item.id !== p.id))} className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mb-6"><span className="text-2xl font-bold text-brand-yellow">{p.price}</span><span className="text-xs text-zinc-500">SAR / {p.billingPeriod === 'monthly' ? t.monthly : t.yearly}</span></div>
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2 text-xs text-zinc-400"><CheckCircle2 className="w-3.5 h-3.5 text-brand-yellow" />{p.totalWashes} {t.totalWashes}</div>
                      {p.features.map((f, i) => (<div key={i} className="flex items-center gap-2 text-xs text-zinc-400"><CheckCircle2 className="w-3.5 h-3.5 text-brand-yellow" />{f}</div>))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeSubView === 'offers') {
    if (!hasPermission('OFFER_MANAGEMENT')) {
      setActiveSubView('main');
      return null;
    }
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.offersManagement} onBack={() => setActiveSubView('settings')} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-4 bg-zinc-900 p-6 rounded-2xl border border-white/5 shadow-xl h-fit">
            <div className="flex items-center gap-2 mb-6"><Tag className="w-5 h-5 text-brand-yellow" /><h2 className="text-lg font-bold text-white">{t.addOffer}</h2></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] text-zinc-400 mb-1">{t.offerCode} *</label><input type="text" value={newOffer.code} onChange={(e) => setNewOffer({...newOffer, code: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" /></div>
                <div><label className="block text-[10px] text-zinc-400 mb-1">{t.offerName} *</label><input type="text" value={newOffer.name} onChange={(e) => setNewOffer({...newOffer, name: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" /></div>
              </div>
              <div><label className="block text-[10px] text-zinc-400 mb-1">{t.offerDetails}</label><textarea value={newOffer.details} onChange={(e) => setNewOffer({...newOffer, details: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white h-20 resize-none" /></div>
              <div className="flex items-end gap-4">
                <div className="w-24"><label className="block text-[10px] text-zinc-400 mb-1">{t.discountPercent} *</label><input type="number" value={newOffer.discount} onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white text-center font-bold" /></div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <DatePicker 
                      label={t.startDate + " *"}
                      value={newOffer.startDate} 
                      onChange={(val) => setNewOffer({...newOffer, startDate: val})} 
                    />
                  </div>
                  <div>
                    <DatePicker 
                      label={t.expiryDate + " *"}
                      value={newOffer.expiryDate} 
                      onChange={(val) => setNewOffer({...newOffer, expiryDate: val})} 
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setNewOffer({name: '', code: '', discount: '', startDate: '', expiryDate: '', details: ''})} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold text-sm transition-all border border-white/5">{t.cancellation}</button>
                <button onClick={() => { if (!newOffer.name || !newOffer.code || !newOffer.discount || !newOffer.expiryDate || !newOffer.startDate) { setNotification({ message: t.incompleteData, type: 'error' }); return; } setOffers([{...newOffer, id: Date.now(), branchId: currentBranchId}, ...offers]); setNewOffer({name: '', code: '', discount: '', startDate: '', expiryDate: '', details: ''}); setNotification({ message: lang === 'en' ? 'Offer added successfully' : 'تم إضافة العرض بنجاح', type: 'success' }); }} className="flex-1 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-yellow-500/10">{t.addOffer}</button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-xl font-display font-bold text-brand-yellow">{t.yourOffers}</h2><span className="text-[10px] text-zinc-500 uppercase tracking-widest">{filteredOffers.length} {t.offersManagement}</span></div>
            {filteredOffers.length === 0 ? (
              <div className="bg-zinc-900/50 border border-dashed border-white/10 rounded-3xl p-20 text-center"><Tag className="w-12 h-12 text-zinc-700 mx-auto mb-4" /><p className="text-zinc-500 text-sm">{t.noOffersYet}</p></div>
            ) : (
              <div className="space-y-4">
                {filteredOffers.map((o: any) => (
                  <div key={o.id} className="bg-zinc-900 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-brand-yellow/30 transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2"><span className="bg-brand-yellow/10 text-brand-yellow px-2 py-1 rounded text-[10px] font-bold tracking-wider">{o.code}</span><h3 className="text-lg font-bold text-white">{o.name}</h3></div>
                      {o.details && <p className="text-xs text-zinc-400 mb-3">{o.details}</p>}
                      <div className="flex flex-wrap gap-4 text-[10px] text-zinc-500"><span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t.startDate}: {o.startDate}</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.expiryDate}: {o.expiryDate}</span><span className="flex items-center gap-1 text-emerald-500 font-bold"><Tag className="w-3 h-3" /> {o.discount}% {lang === 'en' ? 'OFF' : 'خصم'}</span></div>
                    </div>
                    <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto justify-end border-t border-white/5 md:border-0 pt-4 md:pt-0">
                      <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors border border-white/5"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setOffers(offers.filter((item: any) => item.id !== o.id))} className="p-2 bg-zinc-800 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 rounded-lg transition-colors border border-white/5"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeSubView === 'branches') {
    if (!hasPermission('BRANCH_MANAGEMENT')) {
      setActiveSubView('main');
      return null;
    }

    const sortedBranches = [...branches].sort((a, b) => {
      if (a.isMain) return -1;
      if (b.isMain) return 1;
      return (a.branchNumber || '').localeCompare(b.branchNumber || '');
    });

    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.branchManagement} onBack={() => setActiveSubView('settings')} />
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Add Branch Form */}
          <div className="bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 text-right">{t.addNewBranch}</h2>
            <div className="space-y-6">
              <div><label className="block text-xs font-medium text-zinc-400 mb-2 text-right">{t.branchName}:</label><input type="text" value={newBranch.name} onChange={(e) => setNewBranch({...newBranch, name: e.target.value})} className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white text-right" /></div>
              <div><label className="block text-xs font-medium text-zinc-400 mb-2 text-right">{t.branchNumber}:</label><input type="text" value={newBranch.branchNumber} onChange={(e) => setNewBranch({...newBranch, branchNumber: e.target.value})} className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white text-right" /></div>
              <div><label className="block text-xs font-medium text-zinc-400 mb-2 text-right">{t.branchAddress}:</label><input type="text" value={newBranch.address} onChange={(e) => setNewBranch({...newBranch, address: e.target.value})} className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white text-right" /></div>
              <div><label className="block text-xs font-medium text-zinc-400 mb-2 text-right">{t.commercialRegistration}:</label><input type="text" value={newBranch.commercialRegistration} onChange={(e) => setNewBranch({...newBranch, commercialRegistration: e.target.value})} className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white text-right" /></div>
              <div><label className="block text-xs font-medium text-zinc-400 mb-2 text-right">{t.mapLink}:</label><input type="text" value={newBranch.mapLink} onChange={(e) => setNewBranch({...newBranch, mapLink: e.target.value})} className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-brand-yellow text-white text-right" /></div>
              <div className="flex justify-end gap-4 pt-4">
                <button onClick={() => setNewBranch({name: '', address: '', commercialRegistration: '', mapLink: '', branchNumber: ''})} className="px-8 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-bold text-sm transition-all">{t.cancellation}</button>
                <button onClick={() => { 
                  if (!newBranch.name || !newBranch.address || !newBranch.branchNumber) { 
                    setNotification({ message: t.incompleteData, type: 'error' }); 
                    return; 
                  } 
                  const branchId = Date.now();
                  const branchData = {...newBranch, id: branchId, isMain: false};
                  setBranches([branchData, ...branches]); 
                  setNewBranch({name: '', address: '', commercialRegistration: '', mapLink: '', branchNumber: ''}); 
                  setNotification({ message: lang === 'en' ? 'Branch added successfully' : 'تم إضافة الفرع بنجاح', type: 'success' });
                  
                  const qrVal = `https://360cars.app/wash/${branchData.name.replace(/\s+/g, '-').toLowerCase()}-${branchData.branchNumber}`;
                  setQrModalData({ name: branchData.name, value: qrVal });
                  setShowQRModal(true);
                }} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all">{t.saveBranch}</button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-brand-yellow text-right">{t.branchList}</h2>
            {branches.length === 0 ? (
              <div className="bg-zinc-900/50 border border-dashed border-white/10 rounded-2xl p-12 text-center"><MapPin className="w-10 h-10 text-zinc-700 mx-auto mb-4" /><p className="text-zinc-500 text-sm">{lang === 'en' ? 'No branches added yet' : 'لا توجد فروع مضافة بعد'}</p></div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {sortedBranches.map((b: any) => (
                  <div key={b.id} className={`bg-zinc-900 p-6 rounded-2xl border ${b.id === currentBranchId ? 'border-brand-yellow/50 shadow-[0_0_20px_rgba(250,204,21,0.1)]' : 'border-white/5'} flex justify-between items-center group hover:border-brand-yellow/30 transition-all`}>
                    <div className="flex gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                      {b.id !== currentBranchId && (
                        <button 
                          onClick={() => setCurrentBranchId(b.id)}
                          className="px-4 py-2 bg-brand-yellow text-zinc-950 rounded-lg text-xs font-bold hover:bg-yellow-400 transition-all"
                        >
                          {lang === 'en' ? 'Switch to this branch' : 'التبديل لهذا الفرع'}
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          const qrVal = `https://360cars.app/wash/${b.name.replace(/\s+/g, '-').toLowerCase()}-${b.branchNumber || b.id}`;
                          setQrModalData({ name: b.name, value: qrVal });
                          setShowQRModal(true);
                        }}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-brand-yellow rounded-lg transition-colors border border-white/5"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => b.isMain ? setActiveSubView('editCompany') : null}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors border border-white/5"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {!b.isMain && (
                        <button onClick={() => setBranches(branches.filter((item: any) => item.id !== b.id))} className="p-2 bg-zinc-800 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 rounded-lg transition-colors border border-white/5"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                    <div className="text-right flex-1 ml-4">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        {b.isMain && <span className="bg-brand-yellow/10 text-brand-yellow text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">{t.mainBranch}</span>}
                        {b.id === currentBranchId && <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Active</span>}
                        <h3 className="text-lg font-bold text-white">{b.isMain ? (lang === 'en' ? 'Main Branch' : 'الفرع الرئيسي') : b.name}</h3>
                      </div>
                      <p className="text-xs text-zinc-500">{b.address}</p>
                      <div className="flex flex-col items-end gap-2 mt-2">
                        <div className="flex items-center gap-3 justify-end">
                          {b.branchNumber && <p className="text-[10px] text-zinc-400">{t.branchNumber}: {b.branchNumber}</p>}
                          {b.mapLink && (
                            <a href={b.mapLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-yellow hover:underline flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" /> {t.viewLocation}
                            </a>
                          )}
                          {b.commercialRegistration && <p className="text-[10px] text-zinc-600">{t.commercialRegistration}: {b.commercialRegistration}</p>}
                        </div>
                        
                        {b.isMain && (
                          <div className="mt-4 pt-4 border-t border-white/5 w-full flex justify-end">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <span className="text-[10px] font-bold text-zinc-400 group-hover:text-brand-yellow transition-colors">
                                {lang === 'en' ? 'Apply services, offers, and subscriptions to all branches' : 'تطبيق الخدمات والعروض والاشتراكات على جميع الفروع'}
                              </span>
                              <div className="relative">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setShowSyncModal(true);
                                    }
                                  }}
                                />
                                <div className="w-10 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-yellow"></div>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sync Confirmation Modal */}
        <AnimatePresence>
          {showSyncModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#0c0c0e] p-8 rounded-[2rem] border border-white/10 shadow-2xl max-w-md w-full text-center"
              >
                <div className="w-16 h-16 bg-brand-yellow/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Share2 className="w-8 h-8 text-brand-yellow" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {lang === 'en' ? 'Confirm Sync' : 'تأكيد المزامنة'}
                </h3>
                <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                  {lang === 'en' 
                    ? '⚠️ All services, offers, subscriptions, and prices from the main branch will be applied to all other branches. Are you sure you want to proceed?' 
                    : '⚠️ سيتم تطبيق جميع الخدمات والعروض والاشتراكات والأسعار الخاصة بالفرع الرئيسي على جميع الفروع الأخرى. هل أنت متأكد من المتابعة؟'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowSyncModal(false)}
                    className="py-3 bg-zinc-800 text-white rounded-xl font-bold text-sm hover:bg-zinc-700 transition-all border border-white/5"
                  >
                    {t.cancellation}
                  </button>
                  <button 
                    onClick={() => {
                      handleSyncSettings();
                      setShowSyncModal(false);
                    }}
                    className="py-3 bg-brand-yellow text-zinc-950 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
                  >
                    {lang === 'en' ? 'Confirm' : 'تأكيد'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (activeSubView === 'giftCards') {
    if (!hasPermission('GIFT_CARD_MANAGEMENT')) {
      setActiveSubView('main');
      return null;
    }
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.giftCardsManagement} onBack={() => setActiveSubView('settings')} />
        <TicketSystem 
          giftCards={giftCards}
          setGiftCards={setGiftCards}
          services={services}
          newGiftCard={newGiftCard}
          setNewGiftCard={setNewGiftCard}
          lang={lang as 'en' | 'ar'}
          t={t}
          setActiveSubView={setActiveSubView}
          setNotification={showNotification}
        />
      </div>
    );
  }

  if (activeSubView === 'services') {
    if (!hasPermission('PRICE_LIST_MANAGEMENT')) {
      setActiveSubView('main');
      return null;
    }
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.priceListManagement} onBack={() => setActiveSubView('settings')} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-4 bg-zinc-900 p-6 rounded-2xl border border-white/5 shadow-xl h-fit">
            <div className="flex items-center gap-2 mb-6"><Box className="w-5 h-5 text-brand-yellow" /><h2 className="text-lg font-bold text-white">{t.addService}</h2></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[10px] text-zinc-400 mb-1">{t.serviceCode} *</label><input type="text" value={newService.code} onChange={(e) => setNewService({...newService, code: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" /></div>
                <div><label className="block text-[10px] text-zinc-400 mb-1">{t.serviceName} *</label><input type="text" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" /></div>
              </div>
              <div><label className="block text-[10px] text-zinc-400 mb-1">{t.description}</label><textarea value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow h-20 resize-none text-white"></textarea></div>
              <div className="space-y-3">
                <label className="block text-[10px] text-zinc-400">{t.priceByCarSize}</label>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="flex items-center gap-1 text-[9px] text-zinc-500 mb-1"><Car className="w-3 h-3" /> {t.small}</label><input type="number" value={newService.prices.small} onChange={(e) => setNewService({...newService, prices: {...newService.prices, small: e.target.value}})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" /></div>
                  <div><label className="flex items-center gap-1 text-[9px] text-zinc-500 mb-1"><Car className="w-3 h-3" /> {t.average}</label><input type="number" value={newService.prices.average} onChange={(e) => setNewService({...newService, prices: {...newService.prices, average: e.target.value}})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" /></div>
                  <div><label className="flex items-center gap-1 text-[9px] text-zinc-500 mb-1"><Car className="w-3 h-3" /> {t.large}</label><input type="number" value={newService.prices.large} onChange={(e) => setNewService({...newService, prices: {...newService.prices, large: e.target.value}})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" /></div>
                </div>
              </div>
              <div><label className="block text-[10px] text-zinc-400 mb-1">{t.generalFallback}</label><input type="number" value={newService.prices.general} onChange={(e) => setNewService({...newService, prices: {...newService.prices, general: e.target.value}})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white" /><p className="text-[9px] text-zinc-500 mt-1">{t.usedWhenNotSet}</p></div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setNewService({code: '', name: '', description: '', prices: {small: '0', average: '0', large: '0', general: '0'}})} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl font-bold text-xs transition-all border border-white/5">{t.cancellation}</button>
                <button onClick={() => { if (!newService.code || !newService.name) { alert(lang === 'en' ? 'Please fill in required fields' : 'يرجى ملء الحقول المطلوبة'); return; } setServices([{...newService, id: Date.now(), branchId: currentBranchId}, ...services]); setNewService({code: '', name: '', description: '', prices: {small: '0', average: '0', large: '0', general: '0'}}); }} className="flex-1 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 py-2.5 rounded-xl font-bold text-xs transition-all">{t.addService}</button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 bg-zinc-900 p-8 rounded-2xl border border-white/5 shadow-xl min-h-[500px]">
            <div className="flex justify-between items-center mb-10"><h2 className="text-xl font-bold text-brand-yellow">{t.yourServices}</h2><span className="text-xs text-zinc-500">{filteredServices.length} {t.services}</span></div>
            {services.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4"><div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center"><Box className="w-8 h-8 text-zinc-600" /></div><div><h3 className="text-lg font-bold text-zinc-400">{t.noServicesYet}</h3></div></div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((s, idx) => (
                  <div key={s.id} className="bg-zinc-950 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2"><span className="bg-brand-yellow/10 text-brand-yellow px-2 py-1 rounded text-[10px] font-bold tracking-wider">{s.code}</span><h3 className="text-lg font-bold text-white">{s.name}</h3></div>
                      <p className="text-xs text-zinc-400 mb-4">{s.description}</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="bg-zinc-900 px-3 py-2 rounded-lg border border-white/5"><span className="text-[10px] text-zinc-500 block mb-1">{t.small}</span><span className="text-sm font-bold text-brand-yellow">{s.prices.small} <span className="text-[9px] text-zinc-500">{t.sar}</span></span></div>
                        <div className="bg-zinc-900 px-3 py-2 rounded-lg border border-white/5"><span className="text-[10px] text-zinc-500 block mb-1">{t.average}</span><span className="text-sm font-bold text-brand-yellow">{s.prices.average} <span className="text-[9px] text-zinc-500">{t.sar}</span></span></div>
                        <div className="bg-zinc-900 px-3 py-2 rounded-lg border border-white/5"><span className="text-[10px] text-zinc-500 block mb-1">{t.large}</span><span className="text-sm font-bold text-brand-yellow">{s.prices.large} <span className="text-[9px] text-zinc-500">{t.sar}</span></span></div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto justify-end border-t border-white/5 md:border-0 pt-4 md:pt-0">
                      <button className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors border border-white/5"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setServices(services.filter(item => item.id !== s.id))} className="p-2 bg-zinc-900 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 rounded-lg transition-colors border border-white/5"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeSubView === 'purchases') {
    if (!hasPermission('PURCHASES_MANAGEMENT')) {
      setActiveSubView('main');
      return null;
    }
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white font-sans">
        <SubPageHeader title={t.purchasingDepartment} onBack={() => setActiveSubView('main')} />
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-white/5 shadow-xl">
            <div className="flex justify-end mb-6"><h2 className="text-lg font-bold text-brand-yellow">{t.newInvoice}</h2></div>
            <div className="space-y-6">
              <div>
                <DatePicker 
                  label={t.theDate}
                  value={newPurchase.date} 
                  onChange={(val) => setNewPurchase({...newPurchase, date: val})} 
                />
              </div>
              <div><label className="block text-right text-[10px] text-zinc-400 mb-1">{t.expenseType}</label><select value={newPurchase.expenseType} onChange={(e) => setNewPurchase({...newPurchase, expenseType: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white appearance-none">{expenseTypes.map(type => (<option key={type.id} value={type.id}>{type.label}</option>))}</select></div>
              <div><label className="block text-right text-[10px] text-zinc-400 mb-1">{t.contentStatement}</label><textarea placeholder={t.exampleBuyingSoap} value={newPurchase.content} onChange={(e) => setNewPurchase({...newPurchase, content: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-brand-yellow h-24 resize-none text-white"></textarea></div>
              <div className="space-y-4">
                <div><label className="block text-right text-[10px] text-zinc-400 mb-1">{t.thePrice} (Riyal)</label><input type="number" placeholder="150.75" value={newPurchase.price} onChange={(e) => setNewPurchase({...newPurchase, price: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-right text-white" /></div>
                <div className="flex items-center justify-end gap-3"><span className="text-xs text-zinc-300">{t.addVat}</span><input type="checkbox" checked={newPurchase.addVat} onChange={(e) => setNewPurchase({...newPurchase, addVat: e.target.checked})} className="w-4 h-4 rounded border-white/10 bg-zinc-950 text-brand-yellow focus:ring-brand-yellow" /></div>
                {newPurchase.addVat && (<div className="flex justify-between items-center p-3 bg-zinc-950/50 rounded-lg border border-brand-yellow/20"><span className="text-brand-yellow font-bold text-sm">{calculateTotal(newPurchase.price, true).toFixed(2)} {t.sar}</span><span className="text-zinc-400 text-[10px]">{t.totalPrice}</span></div>)}
              </div>
              <div><label className="block text-right text-[10px] text-zinc-400 mb-1">{t.invoiceAttached}</label><div className="flex items-center justify-between bg-zinc-950 border border-white/10 rounded-lg px-4 py-2"><span className="text-[10px] text-zinc-500 truncate max-w-[200px]">{newPurchase.attachment ? newPurchase.attachment.name : t.noFileChosen}</span><label className="bg-brand-yellow text-zinc-950 px-3 py-1 rounded text-[10px] font-bold cursor-pointer hover:bg-yellow-400 transition-colors">{t.chooseFile}<input type="file" className="hidden" onChange={(e) => setNewPurchase({...newPurchase, attachment: e.target.files?.[0] || null})} /></label></div></div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setNewPurchase({date: new Date().toISOString().split('T')[0], content: '', price: '', expenseType: 'other', addVat: false, attachment: null})} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold text-sm transition-all border border-white/5">{t.cancellation}</button>
                <button onClick={handleSaveInvoice} className="flex-1 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-yellow-500/10">{t.saveInvoice}</button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div className="w-24 hidden md:block"></div>
              <div className="flex flex-wrap gap-3 justify-end items-end">
                <div className="flex flex-col items-end">
                  <DatePicker 
                    label={t.theDate}
                    value={purchaseFilters.date} 
                    onChange={(val) => setPurchaseFilters({...purchaseFilters, date: val})} 
                    className="w-40"
                  />
                </div>
                <div className="flex flex-col items-end">
                  <label className="text-[10px] text-zinc-500 mb-1 uppercase tracking-widest">{t.expenseType}</label>
                  <select 
                    value={purchaseFilters.type} 
                    onChange={(e) => setPurchaseFilters({...purchaseFilters, type: e.target.value})} 
                    className="bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white min-w-[120px]"
                  >
                    <option value="all">{t.allTypes}</option>
                    {expenseTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <h2 className="text-lg font-bold text-brand-yellow ml-2">{t.purchaseRecord}</h2>
              </div>
            </div>
            <div className="bg-zinc-900 rounded-2xl border border-white/5 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] text-center border-collapse">
                  <thead><tr className="bg-zinc-950 text-white border-b border-white/5"><th className="p-4 font-bold">{t.procedures}</th><th className="p-4 font-bold">{t.expenseType}</th><th className="p-4 font-bold">{t.content}</th><th className="p-4 font-bold">{t.theDate}</th><th className="p-4 font-bold">{t.thePrice}</th><th className="p-4 font-bold">{t.vatAmount}</th><th className="p-4 font-bold">{t.total}</th></tr></thead>
                  <tbody>
                    {filteredPurchases.length > 0 ? (
                      <>
                        {filteredPurchases.map((p) => (
                          <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="p-4"><button className="text-red-400 hover:text-red-300 p-1" onClick={() => setPurchases(purchases.filter(item => item.id !== p.id))}><Trash2 className="w-3.5 h-3.5" /></button></td><td className="p-4 text-zinc-400">{expenseTypes.find(t => t.id === p.expenseType)?.label}</td><td className="p-4 text-zinc-300">{p.content}</td><td className="p-4 text-zinc-400">{p.date}</td><td className="p-4 text-zinc-300">{p.basePrice} {t.sar}</td><td className="p-4 text-brand-yellow/70">{p.vatAmount} {t.sar}</td><td className="p-4 font-bold text-brand-yellow">{p.totalPrice} {t.sar}</td></tr>
                        ))}
                        <tr className="bg-zinc-950/50 font-bold border-t-2 border-brand-yellow/20"><td colSpan={4} className="p-4 text-right text-zinc-400 uppercase tracking-widest">{t.totalPurchases}</td><td className="p-4 text-white">{totalBase.toFixed(2)} {t.sar}</td><td className="p-4 text-brand-yellow/70">{totalVat.toFixed(2)} {t.sar}</td><td className="p-4 text-brand-yellow text-sm">{totalSum.toFixed(2)} {t.sar}</td></tr>
                      </>
                    ) : (<tr><td colSpan={7} className="p-10 text-zinc-500 italic">{t.noRecordedPurchases}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700 flex flex-col">
      {/* Toast Notification */}
      {localNotification && (
        <div className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-[100] animate-bounce`}>
          <div className={`${localNotification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/20`}>
            {localNotification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-bold text-sm">{localNotification.message}</span>
          </div>
        </div>
      )}

      {/* Pending Approval Banner */}
      {user?.business?.status === 'PENDING' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-400">{lang === 'en' ? 'Account Under Review' : 'الحساب قيد المراجعة'}</h4>
            <p className="text-xs text-zinc-400">{lang === 'en' ? 'Your account is under review. You will be notified once approved.' : 'حسابك قيد المراجعة. سيتم إخطارك بمجرد الموافقة.'}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Left column (Info + Chart stacked) | Right column (Wallet + QR + Summaries) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-3">
        {/* Company Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2rem] p-5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand-yellow/10 transition-all" />
          
          <div className="flex justify-between items-start mb-3">
            <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className="w-14 h-14 bg-gradient-to-br from-brand-yellow to-yellow-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                <span className="text-zinc-950 font-display font-bold text-2xl">3</span>
              </div>
              <div className={isRtl ? 'text-right' : ''}>
                <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t.company}</h2>
                <p className="text-xl font-display font-bold gold-gradient gold-glow">{companyInfo.name}</p>
              </div>
            </div>
            <button className="p-2 text-zinc-500 hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className={`flex items-center justify-between mb-3`}>
            <div className={isRtl ? 'text-right' : ''}>
              <p className="text-base font-bold text-white">{companyInfo.username}</p>
              <p className="text-xs text-zinc-500">{t.businessOwner}</p>
            </div>

            {/* Branch Switcher - The "White Box" area */}
            <div className="relative group/branch">
              <button 
                className={`flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-zinc-50 transition-all group active:scale-95 ${isRtl ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-6 h-6 bg-zinc-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-zinc-900" />
                </div>
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tighter leading-none mb-0.5">
                    {lang === 'en' ? 'Current Branch' : 'الفرع الحالي'}
                  </p>
                  <p className="text-[11px] font-bold text-zinc-900 leading-none">{currentBranch.name}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors ${isRtl ? 'mr-2' : 'ml-2'}`} />
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute top-full ${isRtl ? 'right-0' : 'left-0'} min-w-[200px] mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-100 py-2 hidden group-hover/branch:block z-50 animate-in fade-in slide-in-from-top-2 duration-200`}>
                {branches.map(b => (
                  <button 
                    key={b.id}
                    onClick={() => setCurrentBranchId(b.id)}
                    className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-5 py-3 text-xs font-bold hover:bg-zinc-50 transition-colors flex items-center justify-between gap-4 ${currentBranchId === b.id ? 'text-brand-yellow bg-zinc-50' : 'text-zinc-600'}`}
                  >
                    <span className="truncate">{b.name}</span>
                    {currentBranchId === b.id && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info Fields: Mobile | Branch Name | CR | Tax */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className={`px-3 py-2 rounded-lg bg-zinc-900/50 border border-white/5 ${isRtl ? 'text-right' : ''}`}>
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">{t.mobile}</p>
              <p className="text-[11px] font-medium text-zinc-200 truncate leading-tight">{companyInfo.phone}</p>
            </div>
            <div className={`px-3 py-2 rounded-lg bg-zinc-900/50 border border-white/5 ${isRtl ? 'text-right' : ''}`}>
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">{t.branchName}</p>
              <p className="text-[11px] font-medium text-zinc-200 truncate leading-tight">{currentBranch.name}</p>
            </div>
            <div className={`px-3 py-2 rounded-lg bg-zinc-900/50 border border-white/5 ${isRtl ? 'text-right' : ''}`}>
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">{t.crNumber_label}</p>
              <p className="text-[11px] font-medium text-zinc-200 truncate leading-tight">{companyInfo.crNumber}</p>
            </div>
            <div className={`px-3 py-2 rounded-lg bg-zinc-900/50 border border-white/5 ${isRtl ? 'text-right' : ''}`}>
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold mb-0.5">{t.taxNumber_label}</p>
              <p className="text-[11px] font-medium text-zinc-200 truncate leading-tight">{companyInfo.taxNumber}</p>
            </div>
          </div>
        </motion.div>

        {/* Weekly Sales Performance Card — flush under company info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-[2rem] p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-white">{t.weeklySalesPerformance}</h2>
              <p className="text-[10px] text-zinc-500">{t.previous7DaysAnalysis}</p>
            </div>
            <div className="flex items-center gap-2 px-2 py-0.5 bg-brand-yellow/10 rounded-lg border border-brand-yellow/20">
              <Activity className="w-3 h-3 text-brand-yellow" />
              <span className="text-[8px] font-bold text-brand-yellow uppercase">Live</span>
            </div>
          </div>

        <div className="w-full" style={{ height: 180 }}>
  <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#71717a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#71717a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 9, fontWeight: 600 }}
                  dy={5}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0c0c0e', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    fontSize: '10px'
                  }}
                  itemStyle={{ fontSize: '10px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#FACC15" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="purchases" 
                  stroke="#71717a" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPurchases)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        </div>{/* end Left Column */}

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Wallet Card */}
          <WalletCard />

          {/* Quick Scan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-[2rem] p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer"
            onClick={() => setShowQRModal(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 bg-white rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-4 group-hover:scale-105 transition-transform">
              <QRCodeSVG value={qrValue} size={100} fgColor="#09090b" />
            </div>
            <h3 className="text-base font-bold text-white mb-0.5">{t.quickScan}</h3>
            <p className="text-[10px] text-zinc-500">{t.scanForInstantActions}</p>
            <div className="mt-4 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-1/2 h-full bg-brand-yellow blur-[2px]"
              />
            </div>
          </motion.div>

          {/* Daily Sales Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-[2rem] p-5 flex items-center gap-4 group hover:border-brand-yellow/20 transition-all shrink-0 cursor-pointer"
            onClick={() => setShowWalletReport(true)}
          >
            <div className="w-10 h-10 neumorphic-inset rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-zinc-500 group-hover:text-brand-yellow transition-colors" />
            </div>
            <div>
              <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{t.dailySalesSummary}</h3>
              <div className="flex items-center gap-3">
                <p className="text-base font-bold text-white">{(dashboardStats?.todaySales?.total || 0).toFixed(2)} {t.sar}</p>
                <span className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded-full text-zinc-500">{dashboardStats?.todaySales?.count || 0} {t.washes}</span>
              </div>
              <p className="text-[8px] text-zinc-600 mt-0.5">{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </motion.div>

          {/* Daily Purchase Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-[2rem] p-5 flex items-center gap-4 group hover:border-brand-yellow/20 transition-all shrink-0 cursor-pointer"
            onClick={() => setActiveSubView('purchases')}
          >
            <div className="w-10 h-10 neumorphic-inset rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-zinc-500 group-hover:text-brand-yellow transition-colors" />
            </div>
            <div>
              <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{t.dailyPurchase}</h3>
              <div className="flex items-center gap-3">
                <p className="text-base font-bold text-white">{(dashboardStats?.todayPurchases?.total || 0).toFixed(2)} {t.sar}</p>
                <span className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded-full text-zinc-500">{dashboardStats?.todayPurchases?.count || 0} {t.invoiceCount}</span>
              </div>
              <p className="text-[8px] text-zinc-600 mt-0.5">{new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0c0c0e] p-8 rounded-[3rem] border border-white/10 shadow-2xl max-w-md w-full relative"
          >
            <button 
              onClick={() => setShowCheckoutModal(null)}
              className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-display font-bold text-brand-yellow mb-1">{lang === 'en' ? 'Complete Payment' : 'إتمام عملية الدفع'}</h3>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">{showCheckoutModal.car_details}</p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-zinc-900 rounded-3xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">{lang === 'en' ? 'Base Price' : 'السعر الأساسي'}</span>
                  <span className="text-white font-bold">{showCheckoutModal.price.toFixed(2)} {t.sar}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-zinc-500 text-sm">{lang === 'en' ? 'Discount (Fixed)' : 'الخصم (مبلغ ثابت)'}</span>
                  <div className="relative w-32">
                    <input 
                      type="number"
                      value={checkoutData.discount}
                      onChange={(e) => setCheckoutData({...checkoutData, discount: Number(e.target.value)})}
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-brand-yellow"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500">{t.sar}</span>
                  </div>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-display font-bold text-white">{t.total}</span>
                  <span className="text-2xl font-display font-bold text-brand-yellow">{(showCheckoutModal.price - checkoutData.discount).toFixed(2)} {t.sar}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold px-1">{lang === 'en' ? 'Payment Method' : 'طريقة الدفع'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CASH', label: lang === 'en' ? 'Cash' : 'كاش', icon: Wallet },
                    { id: 'POS', label: lang === 'en' ? 'POS' : 'شبكة', icon: CreditCard },
                    { id: 'APPLE_PAY', label: 'Apple Pay', icon: Smartphone }
                  ].map((method) => (
                    <button 
                      key={method.id}
                      onClick={() => setCheckoutData({...checkoutData, paymentMethod: method.id})}
                      className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-2 ${checkoutData.paymentMethod === method.id ? 'bg-brand-yellow border-brand-yellow text-zinc-950' : 'bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/10'}`}
                    >
                      <method.icon className="w-5 h-5" />
                      <span className="text-[8px] font-bold uppercase">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleCompletePayment}
                className="w-full bg-brand-yellow text-zinc-950 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-brand-yellow/10 mt-4 hover:bg-yellow-400 transition-all"
              >
                {lang === 'en' ? 'Confirm & Post Payment' : 'تأكيد وترحيل الدفع'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {showQRModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0c0c0e] p-8 rounded-[3rem] border border-white/10 shadow-2xl max-w-sm w-full text-center relative"
          >
            <button 
              onClick={() => { setShowQRModal(false); setQrModalData(null); }}
              className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-display font-bold text-brand-yellow mb-1">{t.qrCode}</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">{qrModalData?.name || companyInfo.name}</p>
              </div>

              <div className="p-6 bg-white rounded-[2rem] shadow-2xl inline-block mx-auto">
                <QRCodeSVG value={qrModalData?.value || qrValue} size={200} fgColor="#09090b" />
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 bg-brand-yellow text-zinc-950 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" />
                  {t.printQR}
                </button>
                <button className="w-full py-3 bg-zinc-800 text-white rounded-xl font-bold text-sm hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 border border-white/5">
                  <Share2 className="w-4 h-4" />
                  {t.share}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Sale Modal */}
      {showAddSaleModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0c0c0e] p-8 rounded-[3rem] border border-white/10 shadow-2xl max-w-lg w-full relative"
          >
            <button 
              onClick={() => setShowAddSaleModal(false)}
              className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-display font-bold text-brand-yellow mb-1">{t.addHandWash}</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">{lang === 'en' ? 'Manual Entry' : 'إضافة يدوية'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{lang === 'en' ? 'Code' : 'الكود'}</label>
                  <input 
                    type="text" 
                    value={newSale.code}
                    onChange={(e) => setNewSale({...newSale, code: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.customerName}</label>
                  <input 
                    type="text" 
                    value={newSale.customerName}
                    onChange={(e) => setNewSale({...newSale, customerName: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.car}</label>
                  <input 
                    type="text" 
                    value={newSale.carDetails}
                    onChange={(e) => setNewSale({...newSale, carDetails: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.service}</label>
                  <select 
                    value={newSale.serviceId}
                    onChange={(e) => {
                      const s = services.find(sv => sv.id === parseInt(e.target.value));
                      setNewSale({...newSale, serviceId: e.target.value, price: s ? s.price.toString() : ''});
                    }}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white appearance-none"
                  >
                    <option value="">{lang === 'en' ? 'Select Service' : 'اختر الخدمة'}</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.price} {t.sar})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{lang === 'en' ? 'Notes' : 'ملاحظات'}</label>
                <textarea 
                  value={newSale.notes}
                  onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.thePrice}</label>
                  <input 
                    type="number" 
                    value={newSale.price}
                    onChange={(e) => setNewSale({...newSale, price: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.paymentMethod}</label>
                  <select 
                    value={newSale.paymentMethod}
                    onChange={(e) => setNewSale({...newSale, paymentMethod: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-brand-yellow text-white appearance-none"
                  >
                    <option value="Cash">{t.cash}</option>
                    <option value="Card">{t.card}</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleAddSale}
                className="w-full py-4 bg-brand-yellow text-zinc-950 rounded-2xl font-bold text-sm hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
              >
                {t.confirm}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Wallet Report Modal */}
      {showWalletReport && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0c0c0e] p-8 rounded-[3rem] border border-white/10 shadow-2xl max-w-2xl w-full relative"
          >
            <button 
              onClick={() => setShowWalletReport(false)}
              className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-display font-bold text-brand-yellow mb-1">{t.walletReport}</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">{companyInfo.name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{t.currentBalance}</p>
                  <p className="text-xl font-bold text-white">{walletBalance.toLocaleString()} <span className="text-xs text-brand-yellow">{t.sar}</span></p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{t.totalOnlinePayments}</p>
                  <p className="text-xl font-bold text-emerald-500">+900.00 <span className="text-xs">{t.sar}</span></p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{t.totalSettlements}</p>
                  <p className="text-xl font-bold text-red-500">-350.00 <span className="text-xs">{t.sar}</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2">{t.recentTransactions}</h4>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                  {walletTransactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <p className="text-xs font-bold text-white">{tx.description}</p>
                        <p className="text-[10px] text-zinc-500">{tx.date}</p>
                      </div>
                      <div className={`text-sm font-bold ${tx.type === 'payment' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {tx.type === 'payment' ? '+' : ''}{tx.amount.toFixed(2)} {t.sar}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => setShowWalletReport(false)}
                  className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold text-sm transition-all border border-white/5"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0c0c0e] p-8 rounded-[3rem] border border-white/10 shadow-2xl max-w-sm w-full relative"
          >
            <button 
              onClick={() => setShowQRModal(false)}
              className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center gap-8">
              <div className="text-center">
                <h3 className="text-xl font-display font-bold text-brand-yellow mb-1">360Cars</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Business QR Code</p>
              </div>
              
              <div className="p-8 bg-white rounded-[2.5rem] shadow-2xl">
                <QRCodeSVG id="qr-code-download" value={qrValue} size={240} fgColor="#09090b" />
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: companyInfo.name,
                        text: `Check out ${companyInfo.name} on 360 Cars!`,
                        url: qrValue,
                      });
                    }
                  }}
                  className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl font-bold text-xs transition-all border border-white/5"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button 
                  onClick={() => {
                    const svg = document.getElementById('qr-code-download');
                    if (svg) {
                      const svgData = new XMLSerializer().serializeToString(svg);
                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                      const img = new Image();
                      img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx?.drawImage(img, 0, 0);
                        const pngFile = canvas.toDataURL('image/png');
                        const downloadLink = document.createElement('a');
                        downloadLink.download = `${companyInfo.name}-QR.png`;
                        downloadLink.href = pngFile;
                        downloadLink.click();
                      };
                      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                    }
                  }}
                  className="flex items-center justify-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 py-4 rounded-2xl font-bold text-xs transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
