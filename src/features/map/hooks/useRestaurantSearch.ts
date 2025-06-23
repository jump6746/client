import { searchRestaurantAPI } from "@/entities/map/api";
import { useDebounce } from "@/shared/hooks";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';

interface UseRestaurantSearchOptions {
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

const useRestaurantSearch = (options: UseRestaurantSearchOptions = {}) => {
  const { currentLocation } = options;

  const [search, setSearch] = useState<string>("");
  
  // 500ms debounce 적용
  const debouncedSearch = useDebounce(search, 500);

  // TanStack Query로 데이터 관리
  const { 
    data: list = [], 
    isLoading, 
    error,
    isFetching 
  } = useQuery({
    queryKey: ['restaurant-search', debouncedSearch, currentLocation?.lat, currentLocation?.lng],
    queryFn: () => searchRestaurantAPI({
      query: debouncedSearch,
      lat: currentLocation?.lat,
      lng: currentLocation?.lng,
    }),
    enabled: !!debouncedSearch && debouncedSearch.length > 0,
  });

  // 검색 결과 초기화 함수
  const clearResults = () => {
    setSearch("");
  };

  return {
    search,       
    setSearch,    
    isLoading,
    list: list || [], 
    error: error?.message || null,
    isFetching,
    clearResults,
    hasLocation: !!currentLocation,
  };
}

export default useRestaurantSearch;