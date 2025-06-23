// app/api/map/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  place_url: string;
  distance: string;
  x: string; // 경도
  y: string; // 위도
}

interface KakaoSearchResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: KakaoPlace[];
}

// 거리 계산 함수 (하버사인 공식)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // 지구 반지름 (미터)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c); // 미터 단위로 반환
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const currentLat = searchParams.get('lat');
  const currentLng = searchParams.get('lng');
  const display = searchParams.get('display') || '15';

  if (!query) {
    return NextResponse.json(
      { error: '검색어가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    // 카카오 로컬 API 요청 URL 구성
    const kakaoUrl = new URL('https://dapi.kakao.com/v2/local/search/keyword.json');
    kakaoUrl.searchParams.append('query', query);
    kakaoUrl.searchParams.append('size', display);
    
    // 현재 위치가 있으면 검색 범위 설정 (sort는 제거)
    if (currentLat && currentLng) {
      kakaoUrl.searchParams.append('x', currentLng);
      kakaoUrl.searchParams.append('y', currentLat);
      kakaoUrl.searchParams.append('radius', '20000'); // 20km 반경
    }

    console.log('카카오 API 요청:', kakaoUrl.toString());

    const response = await fetch(kakaoUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('카카오 API 오류:', response.status, errorText);
      throw new Error(`카카오 API 오류: ${response.status}`);
    }

    const data: KakaoSearchResponse = await response.json();
    console.log('카카오 API 응답:', data.meta);

    // 카카오 응답을 기존 형식으로 변환
    let restaurants = data.documents.map((place) => ({
      id: place.id,
      title: place.place_name,
      address: place.road_address_name || place.address_name,
      category: place.category_name.split(' > ').pop() || place.category_name,
      telephone: place.phone || '',
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
      distance: place.distance ? parseInt(place.distance) : undefined,
      mapx: Math.round(parseFloat(place.x) * 1000000).toString(),
      mapy: Math.round(parseFloat(place.y) * 1000000).toString(),
      link: place.place_url,
    }));

    // 현재 위치가 있으면 거리 계산 후 정렬
    if (currentLat && currentLng) {
      const userLat = parseFloat(currentLat);
      const userLng = parseFloat(currentLng);
      
      // 거리 계산
      restaurants = restaurants.map(restaurant => ({
        ...restaurant,
        distance: calculateDistance(userLat, userLng, restaurant.lat!, restaurant.lng!)
      }));
      
      // 거리순 정렬
      restaurants.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      console.log('거리순 정렬 완료:', restaurants.slice(0, 3).map(r => `${r.title}: ${r.distance}m`));
    }

    return NextResponse.json({
      total: data.meta.total_count,
      display: restaurants.length,
      items: restaurants,
    });

  } catch (error) {
    console.error('검색 API 오류:', error);
    return NextResponse.json(
      { 
        error: '검색 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}