import { useState } from "react";
import { Service } from "@/constants/mocks/mockTypes";
import { API_URL } from "@/constants/Api";
import { request } from "react-native-permissions";
import { useAuth } from "./useAuth";



export async function makeValoration (service_id: number, rating: number, comment: string) { //service_id: number, rating: number, comment: string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuth;
  setLoading(true);
  setError(null);
  try {
    /*
    const formData = new FormData();
    formData.append('service_id', service_id);
    formData.append('rating', rating);
    formData.append('comment', comment);
    */
    const res = await fetch(`${API_URL}/api/rate-service`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      //body: formData
      
      body: JSON.stringify({ // la API del A3 accepta arrays no Points
        service_id : service_id,
        rating: rating,
        comment: comment
      }),
      
    });
    if (!res.ok) throw new Error("Error enviant la valoració");
    setLoading(false);
    
  } catch (error: any) {
    setError(error.message);
    setLoading(false);
  }
};


/*
const _uri = "http://localhost:8000";
  const handleEnviarValoracion = async (idx, reserva) => {
  
  const { rating, comment } = valoracions[idx] || {};
  if (!rating || !comment) {
      alert("Por favor, introduce una valoración y un comentario.");
      return;
  }
      */

/*
 try {
      const res = await fetch(`${API_URL}/api/route-rate`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
          scheduled_time: reserva.scheduled_time,
          rating: parseInt(rating),
          comment
      })
      });
      if (res.ok) {
        alert("Valoración añadida correctamente");
      } else {
        const err = await res.json();
        alert("Error al enviar valoración: " + (err.detail || res.statusText));
      }
  } catch (error: any) {
      alert("Error en el servidor: " + error.message);
  }
      */