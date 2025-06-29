import { ResponseDTO } from "@/shared/types/api-structure";
import { ImageFile, PresignedUrlResponse } from "../model";
import { getPresignedUrlAPI } from "@/entities/review/api";

// 여러 파일에 대해 각각 개별 요청 (병렬 처리)
const getPresignedUrls = async (imageFiles: ImageFile[]): Promise<ResponseDTO<PresignedUrlResponse>[]> => {
  try {
    // 각 파일마다 개별적으로 presigned URL 요청 (병렬 처리)
    const presignedUrlPromises = imageFiles.map(async (imageFile, index) => {
      try {
        console.log(`Getting presigned URL for file ${index + 1}/${imageFiles.length}: ${imageFile.name}`);
        return await getPresignedUrlAPI(imageFile);
      } catch (error) {
        console.error(`Failed to get presigned URL for ${imageFile.name}:`, error);
        throw error; // 개별 파일 실패 시 전체 프로세스 중단
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