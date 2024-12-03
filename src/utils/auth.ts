import Cookies from 'js-cookie';

export const logout = () => {
  // 모든 쿠키 삭제
  Object.keys(Cookies.get()).forEach(cookieName => {
    Cookies.remove(cookieName);
  });
  
  // 홈페이지로 리다이렉트
  window.location.href = '/';
}; 