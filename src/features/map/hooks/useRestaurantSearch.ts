import { searchRestaurantAPI } from "@/entities/map/api";
import { useDebounce } from "@/shared/hooks";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';

const useRestaurantSearch = () => {

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
    queryKey: ['restaurant-search', debouncedSearch],
    queryFn: () => searchRestaurantAPI(debouncedSearch),
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
    clearResults
  };
}

export default useRestaurantSearch;