import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import useGuestModeStore from "@/shared/stores/useGuestModeStore";
import { isSuccessResponse } from "@/shared/lib";
import { customToast } from "@/shared/ui/CustomToast";
import logoutAPI from "../api/logoutAPI";

const usePostLogout = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setGuestMode = useGuestModeStore((state) => state.setGuestMode);
  const redirectTo = searchParams.get("redirect") || "/home";

  return useMutation({
    mutationFn: logoutAPI,
    onSuccess: (response) => {
      if (isSuccessResponse(response)) {
        setGuestMode(true);

        customToast.success("로그아웃 성공");
        router.push(redirectTo);
      } else {
        customToast.error("로그아웃 실패");
      }
    },
    onError: (error) => {
      customToast.error(
        error instanceof Error ? error.message : "서버 에러가 발생했습니다."
      );
    },
  });
};

export default usePostLogout;
