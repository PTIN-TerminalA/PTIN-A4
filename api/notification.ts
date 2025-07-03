const RECOMMENDATION_API_URL = 'http://10.60.0.3:4443';

export interface RecommendationRequest {
  x: number;
  y: number;
  id: number;
}

export interface RecommendationResponse {
  recommendation: string | null;
}

/**
 * Solicita una recomendación al servidor según la ubicación y el ID de usuario.
 * @param requestData Coordenadas y ID de usuario.
 * @returns Texto de la recomendación o null si no hay disponible.
 */
export async function getRecommendation(
  requestData: RecommendationRequest
): Promise<RecommendationResponse> {
  try {
    // console.log("Calling getRecommendation with:", requestData);
    const response = await fetch(`${RECOMMENDATION_API_URL}/recommendation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      //throw new Error(`Error en la petició de recomanació (${response.status})`);
    }

    const data = await response.json();
    console.log("S'ha agafat bé la recomanació");
    return {
      recommendation: data.recommendation ?? null,
    };
  } catch (error) {
    // console.error('Error obtenint recomanació:', error);
    return { recommendation: null };
  }
}
