"use client";

import { KakaoResponse } from "@/entities/map/model";
import { PlaceThumbnail } from "@/entities/review/model";
import { isSuccessResponse } from "@/shared/lib";
import { usePlaceStore, useReviewStore } from "@/shared/stores";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGuestModeStore } from "@/shared/stores";
import { Place } from "@/entities/review/model/review";
import { customToast } from "@/shared/ui/CustomToast";
import {
  useDeleteReview,
  usePatchJjim,
  useTasteMapThumbnail,
} from "@/entities/review/queries";
import { useDragSheet } from "@/shared/hooks";
import { useLoginInfo } from "@/entities/auth/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useMapURL } from "@/features/map/hooks";

interface Props {
  place: KakaoResponse | null;
  setPlace: React.Dispatch<React.SetStateAction<KakaoResponse | null>>;
}

const PlaceInfo = ({ place, setPlace }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [placeData, setPlaceData] = useState<PlaceThumbnail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isGuestMode = useGuestModeStore((state) => state.isGuestMode);
  const setSelectedPlace = usePlaceStore((state) => state.setSelectedPlace);
  const setReviewData = useReviewStore((state) => state.setReviewData);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { getPlaceIdFromURL, updateURL } = useMapURL();

  // 유저 정보
  const { userInfo, isLoading } = useLoginInfo();

  // 비율 기반 드래그 훅 사용
  const { isDragging, currentHeight, setIsExpanded, handlePointerDown } =
    useDragSheet(
      {
        canDrag: !!placeData?.review,
        baseHeightRatio: placeData?.review ? 0.5 : 0.35,
        expandedHeightRatio: 0.75,
        minHeightRatio: 0.3,
        maxHeightRatio: 0.9,
        dragSensitivity: 0.7,
        thresholds: {
          expand: 50,
          collapse: -50,
          close: -100,
        },
        allowCloseWhenNoDrag: true,
      },
      () => {
        if (place && place.id) {
          const prevElement = document.querySelector(
            `#nm-marker-${place.id} .nm-marker-shape`
          );
          prevElement?.classList.remove("active");
        }

        setIsOpen(false);
        setPlace(null);
        updateURL({ placeId: null });
      }
    );

  // 장소 리뷰 썸네일 불러오기

  const placeId = getPlaceIdFromURL() ?? place?.id;
  const { data, error: thumbnailError } = useTasteMapThumbnail({ id: placeId });

  useEffect(() => {
    if (!isGuestMode && !isLoading && !userInfo) {
      router.push("/login");
    }
  }, [isLoading, isGuestMode, userInfo, router]);

  useEffect(() => {
    if (data) {
      if (isSuccessResponse(data)) {
        setPlaceData(data.data);
        setError(null);
      }
    } else if (thumbnailError) {
      if (thumbnailError.status != 404) {
        setPlaceData(null);
        setError("리뷰 데이터 불러오기에 실패했습니다.");
      } else {
        setPlaceData(null);
        setError(null);
      }
    }
  }, [data, thumbnailError]);

  useEffect(() => {
    if (!placeId || (!place && !placeData)) {
      // 둘 다 없으면 닫음
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    setIsExpanded(false);
  }, [placeId, placeData, place, setIsExpanded, setIsOpen]);

  const handleWriteReview = () => {
    if (isGuestMode) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!place && !placeData) {
      customToast.error("장소 데이터 누락");
      return;
    }

    let placeDataForReview = null;

    if (place && !placeData) {
      placeDataForReview = place;
    } else if (!place && placeData) {
      placeDataForReview = {
        id: String(placeData.placeId),
        place_name: placeData.title,
        category_group_name: placeData.category,
        address_name: placeData.address,
        road_address_name: placeData.roadAddress,
        phone: placeData.telePhone,
        place_url: placeData.placeUrl,
        x: placeData.mapx,
        y: placeData.mapy,
        distance: placeData.distance,
      };
    }

    if (!placeDataForReview) {
      return;
    }

    setSelectedPlace(placeDataForReview);
    router.push(`/review/write/${place?.id || placeData?.placeId}`);
  };

  const deleteReviewMutation = useDeleteReview({ id: place?.id });
  const patchJjimMutation = usePatchJjim();

  // 리뷰 삭제 handler
  const handleDeleteReview = () => {
    if (!placeData?.review?.reviewId) return;
    deleteReviewMutation.mutate({ reviewId: placeData.review.reviewId });
  };

  // 찜 등록 handler
  const handlePatchJjim = () => {
    if (!place) {
      customToast.error("장소 정보가 없습니다.");
      return;
    }

    const isJjim = placeData?.jjim;

    const jjimPlaceData: Place = {
      placeId: place.id,
      title: place.place_name,
      address: place.address_name ?? "",
      roadAddress: place.road_address_name,
      category: place.category_name ?? "",
      telePhone: place.phone ?? "",
      placeUrl: place.place_url,
      mapx: place.x,
      mapy: place.y,
    };

    patchJjimMutation.mutate(
      {
        tasteMapId: userInfo?.defaultTasteMapId,
        placeId: place.id,
        data: { jjim: !isJjim, place: jjimPlaceData },
      },
      {
        onSuccess: (response) => {
          if (isSuccessResponse(response)) {
            queryClient.invalidateQueries({
              queryKey: ["taste-map-thumbnail", place.id, userInfo?.userId],
            });
            customToast.success(
              isJjim ? "찜 해제되었습니다" : "찜 등록되었습니다"
            );
          } else {
            customToast.error("찜 실패");
          }
        },
        onError: (error) => {
          customToast.error(error.message);
        },
      }
    );
  };

  if (!isOpen && !place && !placeData) {
    return null;
  }

  return (
    <div
      className={`
        absolute w-full bottom-0 bg-white shadow-lg border-t h-full rounded-t-2xl overflow-hidden border-gray-200 z-[800]
        ${isOpen ? "translate-y-0" : "translate-y-full"}
        ${isDragging ? "" : "transition-all duration-300 ease-out"}
        ${!isOpen ? "pointer-events-none" : ""}
      `}
      style={{
        height: `${currentHeight}px`,
      }}
    >
      {/* 상단 핸들 - 드래그 영역 */}
      <div
        className="w-full flex justify-center py-2 select-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        style={{ touchAction: "none" }}
      >
        <div className={"w-12 h-1 rounded-full bg-gray-400"}></div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* 기본 정보 영역 - 드래그 가능 */}
        <div
          className="px-6 pt-6 pb-4 flex-shrink-0 cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          style={{ touchAction: "none" }}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2 flex-1">
              {/* 헤더 */}
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-semibold text-gray-900 flex-1">
                  {place?.place_name || placeData?.title}
                </h3>
              </div>

              {/* 정보 리스트 */}
              <div className="flex flex-col gap-2">
                {place?.category_group_name ? (
                  <span className="text-gray-400">
                    {place.category_group_name}
                  </span>
                ) : (
                  placeData?.category && (
                    <span className="text-gray-400">{placeData?.category}</span>
                  )
                )}
                <div className="flex gap-2">
                  {place?.distance ? (
                    <span className="text-sm text-black font-semibold">
                      {(place.distance / 1000).toFixed(2)}km
                    </span>
                  ) : (
                    placeData?.distance && (
                      <span className="text-sm text-black font-semibold">
                        {(placeData?.distance / 1000).toFixed(2)}km
                      </span>
                    )
                  )}

                  {place?.road_address_name ? (
                    <span className="text-sm text-gray-600 flex-1">
                      {place.road_address_name}
                    </span>
                  ) : (
                    placeData?.roadAddress && (
                      <span className="text-sm text-gray-600 flex-1">
                        {placeData.roadAddress}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* 우측 버튼 영역 - 클릭 전용 */}
            <div
              className="flex flex-col gap-2 items-center ml-4 cursor-auto"
              onPointerDown={(e) => e.stopPropagation()} // 드래그 방지
            >
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
                    {/* 배경 오버레이 */}
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

                          if (!placeData?.review || (!place && !placeData)) {
                            customToast.error(
                              "리뷰 혹은 장소 정보가 없습니다."
                            );
                            console.log(placeData);
                            return;
                          }

                          let placeReviewData = null;

                          if (place) {
                            placeReviewData = {
                              placeName: place?.place_name,
                              placeGroupName: place?.category_group_name,
                              placeAddressName: place?.road_address_name,
                              ...placeData.review,
                            };
                          } else if (!place && placeData) {
                            placeReviewData = {
                              placeName: placeData.title,
                              placeGroupName: placeData.category,
                              placeAddressName: placeData.roadAddress,
                              ...placeData.review,
                            };
                          }

                          if (!placeReviewData) return;

                          setReviewData(placeReviewData);
                          setShowMoreMenu(false);
                          router.push(
                            `/review/modify/${place?.id || placeData.placeId}`
                          );
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg disabled:hover:bg-transparent disabled:text-gray-400"
                        disabled={
                          isGuestMode ||
                          !placeData?.review ||
                          (!place && !placeData)
                        }
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
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 rounded-b-lg disabled:hover:bg-transparent disabled:text-gray-400"
                        disabled={isGuestMode || !placeData?.review || !place}
                      >
                        삭제하기
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handlePatchJjim}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 cursor-pointer flex flex-col items-center"
              >
                {placeData ? (
                  placeData.jjim ? (
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
                  )
                ) : (
                  <Image
                    src={"/icons/non_fill_star.svg"}
                    alt="찜"
                    width={28}
                    height={28}
                  />
                )}
                <span className="text-xs font-medium">찜</span>
              </button>
            </div>
          </div>
        </div>

        {/* 스크롤 콘텐츠 영역 - 스크롤 전용 */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6 cursor-auto"
          onPointerDown={(e) => e.stopPropagation()} // 드래그 방지
        >
          {error ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400 font-semibold">{error}</span>
            </div>
          ) : placeData?.review ? (
            <div className="w-full flex flex-col gap-3 pb-4">
              {/* 추천 메뉴 */}
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

              {/* 사진 갤러리 */}
              <div className="flex gap-2">
                {placeData.review.reviewPhotoList.map((item, index) => {
                  if (index > 2) return null;

                  if (
                    index === 2 &&
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
                            +{placeData.review.reviewPhotoList.length - 2}
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

              {/* 리뷰 내용 */}
              <p className="p-2 whitespace-pre-wrap">
                {placeData.review.reviewContent}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              {/* 후기 등록 버튼 - 클릭 전용 */}
              <div
                className="w-full cursor-auto"
                onPointerDown={(e) => e.stopPropagation()} // 드래그 방지
              >
                <button
                  onClick={handleWriteReview}
                  className="w-full bg-brand-primary-600 text-white py-3 rounded-full cursor-pointer"
                >
                  후기 등록하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceInfo;
