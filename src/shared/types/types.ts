export interface MapOptions {
  center: { lat: number; lng: number };
  zoom: number;
}

export interface Marker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
}