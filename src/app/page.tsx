'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function Home() {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 임시로 쿠키 설정
      Cookies.set('accessKey', accessKey, { expires: 7 });
      Cookies.set('secretKey', secretKey, { expires: 7 });
      
      // 내부 API 라우트를 통해 인증 테스트
      const response = await fetch('/api/zones', {
        credentials: 'include'
      });

      if (!response.ok) {
        // 인증 실패시 쿠키 삭제
        Cookies.remove('accessKey');
        Cookies.remove('secretKey');
        throw new Error('인증에 실패했습니다. Access Key와 Secret Key를 확인해주세요.');
      }

      // 인증 성공시 대시보드로 이동
      router.push("/dashboard");
    } catch (error) {
      alert(error instanceof Error ? error.message : '인증 중 오류가 발생했습니다.');
      console.error("인증 에러:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">iWinV API Manager</h1>
        <input
          type="text"
          placeholder="Access Key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value.trim())}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Secret Key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value.trim())}
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          로그인
        </button>
      </form>
    </div>
  );
}
