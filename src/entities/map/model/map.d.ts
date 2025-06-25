export interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  place_url: string;
  distance: number;
  lat: number;
  lng: number;
  mapx: number; // 경도
  mapy: number; // 위도
}

export interface KakaoSearchResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: KakaoPlace[];
}
export interface SearchResponse {
  places: KakaoPlace[];
  total: number;
  originalTotal: number;
}

export interface SearchOptions {
  query: string;
  lat?: number;
  lng?: number;
  size?: number;
}
