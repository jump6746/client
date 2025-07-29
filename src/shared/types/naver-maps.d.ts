// declare global {
//   interface Window {
//     naver: {
//       maps: {
//         Map: new (element: HTMLElement, options: NaverMapOptions) => NaverMapInstance;
//         LatLng: new (lat: number, lng: number) => NaverLatLng;
//         Marker: new (options: NaverMarkerOptions) => NaverMarker;
//         Point: new (x: number, y: number) => NaverPoint;
//         Event: NaverMapsEvent; // Event 타입 추가
        
//         // 추가적인 네이버 지도 상수들
//         MapTypeId?: {
//           NORMAL: string;
//           TERRAIN: string;
//           SATELLITE: string;
//           HYBRID: string;
//         };
        
//         Position?: {
//           TOP_LEFT: string;
//           TOP_CENTER: string;
//           TOP_RIGHT: string;
//           LEFT_CENTER: string;
//           CENTER: string;
//           RIGHT_CENTER: string;
//           BOTTOM_LEFT: string;
//           BOTTOM_CENTER: string;
//           BOTTOM_RIGHT: string;
//         };
        
//         ZoomControlStyle?: {
//           LARGE: string;
//           SMALL: string;
//         };
//       };
//     };
//   }
// }

// 일반적인 이벤트 핸들러 타입들
export type MapEventHandler = (event: NaverMapEvent) => void;
export type MarkerEventHandler = (event: NaverMarkerEvent) => void;
export type GenericEventHandler<T = unknown> = (event: T) => void;

// 네이버 지도 이벤트 객체 타입들
export interface NaverMapEvent {
  coord?: NaverLatLng;
  point?: NaverPoint;
  pointerEvent?: PointerEvent;
}

export interface NaverMarkerEvent {
  overlay: NaverMarker;
  coord?: NaverLatLng;
  point?: NaverPoint;
  pointerEvent?: PointerEvent;
}

export interface NaverMapsEvent {
  // 지도/마커 이벤트 리스너 추가 (타입별로 오버로드)
  addListener(
    target: NaverMapInstance,
    eventName: 'click' | 'dblclick' | 'rightclick' | 'mouseover' | 'mouseout' | 'mousemove' | 'mousedown' | 'mouseup',
    listener: MapEventHandler
  ): NaverMapEventListener;
  
  addListener(
    target: NaverMapInstance,
    eventName: 'zoom_changed' | 'center_changed' | 'bounds_changed' | 'dragstart' | 'drag' | 'dragend',
    listener: () => void
  ): NaverMapEventListener;
  
  addListener(
    target: NaverMarker,
    eventName: 'click' | 'dblclick' | 'rightclick' | 'mouseover' | 'mouseout' | 'mousemove' | 'mousedown' | 'mouseup',
    listener: MarkerEventHandler
  ): NaverMapEventListener;
  
  addListener(
    target: NaverMarker,
    eventName: 'dragstart' | 'drag' | 'dragend',
    listener: MarkerEventHandler
  ): NaverMapEventListener;
  
  // 일반적인 이벤트 리스너 (fallback)
  addListener<T = unknown>(
    target: NaverMapInstance | NaverMarker,
    eventName: string,
    listener: GenericEventHandler<T>
  ): NaverMapEventListener;
  
  removeListener(listener: NaverMapEventListener): void;
  
  addDOMListener(
    element: HTMLElement,
    eventName: string,
    listener: (event: Event) => void
  ): NaverMapEventListener;
  
  removeDOMListener(listener: NaverMapEventListener): void;
  
  // trigger 메서드도 타입별로 오버로드
  trigger(
    target: NaverMapInstance,
    eventName: 'click' | 'dblclick' | 'rightclick',
    event: NaverMapEvent
  ): void;
  
  trigger(
    target: NaverMapInstance,
    eventName: 'zoom_changed' | 'center_changed' | 'bounds_changed'
  ): void;
  
  trigger(
    target: NaverMarker,
    eventName: 'click' | 'dblclick' | 'rightclick',
    event: NaverMarkerEvent
  ): void;
  
  // 일반적인 trigger (fallback)
  trigger<T = unknown>(
    target: NaverMapInstance | NaverMarker,
    eventName: string,
    ...args: T[]
  ): void;
  
  clearListeners(target: NaverMapInstance | NaverMarker, eventName?: string): void;
  
  hasListener(
    target: NaverMapInstance | NaverMarker,
    eventName: string
  ): boolean;
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

