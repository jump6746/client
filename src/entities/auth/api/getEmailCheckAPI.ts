import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";

const getEmailCheckAPI = async (email: string): Promise<ResponseDTO<boolean> | ErrorResponse> => {
  return await clientFetch<undefined, boolean>({
    url: apiURL(`/users/check/email?email=${email}`),
    method: "GET"
  });
}

export default getEmailCheckAPI;