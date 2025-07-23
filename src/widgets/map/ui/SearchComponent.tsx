"use client";

import { KakaoResponse } from "@/entities/map/model";
import { MapSearch } from "@/features/map/ui";
import Image from "next/image";
import { useState } from "react";

interface Props {
  currentLocation: { lat: number; lng: number } | null;
  onPlaceSelect: (place: KakaoResponse) => void;
}

const SearchComponent = ({ currentLocation, onPlaceSelect }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={`w-full ${
        isOpen ? "h-full" : "px-4 py-4"
      } absolute top-0 left-0 z-[1000] `}
    >
      {isOpen ? (
        <MapSearch
          currentLocation={currentLocation}
          onPlaceSelect={onPlaceSelect}
          setIsOpen={setIsOpen}
        />
      ) : (
        <button
          className="flex bg-white py-4 px-3 rounded-xl shadow gap-3 items-center cursor-pointer w-full"
          aria-label="검색 열기"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Image src="/icons/arrow.svg" alt="돋보기" width={24} height={24} />
          <span className="text-gray-500 font-medium">
            음식점, 메뉴, 장소 검색
          </span>
        </button>
      )}
    </div>
  );
};

export default SearchComponent;
