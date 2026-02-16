import React, { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';

interface AdminAuthContextType {
  isAdmin: boolean;
  user: User | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{
  children: React.ReactNode;
  value: AdminAuthContextType;
}> = ({ children, value }) => (
  <AdminAuthContext.Provider value={value}>
    {children}
  </AdminAuthContext.Provider>
);

export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuthContext must be used within AdminAuthProvider');
  }
  return context;
};
