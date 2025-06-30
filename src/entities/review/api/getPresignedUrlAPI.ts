import { ImageFile, PresignedUrlResponse } from "@/entities/review/model";
import { apiURL, clientFetch } from "@/shared/lib";
import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";

interface Props {
  imageFile: ImageFile;
}

const getPresignedUrlAPI = async ({imageFile}: Props): Promise<ResponseDTO<PresignedUrlResponse> | ErrorResponse> => {
  return await clientFetch<undefined, PresignedUrlResponse>({
    url: apiURL(`/s3/upload-url?uploadType=TEMP&fileName=${imageFile.name}&contentType=image/webp`),
    method: "GET"
  });
}

export default getPresignedUrlAPI;