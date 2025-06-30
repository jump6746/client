import { ErrorResponse, ResponseDTO } from './../types/api-structure.d';

const isSuccessResponse = <T>(response: ResponseDTO<T> | ErrorResponse): response is ResponseDTO<T> => {
  return response && 'data' in response && response.data !== undefined;
}

export default isSuccessResponse;