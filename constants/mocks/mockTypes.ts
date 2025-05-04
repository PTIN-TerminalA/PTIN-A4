export type Tag = {
  name: string;
};

export type Valoration = {
  value: number;
  description: string;
};

export type Ticket = {
  class: string;
};

export type Price = {
  avg_price: number;
};

export type Schedule = {
  day: string;
  opening_hour: string;
  closing_hour: string;
};

export type Service = {
  id: number;
  name: string;
  description: string;
  location: string;
  link: string;
  ad_path: string;
  x: number; // Coordenada X al mapa
  y: number; // Coordenada Y al mapa
  tags: Tag[];
  valorations: Valoration[];
  ticket: Ticket | null;
  price: Price | null;
  schedules: Schedule[];
};
