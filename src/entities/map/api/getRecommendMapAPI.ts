import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";

interface Props {
  limit: number;
  cursor?: string;
  userMapx: number;
  userMapy: number;
}

const getRecommendMapAPI = async ({limit, cursor, userMapx, userMapy}:Props):Promise<ResponseDTO<undefined> | ErrorResponse> => {

  return await clientFetch<undefined, undefined>({
    url: apiURL(`/taste-maps/recommendations?limit=${limit}&userMapx=${userMapx}&userMapy=${userMapy}${cursor ? `&cursor=${cursor}` : ""}`),
    method: "GET"
  })
}

export default getRecommendMapAPI;