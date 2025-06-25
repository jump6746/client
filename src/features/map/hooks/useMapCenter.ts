// features/map/hooks/useMapCenter.ts
import { useState, useCallback, useEffect } from "react";
import { NaverMapInstance } from '@/shared/types/naver-maps';

interface MapCenterData {
  lat: number;
  lng: number;
}

const useMapCenter = (map: NaverMapInstance | null) => {
  const [mapCenter, setMapCenter] = useState<MapCenterData>({ 
    lat: 37.5665, 
    lng: 126.978 
  });

  // 현재 지도 중심 좌표 가져오기
  const getMapCenter = useCallback((): MapCenterData | null => {
    if (!map) return null;

    const center = map.getCenter();
    return {
      lat: center.lat(),
      lng: center.lng(),
    };
  }, [map]);

  // 지도 중심 좌표 업데이트 (최적화된 버전)
  const updateCenter = useCallback(() => {
    const center = getMapCenter();
    if (center) {
      setMapCenter(prev => {
        // 🎯 값이 실제로 변했을 때만 업데이트 (소수점 8자리까지 비교)
        const latChanged = Math.abs(prev.lat - center.lat) > 0.00000001;
        const lngChanged = Math.abs(prev.lng - center.lng) > 0.00000001;
        
        if (latChanged || lngChanged) {
          return center;
        }
        
        return prev; // 🎯 이전 참조 유지로 불필요한 리렌더링 방지
      });
    }
  }, [getMapCenter]);

  // 지도가 변경될 때마다 중심 좌표 업데이트
  useEffect(() => {
    if (!map) return;

    // 초기 중심 좌표 설정
    updateCenter();

    // idle 이벤트로 드래그/줌 완료 시에만 업데이트
    const listener = window.naver.maps.Event.addListener(map, "idle", updateCenter);

    return () => {
      window.naver.maps.Event.removeListener(listener);
    };
  }, [map, updateCenter]);

  return {
    mapCenter,
    getMapCenter,
  };
};

export default useMapCenter;