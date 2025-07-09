"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// QueryClient를 컴포넌트 외부에서 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: "always",
    },
  },
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  console.log("Providers 컴포넌트 렌더링됨"); // 이게 출력되는지 확인

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;
