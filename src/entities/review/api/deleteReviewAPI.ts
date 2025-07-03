import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";

interface Props {
  reviewId: number;
}

const deleteReviewAPI = async ({reviewId}: Props) : Promise<ResponseDTO<null> | ErrorResponse> => {
  return await clientFetch<undefined, null>({
    url: apiURL(`/reviews/${reviewId}`),
    method: "DELETE",
  })
}

export default deleteReviewAPI;