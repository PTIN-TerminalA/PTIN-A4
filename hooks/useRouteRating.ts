import { sendRouteRating } from "@/api/route";
import { useState } from "react";

export function useRouteRating() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rateRoute = async (
    scheduled_time: string,
    rating: number,
    review: string,
    token: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError("No s'ha pogut obtenir el token d'autenticació");
      setLoading(false);
      return;
    }

    try {
      await sendRouteRating(scheduled_time, rating, review, token);
    } catch (err: any) {
      setError(err.message || "Error al enviar la valoració");
    } finally {
      setLoading(false);
    }
  };

  return { rateRoute, loading, error };
}