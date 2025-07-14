import { LoginPage } from "@/views";
import { Suspense } from "react";

const Login = () => {
  return (
    <div className="h-full overflow-auto overscroll-contain">
      <Suspense
        fallback={
          <div className="h-full flex items-center justify-center">
            <div className="text-gray-500">로그인 페이지 로딩 중...</div>
          </div>
        }
      >
        <LoginPage />
      </Suspense>
    </div>
  );
};

export default Login;
