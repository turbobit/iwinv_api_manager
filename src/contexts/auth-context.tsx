'use client';

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext<{
  credentials: { accessKey: string; secretKey: string } | null;
  setCredentials: (creds: { accessKey: string; secretKey: string }) => void;
}>({
  credentials: null,
  setCredentials: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [credentials, setCredentials] = useState<{ accessKey: string; secretKey: string } | null>(null);
  
  return (
    <AuthContext.Provider value={{ credentials, setCredentials }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 