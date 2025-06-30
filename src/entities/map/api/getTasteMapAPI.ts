import { TasteMap } from "@/entities/map/model";
import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";

interface Props {
  tasteMapId: number;
  userMapx: number;
  userMapy: number;
}

const getTasteMapAPI = async ({tasteMapId, userMapx, userMapy}: Props): Promise<ResponseDTO<TasteMap> | ErrorResponse> => {
  return await clientFetch<undefined, TasteMap>({
    url: apiURL(`/taste-maps/${tasteMapId}?userMapx=${userMapx}&userMapy=${userMapy}`),
    method: "GET"
  });
}

export default getTasteMapAPI;