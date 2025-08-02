import { apiURL, clientFetch } from "@/shared/lib";
import { ResponseDTO } from "@/shared/types/api-structure";
import { PlaceThumbnail } from "../model";

interface Props {
  id?: string | null;
  userId?: number | null;
  userMapx: number;
  userMapy: number;
}

const getTasteMapThumbnailAPI = async ({id, userId, userMapx, userMapy}: Props): Promise<ResponseDTO<PlaceThumbnail>> => {

  return await clientFetch<undefined, PlaceThumbnail>({
    url: userId ? apiURL(`/places/${id}/preview?ownerId=${userId}&userMapx=${userMapx}&userMapy=${userMapy}`) 
    : apiURL(`/places/${id}/preview?userMapx=${userMapx}&userMapy=${userMapy}`),
    method: "GET"
  });
}

export default getTasteMapThumbnailAPI;