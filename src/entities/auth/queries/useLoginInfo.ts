import { useQuery } from "@tanstack/react-query";
import { postLoginInfoAPI } from "../api";
import { useGuestModeStore } from "@/shared/stores";
import { isSuccessResponse } from "@/shared/lib";
import { useRouter } from "next/navigation";

const useLoginInfo = () => {

  const router = useRouter();
  const isGuestMode = useGuestModeStore(state => state.isGuestMode);

  const {data: response, ...rest} = useQuery({
    queryKey: ["user-info"],
    queryFn: () => postLoginInfoAPI(),
    staleTime: Infinity,
    enabled: !isGuestMode,
  });

  const userInfo = response && isSuccessResponse(response) ? response.data : null;
  const hasError = response && !isSuccessResponse(response);

  if(isGuestMode && !userInfo){
    router.push("/login");
  }

  return {
    ...rest,
    data: userInfo,
    userInfo: userInfo,
    hasError,
    apiError: hasError ? response.message : null,
  }
}

export default useLoginInfo;