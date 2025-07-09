"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import customToast from "@/shared/ui/CustomToast/customToast";
import isSuccessResponse from "@/shared/lib/isSuccessResponse";
import { changeNicknameAPI } from "@/features/user/api/changeNicknameAPI";
import { checkNickname } from "@/features/user/api/checkNicknameAPI"; // ✅ 닉네임 중복 확인 API

const RegisterNicknamePage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId;

  const [nickname, setNickname] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckDuplicate = async () => {
    console.log(isChecked);
    setIsChecking(true);
    setIsChecked(false);
    setIsAvailable(false);
    try {
      const response = await checkNickname(nickname);
      if (isSuccessResponse(response)) {
        if (response.data === false) {
          customToast.success("사용 가능한 닉네임입니다.");
          setIsAvailable(true);
        } else {
          customToast.error("이미 사용 중인 닉네임입니다.");
        }
        setIsChecked(true);
      }
    } catch (err) {
      console.error(err);
      customToast.error("중복 확인 중 오류 발생");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await changeNicknameAPI({
        userId: Number(userId),
        nickname,
      });

      if (isSuccessResponse(response)) {
        customToast.success("닉네임이 등록되었습니다.");
        router.push("/home");
      } else {
        customToast.error(response.message || "닉네임 등록 실패");
      }
    } catch (error) {
      console.error(error);
      setError("닉네임 등록 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return <p>잘못된 접근입니다.</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-bold mb-4">닉네임 등록</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            className="border px-4 py-2 rounded w-full"
            placeholder="닉네임 입력"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setIsChecked(false); // 입력 시 초기화
              setIsAvailable(false);
            }}
            required
            disabled={isAvailable}
          />
          <button
            type="button"
            onClick={handleCheckDuplicate}
            className="px-4 py-2 bg-gray-200 rounded text-sm"
            disabled={isChecking || nickname.length < 2 || isAvailable}
          >
            {isChecking ? "확인 중..." : "중복 확인"}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
          disabled={!isAvailable || loading}
        >
          {loading ? "등록 중..." : "닉네임 등록"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterNicknamePage;
