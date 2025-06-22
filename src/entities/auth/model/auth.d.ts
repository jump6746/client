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