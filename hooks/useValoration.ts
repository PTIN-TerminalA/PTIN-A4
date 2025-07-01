

export async function makeValoration (service_id: number, rating: number, comment: string, token: string | null) { //service_id: number, rating: number, comment: string
  try {
    const formData = new URLSearchParams();;
    formData.append('service_id', service_id.toString());
    formData.append('rating', rating.toString());
    formData.append('comment', comment);
    
    const res = await fetch(`https://flysy.software/api/rate-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`,
      },
      body: formData.toString()
      
    });
    const data = await res.json();
    if (!res.ok) 
      if (res.status === 409) {
        throw new Error(data.detail);
      }
      else{
        throw new Error(data.detail || "Error enviant la valoració o Error de login");
      }
    else {console.log("ok")}
  } catch (error: any) {
    console.error('Login failed', error);
    throw error
  }
};

