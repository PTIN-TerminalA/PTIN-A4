import { Service } from "../mocks/mockTypes";

export const services: Service[] = [
  {
    id: 1,
    name: "McDonald's",
    description: "Servei de menjar ràpid",
    location: "Zona central est",
    link: "https://mcdonalds.com",
    ad_path: require("@/assets/images/mcdo.jpeg"),
    x: 775,
    y: 250,
    tags: [{ name: "Menjar" }, { name: "Ràpid" }],
    valorations: [{ value: 4, description: "Servei ràpid i bon menjar" }],
    ticket: { class: "Restaurant" },
    price: { avg_price: 8 },
    schedules: [
      { day: "Dilluns", opening_hour: "10:00", closing_hour: "22:00" },
    ],
  },
  {
    id: 2,
    name: "Sala d'actes",
    description: "Espai per a presentacions i conferències",
    location: "Al costat de McDonald's",
    link: "https://exemple.com/sala",
    ad_path: require("@/assets/images/salaactes.jpg"),

    x: 630,
    y: 325,
    tags: [{ name: "Actes" }],
    valorations: [],
    ticket: null,
    price: null,
    schedules: [
      { day: "Dissabte", opening_hour: "09:00", closing_hour: "20:00" },
    ],
  },
  {
    id: 3,
    name: "Zara",
    description: "Botiga de roba",
    location: "Sud-est",
    link: "https://zara.com",
    ad_path: require("@/assets/images/zara.jpg"),

    x: 715,
    y: 580,
    tags: [{ name: "Roba" }],
    valorations: [],
    ticket: null,
    price: null,
    schedules: [
      { day: "Dilluns", opening_hour: "10:00", closing_hour: "21:00" },
    ],
  },
  {
    id: 4,
    name: "Starbucks",
    description: "Cafeteria",
    location: "Nord-oest",
    link: "https://starbucks.com",
    ad_path: require("@/assets/images/starbucks.jpg"),

    x: 400,
    y: 60,
    tags: [{ name: "Begudes" }, { name: "Relax" }],
    valorations: [{ value: 5, description: "Lloc tranquil per estudiar" }],
    ticket: null,
    price: { avg_price: 5 },
    schedules: [
      { day: "Diumenge", opening_hour: "09:00", closing_hour: "20:00" },
    ],
  },
  {
    id: 5,
    name: "Punt d'informació",
    description: "Servei d'informació al campus",
    location: "Zona d'informació",
    link: "https://exemple.com/informacio",
    ad_path: require("@/assets/images/infopoint.jpg"),

    x: 35,
    y: 260,
    tags: [{ name: "Estudi" }],
    valorations: [],
    ticket: null,
    price: null,
    schedules: [
      { day: "Dilluns", opening_hour: "08:00", closing_hour: "22:00" },
    ],
  },
];
