import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { ImageFile, PresignedUrlResponse } from "../model";
import { getPresignedUrlAPI } from "@/entities/review/api";

interface Props {
  imageFiles: ImageFile[];
}

const getPresignedUrls = async ({imageFiles}: Props): Promise<(ResponseDTO<PresignedUrlResponse> | ErrorResponse)[]> => {
  try {
    // 각 파일마다 개별적으로 presigned URL 요청 (병렬 처리)
    const presignedUrlPromises = imageFiles.map(async (imageFile, index) => {
      try {
        console.log(`Getting presigned URL for file ${index + 1}/${imageFiles.length}: ${imageFile.name}`);
        return await getPresignedUrlAPI({imageFile}); // 구조화된 매개변수로 변경
      } catch (error) {
        console.error(`Failed to get presigned URL for ${imageFile.name}:`, error);
        throw error;
      }
    });

    const results = await Promise.all(presignedUrlPromises);
    console.log(`Successfully got ${results.length} presigned URLs`);
    
    return results;
  } catch (error) {
    console.error('Failed to get presigned URLs:', error);
    throw error;
  }
};

export default getPresignedUrls;