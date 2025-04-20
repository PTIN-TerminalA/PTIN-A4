import { useRouter } from 'expo-router';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  dni?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  register: (email: string, name: string, dni: string, phone: string, birthDate: string, gender: string) => void,
  login: (email: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const register = (email: string, name: string, dni: string, phone: string, birthDate: string, gender: string) => {
    setUser({
      name,
      email,
      dni,
      phone,
      birthDate,
      gender,
      avatar: 'https://www.lavanguardia.com/peliculas-series/images/all/movie/posters/2009/12/movie-19995/w1280/yev8cuskZiDfzOPzVjSKPnvBnfk.jpg',
    });

    router.replace('/(tabs)'); // change this to your actual screen
  };

  const login = (email: string) => {
    setUser({
      name: email.split('@')[0],
      email,
      avatar: 'https://www.lavanguardia.com/peliculas-series/images/all/movie/posters/2009/12/movie-19995/w1280/yev8cuskZiDfzOPzVjSKPnvBnfk.jpg',
    });

    router.replace('/(tabs)'); // change this to your actual screen
  };

  const logout = () => {
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
