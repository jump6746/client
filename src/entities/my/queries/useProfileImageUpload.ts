import {useState} from "react";
import {convertToWebP, isSuccessResponse} from "@/shared/lib";
import {ImageFile} from "@/entities/review/model";
import {getPresignedUrlAPI, uploadToS3API} from "@/shared/lib/s3";

const useProfileImageUpload = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadProfileImage = async (selectedFile: File): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Convert
      const file = await convertToWebP(selectedFile);
      const imageFile: ImageFile = {
        id: 0,
        file,
        preview: "",
        name: file.name,
      };

      // 2️⃣ Presigned URL
      const presignedResponse = await getPresignedUrlAPI("PROFILE_IMAGE", imageFile);
      if (!presignedResponse || !isSuccessResponse(presignedResponse)) {
        throw new Error(presignedResponse?.message ?? "Failed to get presigned URL");
      }

      // 3️⃣ S3 Upload
      await uploadToS3API(imageFile, presignedResponse.data);

      // 4️⃣ Return S3 Key
      return presignedResponse.data.s3Key;
    } catch (err) {
      console.error(err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadProfileImage,
    isLoading,
    error,
  };
};

export default useProfileImageUpload;
