"use client";

import { useState, useCallback, useEffect } from "react";
import { KakaoResponse } from "@/entities/map/model";
import { PlaceInfo, SearchComponent } from "@/widgets/map/ui";
import { NaverMap } from "@/features/map";
import { useGeolocation, useMapURL } from "@/features/map/hooks";
import { customToast } from "@/shared/ui/CustomToast";
import RecommendMap from "@/widgets/map/ui/RecommendMap";

const MapPage = () => {
  // url 관리
  const { updatePlaceId } = useMapURL();

  // 현재 위치
  const { currentLocation, getCurrentLocation, locationError } =
    useGeolocation();

  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [place, setPlace] = useState<KakaoResponse | null>(null);

  // 컴포넌트 마운트 시 현재 위치 가져오기
  useEffect(() => {
    getCurrentLocation().catch(() => {
      // 실패하면 디폴트 좌표
      setMapCenter({ lat: 37.5665, lng: 126.978 });
    });
  }, [getCurrentLocation]);

  // 현재 위치 가져오는 중 에러
  useEffect(() => {
    if (!locationError) return;
    customToast.error(locationError);
  }, [locationError]);

  // 현재 위치가 변경되면 지도 중심도 업데이트
  useEffect(() => {
    if (currentLocation) {
      setMapCenter(currentLocation);
    }
  }, [currentLocation]);

  // 장소 선택 핸들러
  const handlePlaceSelect = useCallback(
    (place: KakaoResponse) => {
      setPlace(place);

      updatePlaceId(place.id);
    },
    [updatePlaceId]
  );

  // 지도 클릭 시 PlaceInfo 닫기
  const handleMapClick = useCallback(() => {
    setPlace(null);
    updatePlaceId(null); // URL에서 placeId 제거
  }, [updatePlaceId]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <SearchComponent
        currentLocation={mapCenter}
        onPlaceSelect={handlePlaceSelect}
      />
      {mapCenter && (
        <NaverMap
          place={place}
          setPlace={setPlace}
          center={mapCenter}
          zoom={25}
          onMapClick={handleMapClick}
        />
      )}
      <PlaceInfo place={place} setPlace={setPlace} />
      <RecommendMap />
    </div>
  );
};

export default MapPage;
