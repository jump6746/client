import { KakaoPlace } from "@/entities/map/model";
import { useEffect, useState } from "react";

interface Props {
  place: KakaoPlace | null;
}

const PlaceInfo = ({ place }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (place != null) {
      setIsOpen(true);
    }
  }, [place]);

  // place가 null이고 isOpen이 false면 컴포넌트를 렌더링하지 않음
  if (!place && !isOpen) {
    return null;
  }

  return (
    <div
      className={`
        absolute w-full bottom-0 bg-white shadow-lg border-t border-gray-200
        transition-transform duration-500 ease-in-out
        ${isOpen ? "translate-y-0" : "translate-y-full"}
      `}
      style={{ height: "200px" }} // h-50 대신 고정 높이 사용
    >
      {/* 상단 핸들 */}
      <div className="w-full flex justify-center py-2 bg-gray-50">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-4 space-y-3">
        {/* 헤더 */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4">
            {place?.place_name}
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 정보 리스트 */}
        <div className="space-y-2">
          {place?.category_name && (
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {place.category_name}
              </span>
            </div>
          )}

          {place?.address_name && (
            <div className="flex items-start space-x-2">
              <svg
                className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-600 flex-1">
                {place.address_name}
              </span>
            </div>
          )}

          {place?.distance && (
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span className="text-sm text-gray-600">
                거리: {place.distance}m
              </span>
            </div>
          )}

          {place?.id && (
            <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
              ID: {place.id}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceInfo;
