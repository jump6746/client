import { useMutation } from "@tanstack/react-query";
import { loginAPI } from "../api";
import { useRouter } from "next/navigation";
import useGuestModeStore from "@/shared/stores/useGuestModeStore";
import { isSuccessResponse } from "@/shared/lib";
import { customToast } from "@/shared/ui/CustomToast";
import { useUserStore } from "@/shared/stores";

const usePostLogin = () => {

  const router = useRouter();
  const setGuestMode = useGuestModeStore((state) => state.setGuestMode);
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: loginAPI,
    onSuccess: (response) => {

      if(isSuccessResponse(response)){

        const { data } = response;

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('sessionId', data.sessionId);
        localStorage.setItem("userId", String(data.userId));

        setUser({
          userId: data.userId,
          defaultTasteMapId: data.defaultTasteMapId,
        })

        console.log("Set User Data : ", data.userId, data.defaultTasteMapId);

        setGuestMode(false);
        
        customToast.success("로그인 성공");
        router.push("/home");

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