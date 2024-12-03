# iWinV API Manager

## 프로젝트 소개

iWinV API Manager는 클라우드 인프라 관리를 위한 웹 애플리케이션입니다. Next.js 13 이상의 App Router를 사용하여 구현되었으며, 서버 컴포넌트와 클라이언트 컴포넌트를 효율적으로 활용합니다.

## 주요 기능

- 존(Zone) 관리
- 인스턴스 관리
  - 인스턴스 생성
  - 인스턴스 상세 정보 조회
  - 인스턴스 시작/중지
  - 인스턴스 재부팅
  - 인스턴스 재구축
  - 인스턴스 크기 조정
  - 인스턴스 삭제
- 이미지 관리
- Flavor 관리

## 기술 스택

- **프레임워크**: Next.js 13+
- **언어**: TypeScript
- **상태 관리**: React Hooks
- **UI 라이브러리**: Material-UI (MUI)
- **인증**: 쿠키 기반 인증
- **API 통신**: 커스텀 NetworkAdapter

## 프로젝트 구조

```
src/
├── app/
│   ├── api/                # API 라우트
│   ├── dashboard/           # 대시보드 페이지
│   └── (auth)/              # 인증 관련 페이지
├── components/              # 공통 컴포넌트
├── contexts/                # React Context
├── lib/                     # 유틸리티 및 라이브러리
└── types/                   # TypeScript 타입 정의
```

## 주요 개발 원칙

- 함수형 프로그래밍 접근
- 타입스크립트 엄격 모드
- 서버 컴포넌트와 클라이언트 컴포넌트 분리
- 모듈화된 컴포넌트 구조
- 비동기 처리 최적화

## 환경 설정

1. 저장소 클론

```bash
git clone https://github.com/turbobit/iwinv-api-manager.git
cd iwinv-api-manager
```

2. 의존성 설치

```bash
npm install
```

3. 개발 서버 실행

```bash
npm run dev
```

## 배포

```bash
npm run build
npm start
```

## 기여 방법

1. 포크 (Fork)
2. 기능 브랜치 생성 (`git checkout -b feature/새로운기능`)
3. 변경사항 커밋 (`git commit -am '새로운 기능 추가'`)
4. 브랜치에 푸시 (`git push origin feature/새로운기능`)
5. 풀 리퀘스트 생성

## 라이선스

MIT 라이선스

## 문의

문의사항은 [이메일 주소]로 연락 바랍니다.
