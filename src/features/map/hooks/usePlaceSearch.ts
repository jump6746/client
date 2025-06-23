import { searchPlacesAPI } from "@/entities/map/api";
import { useDebounce } from "@/shared/hooks";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';

interface useSearchOptions {
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

const usePlaceSearch = (options: useSearchOptions = {}) => {

  const { currentLocation } = options;
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  // TanStack Query로 데이터 관리
  const { 
    data: places = [], 
    isLoading, 
    error,
  } = useQuery({
    queryKey: ['restaurant-search', debouncedSearch, currentLocation?.lat, currentLocation?.lng],
    queryFn: () => searchPlacesAPI({
      query: debouncedSearch,
      lat: currentLocation?.lat,
      lng: currentLocation?.lng,
    }),
    enabled: !!debouncedSearch.trim(),
  });

  return {
    search,       
    setSearch,    
    places,
    isLoading,
    error: error?.message || null
  };
}

export default usePlaceSearch;