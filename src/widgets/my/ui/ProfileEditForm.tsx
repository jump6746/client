"use client";

import Image from "next/image";
import { Button } from "@/shared/ui/Button";
import { useEffect, useRef, useState } from "react";
import { useMyProfile, useProfileImageUpload } from "@/entities/my/queries";
import { useRouter } from "next/navigation";
import { useGuestModeStore } from "@/shared/stores";
import Link from "next/link";

const ProfileEditForm = () => {
  const { getMyProfile, patchMyProfile } = useMyProfile();
  const { data, isLoading, error } = getMyProfile;
  const { uploadProfileImage } = useProfileImageUpload();
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isGuestMode = useGuestModeStore((state) => state.isGuestMode);

  useEffect(() => {
    if (data) {
      setNickname(data.nickname);
      setDescription(data.description);
      setProfileImgUrl(data.profileImg.presignedUrl || "");
    }
  }, [data]);

  const handleUpdateProfile = async () => {
    if (!data) {
      alert("프로필 정보를 불러오지 못했습니다.");
      return;
    }

    let profileImgS3Key: string | null = data.profileImg.s3Key;

    if (selectedFile) {
      profileImgS3Key = await uploadProfileImage(selectedFile);
      if (!profileImgS3Key) {
        alert("프로필 이미지 업로드 실패");
        return;
      }
    }

    patchMyProfile.mutate({
      profileImgS3Key,
      nickname,
      description,
    });

    router.push("/my");
  };

  const handleImgUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProfileImgUrl(URL.createObjectURL(file));
    }
  };

  if (isGuestMode) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center">
        <span className="text-brand-primary-600">로그인이 필요합니다.</span>
        <Link href="/login">로그인</Link>
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
    <div className="flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex justify-between text-center border-b border-[#d9d9d9] py-4">
        <div className="w-12 text-center">{/* 왼쪽 공간 */}</div>

        <div className="text-xl font-bold">마이페이지</div>

        <Button
          onClick={handleUpdateProfile}
          className="w-12 text-center cursor-pointer"
        >
          완료
        </Button>
      </div>

      {/* 사진 수정 섹션 */}
      <div className="flex flex-col items-center py-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-300">
          <Image
            alt="프로필 이미지"
            src={profileImgUrl || "/default-profile.png"}
            fill
            className="object-cover"
          />
        </div>

        <button
          onClick={handleImgUpload}
          className="mt-2 text-sm font-medium text-red-500 hover:underline transition cursor-pointer"
        >
          사진 수정
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* 프로필 수정 섹션 */}
      <div className="flex flex-col border-t border-[#d9d9d9]">
        <div className="flex items-center px-4 py-3 border-b border-[#d9d9d9]">
          <label className="w-16 text-sm font-bold">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="flex-1 border-none outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
            placeholder="닉네임을 입력하세요"
          />
        </div>
        <div className="flex items-center px-4 py-3 border-b border-[#d9d9d9]">
          <label className="w-16 text-sm font-bold">소개</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 border-none outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400 resize-none"
            rows={2}
            placeholder="소개를 입력하세요"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;
