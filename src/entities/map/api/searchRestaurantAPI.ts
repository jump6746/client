import { Restaurant } from "@/entities/map/model";

const searchRestaurantAPI = async (query: string): Promise<Restaurant[]> => {

  if(!query.trim()) return [];

  console.log(`Restaurant API 검색 시작: ${query}`);

  try {
    const response = await fetch(`/api/search/restaurants?query=${encodeURIComponent(query)}&display=15`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류' }));
      console.log('❌ Restaurant API 에러:', errorData);
      throw new Error(errorData.message || `HTTP ${response.status}: 검색 요청 실패`);
    }

    const data = await response.json();
    
    console.log(`✅ Restaurant API 응답:`, data);
    // console.log(`📊 총 ${data.data.restaurants.length}개 음식점 발견`);
    // console.log(`🍽️ 음식점 목록:`, data.data.restaurants);

    return data.data.restaurants;

  } catch (error) {
    console.error('❌ Restaurant API 전체 에러:', error);
    
    // 네트워크 에러, 파싱 에러 등을 구분해서 처리
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('네트워크 연결을 확인해주세요');
    }
    
    if (error instanceof SyntaxError) {
      throw new Error('서버 응답 형식 오류');
    }
    
    // 이미 처리된 에러는 그대로 전달
    if (error instanceof Error) {
      throw error;
    }
    
    // 예상치 못한 에러
    throw new Error('음식점 검색 중 오류가 발생했습니다');
  }

}

export default searchRestaurantAPI;