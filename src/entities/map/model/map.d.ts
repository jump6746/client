export interface Restaurant {
  id: string;
  title: string;
  address: string;
  category: string;
  telephone?: string;
  lat?: number;
  lng?: number;
  distance?: number; // 미터 단위 거리 (카카오 API 지원)
  mapx?: string;
  mapy?: string;
  link?: string;
}

export interface SearchResponse {
  restaurants: Restaurant[];
  total: number;
  originalTotal: number;
}