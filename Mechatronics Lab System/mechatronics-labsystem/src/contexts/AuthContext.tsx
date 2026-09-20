import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/client';

export type UserRole = 'admin' | 'staff' | 'student';

export interface User {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  matricNumber?: string;
  level?: string;
  department?: string;
  gmailAddress?: string;
  universityEmail?: string;
}

export interface RegisterPayload {
  fullName: string;
  matricNumber: string;
  level: string;
  department: string;
  email: string;
  gmailAddress: string;
  universityEmail: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeUser(payload: { user: User } | User): User {
  return 'user' in payload ? payload.user : payload;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const response = await api.getCurrentUser();
        if (active) setUser(normalizeUser(response));
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string, role?: UserRole) => {
    try {
      const response = await api.login({ email, password, role });
      setUser(response.user);
      return true;
    } catch {
      setUser(null);
      return false;
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const response = await api.register(payload);
      if (response.user) setUser(response.user);
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to create account.',
      };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Clear the client session even when the API is unavailable.
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
