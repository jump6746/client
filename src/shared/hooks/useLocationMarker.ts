import { useCallback } from 'react';
import { NaverMapInstance } from '../types/naver-maps';

const useLocationMarker = (map: NaverMapInstance | null) => {
  const addLocationMarker = useCallback((lat: number, lng: number, title = "현재 위치") => {
    if (!map) return null;

    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map: map,
      title: title,
      icon: {
        content: '<div style="background: #4285F4; width: 12px; height: 12px; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        anchor: new window.naver.maps.Point(9, 9),
      },
    });

    return marker;
  }, [map]);

  return {
    addLocationMarker,
  };
};

export default useLocationMarker;