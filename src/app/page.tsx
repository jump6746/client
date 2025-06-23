"use client";

import React, { useCallback, useState } from "react";
import { NaverMapInstance } from "@/shared/types/naver-maps";
import LocationMap from "@/widgets/map/ui/LocationMap";
import { MapSearch } from "@/features/map/ui";
import { Restaurant } from "@/entities/map/model";

export default function Home() {
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [mapInstance, setMapInstance] = useState<NaverMapInstance | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  // 검색 결과 마커들을 관리하는 상태 추가
  const [searchMarkers, setSearchMarkers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);

  const handleMapCenterChange = useCallback(
    (center: { lat: number; lng: number }) => {
      setMapCenter(center);
      console.log("지도 중심 변경:", center);
    },
    []
  );

  const handleMapReady = useCallback((map: NaverMapInstance | null) => {
    setMapInstance(map);
    console.log("지도 준비 완료");
  }, []);

  // 기존 마커들을 제거하는 함수
  const clearSearchMarkers = useCallback(() => {
    searchMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    setSearchMarkers([]);
  }, [searchMarkers]);

  // 검색 결과로 마커들을 생성하는 함수
  const createSearchMarkers = useCallback(
    (restaurants: Restaurant[]) => {
      if (!mapInstance) return;

      // 기존 마커들 제거
      clearSearchMarkers();

      const newMarkers = restaurants
        .map((restaurant, index) => {
          if (!restaurant.lat || !restaurant.lng) return null;

          // 마커 생성
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(
              restaurant.lat,
              restaurant.lng
            ),
            map: mapInstance,
            title: restaurant.title,
            zIndex: 1000,
            icon: {
              content: `
              <div style="
                background: #ff4444;
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: bold;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                min-width: 20px;
                text-align: center;
                z-index: 1001;
              ">
                ${index + 1}
              </div>
            `,
              size: new window.naver.maps.Size(30, 30),
              anchor: new window.naver.maps.Point(15, 15),
            },
          });

          // 마커 클릭 이벤트
          window.naver.maps.Event.addListener(marker, "click", () => {
            handleRestaurantSelect(restaurant);
          });

          // 인포윈도우 생성
          const infoWindow = new window.naver.maps.InfoWindow({
            content: `
            <div style="padding: 10px; min-width: 200px;">
              <h4 style="margin: 0 0 5px 0; color: #333;">${
                restaurant.title
              }</h4>
              <p style="margin: 0; font-size: 12px; color: #666;">${
                restaurant.address
              }</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">
                ${
                  restaurant.distance
                    ? `📍 ${
                        restaurant.distance < 1000
                          ? `${Math.round(restaurant.distance)}m`
                          : `${(restaurant.distance / 1000).toFixed(1)}km`
                      }`
                    : ""
                }
              </p>
            </div>
          `,
            borderWidth: 0,
            disableAnchor: true,
            backgroundColor: "transparent",
            pixelOffset: new window.naver.maps.Point(0, -10),
          });

          // 마커 호버 이벤트
          window.naver.maps.Event.addListener(marker, "mouseover", () => {
            infoWindow.open(mapInstance, marker);
          });

          window.naver.maps.Event.addListener(marker, "mouseout", () => {
            infoWindow.close();
          });

          return marker;
        })
        .filter(Boolean);

      setSearchMarkers(newMarkers);
      console.log(newMarkers);
      console.log(`🗺️ ${newMarkers.length}개의 마커 생성 완료`);
    },
    [mapInstance, clearSearchMarkers]
  );

  // 검색 결과 업데이트 핸들러
  const handleSearchResults = useCallback(
    (restaurants: Restaurant[]) => {
      setSearchResults(restaurants);
      createSearchMarkers(restaurants);

      // 검색 결과를 모두 보여주는 지도 범위 설정
      if (mapInstance && restaurants.length > 0) {
        const bounds = new window.naver.maps.LatLngBounds();

        restaurants.forEach((restaurant) => {
          if (restaurant.lat && restaurant.lng) {
            bounds.extend(
              new window.naver.maps.LatLng(restaurant.lat, restaurant.lng)
            );
          }
        });

        // 현재 위치도 포함
        if (mapCenter) {
          bounds.extend(
            new window.naver.maps.LatLng(mapCenter.lat, mapCenter.lng)
          );
        }

        // 여백을 두고 지도 범위 조정
        mapInstance.fitBounds(bounds, {
          top: 100,
          right: 50,
          bottom: 200,
          left: 400, // 검색 패널 공간 확보
        });
      }
    },
    [mapInstance, mapCenter, createSearchMarkers]
  );

  // 음식점 선택 핸들러
  const handleRestaurantSelect = useCallback(
    (restaurant: Restaurant) => {
      setSelectedRestaurant(restaurant);
      console.log("🎯 선택된 음식점:", restaurant);

      // 선택된 음식점으로 지도 이동
      if (mapInstance && restaurant.lat && restaurant.lng) {
        const newCenter = new window.naver.maps.LatLng(
          restaurant.lat,
          restaurant.lng
        );
        mapInstance.setCenter(newCenter);
        mapInstance.setZoom(18);
      }
    },
    [mapInstance]
  );

  return (
    <div className="w-full h-full">
      {/* 지도 컴포넌트 */}
      <LocationMap
        width="100%"
        height="100%"
        zoom={13}
        onCenterChange={handleMapCenterChange}
        onMapReady={handleMapReady}
        autoGetLocation={true}
      />

      {/* 검색 패널 */}
      <div className="absolute top-4 left-4 w-80 z-10 bg-white">
        <MapSearch
          currentLocation={mapCenter}
          onRestaurantSelect={handleRestaurantSelect}
          onSearchResults={handleSearchResults}
        />
      </div>

      {/* 지도 정보 표시 */}
      {mapCenter && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-10">
          <h3 className="font-semibold text-sm mb-2">지도 정보</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              중심: {mapCenter.lat.toFixed(6)}, {mapCenter.lng.toFixed(6)}
            </p>
            {selectedRestaurant && (
              <p className="text-blue-600">선택: {selectedRestaurant.title}</p>
            )}
            <p className="text-green-600">검색결과: {searchResults.length}개</p>
          </div>
        </div>
      )}

      {/* 선택된 음식점 정보 패널 */}
      {selectedRestaurant && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">
                {selectedRestaurant.title}
              </h3>
              <p className="text-gray-600 mb-2">{selectedRestaurant.address}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {selectedRestaurant.category}
                </span>
                {selectedRestaurant.telephone && (
                  <a
                    href={`tel:${selectedRestaurant.telephone}`}
                    className="text-green-600 hover:text-green-800"
                  >
                    📞 {selectedRestaurant.telephone}
                  </a>
                )}
                {selectedRestaurant.distance && (
                  <span className="text-gray-500">
                    📍{" "}
                    {selectedRestaurant.distance < 1000
                      ? `${Math.round(selectedRestaurant.distance)}m`
                      : `${(selectedRestaurant.distance / 1000).toFixed(1)}km`}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="text-gray-400 hover:text-gray-600 text-xl ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
