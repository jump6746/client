import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import signUpAPI from "../api/signUpAPI";
import { isSuccessResponse } from "@/shared/lib";
import { customToast } from "@/shared/ui/CustomToast";

const usePostSignUp = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: signUpAPI,
    onSuccess: (response) => {
      if (isSuccessResponse(response)) {
        customToast.success("회원가입에 성공하였습니다.");
        router.push("/login");
      } else {
        customToast.error(response.message);
        throw new Error(response.message);
      }
    },
    onError: (error) => {
      customToast.error(error instanceof Error ? error.message : '회원가입에 실패하였습니다.');
    },
  });
};

export default usePostSignUp;