export interface FollowUser {
  targetUserId: number;
  targetUserNickname: string;
  targetUserImgUrl: string;
}

export interface SearchUser {
  id: number;
  avatarThumbnailUrl: string;
  nickname: string;
}

export interface SearchUserScorllResponse {
  items: SearchUser[];
  nextCursor: string;
  hasNext: boolean;
}

export interface UserFollowResponse {
  resultMessage: string;
}

export interface FollowerReview {
  reviewId: number;
  reviewImg: {
    presignedUrl: string;
  };
  reviewPlaceName: string;
  reviewCreatedAt: string;
  distance: number;
  placeLongtitude: number;
  placeLatitude: number;
  placeId: number;
  avatarThumbnail: {
    presignedUrl: string;
  };
  nickname: string;
}

export interface FollowerReviewsResponse {
  items: FollowerReview[];
  nextCursor: string | null;
  hasNext: boolean;
}