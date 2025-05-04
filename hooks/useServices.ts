import { useState, useEffect } from "react";
import { Service } from "@/constants/mocks/mockTypes";
import { services as mockServices } from "@/constants/mocks/services";

export const useServices = () => {
  const [services, setServices] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulem crida amb un timeout per semblar que ve d'una API
    const timeout = setTimeout(() => {
      try {
        setServices(mockServices);
        setLoading(false);
      } catch (err) {
        setError("Error carregant els serveis");
        setLoading(false);
      }
    }, 500); // mig segon de delay

    return () => clearTimeout(timeout);
  }, []);

  return {
    services,
    loading,
    error,
  };
};
