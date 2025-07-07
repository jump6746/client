"use client";

import { useRouter } from "next/navigation";
import useGuestModeStore from "@/shared/stores/useGuestModeStore";

export default function GuestButton() {
  const router = useRouter();
  const setGuestMode = useGuestModeStore((state) => state.setGuestMode);

  const handleClick = () => {
    setGuestMode(true);
    router.push("/home");
  };

  return (
    <button
      onClick={handleClick}
      className="px-2 border-b py-0.5 cursor-pointer text-sm"
    >
      게스트로 보기
    </button>
  );
}
