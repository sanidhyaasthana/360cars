import React from 'react';
import { 
  Undo2, 
  CreditCard, 
  ShieldCheck, 
  Smartphone, 
  Trash2,
  PlusCircle,
  Tag
} from 'lucide-react';

interface TicketSystemProps {
  giftCards: any[];
  setGiftCards: (cards: any[]) => void;
  services: any[];
  newGiftCard: any;
  setNewGiftCard: (card: any) => void;
  lang: 'en' | 'ar';
  t: any;
  setActiveSubView: (view: any) => void;
  setNotification: (notif: { message: string; type: 'success' | 'error' }) => void;
}

const TicketSystem: React.FC<TicketSystemProps> = ({
  giftCards,
  setGiftCards,
  services,
  newGiftCard,
  setNewGiftCard,
  lang,
  t,
  setActiveSubView,
  setNotification
}) => {
  const generateCode = () => {
    const lastCode = giftCards.length > 0 ? parseInt(giftCards[0].code.split('-')[1]) : 1000;
    return `GC-${lastCode + 1}`;
  };

  const handleSendWhatsApp = (card: any) => {
    if (!card) return;
    const serviceName = services.find((s: any) => s.id === parseInt(card.serviceId))?.name || 'Service';
    
    const messageEn = `Hello,
You received a gift card from ${card.senderName || 'Someone'}.
Message: ${card.description || 'Enjoy your gift!'}
You can use this gift card at Foam Depth Car Wash Center.
Location: https://maps.app.goo.gl/example`;

    const messageAr = `مرحباً،
لقد تلقيت بطاقة هدية من ${card.senderName || 'شخص ما'}.
الرسالة: ${card.description || 'استمتع بهديتك!'}
يمكنك استخدام هذه البطاقة في مركز عمق الرغوة لغسيل السيارات.
الموقع: https://maps.app.goo.gl/example`;

    const message = lang === 'en' ? messageEn : messageAr;
    
    const recipientMobile = card.recipientMobile || '';
    const phone = recipientMobile.startsWith('0') ? '966' + recipientMobile.substring(1) : recipientMobile;
    if (!phone || phone.length < 9) {
      setNotification({ message: lang === 'en' ? 'Invalid phone number' : 'رقم الجوال غير صحيح', type: 'error' });
      return;
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!newGiftCard) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div className="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand-yellow/10 transition-colors" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-brand-yellow/10 rounded-lg">
                      <PlusCircle className="w-5 h-5 text-brand-yellow" />
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">{t.addGiftCard}</h2>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">{t.senderName}</label>
                      <input 
                        type="text" 
                        value={newGiftCard.senderName}
                        onChange={(e) => setNewGiftCard({...newGiftCard, senderName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-brand-yellow/50 focus:ring-4 focus:ring-brand-yellow/5 transition-all" 
                        placeholder="..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">{t.recipientMobile}</label>
                      <input 
                        type="tel" 
                        placeholder="05XXXXXXXX"
                        value={newGiftCard.recipientMobile}
                        onChange={(e) => setNewGiftCard({...newGiftCard, recipientMobile: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-brand-yellow/50 focus:ring-4 focus:ring-brand-yellow/5 transition-all" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">{t.giftCardMessage || (lang === 'en' ? 'Message' : 'الرسالة')}</label>
                      <textarea 
                        value={newGiftCard.description}
                        onChange={(e) => setNewGiftCard({...newGiftCard, description: e.target.value})}
                        maxLength={250}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-brand-yellow/50 focus:ring-4 focus:ring-brand-yellow/5 transition-all resize-none h-20" 
                        placeholder={lang === 'en' ? 'e.g. Happy Birthday!' : 'مثل: عيد ميلاد سعيد!'}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">{t.service}</label>
                        <select 
                          value={newGiftCard.serviceId}
                          onChange={(e) => {
                            const service = services.find((s: any) => s.id === parseInt(e.target.value));
                            setNewGiftCard({...newGiftCard, serviceId: e.target.value, price: service?.prices.general || '0'});
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-brand-yellow/50 transition-all appearance-none"
                        >
                          <option value="" className="bg-zinc-900">{t.allServices}</option>
                          {services.map((s: any) => (
                            <option key={s.id} value={s.id} className="bg-zinc-900">{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">{t.thePrice}</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={newGiftCard.price}
                            onChange={(e) => setNewGiftCard({...newGiftCard, price: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-brand-yellow/50 transition-all" 
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-500">SAR</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={() => setNewGiftCard({senderName: '', recipientMobile: '', serviceId: '', price: '', description: '', isRedeemed: false})}
                        className="flex-1 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-white/5"
                      >
                        {t.cancellation}
                      </button>
                      <button 
                        onClick={() => {
                          if (!newGiftCard.senderName || !newGiftCard.recipientMobile || !newGiftCard.serviceId) {
                            setNotification({ message: t.incompleteData, type: 'error' });
                            return;
                          }
                          const code = generateCode();
                          const createdCard = {...newGiftCard, id: Date.now(), code};
                          setGiftCards([createdCard, ...giftCards]);
                          setNewGiftCard({senderName: '', recipientMobile: '', serviceId: '', price: '', description: '', isRedeemed: false});
                          setNotification({ message: lang === 'en' ? 'Gift card created successfully' : 'تم إنشاء بطاقة الهدية بنجاح', type: 'success' });
                          handleSendWhatsApp(createdCard);
                        }}
                        className="flex-[1.5] px-6 py-3.5 bg-brand-yellow hover:bg-yellow-400 text-black rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-brand-yellow/20 flex items-center justify-center gap-2"
                      >
                        <Smartphone className="w-4 h-4" />
                        {t.sendViaWhatsApp}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
                {t.giftCardList}
                <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono text-zinc-500">{giftCards.length}</span>
              </h2>
            </div>

            {giftCards.length === 0 ? (
              <div className="bg-[#111] border border-dashed border-white/10 rounded-3xl p-16 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-8 h-8 text-zinc-700" />
                </div>
                <p className="text-zinc-500 text-sm font-medium">{lang === 'en' ? 'No gift cards created yet' : 'لا توجد بطاقات هدايا مضافة بعد'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {giftCards.map((card: any) => (
                  <div 
                    key={card.id} 
                    className="bg-[#111] p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-brand-yellow/30 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-yellow/0 group-hover:bg-brand-yellow transition-all" />
                    
                    <div className="flex flex-col items-start gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.isRedeemed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-yellow/10 text-brand-yellow'}`}>
                          <Tag className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white leading-none mb-1">{card.senderName}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500">{t.recipientMobile}:</span>
                            <span className="text-[10px] font-mono text-zinc-400">{card.recipientMobile}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-[10px] font-bold text-brand-yellow font-mono tracking-widest uppercase">{card.code}</span>
                        </div>
                        <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {services.find((s: any) => s.id === parseInt(card.serviceId))?.name}
                          </span>
                        </div>
                        <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{card.price} SAR</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end gap-2 mr-2">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${card.isRedeemed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {card.isRedeemed ? t.redeemed : t.notRedeemed}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        {!card.isRedeemed && (
                          <button 
                            onClick={() => {
                              setGiftCards(giftCards.map(c => c.id === card.id ? {...c, isRedeemed: true} : c));
                              setNotification({ message: lang === 'en' ? 'Gift card redeemed' : 'تم استخدام بطاقة الهدية', type: 'success' });
                            }}
                            className="w-11 h-11 flex items-center justify-center bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all duration-300"
                            title={t.redeemed}
                          >
                            <ShieldCheck className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleSendWhatsApp(card)}
                          className="w-11 h-11 flex items-center justify-center bg-white/5 hover:bg-emerald-600 text-zinc-400 hover:text-white rounded-xl transition-all duration-300 border border-white/5"
                          title={t.sendViaWhatsApp}
                        >
                          <Smartphone className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setGiftCards(giftCards.filter((item: any) => item.id !== card.id))}
                          className="w-11 h-11 flex items-center justify-center bg-white/5 hover:bg-red-500 text-zinc-400 hover:text-white rounded-xl transition-all duration-300 border border-white/5"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

export default TicketSystem;
