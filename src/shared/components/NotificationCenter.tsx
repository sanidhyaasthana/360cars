import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCircle2, Clock, Calendar, Car, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: number;
  created_at: string;
}

interface NotificationCenterProps {
  lang: string;
  isRtl: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ lang, isRtl }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`);
      const data = await res.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (id: number) => {
    if (!user) return;
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id, userId: user.id })
      });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_CONFIRMED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'BOOKING_REMINDER': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'NEW_BOOKING': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'WASH_STATUS_UPDATE': return <Car className="w-4 h-4 text-brand-yellow" />;
      default: return <Info className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-400 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-zinc-950">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} mt-2 w-80 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-[101] overflow-hidden`}
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-950/50">
                <h3 className="text-sm font-bold text-white">
                  {lang === 'en' ? 'Notifications' : 'التنبيهات'}
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative ${!n.is_read ? 'bg-brand-yellow/5' : ''}`}
                    >
                      {!n.is_read && (
                        <div className="absolute top-4 right-4 w-2 h-2 bg-brand-yellow rounded-full" />
                      )}
                      <div className="flex gap-3">
                        <div className="mt-1">{getIcon(n.type)}</div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-white mb-0.5">{n.title}</p>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">{n.message}</p>
                          <p className="text-[9px] text-zinc-600 mt-2">
                            {new Date(n.created_at).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Bell className="w-8 h-8 text-zinc-800 mx-auto mb-3" />
                    <p className="text-xs text-zinc-500">
                      {lang === 'en' ? 'No notifications yet' : 'لا توجد تنبيهات بعد'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
