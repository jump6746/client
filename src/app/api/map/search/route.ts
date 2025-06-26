// app/api/map/search/route.ts
import { KakaoSearchResponse } from '@/entities/map/model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

  // 쿼리 파람 분석
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const currentLat = searchParams.get('lat');
  const currentLng = searchParams.get('lng');
  const display = searchParams.get('display') || '15';

  // 쿼리 (검색어) 없을 시 처리
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
    const places = data.documents.map((place) => ({
      id: place.id,
      place_name: place.place_name,
      address_name: place.road_address_name || place.address_name,
      category_name: place.category_name.split(">")[0],
      phone: place.phone || '',
      lat: parseFloat(place.x),
      lng: parseFloat(place.x),
      distance: place.distance ? parseInt(place.distance) : undefined,
      mapx: Math.round(parseFloat(place.x) * 1000000).toString(),
      mapy: Math.round(parseFloat(place.y) * 1000000).toString(),
      place_url: place.place_url,
    }));

    return NextResponse.json({
      total: data.meta.total_count,
      count: places.length,
      places: places,
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