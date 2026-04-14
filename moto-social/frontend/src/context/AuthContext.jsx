import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('moto_social_token');
    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch('/auth/me')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('moto_social_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.profile_type === 'admin' || user?.profileType === 'admin',
      async login(email, password) {
        const payload = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem('moto_social_token', payload.token);
        setUser(payload.user);
      },
      async register(data) {
        await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
      logout() {
        localStorage.removeItem('moto_social_token');
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
