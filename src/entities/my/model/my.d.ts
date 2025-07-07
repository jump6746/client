export interface ProfileResponse {
  imgUrl: string | null;
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