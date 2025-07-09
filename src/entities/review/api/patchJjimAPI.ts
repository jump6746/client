import { ErrorResponse, ResponseDTO } from "@/shared/types/api-structure";
import { JjimRequest, JjimResponse } from "../model";
import { apiURL, clientFetch } from "@/shared/lib";

interface Props {
  tasteMapId?: number;
  placeId: string;
  data: JjimRequest;
}

const patchJjimAPI = async ({tasteMapId, placeId, data}:Props) : Promise<ResponseDTO<JjimResponse> | ErrorResponse>=> {

  if(!tasteMapId){
    return {
      status: 400,
      name: "맵 ID 값 누락",
      message: "맵 ID 값이 없습니다.",
      timestamp: new Date().toDateString()
    }
  };

  return await clientFetch<JjimRequest, JjimResponse>({
    url: apiURL(`/jjim/${tasteMapId}/${placeId}`),
    method: "PATCH",
    data,
  });
}

export default patchJjimAPI;