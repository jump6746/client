import { PatchReviewRequest, PatchReviewResponse } from "@/entities/review/model";
import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";

interface Props {
  reviewId: string;
  data: PatchReviewRequest;
}


const patchReviewAPI = async ({reviewId, data}:Props) : Promise<ResponseDTO<PatchReviewResponse> | ErrorResponse> => { 
  return await clientFetch<PatchReviewRequest, PatchReviewResponse>({
    url: apiURL(`/reviews/${reviewId}`),
    method: "PATCH",
    data,
  });
}

export default patchReviewAPI;