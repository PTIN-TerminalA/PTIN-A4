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

export type RawService = {
  id: number;
  name: string;
  description: string;
  link?: string;
  ad_path?: string;
  avg_price?: number;
  location_x: string;
  location_y: string;
  status?: string;
  offer?: string;
};

export type Location = {
  x: number;
  y: number;
};

export type Service = {
  id: number;
  name: string;
  description: string;
  link?: string;
  ad_path?: string;
  avg_price?: number;
  location_x: number;
  location_y: number;
  status?: string;
  offer?: string;
  schedules?: Schedule[];
  valorations?: Valoration[];
  tags?: Tag[];
};