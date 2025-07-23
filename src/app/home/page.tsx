import MapPage from "@/views/Map/ui/MapPage";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="bg-lime-100 w-full h-full">
      <Suspense fallback={<div>로딩 중..</div>}>
        <MapPage />
      </Suspense>
    </div>
  );
}
