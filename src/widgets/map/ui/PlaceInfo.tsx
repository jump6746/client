"use client";

import { KaokaoResponse } from "@/entities/map/model";
import { getTasteMapThumbnailAPI } from "@/entities/review/api";
import { PlaceThumbnail } from "@/entities/review/model";
import { useReview } from "@/features/review/hooks";
import { isSuccessResponse } from "@/shared/lib";
import { usePlaceStore, useReviewStore } from "@/shared/stores";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import useGuestModeStore from "@/shared/stores/useGuestModeStore";
import { PlaceReivewData } from "@/entities/review/model/review";
import { customToast } from "@/shared/ui/CustomToast";

interface Props {
  place: KaokaoResponse | null;
}

const PlaceInfo = ({ place }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  // 드래그 기능을 위한 state 추가
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  // useRef로 드래그 상태 추적 (state 업데이트 지연 문제 해결)
  const dragState = useRef({
    isDragging: false,
    startY: 0,
    currentOffset: 0,
  });

  const isGuestMode = useGuestModeStore((state) => state.isGuestMode);
  const [placeData, setPlaceData] = useState<PlaceThumbnail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setSelectedPlace = usePlaceStore((state) => state.setSelectedPlace);
  const setReviewData = useReviewStore((state) => state.setReviewData);
  const { handleDeleteReview } = useReview({
    reviewId: placeData?.review?.reviewId,
  });

  // 높이 계산 - 드래그 중일 때는 실시간 반영
  const baseHeight = placeData?.review ? (isExpanded ? 750 : 450) : 300;
  const currentHeight = isDragging
    ? Math.max(300, Math.min(800, baseHeight + dragOffset * 0.7))
    : baseHeight;
  const canDrag = !!placeData?.review;

  useEffect(() => {
    if (!place) return;

    if (place != null) {
      setIsOpen(true);
      setIsExpanded(false); // 항상 450px로 시작
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

  // 드래그 시작
  const startDrag = (clientY: number) => {
    if (!canDrag) return;

    console.log("Starting drag at:", clientY);
    dragState.current = {
      isDragging: true,
      startY: clientY,
      currentOffset: 0,
    };
    setIsDragging(true);
    setDragOffset(0);
  };

  // 드래그 중
  const updateDrag = (clientY: number) => {
    if (!dragState.current.isDragging || !canDrag) return;

    const deltaY = dragState.current.startY - clientY;
    dragState.current.currentOffset = deltaY;
    setDragOffset(deltaY);
  };

  // 드래그 종료
  const endDrag = (clientY: number) => {
    if (!dragState.current.isDragging || !canDrag) return;

    console.log("Ending drag");
    const deltaY = dragState.current.startY - clientY;

    // 상태 리셋
    dragState.current.isDragging = false;
    setIsDragging(false);
    setDragOffset(0);

    // 30px 이상 드래그하면 상태 변경
    if (deltaY > 50) {
      setIsExpanded(true);
    } else if (deltaY < -50 && deltaY >= -100) {
      setIsExpanded(false);
    } else if (deltaY < -100) {
      setIsOpen(false);
    }
  };

  // 통합 이벤트 핸들러
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientY);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updateDrag(moveEvent.clientY);
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      endDrag(upEvent.clientY);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  // place가 null이고 isOpen이 false면 컴포넌트를 렌더링하지 않음
  if (!place && !isOpen) {
    return null;
  }

  const handleWriteReview = () => {
    if (isGuestMode) {
      alert("로그인이 필요합니다.");
      return;
    }

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
        ${isOpen ? "translate-y-0" : "translate-y-full"}
        ${isDragging ? "" : "transition-all duration-300 ease-out"}
      `}
      style={{ height: `${currentHeight}px` }}
    >
      {/* 상단 핸들 - 드래그 영역 */}
      <div
        className={`w-full flex justify-center py-2 select-none ${
          canDrag ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        onPointerDown={handlePointerDown}
        style={{ touchAction: "none" }}
      >
        <div
          className={`w-12 h-1 rounded-full ${
            canDrag ? "bg-gray-400" : "bg-gray-300"
          }`}
        ></div>
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

                {place?.road_address_name && (
                  <span className="text-sm text-gray-600 flex-1">
                    {place.road_address_name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
              >
                <Image
                  src="/icons/more_circle.svg"
                  alt="더보기"
                  width={26}
                  height={9}
                />
              </button>

              {/* 드롭다운 메뉴 */}
              {showMoreMenu && (
                <>
                  {/* 배경 오버레이 (클릭시 닫기) */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMoreMenu(false)}
                  />

                  {/* 메뉴 */}
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                    <button
                      onClick={() => {
                        if (isGuestMode) {
                          customToast.error("로그인이 필요합니다.");
                          return;
                        }

                        if (!placeData?.review || !place) return;

                        const data: PlaceReivewData = {
                          placeName: place?.place_name,
                          placeGroupName: place?.category_group_name,
                          placeAddressName: place?.road_address_name,
                          ...placeData.review,
                        };

                        setReviewData(data);

                        setShowMoreMenu(false);
                        router.push(
                          `/review/modify/${placeData?.review?.reviewId}`
                        );
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
                    >
                      수정하기
                    </button>
                    <button
                      onClick={() => {
                        if (isGuestMode) {
                          alert("로그인이 필요합니다.");
                          return;
                        }
                        setShowMoreMenu(false);
                        handleDeleteReview();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 rounded-b-lg"
                    >
                      삭제하기
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => {
                if (isGuestMode) {
                  alert("로그인이 필요합니다.");
                  return;
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 cursor-pointer flex flex-col"
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
              <span className="text-xs font-medium">찜</span>
            </button>
          </div>
        </div>
        <div className="flex flex-1 w-full items-center justify-center py-3">
          {error ? (
            <span className="text-gray-400 font-semibold">{error}</span>
          ) : placeData?.review ? (
            <div className="w-full flex flex-col gap-3">
              <div className="w-full flex gap-2">
                {placeData.review.recommendedMenuList.map((item) => (
                  <div
                    key={item.recommendedMenuId}
                    className="px-2 rounded-full py-1 text-xs shadow-md flex gap-1"
                  >
                    <span>{item.recommendedMenuName}</span>
                    <Image
                      src="/icons/heart.svg"
                      alt="하트"
                      width={13}
                      height={11}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {placeData.review.reviewPhotoList.map((item, index) => {
                  if (index > 2) return;

                  if (
                    index == 2 &&
                    placeData.review &&
                    placeData.review.reviewPhotoList.length > 3
                  ) {
                    return (
                      <div
                        key={item.reviewPhotoId}
                        className="w-25 h-25 overflow-hidden rounded-2xl relative"
                      >
                        <Image
                          src={item.reviewPhotoUrl.replace(/&amp;/g, "&")}
                          alt={item.reviewPhotoCaption ?? "음식"}
                          width={100}
                          height={100}
                          unoptimized={true}
                          className="object-cover w-full h-full"
                        />
                        <div className="flex absolute items-center justify-center w-25 h-25 bg-black/50 top-0">
                          <span className="text-white">
                            +{placeData.review.reviewPhotoList.length - 3}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.reviewPhotoId}
                      className="w-25 h-25 overflow-hidden rounded-2xl"
                    >
                      <Image
                        src={item.reviewPhotoUrl.replace(/&amp;/g, "&")}
                        alt={item.reviewPhotoCaption ?? "음식"}
                        width={100}
                        height={100}
                        unoptimized={true}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  );
                })}
              </div>
              <p className="p-2">{placeData.review.reviewContent}</p>
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
