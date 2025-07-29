// features/map/hooks/useMapMarkers.ts
import { useRef, useCallback } from 'react';

const useMapMarkers = (map: naver.maps.Map | null) => {
  // ref로 마커들 관리 (리렌더링 없이)
  const naverMarkersRef = useRef<naver.maps.Marker[]>([]);

  // 마커 추가
  const addMarker = useCallback((lat: number, lng: number, title: string) => {
    if (!map) return null;

    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map: map,
      title: title,
    });

    naverMarkersRef.current.push(marker);
    return marker;
  }, [map]);

  // 모든 마커 제거
  const clearMarkers = useCallback(() => {
    naverMarkersRef.current.forEach(marker => marker.setMap(null));
    naverMarkersRef.current = [];
  }, []);

  return {
    addMarker,
    clearMarkers,
  };
};

export default useMapMarkers;