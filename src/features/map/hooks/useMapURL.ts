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

  const getZoomFromURL = useCallback(() => {
    return searchParams.get("zoom");
  },[searchParams])

  // url 업데이트
  const updateURL = useCallback((params: {placeId?: string | null, mapId?: string | null, ownerId?: string | null, zoom?: string | null}) => {

    const current = new URLSearchParams(window.location.search);
    console.log(current.toString());

    // undefined가 아닌 파라미터만 처리 (기존 파라미터 보존)
    if(params.placeId !== undefined){
      if(params.placeId !== null){
        current.set("placeId", params.placeId);
      } else {
        current.delete("placeId");
      }
    }
    // placeId가 undefined면 기존 값 그대로 유지

    if(params.mapId !== undefined){
      if(params.mapId !== null){
        current.set("mapId", params.mapId);
      } else {
        current.delete("mapId");
      }
    }

    if(params.ownerId !== undefined){
      if(params.ownerId !== null){
        current.set("ownerId", params.ownerId);
      } else {
        current.delete("ownerId");
      }
    }

    if(params.zoom !== undefined){
      if(params.zoom !== null){
        current.set("zoom", params.zoom);
      } else {
        current.delete("zoom");
      }
    }

    const newURL = `${window.location.pathname}?${current.toString()}`;
    console.log(newURL);
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

  const updateZoom = useCallback((zoom: string | null) => {
    updateURL({ zoom });
  },[updateURL])

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
    getZoomFromURL, 
    updateURL, 
    updateMapId,
    updatePlaceId,
    updateOwnerId,
    updateZoom,
    clearURL, 
    hasMapState 
  }
}

export default useMapURL;