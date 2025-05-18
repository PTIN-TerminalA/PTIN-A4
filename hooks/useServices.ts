import { useState, useEffect } from "react";
import { Service } from "@/constants/mocks/mockTypes";
import { getServices } from "@/api/services";


export const useServices = () => {
  const [services, setServices] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulem crida amb un timeout per semblar que ve d'una API
    const fetchServices = async () => {
      try {
        const fetchedServices = await getServices(); // no te timeout simplement espera
        setServices(fetchedServices);
      } catch (err) {
        console.error(err);
        setError("Error carregant els serveis");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    
  }, []);

  return {
    services,
    loading,
    error,
  };
};


/*

    const timeout = setTimeout(() => {
      try {
        setServices(services);
        setLoading(false);
      } catch (err) {
        setError("Error carregant els serveis");
        setLoading(false);
      }
    }, 500); // mig segon de delay


    
    return () => clearTimeout(timeout);
*/