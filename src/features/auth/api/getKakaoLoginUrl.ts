import { clientFetch } from '@/shared/lib';
import { ResponseDTO, ErrorResponse } from '@/shared/types/api-structure';

interface KakaoLoginUrlResponse {
  redirectUrl: string;
}

export const getKakaoLoginUrl = async (): Promise<ResponseDTO<KakaoLoginUrlResponse> | ErrorResponse> => {
  return await clientFetch<undefined, KakaoLoginUrlResponse>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/oauth2/kakao`,
    method: "GET"
  });
};