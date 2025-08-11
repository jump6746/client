const refreshToken = async (): Promise<boolean> => {
  try{
    console.log("토큰 갱신 시도 중...");
    
    const response = await fetch('/api/auth/refresh', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })

    if(!response.ok){
      console.log("토큰 갱신 실패");
      return false;
    }

    const data = await response.json();
    console.log("토큰 갱신 성공");

    if(data.data?.accessToken){
      sessionStorage.setItem("accessToken", data.data.accessToken);
    }

    return true;
  }catch(error){
    console.error("토큰 갱신 중 오류:", error);
    return false;
  }
}

export default refreshToken;