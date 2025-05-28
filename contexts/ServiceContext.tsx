import React, { createContext, useContext, useEffect, useState } from "react";
import { Service } from "@/constants/mocks/mockTypes";
import { getServices } from "@/api/services";

type ServiceContextType = {
  services: Service[] | null;
  loading: boolean;
  error: string | null;
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching services");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ServiceContext.Provider value={{ services, loading, error }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServiceContext must be used within a ServiceProvider");
  }
  return context;
};

