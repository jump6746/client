import { useState, useCallback } from 'react';
import { Marker } from '../types/types';
import { NaverMapInstance, NaverMarker } from '../types/naver-maps';

const useMapMarkers = (map: NaverMapInstance | null, initialMarkers: Marker[] = []) => {
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers);
  const [naverMarkers, setNaverMarkers] = useState<NaverMarker[]>([]);

  const createMarker = useCallback((lat: number, lng: number, title: string, isCurrentLocation = false) => {
    if (!map) return null;

    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map: map,
      title: title,
      icon: isCurrentLocation ? {
        content: '<div style="background: #4285F4; width: 12px; height: 12px; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        anchor: new window.naver.maps.Point(9, 9),
      } : undefined,
    });

    return marker;
  }, [map]);

  const addMarker = useCallback((lat: number, lng: number, title: string, isCurrentLocation = false) => {
    const marker = createMarker(lat, lng, title, isCurrentLocation);
    if (marker) {
      setNaverMarkers(prev => [...prev, marker]);
      setMarkers(prev => [...prev, {
        id: `marker_${Date.now()}`,
        lat,
        lng,
        title,
      }]);
    }
    return marker;
  }, [createMarker]);

  const removeMarker = useCallback((index: number) => {
    if (naverMarkers[index]) {
      naverMarkers[index].setMap(null);
      setNaverMarkers(prev => prev.filter((_, i) => i !== index));
      setMarkers(prev => prev.filter((_, i) => i !== index));
    }
  }, [naverMarkers]);

  const clearMarkers = useCallback(() => {
    naverMarkers.forEach(marker => marker.setMap(null));
    setNaverMarkers([]);
    setMarkers([]);
  }, [naverMarkers]);

  // 초기 마커들 렌더링
  const renderInitialMarkersSimple = useCallback(() => {
    if (!map || initialMarkers.length === 0) return;

    const newNaverMarkers: NaverMarker[] = [];
    
    initialMarkers.forEach(marker => {
      if (marker) {
        const naverMarker = createMarker(marker.lat, marker.lng, marker.title);
        if (naverMarker) {
          newNaverMarkers.push(naverMarker);
        }
      }
    });

    setNaverMarkers(newNaverMarkers);
  }, [map, initialMarkers, createMarker]);

  return {
    markers,
    addMarker,
    removeMarker,
    clearMarkers,
    renderInitialMarkersSimple,
  };
};

export default useMapMarkers;