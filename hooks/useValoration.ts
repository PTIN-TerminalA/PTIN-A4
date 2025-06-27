import { useState } from "react";
import { Service } from "@/constants/mocks/mockTypes";
import { API_URL } from "@/constants/Api";
import { request } from "react-native-permissions";
import { useAuth } from "./useAuth";



export async function makeValoration (service_id: number, rating: number, comment: string, token: string | null) { //service_id: number, rating: number, comment: string
  try {
    const formData = new URLSearchParams();;
    formData.append('service_id', service_id.toString());
    formData.append('rating', rating.toString());
    formData.append('comment', comment);
    
    const res = await fetch(`${API_URL}/api/rate-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`,
      },
      body: formData.toString()
      
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error enviant la valoració o Error de login");
    else {console.log("ok")}
  } catch (error: any) {
    console.error('Login failed', error);
    throw error
  }
};

