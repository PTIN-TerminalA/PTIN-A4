// api/services.ts
import { API_URL } from "./Api";
import {
  Service,
  Tag,
  Valoration,
  Schedule,
  RawService,
} from "@/constants/mocks/mockTypes";

const fetchJson = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options);
  //if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return res.json();
};

export async function getServices(): Promise<Service[]> {
  const rawServices = await fetchJson<RawService[]>("https://flysy.software/api/getServices");

  const fullServices = await Promise.all(
    rawServices.map(async (service) => {
      const serviceId = service.id;

      const [schedules, tagsRaw, valorations] = await Promise.all([
        fetchJson<Schedule[]>(
          "https://flysy.software/api/getSchedules?service_id=${serviceId}",
          { method: "POST" }
        ),
        fetchJson<any>("https://flysy.software/api/getServiceTag?service_id=${serviceId}", {
          method: "POST",
        }),
        fetchJson<Valoration[]>(
          "https://flysy.software/api/getValoration?service_id=${serviceId}",
          { method: "POST" }
        ),
      ]);

      let tags: Tag[] = [];

      if (Array.isArray(tagsRaw)) {
        tags = tagsRaw
          .filter(Boolean)
          .map((tag) => ({ name: tag?.tag_name ?? tag?.name ?? "" }))
          .filter((tag) => tag.name);
      } else if (tagsRaw && typeof tagsRaw === "object") {
        const name = tagsRaw.tag_name ?? tagsRaw.name;
        if (name) tags = [{ name }];
      }

      return {
        ...service,
        location_x: parseFloat(service.location_x),
        location_y: parseFloat(service.location_y),
        tags,
        valorations,
        schedules,
      };
    })
  );

  // console.log("FULL SERVICE:", JSON.stringify(fullServices, null, 2));
  return fullServices;
}

export async function getTags(): Promise<Tag[]> {
  return fetchJson<Tag[]>("https://flysy.software/api/getTags");
}
