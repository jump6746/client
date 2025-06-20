const loadNaverMaps = ():Promise<void> => {

  return new Promise((resolve, reject) => {
    
    if(window.naver && window.naver.maps) {

      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_MAP_CLIENT_ID}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("네이버 지도 로딩 실패"));
    document.head.appendChild(script);

  })
  
}

export default loadNaverMaps;