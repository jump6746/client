"use client";

import { useState, useCallback, useEffect } from "react";
import { KaokaoResponse } from "@/entities/map/model";
import { PlaceInfo, SearchComponent } from "@/widgets/map/ui";
import { NaverMap } from "@/features/map";
import { useGeolocation } from "@/features/map/hooks";

const MapPage = () => {
  const { currentLocation, getCurrentLocation } = useGeolocation();
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [place, setPlace] = useState<KaokaoResponse | null>(null);

  // 컴포넌트 마운트 시 현재 위치 가져오기
  useEffect(() => {
    getCurrentLocation().catch(() => {
      // 실패하면 디폴트 좌표
      setMapCenter({ lat: 37.5665, lng: 126.978 });
    });
  }, [getCurrentLocation]);

  // 현재 위치가 변경되면 지도 중심도 업데이트
  useEffect(() => {
    if (currentLocation) {
      setMapCenter(currentLocation);
    }
  }, [currentLocation]);

  // 장소 선택 핸들러
  const handlePlaceSelect = useCallback((place: KaokaoResponse) => {
    console.log("선택된 장소:", place);
    setPlace(place);
  }, []);

  return (
    <div className="w-full h-full relative">
      <SearchComponent
        currentLocation={mapCenter}
        onPlaceSelect={handlePlaceSelect}
      />
      {mapCenter && (
        <NaverMap
          place={place}
          setPlace={setPlace}
          center={mapCenter}
          zoom={16}
        />
      )}
      <PlaceInfo place={place} setPlace={setPlace} />
    </div>
  );
};

export default MapPage;
