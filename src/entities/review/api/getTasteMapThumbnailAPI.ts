import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { PlaceThumbnail } from "../model";

interface Props {
  id?: string;
  userId: number | null;
}

const getTasteMapThumbnailAPI = async ({id, userId}: Props): Promise<ResponseDTO<PlaceThumbnail> | ErrorResponse> => {

  if(!id){
    return {
      status: 400,
      name: "장소 ID 값 누락",
      message: "장소 ID 값이 없습니다.",
      timestamp: new Date().toDateString()
    }
  };

  return await clientFetch<undefined, PlaceThumbnail>({
    url: userId ? apiURL(`/places/${id}/preview?ownerId=${userId}`) : apiURL(`/places/${id}/preview`),
    method: "GET"
  });
}

export default getTasteMapThumbnailAPI;