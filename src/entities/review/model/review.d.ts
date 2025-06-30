export interface Place {
  placeId: string;
  title: string;
  address: string;
  roadAddress: string;
  category: string;
  telePhone: string;
  mapx: number;
  mapy: number;
}

export interface ReviewRequest {
  place: Place;
  photos: string[];
  score: number;
  content: string;
  recommendedMenus: string[];
  priceRange: number;
  tasteMapId: number;
}

export interface ReviewResponse {
  reviewId: number;
  placeId: string;
  tasteMapId: number;
  updatedPinCount: number;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  s3Key: string;
}

export interface UploadResult {
  success: boolean;
  fileName: string;
  key: string;
  error?: string;
}

export interface ImageFile {
  id: number;
  file: File;
  preview: string;
  name: string;
}

