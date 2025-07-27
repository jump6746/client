import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react";

const useMapURL = () => {

  const router = useRouter();
  const searchParams = useSearchParams();

  // url에서 placeid 가져오기
  const getPlaceIdFromURL = useCallback(() => {
    return searchParams.get("placeId");
  },[searchParams])

  const getMapIdFromURL = useCallback(() => {
    return searchParams.get("mapId");
  },[searchParams])

  const getOwnerIdFromURL = useCallback(() => {
    return searchParams.get("ownerId");
  },[searchParams])

  // url 업데이트
  const updateURL = useCallback((params: {placeId?: string | null, mapId?: string | null, ownerId?: string | null}) => {

    const current = new URLSearchParams(searchParams.toString());

    if(params.placeId !== undefined && params.placeId !== null){
      current.set("placeId", params.placeId);
    }else{
      current.delete("placeId");
    }

    if(params.mapId !== undefined && params.mapId !== null){
      current.set("mapId", params.mapId);
    }else{
      current.delete("mapId");
    }

    if(params.ownerId !== undefined && params.ownerId !== null){
      current.set("ownerId", params.ownerId);
    }else{
      current.delete("ownerId");
    }

    const newURL = `${window.location.pathname}?${current.toString()}`;
    router.replace(newURL);

  },[router, searchParams])

  // place ID만 업데이트
  const updatePlaceId = useCallback((placeId: string | null) => {
    updateURL({ placeId });
  }, [updateURL]);

  // map ID만 업데이트
  const updateMapId = useCallback((mapId: string | null) => {
    updateURL({ mapId });
  }, [updateURL]);

  // owner ID만 업데이트
  const updateOwnerId = useCallback((ownerId: string | null) => {
    updateURL({ ownerId });
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
    getPlaceIdFromURL,
    getMapIdFromURL,
    getOwnerIdFromURL, 
    updateURL, 
    updateMapId,
    updatePlaceId,
    updateOwnerId,
    clearURL, 
    hasMapState 
  }
}

export default useMapURL;