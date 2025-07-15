export interface SessionData {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  sessionId: string;
  accessToken: string;
}

export interface MyInfoResponse {
  userId: number;
  email: string;
  defaultTasteMapId: number;
}

export interface SignUpResponse {
  userId: number;
  email: string;
}

export interface SignUpRequest {
  email: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
  agreements: {
    service: boolean;
    privacy: boolean;
    thirdParty: boolean;
    consignment: boolean;
    marketing: boolean;
  }
}

export interface NicknameChangeRequest {
  nickname: string;
}

export interface NicknameChangeResponse {
  nickname: string;
}