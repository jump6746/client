import { clientFetch } from '@/shared/lib';
import { ResponseDTO, ErrorResponse } from '@/shared/types/api-structure';

interface GoogleLoginUrlResponse {
  redirectUrl: string;
}

export const getGoogleLoginUrl = async (): Promise<ResponseDTO<GoogleLoginUrlResponse> | ErrorResponse> => {
  return await clientFetch<undefined, GoogleLoginUrlResponse>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/oauth2/google`,
    method: "GET"
  });
};