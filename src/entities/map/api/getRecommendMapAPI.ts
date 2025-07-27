import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { InfinityRecommendMap } from "../model";

interface Props {
  limit: number;
  cursor?: string;
  userMapx: number;
  userMapy: number;
}

const getRecommendMapAPI = async ({limit, cursor, userMapx, userMapy}:Props):Promise<ResponseDTO<InfinityRecommendMap> | ErrorResponse> => {

  return await clientFetch<undefined, InfinityRecommendMap>({
    url: apiURL(`/taste-maps/recommendations?limit=${limit}&userMapx=${userMapx}&userMapy=${userMapy}${cursor ? `&cursor=${cursor}` : ""}`),
    method: "GET"
  })
}

export default getRecommendMapAPI;