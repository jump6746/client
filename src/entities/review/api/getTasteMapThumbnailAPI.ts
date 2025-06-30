import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { ReviewRequest } from "../model";

interface Props {
  id: string;
}

const getTasteMapThumbnailAPI = async ({id}: Props): Promise<ResponseDTO<ReviewRequest> | ErrorResponse> => {
  return await clientFetch<undefined, ReviewRequest>({
    url: apiURL(`/taste-map-places/${id}`),
    method: "GET"
  });
}

export default getTasteMapThumbnailAPI;