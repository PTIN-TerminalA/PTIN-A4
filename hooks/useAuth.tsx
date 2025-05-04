import { useRouter } from 'expo-router';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';
import { API_URL } from "@/constants/Api";

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
  login: (token: string) => void;
  logout: () => void;
  deleteAccount: () => void;
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

  const login = async (token: string) => {
    const response = await fetch(`${API_URL}/api/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`,},
    });

    if (!response.ok) throw new Error("Error al obtener el perfil");
    const profile = await response.json();

    setUser({
      name: profile.name,
      email: profile.email,
      birthDate: profile.birth_date,
      phone: profile.phone_num,
      gender: profile.identity,
      avatar: 'https://www.lavanguardia.com/peliculas-series/images/all/movie/posters/2009/12/movie-19995/w1280/yev8cuskZiDfzOPzVjSKPnvBnfk.jpg',
    });

    router.replace('/(tabs)'); // change this to your actual screen
  };

  const logout = () => {
    setUser(null);
    router.replace('/(auth)/login');
  };

  const deleteAccount = () =>{
    Alert.alert(
      "Si us plau, confirma el procés",            // Título
      "Segur que vols esborar el teu compte? Aquesta acció és permanent i no es pot desfer. Totes les teves dades s'esborraran i perdràs accès al teu compte.", // Mensaje
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => {
            console.log("Compte eliminat"),
              /** API delete account */
              setUser(null);
              router.replace('/(auth)/login');
          },
          style: "destructive" // Rojo en iOS
        }
      ],
      { cancelable: true }
    );
  }; 

  return (
    <AuthContext.Provider value={{ user, register, login, logout, deleteAccount }}>
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
