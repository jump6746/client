declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: NaverMapOptions) => NaverMapInstance;
        LatLng: new (lat: number, lng: number) => NaverLatLng;
        Marker: new (options: NaverMarkerOptions) => NaverMarker;
        Point: new (x: number, y: number) => NaverPoint;
      };
    };
  }
}

export interface NaverMapOptions {
  center: NaverLatLng;
  zoom: number;
  // 필요한 다른 옵션들 추가
  mapTypeControl?: boolean;
  zoomControl?: boolean;
  scaleControl?: boolean;
}

export interface NaverMapInstance {
  setCenter(center: NaverLatLng): void;
  setZoom(zoom: number): void;
  getCenter(): NaverLatLng;
  getZoom(): number;
  // 필요한 다른 메서드들 추가
}

export interface NaverLatLng {
  lat(): number;
  lng(): number;
}

export interface NaverPoint {
  x: number;
  y: number;
}

export interface NaverMarkerIcon {
  content?: string;
  size?: NaverPoint;
  anchor?: NaverPoint;
  origin?: NaverPoint;
  scaledSize?: NaverPoint;
  url?: string;
}

export interface NaverMarkerOptions {
  position: NaverLatLng;
  map: NaverMapInstance | null;
  title?: string;
  icon?: NaverMarkerIcon | string;
  clickable?: boolean;
  draggable?: boolean;
  visible?: boolean;
  zIndex?: number;
}

interface NaverMarker {
  setPosition(position: NaverLatLng): void;
  setMap(map: NaverMapInstance | null): void;
  getPosition(): NaverLatLng;
  setTitle(title: string): void;
  getTitle(): string;
  setIcon(icon: NaverMarkerIcon | string): void;
  setVisible(visible: boolean): void;
  setClickable(clickable: boolean): void;
  setDraggable(draggable: boolean): void;
  setZIndex(zIndex: number): void;
}

