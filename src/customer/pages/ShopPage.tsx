import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Plus, 
  X, 
  CheckCircle2, 
  ArrowLeft,
  Bell,
  User as UserIcon,
  MapPin,
  Star,
  ShieldCheck,
  CreditCard,
  Info,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Logo } from '../../shared/components/Logo';
import { DatePicker, TimePicker } from '../../shared/components/DatePicker';
import { useAuth } from '../../contexts/AuthContext';

interface ShopPageProps {
  t: any;
  lang: string;
  isRtl: boolean;
}

export const ShopPage: React.FC<ShopPageProps> = ({ t, lang, isRtl }) => {
  const { shopId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(0); // 0: Select Flow, 1: Car, 2: Service, 3: Date/Time (Booking only), 4: Summary
  const [flowType, setFlowType] = useState<'REQUEST' | 'BOOKING' | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [newCar, setNewCar] = useState({ brand: '', model: '', year: '' });
  const [userCars, setUserCars] = useState<any[]>([]);
  const [shopSettings, setShopSettings] = useState({ booking_fee: 5, auto_confirm_bookings: 0 });
  const [shopData, setShopData] = useState<any>({
    id: shopId,
    name: '',
    rating: 0,
    reviews: 0,
    address: '',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1000',
    services: []
  });

  useEffect(() => {
    // Fetch shop details and settings
    fetch(`/api/centers/${shopId}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setShopData((prev: any) => ({
            ...prev,
            name: data.center_name || data.name || '',
            address: data.address || '',
            rating: data.avg_rating || 0,
            reviews: data.review_count || 0,
            services: (data.services || []).map((s: any) => ({
              id: s.id,
              name: s.name,
              desc: s.description || '',
              price: s.price || 0,
            })),
          }));
          setShopSettings({
            booking_fee: data.booking_fee || 0,
            auto_confirm_bookings: data.auto_confirm_bookings || 0
          });
        }
      })
      .catch(() => {});
  }, [shopId]);

  useEffect(() => {
    if (user?.cars) {
      try {
        setUserCars(JSON.parse(user.cars));
      } catch (e) {
        setUserCars([]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectShopId', shopId || '');
      navigate('/login');
    }
  }, [isAuthenticated, shopId, navigate]);

  const handleAddCar = () => {
    if (newCar.brand && newCar.model && newCar.year) {
      setUserCars([...userCars, { ...newCar, id: Date.now() }]);
      setNewCar({ brand: '', model: '', year: '' });
      setShowAddCarModal(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      if (flowType === 'REQUEST') {
        const res = await fetch('/api/washes/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId: shopId,
            customerId: user?.id,
            serviceId: selectedService.id,
            carSize: 'SMALL', // Default or based on car
            price: selectedService.price,
            notes,
            carDetails: `${selectedCar.brand} ${selectedCar.model} (${selectedCar.year})`
          })
        });
        if (res.ok) {
          alert(lang === 'en' ? 'Request Sent Successfully!' : 'تم إرسال الطلب بنجاح!');
          navigate('/dashboard');
        }
      } else {
        const res = await fetch('/api/bookings/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId: shopId,
            customerId: user?.id,
            serviceId: selectedService.id,
            bookingDate: selectedDate,
            timeSlot: selectedTime,
            notes
          })
        });
        if (res.ok) {
          const data = await res.json();
          alert(data.status === 'CONFIRMED' 
            ? (lang === 'en' ? 'Booking Confirmed!' : 'تم تأكيد الحجز!')
            : (lang === 'en' ? 'Booking Requested! Awaiting Confirmation.' : 'تم طلب الحجز! بانتظار التأكيد.')
          );
          navigate('/dashboard');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans pb-32">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0B]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ArrowLeft className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full relative">
              <Bell className="w-6 h-6 text-zinc-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-yellow rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
              {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-zinc-500" />}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-28 max-w-4xl mx-auto px-4 space-y-12">
        {/* Shop Header */}
        <div className="relative h-64 rounded-[2.5rem] overflow-hidden group">
          <img src={shopData.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-brand-yellow/20 backdrop-blur-md rounded-lg border border-brand-yellow/30">
                <Star className="w-3 h-3 text-brand-yellow fill-brand-yellow" />
                <span className="text-xs font-bold text-brand-yellow">{shopData.rating}</span>
              </div>
              <span className="text-xs text-zinc-400">({shopData.reviews} {t.reviews || (lang === 'en' ? 'reviews' : 'تقييم')})</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-2">{shopData.name}</h2>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <MapPin className="w-4 h-4" />
                {shopData.address}
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-brand-yellow transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-brand-yellow transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        {bookingStep > 0 && (
          <div className="flex items-center justify-between px-4">
            {[1, 2, flowType === 'BOOKING' ? 3 : null, 4].filter(Boolean).map((step, idx) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${bookingStep >= (step as number) ? 'bg-brand-yellow text-zinc-950' : 'bg-zinc-900 text-zinc-500 border border-white/5'}`}>
                    {idx + 1}
                  </div>
                </div>
                {idx < (flowType === 'BOOKING' ? 2 : 1) && <div className={`h-px flex-1 mx-4 ${bookingStep > (step as number) ? 'bg-brand-yellow' : 'bg-zinc-800'}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {bookingStep === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <button 
                onClick={() => { setFlowType('REQUEST'); setBookingStep(1); }}
                className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 hover:border-brand-yellow/50 transition-all group text-center space-y-4"
              >
                <div className="w-16 h-16 bg-brand-yellow rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Car className="w-8 h-8 text-zinc-950" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white">{lang === 'en' ? 'Request Service Now' : 'اطلب الخدمة الآن'}</h3>
                <p className="text-sm text-zinc-500">{lang === 'en' ? 'For customers currently at the car wash' : 'للعملاء الموجودين حالياً في المغسلة'}</p>
              </button>

              <button 
                onClick={() => { setFlowType('BOOKING'); setBookingStep(1); }}
                className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 hover:border-brand-yellow/50 transition-all group text-center space-y-4"
              >
                <div className="w-16 h-16 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-brand-yellow" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white">{lang === 'en' ? 'Book a Service' : 'حجز موعد مسبق'}</h3>
                <p className="text-sm text-zinc-500">{lang === 'en' ? 'Schedule for a future date and time' : 'جدولة موعد لتاريخ ووقت لاحق'}</p>
              </button>
            </motion.div>
          )}

          {bookingStep === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-display font-bold text-white">{t.myCars || (lang === 'en' ? 'My Cars' : 'سياراتي')}</h3>
                <button 
                  onClick={() => setShowAddCarModal(true)}
                  className="flex items-center gap-2 text-brand-yellow font-bold text-sm hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  {t.addCar || (lang === 'en' ? 'Add Car' : 'إضافة سيارة')}
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userCars.map((car) => (
                  <div 
                    key={car.id}
                    onClick={() => setSelectedCar(car)}
                    className={`p-6 rounded-3xl bg-[#111111] border-2 transition-all cursor-pointer group ${selectedCar?.id === car.id ? 'border-brand-yellow shadow-2xl shadow-brand-yellow/10' : 'border-white/5 hover:border-white/10'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${selectedCar?.id === car.id ? 'bg-brand-yellow text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>
                        <Car className="w-6 h-6" />
                      </div>
                      {selectedCar?.id === car.id && <CheckCircle2 className="w-5 h-5 text-brand-yellow" />}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{car.brand} {car.model}</h4>
                    <p className="text-sm text-zinc-500 font-mono">{car.year}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {bookingStep === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-display font-bold text-white">{t.selectService || (lang === 'en' ? 'Select Service' : 'اختر الخدمة')}</h3>
              <div className="space-y-4">
                {shopData.services.map((service) => (
                  <div 
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-6 rounded-[2rem] bg-[#111111] border-2 transition-all cursor-pointer flex justify-between items-center group ${selectedService?.id === service.id ? 'border-brand-yellow shadow-2xl shadow-brand-yellow/10' : 'border-white/5 hover:border-white/10'}`}
                  >
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1">{service.name}</h4>
                      <p className="text-sm text-zinc-500 mb-4">{service.desc}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-display font-bold text-brand-yellow">{service.price} {t.sar}</span>
                        {service.oldPrice && (
                          <span className="text-sm text-zinc-600 line-through">{service.oldPrice} {t.sar}</span>
                        )}
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedService?.id === service.id ? 'bg-brand-yellow text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>
                      <ChevronRight className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {bookingStep === 3 && flowType === 'BOOKING' && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-display font-bold text-white">{t.selectDate || (lang === 'en' ? 'Select Date' : 'اختر التاريخ')}</h3>
                <DatePicker 
                  value={selectedDate} 
                  onChange={setSelectedDate} 
                  minDate={new Date().toISOString().split('T')[0]}
                  placeholder={lang === 'en' ? 'Choose a date' : 'اختر تاريخاً'}
                />
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-display font-bold text-white">{t.selectTime || (lang === 'en' ? 'Select Time' : 'اختر الوقت')}</h3>
                <TimePicker 
                  value={selectedTime} 
                  onChange={setSelectedTime} 
                  placeholder={lang === 'en' ? 'Choose a time' : 'اختر وقتاً'}
                />
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-display font-bold text-white">{t.notes || (lang === 'en' ? 'Notes' : 'ملاحظات')}</h3>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={lang === 'en' ? 'Any special requests?' : 'أي طلبات خاصة؟'}
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-yellow/50 transition-all min-h-[120px] resize-none"
                />
              </div>
            </motion.div>
          )}

          {bookingStep === 3 && flowType === 'REQUEST' && (
            <motion.div 
              key="step3-request"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-display font-bold text-white">{t.notes || (lang === 'en' ? 'Notes' : 'ملاحظات')}</h3>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={lang === 'en' ? 'Any special requests?' : 'أي طلبات خاصة؟'}
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-yellow/50 transition-all min-h-[120px] resize-none"
                />
              </div>
            </motion.div>
          )}

          {bookingStep === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-display font-bold text-white">{t.bookingSummary || (lang === 'en' ? 'Booking Summary' : 'ملخص الحجز')}</h3>
              
              <div className="bg-[#111111] rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                      <img src={shopData.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{shopData.name}</h4>
                      <p className="text-sm text-zinc-500">{shopData.address}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-brand-yellow">
                        <Car className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{t.car}</p>
                        <p className="text-sm font-bold text-white">{selectedCar?.brand} {selectedCar?.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-brand-yellow">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{t.service}</p>
                        <p className="text-sm font-bold text-white">{selectedService?.name}</p>
                      </div>
                    </div>
                    {flowType === 'BOOKING' && (
                      <>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-brand-yellow">
                            <Calendar className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{t.theDate}</p>
                            <p className="text-sm font-bold text-white">{selectedDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-brand-yellow">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{t.theTime}</p>
                            <p className="text-sm font-bold text-white">{selectedTime}</p>
                          </div>
                        </div>
                      </>
                    )}
                    {flowType === 'REQUEST' && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{lang === 'en' ? 'Arrival' : 'الوصول'}</p>
                          <p className="text-sm font-bold text-white">{lang === 'en' ? 'On-site Now' : 'موجود حالياً'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {notes && (
                    <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">{t.notes}</p>
                      <p className="text-xs text-zinc-300 italic">"{notes}"</p>
                    </div>
                  )}

                  <div className="h-px bg-white/5" />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500">{t.servicePrice || (lang === 'en' ? 'Service Price' : 'سعر الخدمة')}</span>
                      <span className="text-white font-bold">{selectedService?.price} {t.sar}</span>
                    </div>
                    {flowType === 'BOOKING' && shopSettings.booking_fee > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-500">{t.bookingFee || (lang === 'en' ? 'Booking Fee' : 'رسوم الحجز')}</span>
                          <Info className="w-3 h-3 text-zinc-600" />
                        </div>
                        <span className="text-white font-bold">{shopSettings.booking_fee.toFixed(2)} {t.sar}</span>
                      </div>
                    )}
                    <div className="pt-3 flex justify-between items-center">
                      <span className="text-lg font-display font-bold text-white">{t.total}</span>
                      <span className="text-2xl font-display font-bold text-brand-yellow">
                        {(selectedService?.price + (flowType === 'BOOKING' ? shopSettings.booking_fee : 0)).toFixed(2)} {t.sar}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        {bookingStep > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B] to-transparent">
            <div className="max-w-4xl mx-auto">
              {bookingStep < 4 ? (
                <button 
                  disabled={
                    (bookingStep === 1 && !selectedCar) ||
                    (bookingStep === 2 && !selectedService) ||
                    (bookingStep === 3 && flowType === 'BOOKING' && (!selectedDate || !selectedTime))
                  }
                  onClick={() => setBookingStep(bookingStep + 1)}
                  className="w-full bg-brand-yellow disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 py-5 rounded-[2rem] font-bold text-lg shadow-2xl shadow-brand-yellow/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {t.continue || (lang === 'en' ? 'Continue' : 'استمرار')}
                  <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button 
                  onClick={handleConfirmBooking}
                  className="w-full bg-brand-yellow text-zinc-950 py-5 rounded-[2rem] font-bold text-lg shadow-2xl shadow-brand-yellow/10 transition-all active:scale-95"
                >
                  {flowType === 'REQUEST' 
                    ? (lang === 'en' ? 'Send Request' : 'إرسال الطلب')
                    : (t.confirmBooking || (lang === 'en' ? 'Confirm Booking' : 'تأكيد الحجز'))
                  }
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Car Modal */}
      {showAddCarModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111111] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl max-w-md w-full relative"
          >
            <button 
              onClick={() => setShowAddCarModal(false)}
              className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-display font-bold text-brand-yellow mb-8">{t.addCar || (lang === 'en' ? 'Add New Car' : 'إضافة سيارة جديدة')}</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">{t.carType}</label>
                <input 
                  type="text" 
                  placeholder="e.g. Toyota Camry"
                  value={newCar.brand}
                  onChange={(e) => setNewCar({...newCar, brand: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-yellow/50 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">{t.carModel}</label>
                <input 
                  type="text" 
                  placeholder="e.g. SE"
                  value={newCar.model}
                  onChange={(e) => setNewCar({...newCar, model: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-yellow/50 transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">{t.year}</label>
                <input 
                  type="text" 
                  placeholder="2025"
                  value={newCar.year}
                  onChange={(e) => setNewCar({...newCar, year: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-brand-yellow/50 transition-all" 
                />
              </div>
              
              <button 
                onClick={handleAddCar}
                className="w-full bg-brand-yellow text-zinc-950 py-4 rounded-2xl font-bold shadow-xl shadow-brand-yellow/10 mt-4"
              >
                {t.save}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
