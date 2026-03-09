import React, { useState, useEffect } from 'react';
import { Header } from '../../shared/components/Header';
import { Footer } from '../../shared/components/Footer';
import { LoginModal } from '../../shared/components/LoginModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface RootLayoutProps {
  children: React.ReactNode;
  audience?: 'INDIVIDUALS' | 'BUSINESSES';
  setAudience?: (audience: 'INDIVIDUALS' | 'BUSINESSES') => void;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children, audience, setAudience }) => {
  const { isRtl } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoginModalOpen(false);
    }
  }, [isAuthenticated]);

  return (
    <div className={`min-h-screen bg-[#0B0B0B] text-white selection:bg-brand-yellow selection:text-zinc-950 ${isRtl ? 'rtl' : 'ltr'}`}>
      <Header
        audience={audience}
        setAudience={setAudience}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="pt-20">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onOpenLogin: () => setIsLoginModalOpen(true),
              searchQuery,
            });
          }
          return child;
        })}
      </main>
      <Footer onOpenLogin={() => setIsLoginModalOpen(true)} />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        initialAudience={audience}
      />
    </div>
  );
};
