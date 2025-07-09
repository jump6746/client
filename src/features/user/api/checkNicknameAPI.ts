// /features/user/api/checkNickname.ts

import { clientFetch } from "@/shared/lib";
import { ResponseDTO, ErrorResponse } from "@/shared/types/api-structure";

export const checkNickname = async (nickname: string): Promise<ResponseDTO<boolean> | ErrorResponse> => {
  return await clientFetch<undefined, boolean>({
    url: `/api/v1/users/check/nickname?nickname=${nickname}`,
    method: "GET",
  });
};
