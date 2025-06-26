interface KaokaoResponse {
  /** 장소 ID */
  id: string;
  /** 장소명, 업체명 */
  place_name: string;
  /** 카테고리 이름 (예: "음식점 > 카페 > 커피전문점 > 스타벅스") */
  category_name: string;
  /** 중요 카테고리만 그룹핑한 카테고리 그룹 코드 (예: "CE7") */
  category_group_code: string;
  /** 중요 카테고리만 그룹핑한 카테고리 그룹명 (예: "카페") */
  category_group_name: string;
  /** 전화번호 */
  phone: string;
  /** 전체 지번 주소 */
  address_name: string;
  /** 전체 도로명 주소 */
  road_address_name: string;
  /** X 좌표값, 경위도인 경우 longitude (경도) */
  x: string;
  /** Y 좌표값, 경위도인 경우 latitude (위도) */
  y: string;
  /** 장소 상세페이지 URL */
  place_url: string;
  /** 중심좌표까지의 거리 (단위: meter) - x,y 파라미터를 준 경우에만 존재 */
  distance: string;
}

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
  documents: KaokaoResponse[];
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

export interface TasteMap { 
  tasteMapId: number;
  tasteMapUserId: number;
  tasteMapUserNickname: string;
  tasteMapTitle: string;
  placeList: TastePlace[];
}

export interface TastePlace {
  tasteMapPlaceId: number,
  jjim: true;
  placeId: string;
  placeName: string;
  placeCategoryName: string;
  placeMapx: number;
  placeMapy: number;
  priceRange: number;
  distance: number;
}