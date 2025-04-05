import { router } from 'expo-router';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  avatar: string;
}

export function login() {
  router.replace("/(auth)/login");
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulación de usuario autenticado
    setTimeout(() => {
      setUser({
        name: "Usuari",
        email: "usuari@gmail.com",
        avatar: "https://www.lavanguardia.com/peliculas-series/images/all/movie/posters/2009/12/movie-19995/w1280/yev8cuskZiDfzOPzVjSKPnvBnfk.jpg",
      });
    }, 1000);
  }, []);

  const logout = () => {
    setUser(null);
    console.log("Usuario cerró sesión");
    login();
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}