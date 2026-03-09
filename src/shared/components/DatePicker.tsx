import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  minDate?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange, 
  label, 
  placeholder, 
  className = '',
  minDate
}) => {
  const { lang, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(value || new Date()));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const days = [];

    // Empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isSelected = value === dateStr;
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isPast = minDate && dateStr < minDate;

      days.push(
        <button
          key={i}
          disabled={isPast}
          onClick={() => handleDateSelect(i)}
          className={`h-10 w-full rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
            isSelected 
              ? 'bg-brand-yellow text-zinc-950' 
              : isToday 
                ? 'bg-brand-yellow/10 text-brand-yellow' 
                : isPast 
                  ? 'text-zinc-700 cursor-not-allowed' 
                  : 'text-zinc-400 hover:bg-white/5'
          }`}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  const monthNames = lang === 'en' 
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  const dayNames = lang === 'en'
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <label className="block text-[10px] font-medium text-zinc-400 mb-1 uppercase tracking-widest">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-left flex items-center justify-between hover:border-brand-yellow/30 transition-all group"
      >
        <span className={value ? 'text-white' : 'text-zinc-600'}>
          {value || placeholder || (lang === 'en' ? 'Select Date' : 'اختر التاريخ')}
        </span>
        <CalendarIcon className="w-4 h-4 text-zinc-500 group-hover:text-brand-yellow transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] mt-2 w-72 bg-[#111111] border border-white/10 rounded-[2rem] shadow-2xl p-4 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-all">
                <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
              <h4 className="text-sm font-bold text-white">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h4>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-all">
                <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-[10px] font-bold text-zinc-600 uppercase">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  placeholder,
  className = ''
}) => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const times = [];
  for (let h = 8; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && <label className="block text-[10px] font-medium text-zinc-400 mb-1 uppercase tracking-widest">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-3 text-sm text-left flex items-center justify-between hover:border-brand-yellow/30 transition-all group"
      >
        <span className={value ? 'text-white' : 'text-zinc-600'}>
          {value || placeholder || (lang === 'en' ? 'Select Time' : 'اختر الوقت')}
        </span>
        <Clock className="w-4 h-4 text-zinc-500 group-hover:text-brand-yellow transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] mt-2 w-full max-h-60 overflow-y-auto bg-[#111111] border border-white/10 rounded-[2rem] shadow-2xl p-4 backdrop-blur-xl custom-scrollbar"
          >
            <div className="grid grid-cols-3 gap-2">
              {times.map(time => (
                <button
                  key={time}
                  onClick={() => {
                    onChange(time);
                    setIsOpen(false);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    value === time 
                      ? 'bg-brand-yellow text-zinc-950' 
                      : 'text-zinc-400 hover:bg-white/5'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
