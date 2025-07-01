import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { PlaceThumbnail } from "../model";

interface Props {
  id: string;
  userId: string | null;
}

const getTasteMapThumbnailAPI = async ({id, userId}: Props): Promise<ResponseDTO<PlaceThumbnail> | ErrorResponse> => {
  return await clientFetch<undefined, PlaceThumbnail>({
    url: userId ? apiURL(`/places/${id}/preview?ownerId=${userId}`) : apiURL(`/places/${id}/preview`),
    method: "GET"
  });
}

export default getTasteMapThumbnailAPI;