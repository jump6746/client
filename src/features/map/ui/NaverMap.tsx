"use client";

import { loadNaverMaps } from "@/shared";
import { useCallback, useEffect, useState } from "react";

interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  width?: string;
  height?: string;
}

const NaverMap = ({
  center = { lat: 37.5665, lng: 126.978 },
  zoom = 10,
  width = "100%",
  height = "400px",
}: NaverMapProps) => {
  const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mapCallbackRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      console.log("요소 크기:", element.offsetWidth, element.offsetHeight);
      setMapElement(element);
    }
  }, []);

  // 네이버 지도 로드 확인
  const waitForNaverMaps = async (
    timeout: number = 10000,
    interval: number = 50
  ) => {
    const maxAttempts = Math.floor(timeout / interval);

    for (let i = 0; i < maxAttempts; i++) {
      if (window.naver?.maps) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`네이버 지도 API 로딩 실패 (${timeout}ms 타임아웃)`);
  };

  useEffect(() => {
    console.log(mapElement);

    if (!mapElement) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        await loadNaverMaps();
        await waitForNaverMaps();

        // 한 번 더 확인
        if (mapElement) {
          console.log("지도 생성");
          const mapInstance = new window.naver.maps.Map(mapElement, {
            center: new window.naver.maps.LatLng(center.lat, center.lng),
            zoom: zoom,
          });
          setMap(mapInstance);
        }
      } catch (error) {
        console.error("지도 초기화 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, [mapElement, center.lat, center.lng, zoom]);

  // 마커 추가 함수
  const addMarker = (lat: number, lng: number, title?: string) => {
    if (!map) return;

    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map: map,
      title: title || "마커",
    });
  };

  return (
    <div style={{ width, height }} className="relative">
      <div
        ref={mapCallbackRef}
        style={{ width, height }}
        className="rounded-lg w-full h-full"
      />
      {isLoading ?? (
        <div className="flex items-center justify-center bg-gray-100 w-full h-full">
          지도 로딩 중...
        </div>
      )}
      {/* 지도 컨트롤 버튼들 */}
      <div className="absolute top-2 right-2 space-y-2">
        <button
          onClick={() => addMarker(center.lat, center.lng, "현재 위치")}
          className="bg-white px-3 py-1 rounded shadow hover:bg-gray-50"
        >
          마커 추가
        </button>
      </div>
    </div>
  );
};

export default NaverMap;
