"use client";

import { Input } from "@/shared/ui/Input";
import { KakaoPlace } from "@/entities/map/model";
import { usePlaceSearch } from "../hooks";

interface MapSearchProps {
  currentLocation: { lat: number; lng: number } | null;
  onPlaceSelect: (place: KakaoPlace) => void;
}

const MapSearch = ({ currentLocation, onPlaceSelect }: MapSearchProps) => {
  const { search, setSearch, places, isLoading, error } = usePlaceSearch({
    currentLocation: currentLocation || undefined,
  });

  const handlePlaceSelect = (place: KakaoPlace) => {
    console.log("장소 선택: ", place);
    onPlaceSelect(place);
    setSearch(""); // 선택 후 검색어 초기화
  };

  return (
    <div className="relative">
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="map-search" className="sr-only">
          장소 검색
        </label>
        <div className="relative">
          <Input
            type="text"
            id="map-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="음식점, 메뉴, 장소 검색"
            className="w-full py-4 font-medium"
          />

          {/* 로딩 인디케이터 */}
          {isLoading && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* 클리어 버튼 */}
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          )}
        </div>
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
        <div className="mt-2">
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {/* 검색 결과 목록 (스타일은 수정 필요)*/}
          {places.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              <div className="divide-y divide-gray-100">
                {places.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handlePlaceSelect(place)}
                    className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {place.place_name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {place.road_address_name || place.address_name}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-600">
                            {place.category_name}
                          </span>
                          {place.phone && (
                            <span className="text-xs text-gray-500">
                              {place.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* 거리 표시 */}
                      {currentLocation && place.distance && (
                        <div className="ml-2 text-xs text-gray-400">
                          {parseInt(place.distance) < 1000
                            ? `${parseInt(place.distance)}m`
                            : `${(parseInt(place.distance) / 1000).toFixed(
                                1
                              )}km`}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 검색 결과 없음 */}
          {search && !isLoading && places.length === 0 && !error && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-gray-500">
                &quot;{search}&quot; 에 대한 장소를 찾을 수 없습니다
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSearch;
