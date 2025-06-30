import { ErrorResponse, ResponseDTO } from "../types/api-structure";

const isErrorResponse = (response: ResponseDTO<unknown> | ErrorResponse): response is ErrorResponse => {
  return response && typeof response.status === 'number' && response.status >= 400;
}

export default isErrorResponse;