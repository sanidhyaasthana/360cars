import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Star, 
  ChevronRight, 
  ExternalLink,
  ArrowLeft,
  Phone,
  MessageCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CenterData {
  id: string;
  name: string;
  city: string;
  rating: number;
  galleryImages: string[];
  googleMapsUrl: string;
}

export const CenterProfilePage: React.FC = () => {
  const { centerId } = useParams<{ centerId: string }>();
  const navigate = useNavigate();
  const { t, lang, isRtl } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRippleActive, setIsRippleActive] = useState(false);
  const [center, setCenter] = useState<CenterData>({
    id: centerId || '1',
    name: '',
    city: '',
    rating: 0,
    galleryImages: [
      'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1000',
    ],
    googleMapsUrl: ''
  });

  useEffect(() => {
    fetch(`/api/centers/${centerId}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCenter(prev => ({
            ...prev,
            name: data.center_name || data.name || '',
            city: data.address || '',
            rating: data.avg_rating || 0,
            googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(data.center_name || '')}+${encodeURIComponent(data.address || '')}`
          }));
        }
      })
      .catch(() => {});
  }, [centerId]);

  // Slider Logic
  useEffect(() => {
    if (center.galleryImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % center.galleryImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [center.galleryImages.length]);

  const handleServicesClick = () => {
    setIsRippleActive(true);
    setTimeout(() => {
      setIsRippleActive(false);
      navigate(`/center/${center.id}/services`);
    }, 300);
  };

  const handleLocationClick = () => {
    window.open(center.googleMapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans overflow-hidden flex flex-col">
      {/* Page Container with Scroll */}
      <div className="flex-1 overflow-y-auto pb-[85px] scrollbar-hide">
        {/* Hero Section */}
        <div className="relative h-[260px] md:h-[320px] w-full rounded-b-[24px] overflow-hidden shadow-2xl">
          {/* Image Slider */}
          <AnimatePresence mode="wait">
            {center.galleryImages.length > 0 ? (
              <motion.img
                key={currentImageIndex}
                src={center.galleryImages[currentImageIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
                alt={center.name}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
            )}
          </AnimatePresence>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent" />

          {/* Top Controls */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/40 transition-colors active:scale-95"
            >
              <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227]/20 backdrop-blur-md rounded-full border border-[#C9A227]/30">
              <Star className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
              <span className="text-xs font-bold text-[#C9A227]">{center.rating}</span>
            </div>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col"
            >
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                {center.name}
              </h1>
              <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                <MapPin className="w-4 h-4 text-[#C9A227]" />
                <span>{center.city}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Center Information Section */}
        <div className="px-6 py-8 space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-white">{center.name}</h2>
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin className="w-4 h-4 text-[#C9A227]" />
              <span className="text-sm">{center.city}</span>
            </div>
          </div>
          
          <div className="h-px bg-[#1A1A1A] w-full" />
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{t.contactUs}</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center gap-3 p-4 bg-[#111111] rounded-2xl border border-white/5 hover:border-brand-yellow/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold">05XXXXXXXX</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-[#111111] rounded-2xl border border-white/5 hover:border-brand-yellow/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold">WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-[#1A1A1A] w-full" />

          {/* Rate & Review Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{lang === 'ar' ? 'تقييم المركز' : 'Rate this Center'}</h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} className="p-1">
                    <Star className={`w-5 h-5 ${star <= 4 ? 'text-brand-yellow fill-brand-yellow' : 'text-zinc-700'}`} />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                {lang === 'ar' ? 'ملاحظاتك' : 'Your Notes'}
              </label>
              <textarea 
                className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-brand-yellow/50 transition-all resize-none"
                rows={4}
                placeholder={lang === 'ar' ? 'أضف ملاحظاتك هنا...' : 'Add your notes here...'}
              />
            </div>

            <button className="w-full py-4 bg-brand-yellow text-zinc-950 rounded-2xl font-bold text-sm hover:bg-yellow-400 transition-all shadow-xl shadow-brand-yellow/10">
              {lang === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
            </button>
          </div>

          <div className="h-px bg-[#1A1A1A] w-full" />
          <div className="space-y-4">
            <p className="text-zinc-500 text-sm leading-relaxed">
              {lang === 'ar' 
                ? 'نقدم أفضل خدمات العناية بالسيارات باستخدام أحدث التقنيات والمواد العالمية. فريقنا المتخصص يضمن لك جودة استثنائية ولمعان يدوم طويلاً.' 
                : 'We offer the best car care services using the latest technologies and international materials. Our specialized team guarantees exceptional quality and long-lasting shine.'}
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[75px] bg-[#111111] border-t border-[#1A1A1A] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50 flex">
        {/* Services Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleServicesClick}
          className="flex-1 relative overflow-hidden bg-[#C9A227] text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-[#d4ae35]"
        >
          {isRippleActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white/30 rounded-full"
            />
          )}
          <span>{lang === 'ar' ? 'خدماتنا' : 'Our Services'}</span>
          <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        </motion.button>

        {/* Location Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLocationClick}
          className="flex-1 bg-[#111111] text-[#C9A227] font-bold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-zinc-900"
        >
          <MapPin className="w-4 h-4" />
          <span>{lang === 'ar' ? 'الموقع' : 'Location'}</span>
          <ExternalLink className="w-3 h-3 opacity-50" />
        </motion.button>
      </div>

      {/* Global Transition Overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-[#0B0B0B] pointer-events-none z-[100]"
      />
    </div>
  );
};
