import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Role } from '../types/common.types';

export const useAuthActions = () => {
  const { setUser } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const phone = (formData.get('phone') as string)?.trim();
    const password = formData.get('password');
    const role = formData.get('role');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, role, lang })
      });
      const data = await res.json();
      if (data.user) {
        setNotification({ message: t.loginSuccess, type: 'success' });
        setTimeout(() => {
          setUser(data.user);
          const redirectShopId = localStorage.getItem('redirectShopId');
          if (redirectShopId) {
            localStorage.removeItem('redirectShopId');
            navigate(`/shop/${redirectShopId}`);
          } else {
            navigate('/dashboard');
          }
        }, 1000);
      } else {
        setNotification({ message: data.error || (lang === 'en' ? "Login failed" : "فشل تسجيل الدخول"), type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setNotification({ message: lang === 'en' ? "Network error" : "خطأ في الشبكة", type: 'error' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const phone = (formData.get('phone') as string)?.trim();
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const role = formData.get('role') as string;
    const carBrand = formData.get('carBrand') as string;
    const carCategory = formData.get('carCategory') as string;
    const carModel = formData.get('carModel') as string;
    const email = formData.get('email') as string || '';
    const dob = formData.get('dob') as string || '';
    const centerName = formData.get('centerName') as string;
    const taxNumber = formData.get('taxNumber') as string;
    const taxCertificate = (formData.get('taxCertificate') as File)?.name || '';
    const commercialRegistration = formData.get('commercialRegistration') as string;
    const commercialCertificate = (formData.get('commercialCertificate') as File)?.name || '';
    const address = formData.get('address') as string;
    const terms = formData.get('terms');

    if (!name || !phone || !password) {
      setNotification({ message: t.incompleteData, type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setNotification({ message: lang === 'en' ? "Passwords do not match" : "كلمتا المرور غير متطابقتين", type: 'error' });
      return;
    }

    if (role === 'BUSINESS_OWNER' && (!centerName || !taxNumber || !commercialRegistration || !address)) {
      setNotification({ message: t.incompleteData, type: 'error' });
      return;
    }

    if (role === 'CUSTOMER' && (!carBrand || !carCategory || !carModel)) {
      setNotification({ message: t.incompleteData, type: 'error' });
      return;
    }

    if (!terms) {
      setNotification({ message: t.termsRequired, type: 'error' });
      return;
    }

    const carBrandModel = role === 'CUSTOMER' ? `${carBrand} ${carCategory}` : '';
    const carYear = role === 'CUSTOMER' ? carModel : '';

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          password,
          role,
          lang,
          carType: carBrandModel,
          carYear,
          email,
          dob,
          centerName,
          taxNumber,
          taxCertificate,
          commercialRegistration,
          commercialCertificate,
          address
        })
      });
      const data = await res.json();
      if (data.user) {
        setNotification({ message: t.registerSuccess, type: 'success' });
        setTimeout(() => {
          setUser(data.user);
          const redirectShopId = localStorage.getItem('redirectShopId');
          if (redirectShopId) {
            localStorage.removeItem('redirectShopId');
            navigate(`/shop/${redirectShopId}`);
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      } else {
        setNotification({ message: data.error, type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setNotification({ message: lang === 'en' ? "Network error" : "خطأ في الشبكة", type: 'error' });
    }
  };

  return { handleLogin, handleRegister, notification, setNotification };
};
