import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { ReviewRequest, ReviewResponse } from "../model";

interface Props {
  data: ReviewRequest;
}

const postReviewAPI = async ({data}: Props): Promise<ResponseDTO<ReviewResponse> | ErrorResponse> => {
  return await clientFetch<ReviewRequest, ReviewResponse>({
    url: apiURL("/reviews"),
    method: "POST",
    data
  });
}

export default postReviewAPI;