// features/auth/model/useLogin.ts
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const useLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e:FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인 실패');
      }

      const { data } = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('sessionId', data.sessionId);

      // 로그인 확인 화면 필요
      alert("로그인 성공");

      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('sessionId');
    router.push('/login');
  };

  return {
    email,
    password,
    isLoading,
    error,
    setEmail,
    setPassword,
    handleLogin,
    logout,
  };
};

export default useLogin;