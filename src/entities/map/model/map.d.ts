export interface Restaurant {
  id: string;
  title: string;
  address: string;
  category: string;
  telephone: string;
  lat: number;
  lng: number;
  link: string;
}

export interface SearchResponse {
  restaurants: Restaurant[];
  total: number;
  originalTotal: number;
}