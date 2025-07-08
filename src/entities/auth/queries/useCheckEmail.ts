import { useMutation } from "@tanstack/react-query";
import getEmailCheckAPI from "../api/getEmailCheckAPI";
import { isSuccessResponse } from "@/shared/lib";
import { customToast } from "@/shared/ui/CustomToast";

const useCheckEmail = () => {
  return useMutation({
    mutationFn: getEmailCheckAPI,
    onSuccess: (response) => {
      if (isSuccessResponse(response)) {
        if (response.data) {
          customToast.error("이미 존재하는 이메일입니다.");
          return { isAvailable: false };
        } else {
          customToast.success("사용 가능한 이메일입니다.");
          return { isAvailable: true };
        }
      } else {
        customToast.error(response.message);
        throw new Error(response.message);
      }
    },
    onError: (error) => {
      customToast.error(error instanceof Error ? error.message : "이메일 중복확인 실패");
    },
  });
};

export default useCheckEmail;