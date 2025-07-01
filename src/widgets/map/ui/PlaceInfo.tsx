import { KaokaoResponse } from "@/entities/map/model";
import { getTasteMapThumbnailAPI } from "@/entities/review/api";
import { PlaceThumbnail } from "@/entities/review/model";
import { isSuccessResponse } from "@/shared/lib";
import { usePlaceStore } from "@/shared/stores";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  place: KaokaoResponse | null;
}

const PlaceInfo = ({ place }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const setSelectedPlace = usePlaceStore((state) => state.setSelectedPlace);
  const [placeData, setPlaceData] = useState<PlaceThumbnail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!place) return;

    if (place != null) {
      setIsOpen(true);
    }

    const fetchData = async () => {
      const userId = localStorage.getItem("userId");

      const data = await getTasteMapThumbnailAPI({ id: place.id, userId });
      console.log(data);
      if (isSuccessResponse(data)) {
        setPlaceData(data.data);
      } else {
        setError("리뷰 관련 데이터를 불러오지 못했습니다.");
      }
    };

    fetchData();
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
      style={{ height: "600px" }}
    >
      {/* 상단 핸들 */}
      <div className="w-full flex justify-center py-2">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>
      {/* 컨텐츠 영역 */}
      <div className="px-6 pt-6 flex flex-col justify-between h-[240px]">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {/* 헤더 */}
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-semibold text-gray-900 flex-1">
                {place?.place_name}
              </h3>
            </div>

            {/* 정보 리스트 */}
            <div className="flex flex-col gap-2">
              {place?.category_group_name && (
                <span className="text-gray-400">
                  {place.category_group_name}
                </span>
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
            </div>
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => {}}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
            >
              <Image
                src="/icons/more_circle.svg"
                alt="더보기"
                width={26}
                height={9}
              />
            </button>
            <button
              onClick={() => {}}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
            >
              {placeData &&
                (placeData.jjim ? (
                  <Image
                    src={"/icons/fill_star.svg"}
                    alt="찜"
                    width={28}
                    height={28}
                  />
                ) : (
                  <Image
                    src={"/icons/non_fill_star.svg"}
                    alt="찜"
                    width={28}
                    height={28}
                  />
                ))}
            </button>
          </div>
        </div>
        <div className="flex flex-1 w-full items-center justify-center">
          {error ? (
            <span className="text-gray-400 font-semibold">{error}</span>
          ) : placeData?.review ? (
            <div>
              {placeData.review.recommendedMenuList.map((item) => (
                <div
                  key={item.recommendedMenuId}
                  className="px-2 rounded-full py-1 text-xs"
                >
                  {item.recommendedMenuName}
                </div>
              ))}
              {placeData.review.reviewPhotoList.map((item) => (
                <Image
                  src={item.reviewPhotoUrl.replace(/&amp;/g, "&")}
                  alt={item.reviewPhotoCaption ?? "음식"}
                  key={item.reviewPhotoId}
                  width={100}
                  height={100}
                  unoptimized={true}
                />
              ))}
              <p>{placeData.review.reviewContent}</p>
            </div>
          ) : (
            <button
              onClick={handleWriteReview}
              className="w-full bg-brand-primary-600 text-white py-3 rounded-full mt-auto cursor-pointer"
            >
              후기 등록하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceInfo;
