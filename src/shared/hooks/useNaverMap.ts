import { useState, useCallback, useEffect } from 'react';
import { loadNaverMaps } from '@/shared/lib';
import { MapOptions } from '../types/types';

const useNaverMap = (options: MapOptions) => {
  const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mapCallbackRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      setMapElement(element);
    }
  }, []);

  const waitForNaverMaps = async (timeout: number = 10000, interval: number = 50) => {
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
    if (!mapElement) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        await loadNaverMaps();
        await waitForNaverMaps();

        if (mapElement) {
          const mapInstance = new window.naver.maps.Map(mapElement, {
            center: new window.naver.maps.LatLng(options.center.lat, options.center.lng),
            zoom: options.zoom,
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
  }, [mapElement, options.center.lat, options.center.lng, options.zoom]);

  const moveToLocation = useCallback((lat: number, lng: number, zoom = 15) => {
    if (!map) return;
    
    const location = new window.naver.maps.LatLng(lat, lng);
    map.setCenter(location);
    map.setZoom(zoom);
  }, [map]);

  return {
    mapCallbackRef,
    map,
    isLoading,
    moveToLocation,
  };
};

export default useNaverMap;