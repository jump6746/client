// 1. 먼저 상수 파일을 만듭니다
// src/constants/markerStyles.ts

export const MARKER_STYLES = {
  // 기본 마커 스타일
  BASE: `
    .nm-marker-wrapper {
      position: relative;
      width: 32px;
      height: 32px;
      cursor: pointer;
      border-radius: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .nm-marker-shape {
      position: absolute;
      width: 32px;
      height: 32px;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .nm-marker-restaurant { background: #FF6B6B; }
    .nm-marker-coffee { background: #F4A259; }
    .nm-marker-wine { background: #9A6AFF; }
    
    .nm-marker-shape.active {
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg) scale(1.05);
      height: 40px;
      width: 40px;
    }
    
    .nm-marker-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2;
    }
    
    .nm-marker-shape.active .nm-marker-icon {
      transform: rotate(45deg) scale(1.1);
    }
    
    .nm-marker-label {
      position: absolute;
      top: 32px;
      left: 50%;
      transform: translateX(-50%);
      color: #000000;
      padding: 2px 6px;
      background-color: transparent;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      font-family: pretendard, sans-serif;
      z-index: 10;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    
    .nm-marker-shape.active + .nm-marker-label {
      color: black;
      font-weight: 700;
      padding: 4px 8px;
      top: 52px;
    }
  `,
  
  // 애니메이션
  ANIMATIONS: `
    @keyframes nm-bounce-in {
      0% { transform: rotate(-45deg) scale(0.8); }
      50% { transform: rotate(-45deg) scale(1.3); }
      100% { transform: rotate(-45deg) scale(1.2); }
    }
    
    .nm-marker-shape.active {
      animation: nm-bounce-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `,
  
  // 현재 위치 마커
  CURRENT_LOCATION: `
    .nm-current-location {
      width: 20px;
      height: 20px;
      background: #4285f4;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
  `,
  
  // 검색된 장소 마커 (빨간 핀)
  SEARCH_MARKER: `
    .nm-search-marker {
      width: 24px;
      height: 32px;
      background: #dc2626;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
  `
};

// 마커 카테고리별 아이콘 매핑
export const MARKER_ICONS = {
  음식점: "restaurant",
  카페: "coffee",
  술집: "wine",
  한식: "restaurant",
  일식: "restaurant",
  중식: "restaurant",
  양식: "restaurant",
} as const;

// 타입 정의
export type MarkerCategory = keyof typeof MARKER_ICONS;