import { clientFetch } from '@/shared/lib';
import { ResponseDTO, ErrorResponse } from '@/shared/types/api-structure';

interface NaverLoginUrlResponse {
  redirectUrl: string;
}

export const getNaverLoginUrl = async (): Promise<ResponseDTO<NaverLoginUrlResponse> | ErrorResponse> => {
  return await clientFetch<undefined, NaverLoginUrlResponse>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/oauth2/naver`,
    method: "GET"
  });
};