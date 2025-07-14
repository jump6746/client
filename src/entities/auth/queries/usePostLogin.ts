import { useMutation } from "@tanstack/react-query";
import { loginAPI } from "../api";
import { useRouter, useSearchParams } from "next/navigation";
import useGuestModeStore from "@/shared/stores/useGuestModeStore";
import { isSuccessResponse } from "@/shared/lib";
import { customToast } from "@/shared/ui/CustomToast";

const usePostLogin = () => {

  const searchParams = useSearchParams();
  const router = useRouter();
  const setGuestMode = useGuestModeStore((state) => state.setGuestMode);
  const redirectTo = searchParams.get("redirect") || "/home";

  return useMutation({
    mutationFn: loginAPI,
    onSuccess: (response) => {

      if(isSuccessResponse(response)){

        const { data } = response;

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('sessionId', data.sessionId);

        setGuestMode(false);
        
        customToast.success("로그인 성공");
        router.push(redirectTo);

      }else{
        customToast.error(response.message);
      }
    },
    onError: (error) => {
      customToast.error(error instanceof Error ? error.message : "서버 에러가 발생했습니다."); 
    },
  })
}

export default usePostLogin;