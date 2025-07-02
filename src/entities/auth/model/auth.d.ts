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
  userId: number;
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