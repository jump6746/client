import { KaokaoResponse } from "@/entities/map/model";
import { usePlaceStore } from "@/shared/stores";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  place: KaokaoResponse | null;
}

const PlaceInfo = ({ place }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const setSelectedPlace = usePlaceStore((state) => state.setSelectedPlace);
  // const [placeData, setPlaceData] = useState<any>(null);

  useEffect(() => {
    if (!place) return;

    if (place != null) {
      setIsOpen(true);
    }

    // const fetchData = async () => {
    //   const data = await getTasteMapThumbnailAPI(place.id);
    //   console.log(data);
    //   setPlaceData(data.data);
    // };

    // fetchData();
  }, [place]);

  // place가 null이고 isOpen이 false면 컴포넌트를 렌더링하지 않음
  if (!place && !isOpen) {
    return null;
  }

  const handleWriteReview = () => {
    if (!place) {
      console.log("데이터 없음");
      return;
    }
    console.log(place);
    setSelectedPlace(place);
    router.push("/review/write");
  };

  return (
    <div
      className={`
        absolute w-full bottom-0 bg-white shadow-lg border-t h-full rounded-t-2xl overflow-hidden border-gray-200
        transition-transform duration-500 ease-in-out
        ${isOpen ? "translate-y-0" : "translate-y-full"}
      `}
      style={{ height: "300px" }} // h-50 대신 고정 높이 사용
    >
      {/* 상단 핸들 */}
      <div className="w-full flex justify-center py-2">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="px-6 pt-6 flex flex-col justify-between h-[240px]">
        {/* 헤더 */}
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-semibold text-gray-900 flex-1">
            {place?.place_name}
          </h3>
          <div>
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
        </div>

        {/* 정보 리스트 */}
        <div className="flex flex-col gap-2">
          {place?.category_group_name && (
            <span className="text-gray-400">{place.category_group_name}</span>
          )}
          <div className="flex gap-2">
            {place?.distance && (
              <span className="text-sm text-black font-semibold">
                {(place.distance / 1000).toFixed(2)}km
              </span>
            )}

            {place?.address_name && (
              <span className="text-sm text-gray-600 flex-1">
                {place.address_name}
              </span>
            )}
          </div>

          {/* {place?.id && (
            <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
              ID: {place.id}
            </div>
          )} */}
        </div>
        <button
          onClick={handleWriteReview}
          className="w-full bg-brand-primary-600 text-white py-3 rounded-full mt-auto cursor-pointer"
        >
          후기 등록하기
        </button>
      </div>
    </div>
  );
};

export default PlaceInfo;
