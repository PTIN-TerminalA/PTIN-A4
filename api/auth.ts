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
  const userResponse = await fetch("https://flysy.software/api/register", {
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
  const regularResponse = await fetch("https://flysy.software/api/register-regular", {
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
  const response = await fetch("https://flysy.software/api/login", {
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
  const response = await fetch("https://flysy.software/api/profile", {
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
      'https://cdn0.expertoanimal.com/es/posts/0/1/7/mi_gato_no_crece_causas_y_que_hacer_24710_600_square.jpg',
  };
}

export async function updateUserProfile(
  token: string,
  name: string,
  birthDate: string,
  phone: string,
  gender: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      birth_date: birthDate,
      phone_num: phone,
      identity: gender,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    //console.log(error);
    if (Array.isArray(error.detail)) {
      const messages = error.detail.map((e: any) => e.msg).join('\n');
      throw new Error(messages);
    }
    throw new Error(error.detail || 'Error al actualitzar perfil');
  }
}

export async function updateDni(token: string, dni: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/update-dni`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: token,
      dni,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al actualitzar el DNI');
  }
}
