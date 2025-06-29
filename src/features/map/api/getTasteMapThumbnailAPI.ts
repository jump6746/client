import { apiURL } from "@/shared/lib";

const getTasteMapThumbnailAPI = async (id: string) => {

  const accessToken = localStorage.getItem("accessToken");

  try{

    const response = await fetch(apiURL(`/taste-map-places/${id}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    })

    if(!response.ok){
      throw new Error("정보 가져오기 실패");
    }

    if(response.status == 200){

      return await response.json();

    }else{

      throw new Error(`${response}`);
    }

  }catch(error){

    console.error(error);

  }

}

export default getTasteMapThumbnailAPI;