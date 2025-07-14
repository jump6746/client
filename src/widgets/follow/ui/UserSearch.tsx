import { useLoginInfo } from "@/entities/auth/queries";
import { FollowUser } from "@/entities/follow/model";
import useGetInfinityUserSearch from "@/entities/follow/queries/useGetInfinityUserSearch";
import usePostUserFollow from "@/entities/follow/queries/usePostUserFollow";
import { useDebounce } from "@/shared/hooks";
import { ResponseDTO } from "@/shared/types/api-structure";
import { Button } from "@/shared/ui/Button";
import { customToast } from "@/shared/ui/CustomToast";
import { Input } from "@/shared/ui/Input";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSearch = ({ setIsOpen }: Props) => {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value, 500);
  const queryClient = useQueryClient();
  const { userInfo } = useLoginInfo();

  const isAlreadySubscribed = (userId: number) => {
    const subscriptions: ResponseDTO<FollowUser[]> | undefined =
      queryClient.getQueryData(["subscriptions", userInfo?.userId]);

    // 올바른 체크 방법
    if (
      !subscriptions ||
      !subscriptions.data ||
      !Array.isArray(subscriptions.data)
    ) {
      return false;
    }

    return subscriptions.data.some(
      (sub: FollowUser) => sub.targetUserId === userId
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  const {
    data,
    // isLoading,
    // isError,
    // error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfinityUserSearch({
    keyword: debouncedValue,
    limit: 10,
  });

  const postUserFollowMutation = usePostUserFollow();

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const searchResults = data?.pages.flatMap((page) => page.items) ?? [];

  const handleFollow = (id: number) => {
    postUserFollowMutation.mutate(
      { targetUserId: id },
      {
        onSuccess: () => {
          customToast.success("팔로우에 성공했습니다.");
        },
        onError: () => {
          customToast.error("팔로우에 실패했습니다.");
        },
      }
    );
  };

  return (
    <section className="w-full h-full bg-amber-50 top-0 absolute py-5">
      {/* 검색어 입력창 */}
      <div className="flex justify-start items-center bg-white p-3 gap-5 rounded-lg shadow mx-5">
        <Button
          type="button"
          onClick={() => {
            setIsOpen(false);
          }}
          className="cursor-pointer"
        >
          <Image src="/icons/arrow.svg" alt="뒤로" width={28} height={28} />
        </Button>
        <div>
          <label htmlFor="search-user"></label>
          <Input value={value} onChange={handleChange} id="search-user" />
        </div>
      </div>
      <div>
        {/* 검색 결과 목록 */}
        <div>
          {searchResults.map((user) => {
            const isSubscribed = isAlreadySubscribed(user.id);

            console.log(isSubscribed);

            return (
              <div
                key={user.id}
                className="flex gap-2 items-center w-full py-3 px-8 border-b border-gray-200"
              >
                <Image
                  src={user.avatarThumbnailUrl}
                  alt="프로필"
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10"
                />
                <span>{user.nickname}</span>
                {isSubscribed ? (
                  <span className="ml-auto">팔로우중</span>
                ) : (
                  <Button
                    type="button"
                    className="ml-auto"
                    onClick={() => {
                      handleFollow(user.id);
                    }}
                  >
                    추가하기
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* 무한 스크롤 트리거 & 로딩 상태 */}
        {hasNextPage && (
          <div ref={ref} className="py-8 text-center">
            {isFetchingNextPage ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>더 많은 사용자를 불러오는 중...</span>
              </div>
            ) : (
              <div className="text-gray-500">스크롤해서 더 보기</div>
            )}
          </div>
        )}

        {/* 더 이상 데이터가 없을 때 */}
        {!hasNextPage && searchResults.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            모든 검색 결과를 불러왔습니다
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {!hasNextPage && searchResults.length === 0 && debouncedValue && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {`"${debouncedValue}"에 대한 검색 결과가 없습니다`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserSearch;
