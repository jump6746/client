// hooks/useMapCenter.ts
import { useState, useCallback, useRef, useEffect } from "react";
import { NaverMapInstance } from "../types/naver-maps";

interface MapCenterData {
  lat: number;
  lng: number;
}

interface UseMapCenterOptions {
  onCenterChange?: (center: MapCenterData) => void;
  debounceMs?: number;
}

const useMapCenter = (map: NaverMapInstance | null, options: UseMapCenterOptions = {}) => {
  const { onCenterChange, debounceMs = 300 } = options;
  
  // 기본 중심점 (서울시청)
  const defaultCenter = { lat: 37.5665, lng: 126.978 };
  
  // 현재 지도 중심 좌표 상태
  const [mapCenter, setMapCenter] = useState<MapCenterData>(defaultCenter);
  
  // 콜백 ref로 안정적인 참조 유지
  const onCenterChangeRef = useRef(onCenterChange);
  
  // 디바운스를 위한 타이머 ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 이벤트 리스너가 등록되었는지 추적
  const listenersRegisteredRef = useRef(false);

  // ref 업데이트
  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  });

  // 지도 중심 좌표 가져오는 함수
  const getMapCenter = useCallback((): MapCenterData | null => {
    if (!map) return null;

    const center = map.getCenter();

    return {
      lat: center.lat(),
      lng: center.lng(),
    };
  }, [map]);

  // 지도 중심 좌표 업데이트 함수
  const updateMapCenter = useCallback((newCenter?: MapCenterData) => {
    const center = newCenter || getMapCenter();
    if (center) {
      setMapCenter(center);
      onCenterChangeRef.current?.(center);
    }
  }, [getMapCenter]);

  // 디바운스된 중심 변경 핸들러
  const handleCenterChangeDebounced = useCallback(() => {
    // 기존 타이머 클리어
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 새 타이머 설정
    debounceTimerRef.current = setTimeout(() => {
      updateMapCenter();
    }, debounceMs);
  }, [updateMapCenter, debounceMs]);

  // 즉시 실행되는 중심 변경 핸들러
  const handleCenterChangeImmediate = useCallback(() => {
    updateMapCenter();
  }, [updateMapCenter]);

  // 지도 이벤트 리스너 등록
  useEffect(() => {
    if (!map || listenersRegisteredRef.current) return;

    console.log("지도 중심 이벤트 리스너 등록");
    
    // 초기 중심 좌표 설정
    const initialCenter = getMapCenter();
    if (initialCenter) {
      updateMapCenter(initialCenter);
    }

    // 이벤트 리스너 등록
    const idleListener = window.naver.maps.Event.addListener(
      map,
      "idle",
      handleCenterChangeImmediate
    );

    const dragListener = window.naver.maps.Event.addListener(
      map,
      "drag",
      handleCenterChangeDebounced
    );

    const zoomChangedListener = window.naver.maps.Event.addListener(
      map,
      "zoom_changed",
      handleCenterChangeImmediate
    );

    // 등록 완료 표시
    listenersRegisteredRef.current = true;

    // 클린업 함수
    return () => {
      console.log("지도 중심 이벤트 리스너 제거");
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      window.naver.maps.Event.removeListener(idleListener);
      window.naver.maps.Event.removeListener(dragListener);
      window.naver.maps.Event.removeListener(zoomChangedListener);
      listenersRegisteredRef.current = false;
    };
  }, [map, handleCenterChangeDebounced, handleCenterChangeImmediate, getMapCenter, updateMapCenter]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    mapCenter,
    getMapCenter,
    updateMapCenter,
  };
};

export default useMapCenter;