import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { PlaceThumbnail } from "../model";

interface Props {
  id?: string | null;
  userId?: number | null;
  userMapx: number;
  userMapy: number;
}

const getTasteMapThumbnailAPI = async ({id, userId, userMapx, userMapy}: Props): Promise<ResponseDTO<PlaceThumbnail> | ErrorResponse> => {

  if(!id){
    return {
      status: 400,
      name: "장소 ID 값 누락",
      message: "장소 ID 값이 없습니다.",
      timestamp: new Date().toDateString()
    }
  };

  return await clientFetch<undefined, PlaceThumbnail>({
    url: userId ? apiURL(`/places/${id}/preview?ownerId=${userId}&userMapx=${userMapx}&userMapy=${userMapy}`) 
    : apiURL(`/places/${id}/preview?userMapx=${userMapx}&userMapy=${userMapy}`),
    method: "GET"
  });
}

export default getTasteMapThumbnailAPI;