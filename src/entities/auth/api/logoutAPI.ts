import { clientFetch } from "@/shared/lib"; // 경로는 실제 위치에 맞게 조정
import { ResponseDTO } from "@/shared/types/api-structure";

const logoutAPI = async (): Promise<ResponseDTO<null>> => {
  return await clientFetch<undefined, null>({
    url: "/api/auth/logout",
    method: "POST",
    credentials: "same-origin",
  });
};

export default logoutAPI;
