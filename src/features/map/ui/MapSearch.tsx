"use client";

import { Input } from "@/shared/ui/Input";
import { useRestaurantSearch } from "../hooks";
import { Restaurant } from "@/entities/map/model";
import { useEffect, useRef } from "react";

interface MapSearchProps {
  currentLocation: { lat: number; lng: number } | null;
  onRestaurantSelect: (restaurant: Restaurant) => void;
  onSearchResults?: (restaurants: Restaurant[]) => void; // 이미 있음
}

const MapSearch = ({
  currentLocation,
  onRestaurantSelect,
  onSearchResults,
}: MapSearchProps) => {
  if (!currentLocation) {
    currentLocation = { lat: 37.5665, lng: 126.978 };
  }

  const {
    search,
    setSearch,
    isLoading,
    list,
    error,
    isFetching,
    clearResults,
    hasLocation,
  } = useRestaurantSearch({ currentLocation });

  // 이전 list 참조를 저장하여 중복 호출 방지
  const prevListRef = useRef<Restaurant[]>([]);

  // 🎯 list가 실제로 변경되었을 때만 부모에게 알림
  useEffect(() => {
    if (onSearchResults && list.length > 0 && list !== prevListRef.current) {
      prevListRef.current = list;
      onSearchResults(list);
    }
  }, [list]); // onSearchResults 제거

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    console.log("🎯 선택된 음식점:", restaurant);
    onRestaurantSelect(restaurant);
  };

  return (
    <div className="relative">
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="map-search" className="sr-only">
          음식점 검색
        </label>
        <div className="relative">
          <Input
            type="text"
            id="map-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              hasLocation
                ? "음식점명 검색 (가까운 순으로 정렬)"
                : "음식점명 또는 지역명 입력"
            }
            className="w-full pr-20"
          />

          {/* 로딩 인디케이터 */}
          {(isLoading || isFetching) && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* 클리어 버튼 */}
          {search && (
            <button
              type="button"
              onClick={clearResults}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          )}
        </div>

        {/* 현재 위치 상태 표시 */}
        {search && (
          <div className="text-xs text-gray-500 mt-1">
            {hasLocation
              ? `📍 "${search}" 검색결과를 가까운 순으로 정렬합니다`
              : `🔍 "${search}" 검색결과`}
          </div>
        )}

        {/* 위치 없음 안내 */}
        {!hasLocation && (
          <div className="text-xs text-amber-600 mt-1">
            ⚠️ 위치 권한을 허용하면 가까운 순으로 정렬됩니다
          </div>
        )}
      </form>

      {/* 검색 결과 렌더링 할 곳 */}
      <div className="mt-2">
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        )}

        {/* 검색 결과 */}
        {list.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-gray-100">
              <div className="text-sm text-gray-600">
                &quot;{search}&quot; 검색결과 {list.length}개 음식점
                {hasLocation && (
                  <span className="text-blue-600"> (가까운 순)</span>
                )}
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {list.map((restaurant) => (
                <button
                  key={restaurant.id}
                  onClick={() => handleRestaurantSelect(restaurant)}
                  className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {restaurant.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {restaurant.address}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600">
                          {restaurant.category}
                        </span>
                        {restaurant.telephone && (
                          <span className="text-xs text-gray-500">
                            {restaurant.telephone}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* 거리 표시 (현재 위치가 있을 때만) */}
                    {hasLocation && restaurant.distance && (
                      <div className="ml-2 text-xs text-gray-400">
                        {restaurant.distance < 1000
                          ? `${Math.round(restaurant.distance)}m`
                          : `${(restaurant.distance / 1000).toFixed(1)}km`}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 검색 결과 없음 */}
        {search && !isLoading && !isFetching && list.length === 0 && !error && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-gray-500">
              &quot;{search}&quot; 에 대한 음식점을 찾을 수 없습니다
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSearch;
