export interface Place {
  placeId: string;
  title: string;
  address: string;
  roadAddress: string;
  category: string;
  telePhone: string;
  placeUrl: string;
  mapx: number;
  mapy: number;
}

export interface ReviewRequest {
  place: Place;
  photos: string[];
  content: string;
  recommendedMenus: string[];
  priceRange: number;
  tasteMapId: number | null;
}

export interface ReviewResponse {
  reviewId: number;
  placeId: string;
  tasteMapId: number;
  updatedPinCount: number;
}

export interface PatchReviewRequest {
  prevImages: string[];
  newImages: string[];
  content: string;
  recommendedMenus: string[];
  priceRange: number;
}

export interface PatchReviewResponse {
  id: number;
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

export interface PlaceThumbnail {
  jjim: boolean;
  review: PlaceReviewThumbnail | null;
}

export interface PlaceReivewData extends PlaceReviewThumbnail {
  placeGroupName: string;
  placeName: string;
  placeAddressName: string;
}
export interface PlaceReviewThumbnail {
  reviewId: number;
  reviewContent: string;
  reviewScore: number;
  reviewImgCount: number;
  reviewPriceRange: number;
  recommendedMenuList: {recommendedMenuName: string; recommendedMenuId: number}[];
  reviewPhotoList: ReviewPhoto[];
}

export interface ReviewPhoto {
  reviewPhotoId: number; 
  reviewPhotoUrl: string; 
  reviewPhotoS3Key: string; 
  reviewPhotoOrderIndex: number; 
  reviewPhotoCaption: string
}
