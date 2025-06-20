import { useCallback, useState } from "react";

interface LocationData {
  lat: number;
  lng: number;
}

const useGeolocation = () => {
  
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // 사용자의 현재 위치를 가져오는 Promise 반환 함수
  const getCurrentLocation = useCallback((): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("브라우저에서 위치 서비스를 지원하지 않습니다."));
        return;
      }

      setIsGettingLocation(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          setIsGettingLocation(false);
          resolve(location);
        },
        (error) => {
          setIsGettingLocation(false);
          let errorMessage = "위치를 가져올 수 없습니다.";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "위치 접근 권한이 거부되었습니다.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "위치 정보를 사용할 수 없습니다.";
              break;
            case error.TIMEOUT:
              errorMessage = "위치 요청 시간이 초과되었습니다.";
              break;
          }
          
          setLocationError(errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }, []);

  // // 실시간 위치 구독
  // const watchLocation = useCallback((callback: (location: LocationData) => void) => {
  //   if (!navigator.geolocation) return null;

  //   const watchId = navigator.geolocation.watchPosition(
  //     (position) => {
  //       const location = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       };
  //       setCurrentLocation(location);
  //       callback(location);
  //     },
  //     (error) => setLocationError(error.message),
  //     { enableHighAccuracy: true }
  //   );

  //   return () => navigator.geolocation.clearWatch(watchId);
  // }, []);

  return {
    currentLocation,
    isGettingLocation,
    locationError,
    getCurrentLocation,
    // watchLocation,
  };

}

export default useGeolocation;