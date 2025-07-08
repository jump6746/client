import {ErrorResponse, ResponseDTO} from "@/shared/types/api-structure";
import {ImageFile, PresignedUrlResponse} from "@/entities/review/model";
import {apiURL, clientFetch} from "@/shared/lib/index";
import {UploadResult} from "@/entities/review/model/review";

export const getPresignedUrlAPI = async (uploadType: string, imageFile: ImageFile): Promise<ResponseDTO<PresignedUrlResponse> | ErrorResponse> => {
  return await clientFetch<undefined, PresignedUrlResponse>({
    url: apiURL(`/s3/upload-url?uploadType=${uploadType}&fileName=${imageFile.name}&contentType=image/webp`),
    method: "GET"
  });
}

export const uploadToS3API = async (image: ImageFile, presigned: PresignedUrlResponse): Promise<UploadResult> => {
  const response = await fetch(presigned.presignedUrl, {
    method: "PUT",
    body: image.file,
    headers: {
      "Content-Type": image.file.type
    }
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.status} ${response.statusText}`);
  }

  return {
    success: true,
    fileName: image.name,
    key: presigned.s3Key,
  };
}