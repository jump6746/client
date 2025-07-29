"use client";

import React, { useState, useEffect, useRef } from "react";
import { isSuccessResponse, loadNaverMaps } from "@/shared/lib";
import { KakaoResponse, TasteMap } from "@/entities/map/model";
import { NaverMapInstance, NaverMarker } from "@/shared/types/naver-maps";
import useTasteMap from "@/entities/map/queries/useTasteMap";
import { useLoginInfo } from "@/entities/auth/queries";
import { useMapURL } from "../hooks";
import { useTasteMapThumbnail } from "@/entities/review/queries";

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
  zoom = 15,
  width = "100%",
  height = "100%",
  onMapClick,
}: NaverMapProps) => {
  // 상태들
  const [map, setMap] = useState<NaverMapInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TasteMap | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const currentLocationMarkerRef = useRef<NaverMarker | null>(null); // 현재 위치 마커 참조
  const searchMarkerRef = useRef<NaverMarker | null>(null); // 검색 마커 (빨간색)

  const { userInfo } = useLoginInfo();
  const { updatePlaceId, getPlaceIdFromURL } = useMapURL();
  const { data: placeURLData } = useTasteMapThumbnail({
    id: getPlaceIdFromURL(),
  });

  // 맛지도 데이터 받아오는 Query
  const {
    data: response,
    // isLoading,
    // error,
  } = useTasteMap({
    tasteMapId: userInfo?.defaultTasteMapId ?? 0,
    userMapx: center?.lng ?? 37.5665,
    userMapy: center?.lat ?? 126.978,
  });

  const markerTag = {
    음식점: "restaurant",
    카페: "coffee",
    술집: "wine",
    한식: "restaurant",
    일식: "restaurant",
    중식: "restaurant",
    양식: "restaurant",
  };

  // 아이콘 프리로딩 (렌더링 문제 해결)
  useEffect(() => {
    const preloadIcons = () => {
      const iconNames = Object.values(markerTag);

      iconNames.forEach((iconName) => {
        const img = new Image();
        img.src = `/icons/${iconName}.svg`;

        img.onload = () => console.log(`✅ Loaded: ${iconName}.svg`);
        img.onerror = () => console.error(`❌ Failed to load: ${iconName}.svg`);
      });
    };

    preloadIcons();
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
  }, []); // 초기화는 한 번만

  // 맛지도 데이터
  useEffect(() => {
    if (!response) return;

    if (isSuccessResponse(response)) {
      setData(response.data);
    }
  }, [response]);

  // 현재 위치 마커 생성 (center가 있을 때만)
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
            content: `<div style="width:20px;height:20px;background:#4285f4;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
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
      data.placeList.forEach((item) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(item.mapy, item.mapx),
          map: map,
          icon: {
            content: `
            <div style="position: relative; text-align: center;">
              <!-- 마커 아이콘 -->
              <img src="/icons/${
                markerTag[
                  item.placeCategoryName as
                    | "음식점"
                    | "카페"
                    | "술집"
                    | "한식"
                    | "일식"
                    | "양식"
                    | "중식"
                ]
              }.svg" 
                   style="width: 24px !important; height: 32px !important; display: block; margin: 0 auto;" 
                   alt="marker" />
              
              <!-- 텍스트 라벨 -->
              <div style="
                position: absolute;
                top: 30px;
                left: 50%;
                transform: translateX(-50%);
                color: #000000;
                padding: 2px 6px;
                background-color: white;
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
                font-family: pretendard ,sans-serif;
                z-index: 10;
              ">
                ${item.placeName}
              </div>
            </div>
          `,
            anchor: new window.naver.maps.Point(10, 10),
          },
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
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
          updatePlaceId(item.placeId);
        });
      });
    }
  }, [map, data, updatePlaceId]);

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

        const searchMarker = new window.naver.maps.Marker({
          position: searchPosition,
          map: map,
          icon: {
            content: `
            <div style="position: relative;">
              <div style="width: 24px; height: 32px; background: #dc2626; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
            </div>
          `,
            anchor: new window.naver.maps.Point(12, 32),
          },
        });

        searchMarkerRef.current = searchMarker;

        // 지도 scale에 따라서 offsetY 크기 바꿔야함
        const offsetY = 0.002;
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
