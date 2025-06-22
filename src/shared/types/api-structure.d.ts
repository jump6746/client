export interface ResponseDTO<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  status: number;
  name: string;
  message: string;
  timestamp: string;
}