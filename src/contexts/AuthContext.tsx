import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Permission } from '../shared/types/common.types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
}

const ALL_PERMISSIONS: Permission[] = [
  'DASHBOARD_ACCESS',
  'SUBSCRIPTION_PLAN_MANAGEMENT',
  'OFFER_MANAGEMENT',
  'BRANCH_MANAGEMENT',
  'GIFT_CARD_MANAGEMENT',
  'PURCHASES_MANAGEMENT',
  'PRICE_LIST_MANAGEMENT',
  'APPROVAL',
  'SALES'
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('360cars_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('360cars_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('360cars_user');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN' || user.role === 'BUSINESS_OWNER') return true;
    return user.permissions?.includes(permission) || false;
  };

  // For demo purposes, if a user is set as BUSINESS_OWNER, give them all permissions
  useEffect(() => {
    if (user?.role === 'BUSINESS_OWNER' && (!user.permissions || user.permissions.length === 0)) {
      setUser({ ...user, permissions: ALL_PERMISSIONS });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isAuthenticated: !!user, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
