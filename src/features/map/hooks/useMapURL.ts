import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react";

const useMapURL = () => {

  const router = useRouter();
  const searchParams = useSearchParams();

  // url에서 지도 좌표 가져오기
  const getLocationFromURL = useCallback(() => {

    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if(lat && lng){
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);

      if(!isNaN(latNum) && !isNaN(lngNum)){
        return { lat: latNum, lng: lngNum};
      }
    }

    return null;
    
  },[searchParams]);

  // url에서 placeid 가져오기
  const getPlaceIdFromURL = useCallback(() => {
    return searchParams.get("placeId");
  },[searchParams])

  // url 업데이트
  const updateURL = useCallback((params: {lat?:number; lng?:number; placeId?: string | null}) => {

    const current = new URLSearchParams(searchParams.toString());

    if(params.lat !== undefined && params.lng !== undefined){
      current.set("lat", params.lat.toString());
      current.set("lng", params.lng.toString());
    }

    if(params.placeId !== undefined && params.placeId !== null){
      current.set("placeId", params.placeId);
    }else{
      current.delete("placeId");
    }

    const newURL = `${window.location.pathname}?${current.toString()}`;
    router.replace(newURL);

  },[router, searchParams])

  // 좌표만 업데이트 (지도 드래그 시)
  const updateLocation = useCallback((lat: number, lng: number) => {
    updateURL({ lat, lng });
  }, [updateURL]);

  // place ID만 업데이트
  const updatePlaceId = useCallback((placeId: string | null) => {
    updateURL({ placeId });
  }, [updateURL]);

  // 좌표와 place ID 동시 업데이트 (장소 선택 시)
  const updateMapState = useCallback((lat: number, lng: number, placeId: string | null) => {
    updateURL({ lat, lng, placeId });
  }, [updateURL]);

  // URL 초기화
  const clearURL = useCallback(() => {
    router.replace(window.location.pathname);
  }, [router]);

  // URL에 맵 상태가 있는지 확인
  const hasMapState = useCallback(() => {
    return searchParams.has('lat') && searchParams.has('lng') && searchParams.has("placeId");
  }, [searchParams]);


  return { 
    getLocationFromURL, 
    getPlaceIdFromURL, 
    updateURL, 
    updateLocation, 
    updatePlaceId,
    updateMapState, 
    clearURL, 
    hasMapState 
  }
}

export default useMapURL;