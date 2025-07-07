import { KaokaoResponse, SearchOptions } from "../model";
import { useCallback, useState } from "react";
import { searchPlacesAPI } from "../api";

const useSearchPlaces = () => {
  const [places, setPlaces] = useState<KaokaoResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlaces = useCallback(async(options: SearchOptions) => {
  if (!options.query.trim()) {
      setPlaces([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchPlacesAPI(options);
      setPlaces(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색 실패');
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setPlaces([]);
    setError(null);
  },[])

  return { 
    places, 
    isLoading, 
    error, 
    searchPlaces,
    clearSearch
  };
}

export default useSearchPlaces;