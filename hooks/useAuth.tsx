import { useRouter } from 'expo-router';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';
import { registerUser, loginUser, getUserProfile, User } from '@/api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  register: (email: string, password: string, name: string, dni: string, phone: string, birthDate: string, gender: string) => void,
  login: (email: string, password: string) => void;
  logout: () => void;
  deleteAccount: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const register = async (
    email: string,
    password: string,
    name: string,
    dni: string,
    phone: string,
    birthDate: string,
    gender: string
  ) => {
    try {
      const token = await registerUser(name, dni, email, password, phone, birthDate, gender);
      setToken(token);
      console.log("TOKEN: ", token);
      const profile = await getUserProfile(token);
      setUser(profile);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error en el registre', err);
      Alert.alert('Error', (err as Error).message);
    }
  };


  const login = async (email: string, password: string) => {
    try {
      const token = await loginUser(email, password);
      setToken(token);
      console.log("TOKEN: ", token);
      const profile = await getUserProfile(token);
      setUser(profile);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Login failed', err);
      Alert.alert('Error', 'Credencials incorrectes');
    } 
  };

  const logout = () => {
    setUser(null);
    router.replace('/(auth)/login');
  };

  const deleteAccount = () =>{
    Alert.alert(
      "Si us plau, confirma el procés",            // Títol
      "Segur que vols esborar el teu compte? Aquesta acció és permanent i no es pot desfer. Totes les teves dades s'esborraran i perdràs accès al teu compte.", // Missatge
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
    <AuthContext.Provider value={{ user, token, register, login, logout, deleteAccount }}>
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
