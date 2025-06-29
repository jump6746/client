import { ResponseDTO } from "@/shared/types/api-structure";
import { ImageFile, PresignedUrlResponse, UploadResult } from "../model/review";

const uploadToS3API = async (image: ImageFile, presigned: PresignedUrlResponse): Promise<UploadResult> => {

  const response = await fetch(presigned.presignedUrl, {
    method: "PUT",
    body: image.file,
    headers: {
      "Content-Type": image.file.type
    }
  });

  if(!response.ok){
    throw new Error(`S3 upload failed: ${response.status} ${response.statusText}`);
  }

  return {
    success: true,
    fileName: image.name,
    key: presigned.s3Key,
  };
}

const uploadAllImages = async ( files: ImageFile[], presigned: ResponseDTO<PresignedUrlResponse>[]): Promise<UploadResult[]> => {

  if(files.length !== presigned.length){
    throw new Error("파일 개수와 url 개수가 일치하지 않습니다.");
  }

  const uploadPromises = files.map( async (file, index) => {
    const presign = presigned[index];
    
    try{
      return await uploadToS3API(file, presign.data);
    }catch(error){
      console.error(`파일 업로드 실패 = ${file.name}: `, error);

      const errorData: UploadResult = {
        success: false,
        fileName: file.name,
        key: "",
        error: error instanceof Error ? error.message : "Unknown Error"
      }
      return errorData;
    } 
  })

  return await Promise.all(uploadPromises);
}

export default uploadAllImages;