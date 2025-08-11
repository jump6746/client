"use client";

import useGetInfinityRecommendMap from "@/entities/map/queries/useGetInfinityRecommendMap";
import { useGeolocation, useMapURL } from "@/features/map/hooks";
import RecommendMapThumbnail from "@/features/map/ui/RecommendMapThumbnail";
import { useDragSheet } from "@/shared/hooks";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const RecommendMap = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const { getPlaceIdFromURL } = useMapURL();

  useEffect(() => {
    if (getPlaceIdFromURL()) {
      setIsOpen(false);
    }
  }, []);

  const {
    isDragging,
    currentHeight,
    isExpanded,
    setIsExpanded,
    handlePointerDown,
  } = useDragSheet(
    {
      canDrag: true,
      baseHeightRatio: 0.5,
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
      setIsOpen(false);
      setIsExpanded(false);
    }
  );

  const { currentLocation } = useGeolocation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfinityRecommendMap({
      limit: 10,
      userMapx: currentLocation?.lat ?? 37.5665,
      userMapy: currentLocation?.lng ?? 126.9779,
    });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const recommendData = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <section
      className={`absolute w-full bottom-0 bg-white rounded-t-2xl overflow-hidden border-gray-200 z-[780]
        ${isOpen ? "translate-y-0" : "translate-y-14/15"}
        ${isDragging ? "" : "transition-transform duration-300 ease-out"}
      `}
      style={{
        height: `${currentHeight}px`,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {/* 상단 핸들 - 드래그 영역 */}
      <div
        className="w-full flex justify-center py-2 select-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onClick={
          !isOpen
            ? () => {
                setIsOpen(true);
              }
            : undefined
        }
        style={{ touchAction: "none" }}
      >
        <div className={"w-12 h-1 rounded-full bg-brand-primary-600"}></div>
      </div>

      <div
        className={`flex flex-col h-full py-5 gap-5 ${
          isExpanded ? "overflow-auto" : "overflow-hidden"
        }`}
      >
        <h2 className="text-xl font-semibold px-5">추천 지도</h2>
        {recommendData.map((content) => (
          <RecommendMapThumbnail
            key={content.tasteMapId}
            mapId={content.tasteMapId}
            title={content.title}
            mapImg={content.tasteMapThumbnails}
            nickname={content.nickname}
            profileImg={content.avatarThumbnail.presignedUrl}
            score={content.gourmetScore}
          />
        ))}
        {/* 무한 스크롤 트리거 & 로딩 상태 */}
        {hasNextPage && (
          <div ref={ref} className="py-8 text-center">
            {isFetchingNextPage ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>더 많은 추천 지도를 불러오는 중...</span>
              </div>
            ) : (
              <div className="text-gray-500">스크롤해서 더 보기</div>
            )}
          </div>
        )}

        {/* 더 이상 데이터가 없을 때 */}
        {!hasNextPage && recommendData.length > 0 && (
          <div className="text-center py-8 text-gray-500 border-t-2 border-gray-400">
            모든 추천 지도를 불러왔습니다
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {!hasNextPage && recommendData.length === 0 && (
          <div className="py-8 h-full flex items-center justify-center">
            <p className="text-gray-500">{`추천 지도가 없습니다`}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendMap;
