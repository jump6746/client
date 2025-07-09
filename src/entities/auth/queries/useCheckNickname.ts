import { useMutation } from "@tanstack/react-query";
import getNicknameCheckAPI from "../api/getNicknameCheckAPI";
import { isSuccessResponse } from "@/shared/lib";
import { customToast } from "@/shared/ui/CustomToast";

const useCheckNickname = () => {
  return useMutation({
    mutationFn: getNicknameCheckAPI,
    onSuccess: (response) => {
      if (isSuccessResponse(response)) {
        if (response.data) {
          customToast.error("이미 존재하는 닉네임입니다.");
          return { isAvailable: false };
        } else {
          customToast.success("사용 가능한 닉네임입니다.");
          return { isAvailable: true };
        }
      } else {
        customToast.error(response.message);
        throw new Error(response.message);
      }
    },
    onError: (error) => {
      customToast.error(error instanceof Error ? error.message : "닉네임 중복확인 실패");
    },
  });
};

export default useCheckNickname;