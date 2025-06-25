import { apiURL } from "@/shared/lib";
import { ResponseDTO } from "@/shared/types/api-structure";

interface Props {
  tasteMapId: number;
  userMapx: number;
  userMapy: number;
}

const getTasteMapAPI = async ({tasteMapId, userMapx, userMapy}: Props): Promise<ResponseDTO<any>>=> {

  const accessToken = localStorage.getItem("accessToken");

  if(!accessToken) throw new Error("accessToken이 존재하지 않습니다.");

  const response = await fetch(apiURL(`/taste-maps/${tasteMapId}?userMapx=${userMapx}&userMapy=${userMapy}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
  });

  if(!response.ok){
    const error = await response.json();
    throw new Error(error);
  }

  return response.json();
}

export default getTasteMapAPI;