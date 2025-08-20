"use client";

import Image from "next/image";
import { Button } from "@/shared/ui/Button";
import { HistoryItem } from "@/entities/my/model";
import { useRouter } from "next/navigation";
import { useMyProfile } from "@/entities/my/queries";
import { useGuestModeStore } from "@/shared/stores";
import Link from "next/link";
import usePostLogout from "@/entities/auth/queries/usePostLogout";

const MyPage = () => {
  const { getMyProfile } = useMyProfile();
  const isGuestMode = useGuestModeStore((state) => state.isGuestMode);
  const { data, isLoading, error } = getMyProfile;
  const router = useRouter();
  const history: HistoryItem[] = [];
  const postLogoutMutation = usePostLogout();

  if (isGuestMode) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center gap-4">
        <span className="text-brand-primary-600">로그인이 필요합니다.</span>
        <Link
          href="/"
          className="bg-brand-primary-600 text-white px-2 py-1 rounded-lg"
        >
          로그인
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col text-brand-primary-600 h-full w-full items-center justify-center">
        로딩중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col text-brand-primary-600 h-full w-full items-center justify-center">
        <span>오류가 발생했습니다.</span>
        <span>{error.message}</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col text-brand-primary-600 h-full w-full items-center justify-center">
        프로필 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 헤더 */}
      <div className="flex justify-between text-center border-b-2 border-[#d9d9d9] py-5">
        <div className="w-12 text-center">{/* 왼쪽 공간 */}</div>

        <div className="text-xl font-bold">마이페이지</div>

        <div className="w-12 text-center">{/* 오른쪽 공간 */}</div>
      </div>

      {/* 프로필 소개 1 */}
      <div className="flex items-center px-4 gap-8 w-full">
        {/* 프로필 사진 */}
        <div className="flex gap-8 items-center w-full">
          <div className="relative size-25 rounded-full overflow-hidden bg-gray-300">
            <Image
              src={data.profileImg.presignedUrl || ""}
              alt="프로필 이미지"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex justify-between gap-4">
            {/* 구독자 */}
            <div className="flex flex-col items-center">
              <div className="font-bold text-xl">{data.subscriberCount}</div>
              <div className="text-xs font-bold text-gray-400">구독자</div>
            </div>

            {/* 핀 */}
            <div className="flex flex-col items-center">
              <div className="font-bold text-xl">{data.pinCount}</div>
              <div className="text-xs font-bold text-gray-400">나의 핀</div>
            </div>

            {/* 먹부심 지수 */}
            <div className="flex flex-col items-center">
              <div className="font-bold text-xl">{data.gourmetScore}</div>
              <div className="text-xs font-bold text-gray-400">먹부심 지수</div>
            </div>
          </div>

          <Button
            className="bg-red-600 px-4 py-1 text-white rounded-lg font-semibold mt-auto ml-auto cursor-pointer"
            onClick={() => {
              postLogoutMutation.mutate();
            }}
          >
            로그아웃
          </Button>
        </div>
      </div>

      {/* 프로필 소개 2 */}
      <div className="flex flex-col px-4">
        {/* 이름 */}
        <div className="text-lg font-bold">{data.nickname}</div>

        {/* 아이디 */}
        <div className="fond-bold text-gray-500">{data.email}</div>

        {/* 자기소개 */}
        <div>{data.description}</div>
      </div>

      {/* 프로필 수정, 프로필 공유 버튼 */}
      <div className="flex justify-center items-center gap-2 px-4">
        <Button
          onClick={() => router.push("/my/edit")}
          className="w-40 bg-[#ff6b6b] text-white font-semibold py-2 rounded-xl cursor-pointer"
        >
          프로필 수정
        </Button>
        <Button className="w-40 bg-[#ff6b6b] text-white font-semibold py-2 rounded-xl cursor-pointer">
          프로필 공유
        </Button>
      </div>

      {/* 신뢰도 평가 내역 */}
      <div className="flex flex-col px-4 gap-8">
        <div className="flex flex-col">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-[#d9d9d9] py-4"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gray-300" />
                <div className="flex flex-col">
                  <div className="text-sm">
                    <span className="font-medium">{item.user}</span> 님이{" "}
                    {item.text}
                  </div>
                  <div className="text-xs text-gray-400">{item.timeAgo}</div>
                </div>
              </div>
              <div
                className={`text-sm font-bold ${
                  item.delta.startsWith("+") ? "text-blue-500" : "text-red-500"
                }`}
              >
                {item.delta}
              </div>
            </div>
          ))}
        </div>

        {history.length > 5 && (
          <button className="w-full text-lg">더 보기</button>
        )}
      </div>
    </div>
  );
};

export default MyPage;
