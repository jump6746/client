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