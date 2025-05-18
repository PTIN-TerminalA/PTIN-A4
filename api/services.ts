import { API_URL } from "./Api";
import { Service } from "@/constants/mocks/mockTypes";
import { Tag } from "@/constants/mocks/mockTypes";


export async function getServices(){
  const servicesRes = await fetch(`${API_URL}/api/getServices`);
  const services = await servicesRes.json(); // <- services: Service[]

  // Paso 2: Para cada servicio, obtener datos adicionales
  const fullServices = await Promise.all(
    services.map(async (service: Service) => {
      const [priceRes, schedulesRes, tagsRes, valorationRes] = await Promise.all([
        fetch(`${API_URL}/api/getPrice`),////
        fetch(`${API_URL}/api/getSchedules/${service.id}`),
        fetch(`${API_URL}/api/getServiceTag/${service.id}`),
        fetch(`${API_URL}/api/getValoration/${service.id}`)
      ]);

      const [price, schedules, tags, valorations] = await Promise.all([
        priceRes.json(),///
        schedulesRes.json(),
        tagsRes.json(),
        valorationRes.json()
      ]);

      return {
        id: service.id,
        name: service.name,
        description: service.description,
        link: service.link,
        ad_path: service.ad_path,
        x: service.x,
        y: service.y,
        tags: tags,
        valorations: valorations,
        price: service.price,                   ///
        schedules: schedules,
        status: service.status,
        offer: service.offer,
      };
    })
  );

  return fullServices;
}


export async function getTags(): Promise<Tag[]> {
  const response = await fetch(`${API_URL}/api/getTags`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Error al obtenir els serveis.');
  }

  const tags = await response.json();
  return tags;
}
