"use client";

import React, { useState, useEffect, useRef } from "react";
import { isSuccessResponse, loadNaverMaps } from "@/shared/lib";
import { KaokaoResponse, TasteMap } from "@/entities/map/model";
import { NaverMapInstance, NaverMarker } from "@/shared/types/naver-maps";
import { getTasteMapAPI } from "@/entities/map/api";
import useGuestModeStore from "@/shared/stores/useGuestModeStore";

interface Location {
  lat: number;
  lng: number;
}

interface NaverMapProps {
  center?: Location; // 외부에서 받는 중심 위치
  place: KaokaoResponse | null;
  zoom?: number; // 줌 레벨
  width?: string; // 너비
  height?: string; // 높이
}

const NaverMap = ({
  center,
  place,
  zoom = 15,
  width = "100%",
  height = "100vh",
}: NaverMapProps) => {
  const [map, setMap] = useState<NaverMapInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isGuestMode = useGuestModeStore((state) => state.isGuestMode);

  const mapRef = useRef<HTMLDivElement>(null);
  const currentLocationMarkerRef = useRef<NaverMarker | null>(null); // 현재 위치 마커 참조
  const searchMarkerRef = useRef<NaverMarker | null>(null); // 검색 마커 (빨간색)

  const [data, setData] = useState<TasteMap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const markerTag = {
    음식점: "restaurant",
    카페: "coffee",
    술집: "wine",
    한식: "restaurant",
    일식: "restaurant",
    중식: "restaurant",
    양식: "restaurant",
  };

  // 네이버 지도 초기화
  useEffect(() => {
    const initMap = async () => {
      try {
        // 커스텀 함수로 네이버 지도 API 로드
        await loadNaverMaps();

        if (!mapRef.current) return;

        // props로 받은 center가 있으면 사용, 없으면 서울 기본값
        const initialCenter = center || { lat: 37.5665, lng: 126.978 };

        const mapOptions = {
          center: new window.naver.maps.LatLng(
            initialCenter.lat,
            initialCenter.lng
          ),
          zoom: zoom,
        };

        const mapInstance = new window.naver.maps.Map(
          mapRef.current,
          mapOptions
        );
        setMap(mapInstance);
        setIsLoading(false);
      } catch (error) {
        console.error("네이버 지도 로딩 실패:", error);
        setIsLoading(false);
      }
    };

    initMap();
  }, []); // 초기화는 한 번만

  useEffect(() => {
    if (isGuestMode) {
      console.log('게스트 모드');
      return;
    }

    const fetchTasteMap = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getTasteMapAPI({
          tasteMapId: 1,
          userMapx: center?.lng ?? 37.5665,
          userMapy: center?.lat ?? 126.978,
        });

        if (isSuccessResponse(response)) {
          console.log(response.data);

          setData(response.data); // ResponseDTO의 data 부분
        } else {
          setError(response.message);
        }

        console.log(data);
        console.log(loading);
        console.log(error);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
        console.error("API 호출 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasteMap();
  }, [center, isGuestMode]); // 의존성 배열

  // 현재 위치 마커 생성 (center가 있을 때만)
  useEffect(() => {
    if (map && center) {
      console.log("현재 위치:", center);

      // 현재 위치 마커가 없으면 생성
      if (!currentLocationMarkerRef.current) {
        const currentPosition = new window.naver.maps.LatLng(
          center.lat,
          center.lng
        );

        const currentMarker = new window.naver.maps.Marker({
          position: currentPosition,
          map: map,
          icon: {
            content: `<div style="width:20px;height:20px;background:#4285f4;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
            anchor: new window.naver.maps.Point(10, 10),
          },
        });

        currentLocationMarkerRef.current = currentMarker;

        // 현재 위치로 지도 중심 이동
        map.setCenter(currentPosition);
      }
    }
  }, [map, center]);

  useEffect(() => {
    if (map && data) {
      data.placeList.forEach((item) => {
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(item.mapy, item.mapx),
          map: map,
          icon: {
            content: `
            <div style="position: relative; text-align: center;">
              <!-- 마커 아이콘 -->
              <img src="/icons/${markerTag[item.placeCategoryName]}.svg" 
                   style="width: 24px; height: 32px; display: block; margin: 0 auto;" 
                   alt="marker" />
              
              <!-- 텍스트 라벨 -->
              <div style="
                position: absolute;
                top: 30px;
                left: 50%;
                transform: translateX(-50%);
                color: #000000;
                padding: 2px 6px;
                background-color: white;
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
                font-family: pretendard ,sans-serif;
                z-index: 10;
              ">
                ${item.placeName}
              </div>
            </div>
          `,
            anchor: new window.naver.maps.Point(10, 10),
          },
        });
      });
    }
  }, [map, data]);

  // 검색된 장소 마커 생성/업데이트
  useEffect(() => {
    if (map && place) {
      console.log("검색된 장소:", place);

      // 기존 검색 마커 제거
      if (searchMarkerRef.current) {
        searchMarkerRef.current.setMap(null);
        searchMarkerRef.current = null;
      }

      // 새로운 검색 마커 생성 (빨간색 핀)
      const searchPosition = new window.naver.maps.LatLng(place.y, place.x);

      const searchMarker = new window.naver.maps.Marker({
        position: searchPosition,
        map: map,
        icon: {
          content: `
            <div style="position: relative;">
              <div style="width: 24px; height: 32px; background: #dc2626; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
              <div style="position: absolute; top: 3px; left: 3px; width: 12px; height: 12px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
            </div>
          `,
          anchor: new window.naver.maps.Point(12, 32),
        },
      });

      searchMarkerRef.current = searchMarker;

      // 검색된 장소로 지도 중심 이동
      map.setCenter(searchPosition);
      console.log("선택된 장소로 이동", searchPosition);
    }
  }, [map, place]);

  // 컴포넌트 언마운트 시 마커 정리
  useEffect(() => {
    return () => {
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }
    };
  }, []);

  return (
    <div style={{ width, height }} className="relative">
      <div ref={mapRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <p>지도 로딩 중...</p>
        </div>
      )}
    </div>
  );
};

export default NaverMap;
