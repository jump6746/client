import { FollowUser } from "@/entities/follow/model";
import useGetSubscriptions from "@/entities/follow/queries/useGetSubscriptions";
import { isSuccessResponse } from "@/shared/lib";
import { Button } from "@/shared/ui/Button";
import Image from "next/image";
import { useEffect, useState } from "react";

const FollowList = () => {
  const { data: response } = useGetSubscriptions();

  const [users, setUsers] = useState<FollowUser[]>([]);

  useEffect(() => {
    if (!response) return;

    if (isSuccessResponse(response)) {
      setUsers(response.data);
    } else {
    }
  }, [response]);

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
      <section className="flex justify-start w-full px-5 gap-3">
        {users.map((item) => {
          return (
            <div
              key={item.targetUserId}
              className="flex flex-col items-center gap-1"
            >
              <Image
                src={item.targetUserImgUrl}
                alt="프로필"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
              <span className="font-semibold">{item.targetUserNickname}</span>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default FollowList;
