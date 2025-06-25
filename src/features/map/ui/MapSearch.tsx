"use client";

import { Input } from "@/shared/ui/Input";
import { KakaoPlace } from "@/entities/map/model";
import { usePlaceSearch } from "../hooks";
import Image from "next/image";

interface MapSearchProps {
  currentLocation: { lat: number; lng: number } | null;
  onPlaceSelect: (place: KakaoPlace) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapSearch = ({
  currentLocation,
  onPlaceSelect,
  setIsOpen,
}: MapSearchProps) => {
  const { search, setSearch, places, error } = usePlaceSearch({
    currentLocation: currentLocation || undefined,
  });

  const handlePlaceSelect = (place: KakaoPlace) => {
    console.log("장소 선택: ", place);
    onPlaceSelect(place);
    setSearch(""); // 선택 후 검색어 초기화
    setIsOpen(false);
  };

  return (
    <div className="relative bg-white h-full flex flex-col px-4 py-4">
      <form
        onSubmit={(e) => e.preventDefault()}
        className=" rounded-lg py-2 shadow"
      >
        <label htmlFor="map-search" className="sr-only">
          장소 검색
        </label>
        <div className="flex gap-3 px-3 items-center">
          <button
            className="cursor-pointer"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <Image
              src="/icons/arrow.svg"
              alt="뒤로 돌아가기"
              width={24}
              height={24}
            />
          </button>
          <Input
            type="text"
            id="map-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="음식점, 메뉴, 장소 검색"
            className="w-full py-2 font-medium"
          />
        </div>
      </form>
      {/* 검색 결과 */}
      <div className="mt-2 flex-1 overflow-auto">
        {/* 검색 결과 목록 (스타일은 수정 필요)*/}
        {places.length > 0 && (
          <div className="bg-white h-full">
            <div className="divide-y-2 divide-gray-200">
              {places.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handlePlaceSelect(place)}
                  className="w-full text-left p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-start w-full px-3 gap-4">
                    <Image
                      src="/icons/location_on.svg"
                      alt="핀"
                      width={24}
                      height={24}
                    />
                    <div className="flex flex-col">
                      <h3 className="text-gray-900 mb-1 text-lg font-medium">
                        {place.place_name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {place.road_address_name || place.address_name}
                      </p>
                    </div>
                    <div className="flex flex-col ml-auto justify-between items-end gap-2">
                      <span className="text-xs text-gray-500">
                        {place.category_name}
                      </span>
                      {/* 거리 표시 */}
                      {currentLocation && place.distance ? (
                        <div className="ml-2 text-xs text-gray-500">
                          {place.distance < 1000
                            ? `${place.distance}m`
                            : `${(place.distance / 1000).toFixed(1)}km`}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">정보없음</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 검색 결과 없음 */}
        {search && places.length === 0 && !error && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-gray-500">
              &quot;{search}&quot; 에 대한 장소를 찾을 수 없습니다
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSearch;
