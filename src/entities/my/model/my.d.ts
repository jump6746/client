import {PresignedUrlResponse} from "@/entities/review/model";

export interface ProfileResponse {
  profileImg: PresignedUrlResponse;
  subscriberCount: number;
  pinCount: number;
  gourmetScore: number;
  nickname: string;
  email: string;
  description: string;
}

export interface HistoryItem {
  id: string;
  user: string;
  text: string;
  timeAgo: string;
  delta: string;
}

export interface ProfileUpdateRequest {
  profileImgS3Key?: string;
  nickname: string;
  description: string;
}