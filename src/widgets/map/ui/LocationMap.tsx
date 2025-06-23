"use client";

import { useEffect, useRef } from "react";
import {
  useGeolocation,
  useNaverMap,
  useLocationMarker,
  useMapCenter,
} from "@/shared/hooks";
import { NaverMapInstance } from "@/shared/types/naver-maps";

interface LocationMapProps {
  width?: string;
  height?: string;
  zoom?: number;
  autoGetLocation?: boolean; // 자동으로 현재 위치 가져올지 여부
  // 지도 중심 좌표 변경 콜백 추가
  onCenterChange?: (center: { lat: number; lng: number }) => void;
  // 지도 준비 완료 콜백 추가
  onMapReady?: (mapInstance: NaverMapInstance) => void;
  // 현재 위치 변경 콜백 추가
  onLocationChange?: (location: { lat: number; lng: number }) => void;
}

const LocationMap = ({
  width = "100%",
  height = "400px",
  zoom = 15,
  autoGetLocation = true,
  onCenterChange,
  onMapReady,
  onLocationChange,
}: LocationMapProps) => {
  // 기본 중심점 (서울시청)
  const defaultCenter = { lat: 37.5665, lng: 126.978 };

  // 지도 준비 완료 추적
  const mapReadyRef = useRef(false);

  // 커스텀 훅들
  const {
    currentLocation,
    isGettingLocation,
    locationError,
    getCurrentLocation,
  } = useGeolocation();

  const { mapCallbackRef, map, isLoading, moveToLocation } = useNaverMap({
    center: currentLocation || defaultCenter,
    zoom,
  });

  const { addLocationMarker } = useLocationMarker(map);

  // 지도 중심 관리 훅
  const { mapCenter } = useMapCenter(map, {
    onCenterChange,
    debounceMs: 300,
  });

  // 지도 준비 완료 처리
  useEffect(() => {
    if (map && !mapReadyRef.current) {
      console.log("지도 준비 완료");
      onMapReady?.(map);
      mapReadyRef.current = true;
    }
  }, [map, onMapReady]);

  // 컴포넌트 마운트 시 자동으로 현재 위치 가져오기
  useEffect(() => {
    if (autoGetLocation) {
      getCurrentLocation().catch(console.error);
    }
  }, [autoGetLocation, getCurrentLocation]);

  // 현재 위치가 변경되면 지도 이동 및 마커 추가
  useEffect(() => {
    if (currentLocation && map) {
      console.log(`위도 ${currentLocation.lat} 경도 ${currentLocation.lng}`);
      moveToLocation(currentLocation.lat, currentLocation.lng);
      addLocationMarker(currentLocation.lat, currentLocation.lng);

      // 현재 위치 변경 콜백 호출 추가
      onLocationChange?.(currentLocation);
    }
  }, [
    currentLocation,
    map,
    moveToLocation,
    addLocationMarker,
    onLocationChange,
  ]);

  // 현재 위치로 이동 버튼 핸들러
  const handleMoveToCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (map) {
        moveToLocation(location.lat, location.lng);
      }
    } catch (error) {
      console.error("현재 위치 이동 실패:", error);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center bg-gray-100 rounded-lg"
      >
        지도 로딩 중...
      </div>
    );
  }

  return (
    <div style={{ width, height }} className="relative">
      {/* 지도 엘리먼트 */}
      <div
        ref={mapCallbackRef}
        style={{ width, height }}
        className="rounded-lg w-full h-full"
      />

      {/* 현재 위치 버튼 */}
      <button
        onClick={handleMoveToCurrentLocation}
        disabled={isGettingLocation}
        className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 disabled:bg-gray-400 text-sm flex items-center gap-1"
      >
        {isGettingLocation ? (
          <>
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            위치 찾는 중...
          </>
        ) : (
          <>📍 현재 위치</>
        )}
      </button>

      {/* 현재 위치 좌표 표시 */}
      {mapCenter && (
        <div className="absolute bottom-2 left-2 bg-white px-3 py-2 rounded shadow text-sm">
          <div className="text-gray-600 text-xs">
            {mapCenter.lat.toFixed(6)}, {mapCenter.lng.toFixed(6)}
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {locationError && (
        <div className="absolute bottom-2 left-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          {locationError}
        </div>
      )}
    </div>
  );
};

export default LocationMap;
