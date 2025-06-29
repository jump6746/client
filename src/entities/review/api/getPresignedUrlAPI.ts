import { ImageFile, PresignedUrlResponse } from "@/entities/review/model";
import { apiURL } from "@/shared/lib";
import { ResponseDTO } from "@/shared/types/api-structure";

// S3 업로드 관련 함수들
const getPresignedUrlAPI = async (imageFile: ImageFile): Promise<ResponseDTO<PresignedUrlResponse>> => {
  const fileInfos ={
    fileName: imageFile.name,
  };

  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(apiURL(`/s3/upload-url?uploadType=TEMP&fileName=${fileInfos.fileName}&contentType=image/webp`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get presigned URLs: ${response.statusText}`);
  }

  return await response.json();
};

export default getPresignedUrlAPI;