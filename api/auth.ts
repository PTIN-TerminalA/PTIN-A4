import { API_URL } from './Api';

export interface User {
  name: string;
  email: string;
  dni?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  avatar: string;
}

export async function registerUser(
  name: string,
  dni: string,
  email: string,
  password: string,
  phone: string,
  birthDate: string,
  gender: string
): Promise<string> {
  // Primer pas: registrar usuari base (taula user) i obtenir token
  const userResponse = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      dni,
      email,
      password,
      usertype: 1, // Regular user
    }),
  });

  const userData = await userResponse.json();
  if (!userResponse.ok) {
    throw new Error(userData.detail || 'Error al registrar l\'usuari');
  }

  const token = userData.access_token;

  // Segon pas: registrar info addicional de l'usuari (taula regular)
  const regularResponse = await fetch(`${API_URL}/api/register-regular`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      phone_num: phone,
      birth_date: birthDate,
      identity: gender,
    }),
  });

  const regularData = await regularResponse.json();
  if (!regularResponse.ok) {
    throw new Error(regularData.detail || 'Error al registrar el regular');
  }

  return token;
}

export async function loginUser(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Error al iniciar sesión');
  }

  return data.access_token;
}

export async function getUserProfile(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtenir el perfil.');
  }

  const profile = await response.json();

  return {
    name: profile.name,
    email: profile.email,
    dni: profile.dni,
    phone: profile.phone_num,
    birthDate: profile.birth_date,
    gender: profile.identity,
    avatar:
      'https://www.lavanguardia.com/peliculas-series/images/all/movie/posters/2009/12/movie-19995/w1280/yev8cuskZiDfzOPzVjSKPnvBnfk.jpg',
  };
}