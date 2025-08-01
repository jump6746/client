"use client";

import React, { useState, useEffect, useRef } from "react";
import { isSuccessResponse, loadNaverMaps } from "@/shared/lib";
import { KakaoResponse, TasteMap } from "@/entities/map/model";
import useTasteMap from "@/entities/map/queries/useTasteMap";
import { useMapURL } from "../hooks";
import { useTasteMapThumbnail } from "@/entities/review/queries";
import {
  MARKER_ICONS,
  MARKER_STYLES,
  MarkerCategory,
  ZOOM_OFFSET,
  ZoomCategory,
} from "@/entities/map/ui";

interface Location {
  lat: number;
  lng: number;
}

interface NaverMapProps {
  center?: Location; // 외부에서 받는 중심 위치
  place: KakaoResponse | null;
  setPlace: React.Dispatch<React.SetStateAction<KakaoResponse | null>>;
  zoom?: number; // 줌 레벨
  width?: string; // 너비
  height?: string; // 높이
  onMapClick?: () => void;
}

const NaverMap = ({
  center,
  place,
  setPlace,
  zoom = 16,
  width = "100%",
  height = "100%",
  onMapClick,
}: NaverMapProps) => {
  // 상태들
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TasteMap | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const currentLocationMarkerRef = useRef<naver.maps.Marker | null>(null); // 현재 위치 마커 참조
  const searchMarkerRef = useRef<naver.maps.Marker | null>(null); // 검색 마커 (빨간색)
  const selectedMarkerIdRef = useRef<string | null>(null);
  const markersRef = useRef<Map<string, naver.maps.Marker>>(new Map());

  const { updateURL, getPlaceIdFromURL, getOwnerIdFromURL } = useMapURL();
  const { data: placeURLData } = useTasteMapThumbnail({
    id: getPlaceIdFromURL(),
  });

  // 맛지도 데이터 받아오는 Query
  const {
    data: response,
    // isLoading,
    // error,
  } = useTasteMap({
    userMapx: center?.lng ?? 37.5665,
    userMapy: center?.lat ?? 126.978,
  });

  // 스타일 주입 (한 번만 실행)
  useEffect(() => {
    if (!document.getElementById("nm-marker-styles")) {
      const styleElement = document.createElement("style");
      styleElement.id = "nm-marker-styles";
      styleElement.textContent =
        MARKER_STYLES.BASE +
        MARKER_STYLES.ANIMATIONS +
        MARKER_STYLES.CURRENT_LOCATION;
      document.head.appendChild(styleElement);
    }

    return () => {
      // 컴포넌트 언마운트 시 스타일 제거 (선택사항)
      const styleElement = document.getElementById("nm-marker-styles");
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // 네이버 지도 초기화
  useEffect(() => {
    const initMap = async () => {
      try {
        // 커스텀 함수로 네이버 지도 API 로드
        await loadNaverMaps();

        // DOM이 준비될 때까지 대기
        if (!mapRef.current) {
          setTimeout(() => initMap(), 100);
          return;
        }

        // props로 받은 center가 있으면 사용, 없으면 서울 기본값
        const initialCenter = center || { lat: 37.5665, lng: 126.978 };
        console.log("줌 레벨", zoom);
        const mapOptions = {
          center: new window.naver.maps.LatLng(
            initialCenter.lat,
            initialCenter.lng
          ),
          zoom: zoom,
        };

        const mapInstance = new window.naver.maps.Map(
          mapRef.current,
          mapOptions
        );

        setMap(mapInstance);
        setIsLoading(false);
      } catch (error) {
        console.error("네이버 지도 로딩 실패:", error);
        setIsLoading(false);
      }
    };

    initMap();
  }, []);

  // 맛지도 데이터
  useEffect(() => {
    if (!response) return;

    if (isSuccessResponse(response)) {
      setData(response.data);
      // ownerId가 현재 URL에 없을 때만 설정
      const currentOwnerId = getOwnerIdFromURL();
      if (
        !currentOwnerId ||
        currentOwnerId !== String(response.data.tasteMapUserId)
      ) {
        updateURL({ ownerId: String(response.data.tasteMapUserId) });
      }
    }
  }, [response]);

  // 현재 위치 마커 생성 (현재 위치 관련 useEffect)
  useEffect(() => {
    if (map && center) {
      console.log("현재 위치:", center);

      // 현재 위치 마커가 없으면 생성
      if (!currentLocationMarkerRef.current) {
        const currentPosition = new window.naver.maps.LatLng(
          center.lat,
          center.lng
        );

        const currentMarker = new window.naver.maps.Marker({
          position: currentPosition,
          map: map,
          icon: {
            content: `<div class="nm-current-location"></div>`,
            anchor: new window.naver.maps.Point(10, 10),
          },
        });

        currentLocationMarkerRef.current = currentMarker;

        // 현재 위치로 지도 중심 이동
        map.setCenter(currentPosition);
      }
    }
  }, [map, center]);

  useEffect(() => {
    if (map && data) {
      // 기존 마커들 제거
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current.clear();

      // 클릭 시점에 현재 URL에서 ownerId 가져오기
      const currentMapId = new URLSearchParams(window.location.search).get(
        "mapId"
      );

      data.placeList.forEach((item) => {
        const markerId = `nm-marker-${item.placeId}`;
        const iconName = MARKER_ICONS[item.placeCategoryName as MarkerCategory];

        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(item.mapy, item.mapx),
          map: map,
          icon: {
            content: `
              <div id="${markerId}" class="nm-marker-wrapper">
                <div class="nm-marker-shape nm-marker-${
                  !currentMapId && item.jjim ? "star" : iconName
                }">
                  <img class="nm-marker-icon"
                       src="/icons/${
                         !currentMapId && item.jjim ? "star" : iconName
                       }.svg"
                       alt="${item.placeCategoryName}"
                  />
                </div>
                <span class="nm-marker-label">
                  ${item.placeName}
                </span>
              </div>
            `,
            anchor: new naver.maps.Point(16, 16),
          },
        });

        markersRef.current.set(item.placeId, marker);

        naver.maps.Event.addListener(marker, "click", () => {
          if (selectedMarkerIdRef.current) {
            const prevElement = document.querySelector(
              `#nm-marker-${selectedMarkerIdRef.current} .nm-marker-shape`
            );
            console.log("remove");
            prevElement?.classList.remove("active");
          }

          const currentElement = document.querySelector(
            `#${markerId} .nm-marker-shape`
          );
          currentElement?.classList.add("active");

          selectedMarkerIdRef.current = item.placeId;

          const currentOwnerId = new URLSearchParams(
            window.location.search
          ).get("ownerId");

          setPlace({
            id: item.placeId,
            place_name: item.placeName,
            category_group_name: item.placeCategoryName,
            x: item.mapx,
            y: item.mapy,
            place_url: item.placeUrl,
            road_address_name: item.roadAddress,
            distance: item.distance,
          });

          updateURL({
            placeId: item.placeId,
            zoom: "16",
            ownerId: currentOwnerId,
          });
        });
      });
    }
  }, [map, data]);

  // 검색된 장소 마커 생성/업데이트
  useEffect(() => {
    if (map) {
      console.log("검색된 장소:", place);

      // 기존 검색 마커 제거
      if (searchMarkerRef.current) {
        searchMarkerRef.current.setMap(null);
        searchMarkerRef.current = null;
      }

      const placePosition: { y: number | null; x: number | null } = {
        y: null,
        x: null,
      };

      if (place) {
        placePosition.y = place.y;
        placePosition.x = place.x;
      } else {
        if (placeURLData && isSuccessResponse(placeURLData)) {
          placePosition.y = placeURLData.data.mapy;
          placePosition.x = placeURLData.data.mapx;
        }
      }

      // place가 있을 때만 새로운 마커 생성
      if (placePosition.x && placePosition.y) {
        // 새로운 검색 마커 생성 (빨간색 핀)
        const searchPosition = new window.naver.maps.LatLng(
          placePosition.y,
          placePosition.x
        );

        const currentZoom = map.getZoom();
        const offsetY = ZOOM_OFFSET[currentZoom as ZoomCategory];
        const centerPosition = new window.naver.maps.LatLng(
          placePosition.y - offsetY,
          placePosition.x
        );

        // 검색된 장소로 지도 중심 이동
        map.setCenter(centerPosition);
        console.log("선택된 장소로 이동", searchPosition);
      }
    }
  }, [map, place, placeURLData]);

  // 컴포넌트 언마운트 시 마커 정리
  useEffect(() => {
    return () => {
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }
    };
  }, []);

  // 지도 클릭 시 placeInfo 닫기
  useEffect(() => {
    if (!map || !onMapClick) return;

    const listener = window.naver.maps.Event.addListener(map, "click", () => {
      // 기존 활성화된 마커 비활성화
      if (selectedMarkerIdRef.current) {
        const prevElement = document.querySelector(
          `#nm-marker-${selectedMarkerIdRef.current} .nm-marker-shape`
        );
        prevElement?.classList.remove("active");

        // 선택된 마커 ID 초기화
        selectedMarkerIdRef.current = null;
      }

      setPlace(null);

      onMapClick?.();
    });

    return () => {
      window.naver.maps.Event.removeListener(listener);
    };
  }, [map, onMapClick]);

  return (
    <div style={{ width, height }} className="relative">
      <div ref={mapRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <p>지도 로딩 중...</p>
        </div>
      )}
    </div>
  );
};

export default NaverMap;
