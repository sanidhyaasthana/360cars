import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  FileText,
  Tag,
  Calendar,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  X,
  LogOut,
  Car as CarIcon,
  Star,
  Info,
  Send,
  ArrowLeft,
  Bell,
  MapPin,
  Layers,
  MapPinned,
  Phone,
  Trash2,
  Store
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { DatePicker, TimePicker } from '../../shared/components/DatePicker';

type Tab = 'home' | 'pricelist' | 'offers' | 'subscriptions';

export const CustomerDashboard: React.FC = () => {
  const { shopId } = useParams();
  const { user, logout } = useAuth();
  const { t, isRtl, lang } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCenterDetails, setShowCenterDetails] = useState(false);
  const [showCenterPicker, setShowCenterPicker] = useState(false);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [historyFilter, setHistoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [preferredDate, setPreferredDate] = useState('');

  // Current center - starts empty (user must choose)
  const [currentCenter, setCurrentCenter] = useState<any>(null);
  const [availableCenters, setAvailableCenters] = useState<any[]>([]);
  const [centerRating, setCenterRating] = useState<{ avg: number; count: number }>({ avg: 0, count: 0 });

  // Cars - fetched from API, no defaults
  const [cars, setCars] = useState<any[]>([]);
  const [newCar, setNewCar] = useState({ brand: '', model: '', year: '', plateNumber: '' });

  // History from API
  const [history, setHistory] = useState<any[]>([]);

  // Review
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const shopServices = [
    {
      id: 1,
      name: lang === 'ar' ? 'غسيل أساسي' : 'Basic Wash',
      prices: { small: 30, medium: 35, large: 40, suv: 45 },
      desc: lang === 'ar' ? 'غسيل خارجي وتجفيف' : 'Exterior wash and dry'
    },
    {
      id: 2,
      name: lang === 'ar' ? 'غسيل فاخر' : 'Premium Wash',
      prices: { small: 50, medium: 60, large: 70, suv: 80 },
      desc: lang === 'ar' ? 'غسيل خارجي وداخلي كامل' : 'Full exterior and interior'
    },
    {
      id: 3,
      name: lang === 'ar' ? 'طلاء سيراميك' : 'Ceramic Coating',
      prices: { small: 500, medium: 600, large: 700, suv: 800 },
      desc: lang === 'ar' ? 'حماية طويلة الأمد' : 'Long term protection'
    },
  ];

  const shopOffers = [
    { id: 1, title: lang === 'ar' ? 'خصم المرة الأولى' : 'First Time Discount', discount: '20%', code: 'WELCOME20' },
    { id: 2, title: lang === 'ar' ? 'عرض نهاية الأسبوع' : 'Weekend Special', discount: '15%', code: 'WEEKEND' },
  ];

  const shopPlans = [
    { id: 1, name: lang === 'ar' ? 'الخطة الشهرية الأساسية' : 'Monthly Basic', price: 100, features: ['4 Basic Washes', 'Priority Booking'], status: 'Available' },
    { id: 2, name: lang === 'ar' ? 'الخطة الشهرية الفاخرة' : 'Monthly Premium', price: 180, features: ['4 Premium Washes', 'Engine Cleaning'], status: 'Available' },
  ];

  // Fetch cars from API
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/cars?userId=${user.id}`).then(r => r.json()).then(setCars).catch(() => {});
      fetch(`/api/service-requests?customerId=${user.id}`).then(r => r.json()).then(data => {
        setHistory(data.map((sr: any) => ({
          id: sr.id,
          date: sr.created_at?.split('T')[0] || '',
          shopName: sr.center_name || sr.business_name || '',
          service: 'Service Request',
          car: sr.car_brand ? `${sr.car_brand} ${sr.car_model}` : '',
          status: sr.status,
          amount: sr.total_price || 0
        })));
      }).catch(() => {});
    }
  }, [user]);

  // Fetch available centers
  useEffect(() => {
    fetch('/api/businesses').then(r => r.json()).then(setAvailableCenters).catch(() => {});
  }, []);

  // Fetch center rating when center changes
  useEffect(() => {
    if (currentCenter?.id) {
      fetch(`/api/reviews/${currentCenter.id}`)
        .then(r => r.json())
        .then(data => setCenterRating({ avg: data.avgRating || 0, count: data.count || 0 }))
        .catch(() => {});
    }
  }, [currentCenter]);

  const handleAddCar = async () => {
    if (!newCar.brand || !newCar.model) return;
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, ...newCar })
      });
      const data = await res.json();
      if (data.success) {
        setCars(prev => [...prev, { id: data.id, ...newCar }]);
        setNewCar({ brand: '', model: '', year: '', plateNumber: '' });
        setShowAddCarModal(false);
      }
    } catch (e) {}
  };

  const handleDeleteCar = async (carId: number) => {
    try {
      await fetch(`/api/cars/${carId}`, { method: 'DELETE' });
      setCars(prev => prev.filter(c => c.id !== carId));
      if (selectedCarId === carId) setSelectedCarId(null);
    } catch (e) {}
  };

  const handleSubmitReview = async () => {
    if (!currentCenter?.id || !user?.id) return;
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, centerId: currentCenter.id, rating: reviewRating, comment: reviewComment })
      });
      setShowReviewModal(false);
      setReviewComment('');
      // Refresh rating
      const data = await (await fetch(`/api/reviews/${currentCenter.id}`)).json();
      setCenterRating({ avg: data.avgRating || 0, count: data.count || 0 });
    } catch (e) {}
  };

  const handleServiceRequest = async () => {
    if (!currentCenter?.id || !user?.id) return;
    try {
      await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id,
          centerId: currentCenter.id,
          carId: selectedCarId,
          serviceIds: selectedServices,
          notes: ''
        })
      });
      setShowRequestModal(false);
      setSelectedServices([]);
      alert(t.requestSent);
    } catch (e) {}
  };

  const filteredHistory = history.filter(item => {
    if (historyFilter === 'All') return true;
    if (historyFilter === 'Pending') return item.status === 'PENDING';
    if (historyFilter === 'Completed') return item.status === 'COMPLETED';
    return true;
  });

  const filteredServices = shopServices.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleServiceSelection = (id: number) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const renderStars = (rating: number, interactive = false, onSet?: (r: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        onClick={() => interactive && onSet?.(i + 1)}
        className={`w-5 h-5 ${interactive ? 'cursor-pointer' : ''} ${i < Math.round(rating) ? 'text-brand-yellow fill-brand-yellow' : 'text-zinc-600'}`}
      />
    ));
  };

  const renderHome = () => (
    <div className="space-y-6 pb-24">
      {/* Center Selection */}
      {!currentCenter ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/40 backdrop-blur-md border border-brand-yellow/20 rounded-2xl p-6 text-center"
        >
          <Store className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-white mb-2">{t.noCenterSelected}</h3>
          <p className="text-xs text-zinc-500 mb-4">{t.chooseCenter}</p>
          <button
            onClick={() => setShowCenterPicker(true)}
            className="bg-brand-yellow text-zinc-950 px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all"
          >
            {t.selectCenter}
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowCenterDetails(true)}
          className="bg-zinc-900/40 backdrop-blur-md border border-brand-yellow/20 rounded-2xl p-4 flex items-center justify-between group hover:border-brand-yellow/40 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
              <MapPinned className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{currentCenter.center_name || currentCenter.name}</h3>
              <p className="text-[10px] text-zinc-500">{currentCenter.address || 'Saudi Arabia'}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-0.5">
              {renderStars(centerRating.avg)}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowCenterPicker(true); }}
              className="text-[10px] font-bold text-brand-yellow hover:underline"
            >
              {t.changeCenter}
            </button>
          </div>
        </motion.div>
      )}

      {/* User Mini Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center text-brand-yellow shadow-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-white">{user?.name || 'Guest User'}</h2>
            <p className="text-xs text-zinc-500 font-mono">{user?.phone || '05XXXXXXXX'}</p>
          </div>
        </div>
        <button className="relative w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-brand-yellow transition-all">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Car Selection */}
      <div className="px-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{t.myCars}</h3>
          <button
            onClick={() => setShowAddCarModal(true)}
            className="text-[10px] font-bold text-brand-yellow hover:underline uppercase tracking-widest"
          >
            + {t.addCar}
          </button>
        </div>
        {cars.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {cars.map(car => (
              <motion.div
                key={car.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCarId(car.id)}
                className={`relative p-4 rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${selectedCarId === car.id ? 'bg-brand-yellow/10 border-brand-yellow shadow-[0_0_20px_rgba(201,162,39,0.1)]' : 'bg-zinc-900/50 border-white/5 hover:border-white/10'}`}
              >
                {selectedCarId === car.id && (
                  <div className="absolute top-3 right-3 w-4 h-4 bg-brand-yellow rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-zinc-950" />
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteCar(car.id); }}
                  className="absolute top-3 left-3 p-1 text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center">
                  <CarIcon className="w-5 h-5 text-brand-yellow" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{car.brand} {car.model}</p>
                  <p className="text-[9px] text-zinc-500">{car.year} {car.plate_number || car.plateNumber ? `• ${car.plate_number || car.plateNumber}` : ''}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/30 rounded-2xl p-8 text-center border border-dashed border-white/10">
            <CarIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-xs text-zinc-500 mb-3">{t.noCars}</p>
            <button
              onClick={() => setShowAddCarModal(true)}
              className="text-xs font-bold text-brand-yellow hover:underline"
            >
              {t.addYourCar}
            </button>
          </div>
        )}
      </div>

      {/* Action Cards */}
      {currentCenter && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRequestModal(true)}
              className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-yellow to-yellow-600 text-zinc-950 p-6 rounded-[2.5rem] font-bold flex flex-col items-center justify-center gap-4 shadow-2xl shadow-brand-yellow/20 group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl -mr-16 -mt-16" />
              <div className="w-14 h-14 rounded-3xl bg-zinc-950/10 flex items-center justify-center">
                <Send className="w-7 h-7" />
              </div>
              <span className="block text-sm tracking-tight">{t.requestServiceBtn}</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBookingModal(true)}
              className="relative aspect-square bg-zinc-900 border border-white/5 text-white p-6 rounded-[2.5rem] font-bold flex flex-col items-center justify-center gap-4 hover:bg-zinc-800 transition-all"
            >
              <div className="w-14 h-14 rounded-3xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                <Calendar className="w-7 h-7" />
              </div>
              <span className="block text-sm tracking-tight">{t.bookService}</span>
            </motion.button>
          </div>

          {/* Rate Center Button */}
          <button
            onClick={() => setShowReviewModal(true)}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-brand-yellow/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-brand-yellow" />
              <span className="text-sm font-bold text-white">{t.rateCenter}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(centerRating.avg)}
              <span className="text-xs text-zinc-500 ml-2">({centerRating.count})</span>
            </div>
          </button>
        </>
      )}

      {/* History */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{t.history}</h3>
          <div className="flex gap-2">
            {['All', 'Pending', 'Completed'].map(f => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${historyFilter === f ? 'bg-brand-yellow text-zinc-950' : 'bg-zinc-900 text-zinc-500'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {filteredHistory.length > 0 ? filteredHistory.map(item => (
            <div key={item.id} className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center ${
                  item.status === 'COMPLETED' ? 'text-emerald-500' :
                  item.status === 'CANCELLED' ? 'text-red-500' : 'text-brand-yellow'
                }`}>
                  {item.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.shopName || item.service}</h4>
                  <p className="text-[10px] text-zinc-500">{item.date} {item.car && `• ${item.car}`}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[9px] font-bold uppercase tracking-widest ${
                  item.status === 'COMPLETED' ? 'text-emerald-500' :
                  item.status === 'CANCELLED' ? 'text-red-500' : 'text-brand-yellow'
                }`}>{item.status}</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-zinc-600 text-xs">{t.noActivities}</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPriceList = () => (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">{t.priceList}</h2>
          {currentCenter && <p className="text-xs text-zinc-500">{t.scopedTo} {currentCenter.center_name || currentCenter.name}</p>}
        </div>
      </div>
      <div className="relative">
        <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500`} />
        <input
          type="text"
          placeholder={t.searchServices}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full bg-zinc-900/50 border border-white/5 rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-4 text-sm outline-none focus:border-brand-yellow/50 transition-all backdrop-blur-md`}
        />
      </div>
      <div className="space-y-6">
        {filteredServices.map(s => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 rounded-[2rem] border border-white/5 overflow-hidden group hover:border-brand-yellow/20 transition-all">
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-brand-yellow">
                <CarIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{s.name}</h4>
                <p className="text-xs text-zinc-500">{s.desc}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 divide-x divide-white/5 bg-zinc-950/30">
              {[
                { label: t.small, price: s.prices.small },
                { label: t.medium, price: s.prices.medium },
                { label: t.large, price: s.prices.large },
                { label: t.suv, price: s.prices.suv }
              ].map((tier, i) => (
                <div key={i} className="p-4 text-center">
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{tier.label}</p>
                  <p className="text-sm font-display font-bold text-brand-yellow">{tier.price}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderOffers = () => (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-display font-bold text-white">{t.offers}</h2>
      {shopOffers.map(offer => (
        <div key={offer.id} className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-yellow/5 blur-[80px] -mr-20 -mt-20" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-brand-yellow/10 rounded-2xl flex items-center justify-center text-brand-yellow">
                <Tag className="w-7 h-7" />
              </div>
              <span className="bg-brand-yellow text-zinc-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{offer.discount} OFF</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">{offer.title}</h4>
            <p className="text-xs text-zinc-500 mb-6 font-mono">{offer.code}</p>
            <button className="w-full py-4 bg-zinc-950 border border-white/5 rounded-2xl text-xs font-bold text-brand-yellow hover:bg-brand-yellow hover:text-zinc-950 transition-all">{t.applyOffer}</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-display font-bold text-white">{t.subscriptions}</h2>
      {shopPlans.map(plan => (
        <div key={plan.id} className="bg-zinc-900/50 p-8 rounded-[3rem] border border-white/5">
          <div className="flex justify-between items-start mb-8">
            <h4 className="text-2xl font-display font-bold text-white">{plan.name}</h4>
            <div className="text-right">
              <p className="text-3xl font-display font-bold text-brand-yellow">{plan.price}</p>
              <p className="text-[10px] text-zinc-500">{t.sar} / {t.monthly}</p>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            {plan.features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-brand-yellow" />
                {f}
              </div>
            ))}
          </div>
          <button className="w-full py-4 rounded-2xl bg-brand-yellow text-zinc-950 font-bold hover:bg-yellow-400 transition-all">{t.subscribe}</button>
        </div>
      ))}
    </div>
  );

  const renderCenterDetails = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setShowCenterDetails(false)} className="p-2 text-zinc-400 hover:text-white">
          <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
        <h2 className="text-sm font-bold text-white">{t.centerDetails}</h2>
      </div>
      {currentCenter && (
        <div className="bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden">
          <div className="h-48 bg-zinc-800 relative">
            <img
              src={currentCenter.images ? JSON.parse(currentCenter.images)[0] : `https://picsum.photos/seed/${currentCenter.id}/800/400`}
              alt="Center"
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-display font-bold text-white">{currentCenter.center_name || currentCenter.name}</h3>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-brand-yellow shrink-0" />
              <span className="text-sm text-white">{currentCenter.address || 'Saudi Arabia'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-yellow shrink-0" />
              <span className="text-sm text-white">{currentCenter.owner_phone || '05XXXXXXXX'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-brand-yellow shrink-0" />
              <span className="text-sm text-white">{currentCenter.opening_time || '08:00'} - {currentCenter.closing_time || '23:00'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-brand-yellow shrink-0" />
              <div className="flex items-center gap-1">
                {renderStars(centerRating.avg)}
                <span className="text-xs text-zinc-500 ml-2">({centerRating.count} {t.reviewsTitle})</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className={`min-h-screen bg-[#0B0B0B] text-white font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      {activeTab !== 'home' && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-lg mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab('home')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
                <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
              <h1 className="text-sm font-bold text-white">
                {activeTab === 'pricelist' ? t.priceList : activeTab === 'offers' ? t.offers : t.subscriptions}
              </h1>
            </div>
            <button onClick={() => logout()} className="p-2 bg-zinc-900 rounded-full border border-white/5 text-zinc-400 hover:text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}

      <main className={`${activeTab === 'home' ? 'pt-10' : 'pt-20'} px-4 sm:px-6 max-w-lg mx-auto`}>
        <AnimatePresence mode="wait">
          <motion.div key={showCenterDetails ? 'details' : activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {showCenterDetails ? renderCenterDetails() : (
              <>
                {activeTab === 'home' && renderHome()}
                {activeTab === 'pricelist' && renderPriceList()}
                {activeTab === 'offers' && renderOffers()}
                {activeTab === 'subscriptions' && renderSubscriptions()}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111]/90 backdrop-blur-xl border-t border-white/5 pb-safe">
        <div className="max-w-lg mx-auto px-6 h-16 flex items-center justify-between">
          {[
            { id: 'home', icon: User, label: t.home },
            { id: 'pricelist', icon: FileText, label: t.priceList },
            { id: 'offers', icon: Tag, label: t.offers },
            { id: 'subscriptions', icon: Layers, label: t.subscriptions },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as Tab); setShowCenterDetails(false); }}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-brand-yellow' : 'text-zinc-500'}`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Center Picker Modal */}
      {showCenterPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#111111] p-6 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-brand-yellow">{t.selectCenter}</h3>
              <button onClick={() => setShowCenterPicker(false)} className="p-2 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {availableCenters.map(c => (
                <div
                  key={c.id}
                  onClick={() => { setCurrentCenter(c); setShowCenterPicker(false); }}
                  className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 cursor-pointer hover:border-brand-yellow/30 transition-all"
                >
                  <h4 className="text-sm font-bold text-white">{c.center_name || c.name}</h4>
                  <p className="text-xs text-zinc-500">{c.address || 'Saudi Arabia'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] text-zinc-400">{c.opening_time || '08:00'} - {c.closing_time || '23:00'}</span>
                  </div>
                </div>
              ))}
              {availableCenters.length === 0 && (
                <p className="text-center text-zinc-500 text-xs py-8">{lang === 'en' ? 'No centers available' : 'لا توجد مراكز متاحة'}</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Car Modal */}
      {showAddCarModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#111111] p-6 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-brand-yellow">{t.addCar}</h3>
              <button onClick={() => setShowAddCarModal(false)} className="p-2 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{t.carBrand_label}</label>
                <input value={newCar.brand} onChange={e => setNewCar(p => ({ ...p, brand: e.target.value }))} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-yellow/50 text-white" placeholder="e.g. Toyota" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{t.carModel_label}</label>
                <input value={newCar.model} onChange={e => setNewCar(p => ({ ...p, model: e.target.value }))} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-yellow/50 text-white" placeholder="e.g. Camry" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{t.carYear_label}</label>
                <input value={newCar.year} onChange={e => setNewCar(p => ({ ...p, year: e.target.value }))} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-yellow/50 text-white" placeholder="2025" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{t.plateNumber}</label>
                <input value={newCar.plateNumber} onChange={e => setNewCar(p => ({ ...p, plateNumber: e.target.value }))} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-yellow/50 text-white" placeholder="ABC 1234" />
              </div>
              <button onClick={handleAddCar} className="w-full bg-brand-yellow text-zinc-950 py-3 rounded-xl font-bold mt-2">{t.save}</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Request Service Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#111111] p-6 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-brand-yellow">{t.requestServiceBtn}</h3>
              <button onClick={() => setShowRequestModal(false)} className="p-2 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {shopServices.map(s => (
                <div
                  key={s.id}
                  onClick={() => toggleServiceSelection(s.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${selectedServices.includes(s.id) ? 'bg-brand-yellow/10 border-brand-yellow' : 'bg-zinc-900 border-white/5'}`}
                >
                  <span className="text-sm font-bold text-white">{s.name}</span>
                  {selectedServices.includes(s.id) && <CheckCircle2 className="w-4 h-4 text-brand-yellow" />}
                </div>
              ))}
            </div>
            <button onClick={handleServiceRequest} className="w-full bg-brand-yellow text-zinc-950 py-3 rounded-xl font-bold mt-4">{t.confirmRequest}</button>
          </motion.div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#111111] p-6 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-brand-yellow">{t.bookService}</h3>
              <button onClick={() => setShowBookingModal(false)} className="p-2 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <select className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none text-white appearance-none">
                {shopServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <DatePicker label={t.preferredDate} value={preferredDate} onChange={setPreferredDate} minDate={new Date().toISOString().split('T')[0]} />
              <div className="grid grid-cols-3 gap-2">
                {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'].map(slot => (
                  <button key={slot} className="py-2 bg-zinc-800 border border-white/5 rounded-xl text-xs font-bold hover:border-brand-yellow transition-all text-white">{slot}</button>
                ))}
              </div>
              <button onClick={() => { setShowBookingModal(false); alert(t.bookingConfirmed); }} className="w-full bg-brand-yellow text-zinc-950 py-3 rounded-xl font-bold mt-2">{t.confirmBooking}</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#111111] p-6 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-brand-yellow">{t.rateCenter}</h3>
              <button onClick={() => setShowReviewModal(false)} className="p-2 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 py-4">
                {renderStars(reviewRating, true, setReviewRating)}
              </div>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder={t.writeReview}
                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none resize-none text-white focus:border-brand-yellow/50"
                rows={3}
              />
              <button onClick={handleSubmitReview} className="w-full bg-brand-yellow text-zinc-950 py-3 rounded-xl font-bold">{t.submitReview}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
