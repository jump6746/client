import { apiURL } from "@/shared/lib";
import { ReviewRequest } from "../model";

const postReviewAPI = async (data: ReviewRequest) => {

  const accessToken = localStorage.getItem("accessToken");

  try{

    const response = await fetch(apiURL("/reviews"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(data),
    })

    if(!response.ok){
      throw new Error(`요청 실패 ${response.status}`)
    }

    return await response.json();

  }catch(error){

    console.error(error);
  }
}

export default postReviewAPI;