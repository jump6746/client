import { Restaurant, SearchResponse } from "@/entities/map/model";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse<ResponseDTO<SearchResponse> | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const display = searchParams.get('display') || '10';

    console.log('받은 검색어:', query); // 디버깅용

    if (!query) {
      const errorResponse: ErrorResponse = {
        status: 400,
        name: "INVALID_QUERY",
        message: "검색어가 필요합니다",
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    console.log("네이버 API 요청 시작:", `query=${query}, display=${display}`);

    const response = await fetch(
      `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=${display}&sort=random`,
      {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID!,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET!,
        },
      }
    );

    console.log('네이버 API 응답 상태:', response.status); // 디버깅용

    if (!response.ok) {
      const errorText = await response.text();
      console.log('네이버 API 에러 응답:', errorText); // 디버깅용
      
      const errorResponse: ErrorResponse = {
        status: 500,
        name: "NAVER_API_ERROR",
        message: "네이버 API 요청 실패",
        timestamp: new Date().toISOString()
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const data = await response.json();
    console.log("네이버 API 원본 응답:", data);

    // 음식점 관련 카테고리만 필터링
    const filteredItems = data.items.filter((item: any) => {
      const category = item.category.toLowerCase();
      return category.includes('음식점') || 
             category.includes('카페') || 
             category.includes('치킨') || 
             category.includes('피자') ||
             category.includes('한식') ||
             category.includes('중식') ||
             category.includes('일식') ||
             category.includes('양식') ||
             category.includes('분식') ||
             category.includes('베이커리');
    });

    console.log(`필터링 결과: 전체 ${data.items.length}개 → 음식점 ${filteredItems.length}개`);

    // 클라이언트가 사용하기 쉽게 변환
    const restaurants: Restaurant[] = filteredItems.map((item: any, index: number) => ({
      id: `restaurant_${Date.now()}_${index}`,
      title: item.title.replace(/<\/?b>/g, ''), // HTML 태그 제거
      address: item.roadAddress || item.address,
      category: item.category,
      telephone: item.telephone || '',
      lat: parseInt(item.mapy) / 10000000,
      lng: parseInt(item.mapx) / 10000000,
      link: item.link
    }));

    console.log('✅ 최종 검색 결과:', restaurants);

    const searchData: SearchResponse = {
      restaurants,
      total: filteredItems.length,
      originalTotal: data.total
    };

    const successResponse: ResponseDTO<SearchResponse> = {
      status: 200,
      message: "검색 성공",
      data: searchData,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(successResponse);

  } catch (error) {
    console.error("Restaurant search error:", error);
    
    const errorResponse: ErrorResponse = {
      status: 500,
      name: "SERVER_ERROR",
      message: "서버 내부 오류",
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}