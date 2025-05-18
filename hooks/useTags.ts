import { useState, useEffect } from "react";
import { Tag } from "@/constants/mocks/mockTypes";
import { getTags } from "@/api/services";


export const useTags = () => {
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulem crida amb un timeout per semblar que ve d'una API
    const fetchTags = async () => {
      try {
        const fetchedTags = await getTags(); // no te timeout simplement espera
        setTags(fetchedTags);
      } catch (err) {
        console.error(err);
        setError("Error carregant els serveis");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
    
  }, []);

  return {
    tags,
    loading,
    error,
  };
};


/*

    const timeout = setTimeout(() => {
      try {
        setTags(Tags);
        setLoading(false);
      } catch (err) {
        setError("Error carregant els serveis");
        setLoading(false);
      }
    }, 500); // mig segon de delay


    
    return () => clearTimeout(timeout);
*/