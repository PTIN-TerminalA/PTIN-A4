import { Service } from "../mocks/mockTypes";
import { Tag } from "../mocks/mockTypes";

export const tags: Tag[] = [
  { name: "Tots"},
  { name: "Cafeteria" },
  { name: "Cosmètica" },
  { name: "Dolços" },
  { name: "Esport" },
  { name: "Farmàcia" },
  { name: "Menjar ràpid" },
  { name: "Mobilitat" },
  { name: "Moda" },
  { name: "Oci" },
  { name: "Servei" }
];


export const services: Service[] = [
  {
    id: 1,
    name: "McDonald's",
    description: "Servei de menjar ràpid",
    link: "https://mcdonalds.com",
    ad_path: require("@/assets/images/mcdo.jpeg"),
    x: 775,
    y: 250,
    tags: [{ name: "Menjar" }, { name: "Ràpid" }],
    valorations: [{ value: 4, description: "Servei ràpid i bon menjar" }],
    price: { avg_price: 8 },
    schedules: [
      { day: "Dilluns", opening_hour: "07:00", closing_hour: "23:00" },
      { day: "Dimarts", opening_hour: "07:00", closing_hour: "23:00" },
      { day: "Dimecres", opening_hour: "07:00", closing_hour: "23:00" },
      { day: "Dijous", opening_hour: "07:00", closing_hour: "23:30" },
      { day: "Divendres", opening_hour: "07:00", closing_hour: "00:00" },
      { day: "Dissabte", opening_hour: "08:00", closing_hour: "00:00" },
      { day: "Diumenge", opening_hour: "08:00", closing_hour: "23:00" }
    ],
    status: "open",
    offer: "20% descompte"
  },
  {
    id: 2,
    name: "Sala d'actes",
    description: "Espai per a presentacions i conferències",
    ad_path: require("@/assets/images/salaactes.jpg"),
    x: 630,
    y: 325,
    tags: [{ name: "Actes" }],
    valorations: [],
    price: null,
    schedules: [
      { day: "Dilluns", opening_hour: "08:00", closing_hour: "20:00" },
      { day: "Dimarts", opening_hour: "08:00", closing_hour: "20:00" },
      { day: "Dimecres", opening_hour: "08:00", closing_hour: "20:00" },
      { day: "Dijous", opening_hour: "08:00", closing_hour: "21:00" },
      { day: "Divendres", opening_hour: "09:00", closing_hour: "18:00" },
      { day: "Dissabte", opening_hour: "09:00", closing_hour: "20:00" },
      { day: "Diumenge", opening_hour: "Tancat", closing_hour: "Tancat"}
    ],
    status: "open",
    offer: "20% descompte"
  },
  {
    id: 3,
    name: "Zara",
    description: "Botiga de roba",
    link: "https://zara.com",
    ad_path: require("@/assets/images/zara.jpg"),
    x: 715,
    y: 580,
    tags: [{ name: "Roba" }],
    valorations: [],
    price: null,
    schedules: [
      { day: "Dilluns", opening_hour: "10:00", closing_hour: "21:00" },
      { day: "Dimarts", opening_hour: "10:00", closing_hour: "21:00" },
      { day: "Dimecres", opening_hour: "10:00", closing_hour: "21:00" },
      { day: "Dijous", opening_hour: "10:00", closing_hour: "22:00" },
      { day: "Divendres", opening_hour: "10:00", closing_hour: "22:00" },
      { day: "Dissabte", opening_hour: "10:00", closing_hour: "22:00" },
      { day: "Diumenge", opening_hour: "11:00", closing_hour: "20:00" }
    ],
    status: "open",
    offer: "20% descompte"
  },
  {
    id: 4,
    name: "Starbucks",
    description: "Cafeteria",
    link: "https://starbucks.com",
    ad_path: require("@/assets/images/starbucks.jpg"),
    x: 400,
    y: 60,
    tags: [{ name: "Begudes" }, { name: "Relax" }],
    valorations: [{ value: 5, description: "Lloc tranquil per estudiar" }],
    price: { avg_price: 5 },
    schedules: [
      { day: "Dilluns", opening_hour: "06:30", closing_hour: "22:00" },
      { day: "Dimarts", opening_hour: "06:30", closing_hour: "22:00" },
      { day: "Dimecres", opening_hour: "06:30", closing_hour: "22:00" },
      { day: "Dijous", opening_hour: "06:30", closing_hour: "22:30" },
      { day: "Divendres", opening_hour: "06:30", closing_hour: "23:00" },
      { day: "Dissabte", opening_hour: "07:00", closing_hour: "23:00" },
      { day: "Diumenge", opening_hour: "07:00", closing_hour: "22:00" }
    ],
    status: "open",
    offer: "20% descompte"
  },
  {
    id: 5,
    name: "Punt d'informació",
    description: "Servei d'informació al campus",
    ad_path: require("@/assets/images/infopoint.jpg"),
    x: 35,
    y: 260,
    tags: [{ name: "Estudi" }],
    valorations: [],
    price: null,
    schedules: [
      { day: "Dilluns", opening_hour: "08:00", closing_hour: "22:00" },
      { day: "Dimarts", opening_hour: "08:00", closing_hour: "22:00" },
      { day: "Dimecres", opening_hour: "08:00", closing_hour: "22:00" },
      { day: "Dijous", opening_hour: "08:00", closing_hour: "22:00" },
      { day: "Divendres", opening_hour: "08:00", closing_hour: "22:00" },
      { day: "Dissabte", opening_hour: "09:00", closing_hour: "14:00" },
      { day: "Diumenge", opening_hour: "Tancat", closing_hour: "Tancat"}
    ],
    status: "open",
    offer: "20% descompte"
  },
];
