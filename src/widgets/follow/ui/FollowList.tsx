import { FollowUser } from "@/entities/follow/model";
import useGetInfinityUserReview from "@/entities/follow/queries/useGetInfinityUserReview";
import useGetSubscriptions from "@/entities/follow/queries/useGetSubscriptions";
import { FollowReview } from "@/entities/review/ui";
import { useGeolocation } from "@/features/map/hooks";
import { isSuccessResponse } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/Carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const FollowList = () => {
  const { data: response } = useGetSubscriptions();
  const { currentLocation } = useGeolocation();
  const {
    data: reviewData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfinityUserReview({
    sort: "latest",
    limit: 15,
    userMapx: currentLocation?.lat ?? 37.5665,
    userMapy: currentLocation?.lng ?? 126.9779,
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  const [users, setUsers] = useState<FollowUser[]>([]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!response) return;

    if (isSuccessResponse(response)) {
      setUsers(response.data);
    } else {
    }
  }, [response]);

  const reviewResults = reviewData?.pages.flatMap((page) => page.items) ?? [];

  if (users.length == 0) {
    return (
      <section className="flex flex-col h-full items-center justify-center">
        <span className="text-xl font-semibold">
          아직 구독한 사람이 없어요!
        </span>
        <span className="text-xl font-semibold">
          나랑 취향이 비슷한 유저를 탐색해 보아요.
        </span>
        <Button
          type="button"
          className="bg-brand-primary-600 text-white px-2 py-1 rounded-lg mt-4"
        >
          추천 보러가기
        </Button>
      </section>
    );
  }

  return (
    <div>
      {/* <section className="flex justify-start w-full px-5 gap-3">
        {users.map((item) => {
          return (
            <div
              key={item.targetUserId}
              className="flex flex-col items-center gap-1"
            >
              <Image
                src={item.targetUserImgUrl || "icons/default_profile.svg"}
                alt="프로필"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
              <span className="font-semibold">{item.targetUserNickname}</span>
            </div>
          );
        })}
      </section> */}
      <Carousel>
        <CarouselContent className="pl-5">
          {users.map((item) => {
            return (
              <CarouselItem
                key={item.targetUserId}
                className="flex flex-col items-center gap-1"
              >
                <Image
                  src={item.targetUserImgUrl || "icons/default_profile.svg"}
                  alt="프로필"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <span className="font-semibold">{item.targetUserNickname}</span>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <section className="flex flex-col gap-5">
        {reviewResults.map((item) => (
          <FollowReview key={item.reviewId} data={item} />
        ))}
        {/* 무한 스크롤 트리거 & 로딩 상태 */}
        {hasNextPage && (
          <div ref={ref} className="py-8 text-center">
            {isFetchingNextPage ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>더 많은 리뷰를 불러오는 중...</span>
              </div>
            ) : (
              <div className="text-gray-500">스크롤해서 더 보기</div>
            )}
          </div>
        )}

        {/* 더 이상 데이터가 없을 때 */}
        {!hasNextPage && reviewResults.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            모든 리뷰를 불러왔습니다
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {!hasNextPage && reviewResults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">{`작성된 리뷰가 없습니다`}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default FollowList;
