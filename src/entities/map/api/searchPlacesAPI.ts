import { KaokaoResponse, SearchOptions } from "@/entities/map/model";

const searchPlacesAPI = async (options: SearchOptions): Promise<KaokaoResponse[]> => {
  const { query, lat, lng, size = 15 } = options;

  if (!query.trim()) return [];

  console.log(`카카오 검색 API 사용: ${options.query} ${options.lat} ${options.lng} ${options.size}`);

  try {
    const params = new URLSearchParams({
      query: query,
      display: size.toString(),
      ...(lat && lng && {
        lat: lat.toString(),
        lng: lng.toString()
      })
    });

    const response = await fetch(`/api/map/search?${params}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류' }));
      throw new Error(errorData.message || `HTTP ${response.status}: 검색 요청 실패`);
    }

    const data = await response.json();
    
    console.log(`카카오 Place API 응답:`, data);

    return data.places.documents || [];

  } catch (error) {
    console.error('검색 API 오류:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('장소 검색 중 오류가 발생했습니다');
  }

}

export default searchPlacesAPI;