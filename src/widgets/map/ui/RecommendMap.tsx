"use client";

import useGetInfinityRecommendMap from "@/entities/map/queries/useGetInfinityRecommendMap";
import { useMapURL } from "@/features/map/hooks";
import RecommendMapThumbnail from "@/features/map/ui/RecommendMapThumbnail";
import { useDragSheet } from "@/shared/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface Props {
  center: {
    lat: number;
    lng: number;
  } | null;
}

const RecommendMap = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const router = useRouter();

  const { getPlaceIdFromURL } = useMapURL();

  useEffect(() => {
    if (getPlaceIdFromURL()) {
      setIsOpen(false);
    }
  }, []);

  const { isDragging, currentHeight, isExpanded, setIsExpanded } = useDragSheet(
    {
      canDrag: false,
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

  const handleStageClick = () => {
    if (!isOpen && !isExpanded) {
      setIsOpen(true);
      setIsExpanded(false);
    } else if (isOpen && !isExpanded) {
      setIsExpanded(true);
    } else {
      setIsOpen(false);
      setIsExpanded(false);
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfinityRecommendMap({
      limit: 10,
      userMapx: props.center?.lat || 37.5665,
      userMapy: props.center?.lng || 126.978,
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
        ${isOpen ? "translate-y-0" : "translate-y-12/13"}
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
        className="w-full flex justify-center py-2 select-none cursor-pointer hover:bg-gray-100"
        onClick={handleStageClick}
        style={{ touchAction: "none" }}
      >
        <div
          className={
            "w-12 text-[0.75rem] rounded-full bg-brand-primary-600 flex justify-center items-center"
          }
        >
          <span>{isExpanded ? "▼" : "▲"}</span>
        </div>
      </div>

      {isOpen ? (
        <div
          className={`flex flex-col h-full py-5 gap-5 cursor-grab active:cursor-grabbing ${
            isExpanded ? "overflow-auto" : "overflow-hidden"
          }`}
        >
          <h2 className="text-xl font-semibold px-5">추천 지도</h2>
          <div
            onPointerDown={(e) => e.stopPropagation()} // 드래그 방지
          >
            {recommendData.map((content) => (
              <RecommendMapThumbnail
                key={content.tasteMapId}
                mapId={content.tasteMapId}
                title={content.title}
                mapImg={content.tasteMapThumbnails}
                nickname={content.nickname}
                profileImg={content.avatarThumbnail.presignedUrl}
                score={content.gourmetScore}
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/home?mapId=${content.tasteMapId}&zoom=16`);
                }}
              />
            ))}
          </div>
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
      ) : null}
    </section>
  );
};

export default RecommendMap;
