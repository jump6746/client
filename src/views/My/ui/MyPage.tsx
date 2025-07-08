"use client";

import Image from "next/image";
import { Button } from "@/shared/ui/Button";
import { useEffect, useState } from "react";
import { isSuccessResponse } from "@/shared/lib";
import { getMyProfileAPI } from "@/entities/my/api";
import { ProfileResponse } from "@/entities/my/model";
import { HistoryItem } from "@/entities/my/model/my";

const MyPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [myProfile, setData] = useState<ProfileResponse | null>(null);

  const history: HistoryItem[] = [];

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getMyProfileAPI();

        if (isSuccessResponse(response)) {
          console.log(response.data);

          setData(response.data); // ResponseDTO의 data 부분
        } else {
          setError(response.message);
        }

        console.log(myProfile);
        console.log(loading);
        console.log(error);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
        console.error("API 호출 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfile();
  }, []);

  if (loading) {
    return <div>로딩중...</div>;
  }

  if (!myProfile) {
    return <div>프로필 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center border-b-2 border-[#d9d9d9] py-5">
        <div></div>
        <div className="text-xl font-bold">마이페이지</div>
        <div>dd</div>
      </div>

      {/* 프로필 소개 1 */}
      <div className="flex items-center px-4 gap-8">
        {/* 프로필 사진 */}
        <Image
          alt="프로필 이미지"
          src={myProfile?.imgUrl || ""}
          className="size-25 rounded-full bg-gray-300"
        />

        <div className="flex justify-between gap-4">
          {/* 구독자 */}
          <div className="flex flex-col items-center">
            <div className="font-bold text-xl">{myProfile.subscriberCount}</div>
            <div className="text-xs font-bold text-gray-400">구독자</div>
          </div>

          {/* 핀 */}
          <div className="flex flex-col items-center">
            <div className="font-bold text-xl">{myProfile.pinCount}</div>
            <div className="text-xs font-bold text-gray-400">나의 핀</div>
          </div>

          {/* 먹부심 지수 */}
          <div className="flex flex-col items-center">
            <div className="font-bold text-xl">{myProfile.gourmetScore}</div>
            <div className="text-xs font-bold text-gray-400">먹부심 지수</div>
          </div>
        </div>
      </div>

      {/* 프로필 소개 2 */}
      <div className="flex flex-col px-4">
        {/* 이름 */}
        <div className="text-lg font-bold">{myProfile.nickname}</div>

        {/* 아이디 */}
        <div className="fond-bold text-gray-500">{myProfile.email}</div>

        {/* 자기소개 */}
        <div>{myProfile.description}</div>
      </div>

      {/* 프로필 수정, 프로필 공유 버튼 */}
      <div className="flex justify-center items-center gap-2 px-4">
        <Button className="w-40 bg-[#ff6b6b] text-white font-semibold py-2 rounded-xl">
          프로필 수정
        </Button>
        <Button className="w-40 bg-[#ff6b6b] text-white font-semibold py-2 rounded-xl">
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
