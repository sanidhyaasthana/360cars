import React, { useState, useEffect, useCallback } from 'react';
import { Hero } from '../../shared/components/Hero';
import { motion } from 'motion/react';
import {
  Shield,
  Zap,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  Car,
  Smartphone,
  TrendingUp,
  Store,
  CreditCard,
  History,
  ArrowRight,
  Navigation
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { LoginModal } from '../../shared/components/LoginModal';

interface CustomerHomeProps {
  audience?: 'INDIVIDUALS' | 'BUSINESSES';
  setAudience?: (audience: 'INDIVIDUALS' | 'BUSINESSES') => void;
  onOpenLogin?: () => void;
  searchQuery?: string;
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({ audience = 'INDIVIDUALS', setAudience, onOpenLogin, searchQuery = '' }) => {
  const { t, isRtl, lang } = useLanguage();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [ratings, setRatings] = useState<Record<number, { avg: number; count: number }>>({});

  useEffect(() => {
    if (audience === 'INDIVIDUALS') {
      fetch('/api/businesses').then(res => res.json()).then(data => {
        setBusinesses(data);
        data.forEach((biz: any) => {
          fetch(`/api/reviews/${biz.id}`)
            .then(r => r.json())
            .then(rev => {
              setRatings(prev => ({
                ...prev,
                [biz.id]: { avg: rev.avgRating || 0, count: rev.count || 0 }
              }));
            })
            .catch(() => {});
        });
      });
    }
  }, [audience]);

  // Request geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setLocationDenied(true);
        }
      );
    }
  }, []);

  // Sort businesses by distance
  const sortedBusinesses = React.useMemo(() => {
    if (!userLocation) return businesses;
    return [...businesses].sort((a, b) => {
      const distA = a.latitude && a.longitude
        ? getDistanceKm(userLocation.lat, userLocation.lng, a.latitude, a.longitude)
        : 9999;
      const distB = b.latitude && b.longitude
        ? getDistanceKm(userLocation.lat, userLocation.lng, b.latitude, b.longitude)
        : 9999;
      return distA - distB;
    });
  }, [businesses, userLocation]);

  // Filter businesses by search query
  const filteredBusinesses = React.useMemo(() => {
    if (!searchQuery.trim()) return sortedBusinesses;
    const q = searchQuery.toLowerCase();
    return sortedBusinesses.filter((biz: any) => {
      const name = (biz.center_name || biz.name || '').toLowerCase();
      const address = (biz.address || '').toLowerCase();
      const phone = (biz.owner_phone || '').toLowerCase();
      return name.includes(q) || address.includes(q) || phone.includes(q);
    });
  }, [sortedBusinesses, searchQuery]);

  const getDistance = (biz: any) => {
    if (!userLocation || !biz.latitude || !biz.longitude) return null;
    return getDistanceKm(userLocation.lat, userLocation.lng, biz.latitude, biz.longitude).toFixed(1);
  };

  const isOpen = (biz: any) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const open = biz.opening_time || '08:00';
    const close = biz.closing_time || '23:00';
    return currentTime >= open && currentTime <= close;
  };

  const features = {
    INDIVIDUALS: [
      {
        icon: Smartphone,
        title: lang === 'en' ? 'Instant Requests' : 'طلبات فورية',
        desc: lang === 'en' ? 'Request a wash on-site in seconds. No waiting, no hassle.' : 'اطلب غسلة في الموقع خلال ثوانٍ. لا انتظار، لا عناء.'
      },
      {
        icon: Clock,
        title: lang === 'en' ? 'Smart Booking' : 'حجز ذكي',
        desc: lang === 'en' ? 'Schedule your detailing sessions in advance with our smart calendar.' : 'جدول جلسات العناية بسيارتك مسبقاً مع تقويمنا الذكي.'
      },
      {
        icon: History,
        title: lang === 'en' ? 'Digital History' : 'سجل رقمي',
        desc: lang === 'en' ? 'Keep track of every service, payment, and subscription in one place.' : 'تتبع كل خدمة، دفعة، واشتراك في مكان واحد.'
      },
      {
        icon: Shield,
        title: lang === 'en' ? 'Verified Centers' : 'مراكز معتمدة',
        desc: lang === 'en' ? 'Only the best detailing centers, verified for quality and trust.' : 'أفضل مراكز العناية فقط، معتمدة للجودة والثقة.'
      }
    ],
    BUSINESSES: [
      {
        icon: Store,
        title: lang === 'en' ? 'Advanced Dashboard' : 'لوحة تحكم متقدمة',
        desc: lang === 'en' ? 'Complete control over your operations, from bookings to staff.' : 'تحكم كامل في عملياتك، من الحجوزات إلى الموظفين.'
      },
      {
        icon: TrendingUp,
        title: lang === 'en' ? 'Revenue Analytics' : 'تحليلات الإيرادات',
        desc: lang === 'en' ? 'Track your growth with detailed financial reports and trends.' : 'تتبع نموك مع تقارير مالية مفصلة واتجاهات الأداء.'
      },
      {
        icon: CreditCard,
        title: lang === 'en' ? 'Seamless Payments' : 'مدفوعات سلسة',
        desc: lang === 'en' ? 'Accept Apple Pay, POS, and cash with automated reconciliation.' : 'اقبل Apple Pay، POS، والنقد مع تسوية آلية.'
      },
      {
        icon: Zap,
        title: lang === 'en' ? 'Branch Sync' : 'مزامنة الفروع',
        desc: lang === 'en' ? 'Manage multiple locations from a single unified account.' : 'أدر مواقع متعددة من حساب موحد واحد.'
      }
    ]
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const rounded = Math.round(rating * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rounded ? 'text-brand-yellow fill-brand-yellow star-glow' : 'text-zinc-700'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-[#0B0B0B] min-h-screen">
      <Hero audience={audience} setAudience={setAudience} onOpenLogin={onOpenLogin} />

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4"
          >
            {audience === 'INDIVIDUALS'
              ? (lang === 'en' ? 'Smart Features for You' : 'مزايا ذكية لك')
              : (lang === 'en' ? 'Powerful Tools for Business' : 'أدوات قوية للأعمال')}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            className="h-0.5 bg-gradient-to-r from-brand-yellow to-yellow-500 mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {features[audience].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="premium-card p-6 sm:p-7 group relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-brand-yellow/5 rounded-full blur-2xl group-hover:bg-brand-yellow/10 transition-colors duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center mb-5 border border-brand-yellow/20 group-hover:scale-110 group-hover:bg-brand-yellow/15 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-brand-yellow" />
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-brand-yellow transition-colors">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Centers That Joined Us Section */}
      {audience === 'INDIVIDUALS' && (
        <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-14 gap-4 sm:gap-6">
            <div className={isRtl ? 'text-right' : 'text-left'}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2 sm:mb-3">{t.centersNearYou}</h2>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-md">{t.centersNearYouDesc}</p>
            </div>
            {locationDenied && (
              <button
                onClick={() => {
                  setUserLocation({ lat: 24.7136, lng: 46.6753 });
                  setLocationDenied(false);
                }}
                className="group flex items-center gap-2 text-brand-yellow font-bold text-xs sm:text-sm bg-brand-yellow/10 px-5 py-2.5 rounded-xl border border-brand-yellow/20 hover:bg-brand-yellow/15 transition-all"
              >
                <Navigation className="w-4 h-4" />
                {t.manualLocation}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredBusinesses.length > 0 ? filteredBusinesses.map((biz, i) => {
              const bizRating = ratings[biz.id];
              const distance = getDistance(biz);
              const open = isOpen(biz);

              return (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => navigate(`/shop/${biz.id}`)}
                  className="premium-card overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-brand-yellow/5 hover:-translate-y-1 hover:border-brand-yellow/30 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-44 sm:h-48 overflow-hidden rounded-t-2xl">
                    <img
                      src={biz.images ? JSON.parse(biz.images)[0] : `https://images.unsplash.com/photo-${['1607860108855-64acf2078ed9','1520340356584-f9917d1eea6f','1601362840469-5f69e1305e69','1605164599901-db0e4d4b8a06','1619642751034-765dfdf7c58e','1618843479619-f3d0d81e4d10'][i % 6]}?w=800&h=600&fit=crop&auto=format`}
                      alt={biz.center_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="card-image-overlay absolute inset-0" />

                    {/* Badges on image */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${open ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/20 text-red-300 border border-red-500/20'}`}>
                        {open ? t.openNow : t.closed}
                      </span>
                      {distance && (
                        <div className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                          <Navigation className="w-3 h-3 text-brand-yellow" />
                          <span className="text-white text-[10px] font-bold">{distance} {t.km}</span>
                        </div>
                      )}
                    </div>

                    {/* Rating badge */}
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-brand-yellow/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
                        <Star className="w-3 h-3 text-zinc-950 fill-zinc-950" />
                        <span className="text-zinc-950 text-xs font-bold">{bizRating ? bizRating.avg.toFixed(1) : '0.0'}</span>
                        {bizRating && bizRating.count > 0 && (
                          <span className="text-zinc-950/60 text-[9px]">({bizRating.count})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-display font-bold text-white mb-2 group-hover:text-brand-yellow transition-colors">
                      {biz.center_name || biz.name}
                    </h3>

                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-600" />
                      <span className="truncate">{biz.address || (lang === 'en' ? 'Saudi Arabia' : 'المملكة العربية السعودية')}</span>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5 mb-2.5">
                      {renderStars(bizRating?.avg || 0)}
                    </div>

                    {/* Working Hours */}
                    <div className="flex items-center gap-2 text-xs mb-4">
                      <Clock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      <span className="text-zinc-400">{biz.opening_time || '08:00'} - {biz.closing_time || '23:00'}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-brand-yellow" />
                        <span className="text-zinc-500 text-[10px] uppercase tracking-[0.15em] font-bold">{t.verifiedStore}</span>
                      </div>
                      <ArrowRight className={`w-4 h-4 text-brand-yellow opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 ${isRtl ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="col-span-full py-16 sm:py-20 text-center premium-card border-dashed">
                <Car className="w-12 h-12 sm:w-14 sm:h-14 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm sm:text-base font-medium">
                  {searchQuery.trim()
                    ? (lang === 'en' ? `No results found for "${searchQuery}"` : `لا توجد نتائج لـ "${searchQuery}"`)
                    : (lang === 'en' ? 'Discovering premium centers near you...' : 'جاري اكتشاف المراكز القريبة منك...')}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
