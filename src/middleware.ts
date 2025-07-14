import { NextRequest, NextResponse } from "next/server";

// 로그인 필요 경로
const PROTECTED_ROUTES:string[] = [
  "/review"
];

// 로그인 후 접근 불가 경로
// const AUTH_ONLY_ROUTES = [];

// 공개 경로
// const PUBLIC_ROUTES = [];

const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

const isApiRoute = (pathname: string):boolean => {
  return pathname.startsWith("/api/");
}

// 정적 파일인지 확인
const isStaticFile = (pathname: string): boolean => {
  return pathname.startsWith('/_next/') || 
         pathname.startsWith('/favicon.ico') ||
         pathname.startsWith('/images/') ||
         pathname.startsWith('/icons/') ||
         pathname.includes('.')
}

// SessionId 확인 함수
const hasValidSessionId = (request: NextRequest): boolean => {
  const sessionId = request.cookies.get('sessionId')?.value
  
  if (!sessionId) {
    return false
  }
  
  // SessionId 형식 검증 (선택사항)
  // 예: nanoid 형식인지 확인
  if (sessionId.length < 10) {
    return false
  }
  
  return true
}

// 로그인 페이지로 리다이렉트
const redirectToLogin = (request: NextRequest) => {
  const loginUrl = new URL('/login', request.url)
  
  // 현재 경로를 redirect 파라미터로 추가 (로그인 후 원래 페이지로 돌아가기)
  if (request.nextUrl.pathname !== '/') {
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
  }
  
  console.log(`인증 필요 - 로그인 페이지로: ${loginUrl.pathname}`)
  return NextResponse.redirect(loginUrl)
}

// 홈페이지로 리다이렉트 (이미 로그인된 사용자)
// const redirectToHome = (request: NextRequest) => {
//   const homeUrl = new URL('/home', request.url) 

//   console.log(`이미 로그인됨 - 홈으로: ${homeUrl.pathname}`)
//   return NextResponse.redirect(homeUrl)
// }

// 메인 미들웨어 함수
export function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;
  console.log(`미들웨어 실행: ${pathname}`);
  
  // 제외할 경로들 - 미들웨어 실행 안함
  if (isStaticFile(pathname) || isApiRoute(pathname)) {
    return NextResponse.next();
  }
  
  // SessionId 확인
  const isLoggedIn = hasValidSessionId(request);
  console.log(`로그인 상태: ${isLoggedIn ? '로그인됨' : '로그인 안됨'}`);
  
  // 경로별 처리 로직
  
  // 보호된 경로 - 로그인 필요
  if (isProtectedRoute(pathname)) {
    if (!isLoggedIn) {
      return redirectToLogin(request);
    }
    console.log(`✅ 보호된 경로 접근 허용: ${pathname}`);
    return NextResponse.next();
  }
  
  // 2️⃣ 인증 전용 경로 - 로그인 상태에서는 접근 불가
  // if (isAuthOnlyRoute(pathname)) {
  //   if (isLoggedIn) {
  //     return redirectToHome(request)
  //   }
  //   console.log(`📝 인증 페이지 접근 허용: ${pathname}`)
  //   return NextResponse.next()
  // }
  
  // 3️⃣ 공개 경로 - 누구나 접근 가능
  // if (isPublicRoute(pathname)) {
  //   console.log(`🌍 공개 페이지 접근: ${pathname}`)
  //   return NextResponse.next()
  // }
  
  // 4️⃣ 정의되지 않은 경로 - 기본적으로 로그인 필요
  // if (!isLoggedIn) {
  //   console.log(`❓ 미정의 경로, 로그인 필요: ${pathname}`)
  //   return redirectToLogin(request)
  // }
  
  console.log(`미정의 경로, 로그인된 사용자 접근 허용: ${pathname}`);

  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}