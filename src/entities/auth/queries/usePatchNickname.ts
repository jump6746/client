import { useMutation } from "@tanstack/react-query"
import patchNicknameAPI from "../api/patchNicknameAPI"
import { isSuccessResponse } from "@/shared/lib"
import { customToast } from "@/shared/ui/CustomToast"
import { useRouter } from "next/navigation"

const usePatchNickname = () => {

  const router = useRouter();

  return useMutation({
    mutationFn: patchNicknameAPI,
    onSuccess: (response) => {
      if(isSuccessResponse(response)){
        customToast.success("닉네임 변경에 성공하였습니다.");
        router.push("/home");
      }else{
        customToast.error(response.message);
        throw new Error(response.message);
      }
    },
    onError: (error) => {
      customToast.error(error instanceof Error ? error.message : "닉네임 변경에 실패했습니다.");
    }
  })
}

export default usePatchNickname;